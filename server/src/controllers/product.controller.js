const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const products = await db.product.findAll();

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html


  res.json(products);
};

// Create a post in the database.
exports.create = async (req, res) => {
  const product = await db.product.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    onSpecial: req.body.onSpecial,
    size: req.body.size,
    unit: req.body.unit
  });

  res.json(product);
};
