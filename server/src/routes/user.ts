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

userRouter.get("/:username", async (req, res) => {
  const users = await AppDataSource.getRepository(Users).find({
    where: { username: req.params.username },
  });

  res.send(users);
});

export default userRouter;
