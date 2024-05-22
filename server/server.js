const express = require("express");
const cors = require("cors");
const db = require("./src/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());



db.sync({ logging: console.log });

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// routes
require("./src/routes/users.js")(express, app);
require("./src/routes/product.routes.js")(express, app);
require("./src/routes/cart.routes.js")(express, app);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
