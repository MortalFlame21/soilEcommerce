const db = require("../database");

// Select all product from the database.
exports.all = async (req, res) => {
  const products = await db.product.findAll();

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html


  res.json(products);
};
// Select a single product by its id.
exports.one = async (req, res) => {
  const product = await db.product.findByPk(req.params.id);

  res.json(product);
};

// Select product image by id
exports.image = async (req, res) => {
  const product = await db.product.findByPk(req.params.id);

  if (product) {
    res.send(product.image);
  } else {
    res.status(404).send('Product not found');
  }
};

// Create a product in the database.
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
