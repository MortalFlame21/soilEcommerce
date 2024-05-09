import express from "express";
import AppDataSource from "../db/dataSource.js";
import { Users } from "../db/models/users.js";
import bcrypt from "bcrypt";
import { validate } from "class-validator";

const userRouter = express.Router(); // for validation only

// find by username
userRouter.get("/username/:username", async (req, res) => {
  try {
    const users = await AppDataSource.getRepository(Users).find({
      where: { username: req.params.username },
    });

    res.send(users);
  } catch {
    res.send([]);
  }
});

// find by email
userRouter.get("/email/:email", async (req, res) => {
  try {
    const users = await AppDataSource.getRepository(Users).find({
      where: { email: req.params.email },
    });

    res.send(users);
  } catch {
    res.send([]);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // validate, email, password
    if (validatePassword(password)) {
      res.send(validatePassword(password));
      next();
    }
    const errors = await validateUsernamePassword(username, email);
    if (errors.length > 0) {
      res.send(errors);
      next();
    }

    // check if user exists

    const hashedPassword = await bcrypt.hash(password, 10);

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {
          username: username,
          email: email,
          hash: hashedPassword,
        },
      ])
      .execute();

    res.send([]);
  } catch (e) {
    console.log(e);
    console.log("!!!!!!!! error !!!!!!!");
    res.send(e);
  }
});

async function validateUsernamePassword(username: string, email: string) {
  const user = new Users();
  user.username = username;
  user.email = email;

  const errors = await validate(user);

  console.log("errors", errors);

  return errors;
}

function validatePassword(password: string) {
  const exp = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-={};':,.<>?/|\\\"])"
  );

  if (!password) return "Enter a password!";
  else if (password.length < 10)
    return "Password must be \u2265 10 characters in length";
  else if (!exp.test(password))
    return "Password must contain:\n -At least one lower case\n -At least one upper case\n -At least special character\n -At least one number\n";
  return "";
}

export default userRouter;
