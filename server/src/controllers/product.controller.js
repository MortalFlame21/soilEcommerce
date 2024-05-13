const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const products = await db.post.findAll();

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(products);
};

// Create a post in the database.
exports.create = async (req, res) => {
  const product = await db.post.create({
    text: req.body.text,
    username: req.body.username
  });

  res.json(product);
};
