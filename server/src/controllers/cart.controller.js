const db = require("../database");

const createCart = async (user_id) => {
  try {
    return await db.cart.create({
      user_id: user_id || null,
    });
  } catch (error) {
    console.error("Error in createCart:", error);
  }
};

async function validateUserID(user_id) {
  if (!user_id) return ""; // skip anon users can add to cart

  const existingUser = await db.users.findOne({
    where: { user_id: user_id },
  });
  if (!existingUser) return "User not found";

  return "";
}

exports.createOrFindCart = async (req, res) => {
  try {
    const { cart_id, user_id } = req.body;

    // wont bother checking if the user_id maps to the same cart_id

    const idInvalid = await validateUserID(user_id);
    if (idInvalid) {
      res.status(400).json({ error: idInvalid });
      return;
    }

    let cart = null;
    // find an existing cart based on cart_id or user_id
    if (cart_id) cart = await db.cart.findByPk(cart_id);
    else if (user_id)
      cart = await db.cart.findOne({ where: { user_id: user_id } });

    // if no carts created above, make one
    if (!cart) cart = await createCart(user_id);

    res.json(cart);
  } catch (error) {
    console.error("Error in createOrFindCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const [item, created] = await db.cart_products.findOrCreate({
      where: {
        cart_id: req.body.cart_id,
        product_id: req.body.product_id,
      },
      defaults: {
        quantity: req.body.quantity,
      },
    });

    if (!created) {
      item.quantity += req.body.quantity;
      await item.save();
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the item to the cart" });
  }
};
