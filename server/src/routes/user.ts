import express from "express";
import AppDataSource from "../db/dataSource.js";
import { Users } from "../db/models/users.js";

const userRouter = express.Router(); // for validation only

userRouter.get("/", async (req, res) => {
  //   console.log("get request received");
  //   console.log(req.body.username);
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Users)
    .values([
      {
        username: "user1@MAIL.co",
        email: "user1@MAIL.co",
        hash: "user1@MAIL.co",
      },
    ])
    .execute();

  res.send("Hello /user");
});

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

export default userRouter;
