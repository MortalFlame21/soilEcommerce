const express = require("express");
const cors = require("cors");
const db = require("./src/database");

const graphql = require("./src/graphql");
const { graphqlHTTP } = require("express-graphql");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

db.sync({ logging: console.log });

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphql.schema,
    rootValue: graphql.root,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// routes
require("./src/routes/users.js")(express, app);
require("./src/routes/product.routes.js")(express, app);
require("./src/routes/cart.routes.js")(express, app);
require("./src/routes/review.routes.js")(express, app);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
