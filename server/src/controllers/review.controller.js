const db = require("../database");

// todo: valite .create

// Get all reviews for the single product
exports.getSingleProduct = async (req, res) => {
  const { product_id } = req.query;

  try {
    const productReviews = await db.review.findAll({
      where: {
        product_id: product_id,
      },
    });
    // a non existent product_id will return []
    res.status(200).json(productReviews);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new review
exports.create = async (req, res) => {
  const { user_id, product_id, description, stars } = req.body;

  await db.review.create({
    user_id: user_id,
    product_id: product_id,
    description: description,
    stars: stars,
  });

  res.status(200).json({
    message: `Success. user_id: ${user_id} has reviewed product_id: ${product_id}`,
  });
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// todo:
// edit the review
exports.patch = async (req, res) => {
  const { user_id, product_id, description, stars } = req.body;
  res.send("PATCH / review");
};

// delete the review
exports.delete = async (req, res) => {
  const { user_id, product_id } = req.body;
  res.send("DELETE / review");
};
