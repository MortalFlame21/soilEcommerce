const db = require("../database");
const validate = require("validator");
const bcrypt = require("bcryptjs");

module.exports = (express, app) => {
  const userRouter = express.Router();

  // find by username
  userRouter.get("/username/:username", async (req, res) => {
    try {
      const users = await db.users.findAll({
        where: {
          username: req.params.username,
        },
      });
      res.send(users);
    } catch (e) {
      console.log(e);
      res.send([]);
    }
  });

  // find by email
  userRouter.get("/email/:email", async (req, res) => {
    try {
      const users = await db.users.findAll({
        where: {
          email: req.params.email,
        },
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

      const passwordInvalid = validatePassword(password);
      if (passwordInvalid) {
        res.send([passwordInvalid]);
        next();
        return;
      }

      const errors = await validateUsernameEmail(username, email);
      if (errors.length > 0) {
        res.send(errors);
        next();
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      await db.users.create({
        username: username,
        email: email,
        hash: passwordHashed,
      });

      res.send([]);
    } catch (e) {
      console.log(e);
      res.send(["Server error POST"]);
    }
  });

  app.use("/user", userRouter);
};

async function validateUsernameEmail(username, email) {
  const errors = [];

  if (!username || !validate.isLength(username, { min: 5, max: 30 })) {
    errors.push({
      property: "username",
      value: "Username must be between 5 and 30 characters",
    });
  }

  if (!email || !validate.isEmail(email)) {
    errors.push({ property: "email", value: "Invalid email address" });
  }

  // validate its uniqueness
  const usersWithUsername = await db.users.findAll({
    where: { username: username },
  });
  if (usersWithUsername.length > 0)
    errors.push({ property: "email", value: "Username exists" });

  const usersWithEmail = await db.users.findAll({
    where: { email: email },
  });
  if (usersWithEmail.length > 0)
    errors.push({ property: "email", value: "Email exists" });

  console.log(errors);
  return errors;
}

function validatePassword(password) {
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
