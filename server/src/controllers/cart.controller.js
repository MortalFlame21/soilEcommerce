const db = require("../database");
const { validateUserID, validateCartId } = require("../utils/cart");

const createCart = async (user_id) => {
  try {
    return await db.cart.create({
      user_id: user_id || null,
    });
  } catch (error) {
    console.error("Error in createCart:", error);
  }
};

exports.createOrFindCart = async (req, res) => {
  try {
    const { cart_id, user_id } = req.body;

    // wont bother checking if the user_id maps to the same cart_id

    const cartIdInvalid = await validateCartId(cart_id);
    if (cartIdInvalid) {
      res.status(400).json({ error: cartIdInvalid });
      return;
    }

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
  const item = await db.cartItem.create({
    cartId: req.body.cartId,
    productId: req.body.productId,
    quantity: req.body.quantity,
  });

  res.json(item);
};
