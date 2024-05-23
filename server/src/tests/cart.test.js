const { createOrFindCart } = require("../controllers/cart.controller");

test("Non-logged in user creates a new cart row", () => {
  // Non-logged user
  // {
  //      cart_id : null
  //      user_id : null
  // }
  expect(createOrFindCart(req, res)).toBe();
});

test("Non-logged in user with an existing cart in their local storage", () => {
  // Non-logged user
  // req:
  // {
  //      cart_id : some existing and valid cart_id
  //      user_id : null
  // }
  expect(createOrFindCart(req, res)).toBe();
});

test("Non-logged in user, then logged in after adding a item to the cart", () => {
  // Logged user
  // req:
  // {
  //      cart_id : ?
  //      user_id : some existing and valid user_id
  // }
  expect(createOrFindCart(req, res)).toBe();
});
