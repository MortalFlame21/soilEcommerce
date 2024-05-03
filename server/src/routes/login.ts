import express from "express";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.send("hello /login");
});

loginRouter.post("/", (req, res) => {
  res.send("POST request to /login");
});

export default loginRouter;
