const db = require("../database");
const { validateUserID } = require("../utils/users");
const validate = require("validator");

// todo: validate .create

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
  try {
    const idInvalid = await validateUserID(user_id);
    if (idInvalid) {
      res.status(500).json({ message: idInvalid });
      return;
    }

    // validate product_id
    const productIdValid = await db.product.findByPk(product_id);
    if (!productIdValid) {
      res.status(500).json({ message: "Invalid product_id!" });
      return;
    }

    const descriptionTrimmed = description.trim();

    // check if the user has already created one ???
    // const reviewExists = await db.review.findAll({
    //   where: {
    //     user_id: user_id,
    //     product_id: product_id,
    //   },
    // });

    if (
      !descriptionTrimmed ||
      !validate.isLength(descriptionTrimmed, { min: 5, max: 100 })
    ) {
      res.status(500).json({ message: "Invalid product review description!" });
      return;
    }

    if (stars < 1 || stars > 5) {
      res.status(500).json({ message: `Invalid star rating! stars, ${stars}` });
      return;
    }

    await db.review.create({
      user_id: user_id,
      product_id: product_id,
      description: descriptionTrimmed,
      stars: stars,
    });

    res.status(200).json({
      message: `Success. user_id: ${user_id} has reviewed product_id: ${product_id}`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// todo:
// edit the review
exports.edit = async (req, res) => {
  const { user_id, product_id, description, stars } = req.body;

  try {
    const idInvalid = await validateUserID(user_id);
    if (idInvalid) {
      res.status(500).json({ message: idInvalid });
      return;
    }

    // validate product_id
    const productIdValid = await db.product.findByPk(product_id);
    if (!productIdValid) {
      res.status(500).json({ message: "Invalid product_id!" });
      return;
    }

    const descriptionTrimmed = description.trim();
    if (
      !descriptionTrimmed ||
      !validate.isLength(descriptionTrimmed, { min: 5, max: 100 })
    ) {
      res.status(500).json({ message: "Invalid product review description!" });
      return;
    }

    if (stars < 1 || stars > 5) {
      res.status(500).json({ message: `Invalid star rating! stars, ${stars}` });
      return;
    }

    await db.review.update(
      {
        description: descriptionTrimmed,
        stars: stars,
      },
      { where: { user_id: user_id, product_id: product_id } }
    );

    res.status(200).json({
      message: `Success. user_id: ${user_id} has modified the review for product_id: ${product_id}`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete the review
exports.delete = async (req, res) => {
  const { user_id, product_id } = req.body;
  res.send("DELETE / review");
};
