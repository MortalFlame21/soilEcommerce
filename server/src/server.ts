import express, { Request, Response } from "express";
import cors from "cors";
import signUpRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";

const app = express();

app.use(cors());

app.get("/", (res, req) => {
  req.send("hello /");
});

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
