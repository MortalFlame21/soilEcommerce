const db = require("../database");
const bcrypt = require("bcryptjs");
const {
  validatePassword,
  validateUsernameEmail,
  uniqueUsernameEmail,
  validateUserID,
} = require("../utils/users");

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
  userRouter.post("/", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const passwordInvalid = validatePassword(password);
      if (passwordInvalid) {
        res.send([passwordInvalid]);
        return;
      }

      const errors1 = validateUsernameEmail(username, email);
      if (errors1.length > 0) {
        res.send(errors1);
        return;
      }

      const errors2 = await uniqueUsernameEmail(username, email);
      if (errors2.length > 0) {
        res.send(errors2);
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

  userRouter.put("/", async (req, res) => {
    try {
      const { user_id, username, email, password } = req.body;

      console.log(`${user_id} ${username} ${email} ${password}`);

      const idInvalid = validateUserID(user_id);
      if (idInvalid) {
        res.status(400).send([idInvalid]);
      }

      const passwordInvalid = validatePassword(password);
      if (passwordInvalid) {
        res.send([passwordInvalid]);
        next();
        return;
      }

      const errors1 = validateUsernameEmail(username, email);
      if (errors1.length > 0) {
        res.send(errors1);
        return;
      }

      // !!
      // need to fix this still :(
      // !!
      const errors2 = uniqueUsernameEmail(username, email);
      if (errors2.length > 0) {
        res.send(errors2);
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      await db.users.update(
        { username: username, email: email, hash: passwordHashed },
        { where: { user_id: user_id } }
      );

      console.log("pass");
      res.send("ok good");
    } catch (e) {
      console.log("fail");
      res.status(500).send("Internal Server Error");
    }
  });

  app.use("/user", userRouter);
};
