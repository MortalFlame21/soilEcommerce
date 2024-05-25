const db = require("../database");
const { createOrFindCart } = require("../controllers/cart.controller");

// don't query the db during unit tests, we'll refer to the mock cart table below
jest.mock("../database");

const mockCartTable = [{ user_id: null, cart_id: 22 }];

const mockRequestBodyCarts = [
  // Non-logged user with no existing cart
  {
    mock_cart_id: null,
    mock_user_id: null,
  },
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
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Adding a product to a shopping cart", () => {
  test("Non-logged in user creates a new cart row", async () => {
    // fake body req
    mockRequest.body = mockRequestBodyCarts.at(0);

    // fake return
    db.cart.create.mockImplementationOnce(() => {
      return mockCartTable.at(0);
    });
    await createOrFindCart(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCartTable.at(0));
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
});
