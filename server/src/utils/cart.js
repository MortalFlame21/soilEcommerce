const db = require("../database");

async function validateUserID(user_id) {
  if (!user_id) return ""; // skip anon users can add to cart

  const existingUser = await db.users.findOne({
    where: { user_id: user_id },
  });
  if (!existingUser) return "User not found";

  return "";
}

async function validateCartId(cart_id) {
  if (!cart_id) return ""; // skip anon users can add to cart

  const existingCartId = await db.cart.findOne({
    where: { cart_id: cart_id },
  });
  if (!existingCartId) return "Cart ID not found";
  return "";
}

module.exports = {
  validateUserID,
  validateCartId,
};
