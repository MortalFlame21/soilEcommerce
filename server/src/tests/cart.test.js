const { createOrFindCart } = require("../controllers/cart.controller");

// don't query the db during unit tests, we'll refer to the mock cart table below
jest.mock("../database");

const mockBodyCarts = [
  // Existing user differing cart and user id
  {
    mock_cart_id: 21,
    mock_user_id: 15,
  },
  // Existing user with same cart and user id
  {
    mock_cart_id: 5,
    mock_user_id: 5,
  },
  // Non-logged user with no existing cart
  {
    mock_cart_id: null,
    mock_user_id: null,
  },
  // Non-logged user with existing cart
  {
    mock_cart_id: 19,
    mock_user_id: null,
  },
  // No body in request
  {},
];

const mockRequest = {
  body: {},
};

const mockResponse = {
  json: jest.fn(),
  status: jest.fn(),
};

test("Non-logged in user creates a new cart row", async () => {
  mockRequest.body = mockBodyCarts.at(2);

  await createOrFindCart(mockRequest, mockResponse);

  expect(mockResponse.status);
  expect(mockResponse.json);
});

// test("Non-logged in user with an existing cart in their local storage", () => {
//   // Non-logged user
//   // req:
//   // {
//   //      cart_id : some existing and valid cart_id
//   //      user_id : null
//   // }
//   expect(createOrFindCart(req, res)).toBe();
// });

// test("Non-logged in user, then logged in after adding a item to the cart", () => {
//   // Logged user
//   // req:
//   // {
//   //      cart_id : ?
//   //      user_id : some existing and valid user_id
//   // }
//   expect(createOrFindCart(req, res)).toBe();
// });
