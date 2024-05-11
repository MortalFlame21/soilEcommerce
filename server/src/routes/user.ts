import express from "express";
import AppDataSource from "../db/dataSource.js";
import { Users } from "../db/models/users.js";
import bcrypt from "bcryptjs";
import { validate } from "class-validator";

const userRouter = express.Router(); // /user/...

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

// user creation
userRouter.post("/", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // validate, email, password
    if (validatePassword(password)) {
      res.send(validatePassword(password));
      next();
      return;
    }
    const errors = await validateUsernameEmail(username, email);
    if (errors.length > 0) {
      res.send(errors);
      next();
      return;
    }

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
    res.send(["Server error"]);
  }
});

async function validateUsernameEmail(username: string, email: string) {
  const user = new Users();
  user.username = username;
  user.email = email;

  const errors = await validate(user);

  // validate its uniqueness
  const usersWithUsername = await AppDataSource.getRepository(Users).find({
    where: { username: username },
  });
  if (usersWithUsername.length > 0)
    errors.push({ property: "email", value: "Username exists" });

  const usersWithEmail = await AppDataSource.getRepository(Users).find({
    where: { email: email },
  });
  if (usersWithEmail.length > 0)
    errors.push({ property: "email", value: "Email exists" });

  return errors;
}

function validatePassword(password: string) {
  const exp = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-={};':,.<>?/|\\\"])"
  );

  console.log("password", password);
  if (!password) return "Enter a password!";
  else if (password.length < 10)
    return "Password must be \u2265 10 characters in length";
  else if (!exp.test(password))
    return "Password must contain:\n -At least one lower case\n -At least one upper case\n -At least special character\n -At least one number\n";
  return "";
}

export default userRouter;
