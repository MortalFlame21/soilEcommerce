const db = require("../database");
const bcrypt = require("bcryptjs");
const {
  validatePassword,
  validateUsernameEmail,
  uniqueUsernameEmail,
  validateUserID,
} = require("../utils/users");
const { Op } = require("sequelize");

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

  userRouter.patch("/", async (req, res) => {
    try {
      const { user_id, username, email, password } = req.body;

      console.log(`${user_id} ${username} ${email} ${password}`);

      const idInvalid = await validateUserID(user_id);
      if (idInvalid) {
        res.send(idInvalid);
        return;
      }

      const passwordInvalid = validatePassword(password);
      if (passwordInvalid) {
        res.send(passwordInvalid);
        return;
      }

      const errors1 = validateUsernameEmail(username, email);
      if (errors1.length > 0) {
        res.send(errors1);
        return;
      }

      const errors2 = await uniqueUsernameEmail(username, email, {
        [Op.not]: [{ user_id: [user_id] }],
      });
      if (errors2.length > 0) {
        res.send(errors2);
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 10);

      await db.users.update(
        { username: username, email: email, hash: passwordHashed },
        { where: { user_id: user_id } }
      );

      res.send([]);
    } catch {
      res.send(["Internal Server Error"]);
    }
  });

  userRouter.delete("/", async (req, res) => {
    try {
      const { user_id } = req.body;

      const idInvalid = await validateUserID(user_id);
      if (idInvalid) {
        res.send(idInvalid);
        return;
      }

      // DELETE CART STUFF AND REVIEW STUFF AS WELL!
      await db.users.destroy({ where: { user_id: user_id } });
      res.send([]);
    } catch {
      res.send(["Internal Server Error"]);
    }
  });

  app.use("/user", userRouter);
};
