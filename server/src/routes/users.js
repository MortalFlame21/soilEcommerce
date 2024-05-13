const db = require("../database");

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
      res.send("huh post");
    } catch (e) {
      console.log(e);
      res.send(["Server error get"]);
    }
  });

  app.use("/users", userRouter);
};

async function validateUsernameEmail(username, email) {
  return "";
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
