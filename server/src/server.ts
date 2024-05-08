import express, { Request, Response } from "express";
import cors from "cors";

import AppDataSource from "./db/dataSource.js";

import signUpRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (res, req) => {
  req.send("hello /");
});

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.use("/login", userRouter);

AppDataSource.initialize()
  .then(() => console.log("Server is connected"))
  .catch((e) => {
    console.log(e);
    console.log("Server is not working");
  });

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
