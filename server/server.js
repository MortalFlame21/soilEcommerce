const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = 5173;
app.listen(
  PORT,
  console.log(
    `Server is running on port ${PORT}. Visit http://localhost:${PORT}`
  )
);

// fix:
//  allow server to connect to client
//  look at other code examples

// client dep to add
// axios
