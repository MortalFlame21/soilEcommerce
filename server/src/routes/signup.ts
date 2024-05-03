import express from "express";

const signUpRouter = express.Router();

signUpRouter.get("/", (req, res) => {
  res.send("hello /signup");
});

signUpRouter.post("/", (req, res) => {
  res.send("POST request to /signup");
});

export default signUpRouter;
