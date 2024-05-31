const db = require("../database");
const { createOrFindCart } = require("../controllers/cart.controller");

// don't query the db during unit tests, we'll refer to the mock cart table below
jest.mock("../database");

const mockCartTable = [
  { user_id: null, cart_id: 22 },
  { user_id: null, cart_id: 19 },
];

const mockRequestBodyCarts = [
  // Non-logged user with no existing cart
  {
    cart_id: null,
    user_id: null,
  },
  // Non-logged user with existing cart
  {
    cart_id: 19,
    user_id: null,
  },
  // Invalid user_id with existing cart
  {
    cart_id: 19,
    user_id: 10,
  },
];

describe("Adding a product to a shopping cart", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

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

  test("Non-logged in user with an existing cart in their local storage", async () => {
    // fake body req
    mockRequest.body = mockRequestBodyCarts.at(1);

    // fake return
    db.cart.create.mockImplementationOnce(() => {
      return mockCartTable.at(1);
    });
    await createOrFindCart(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCartTable.at(1));
  });

  test("Sent invalid user_id within the body request", async () => {
    // fake body req
    mockRequest.body = mockRequestBodyCarts.at(2);

    // fake return
    db.users.findOne.mockImplementationOnce(() => {
      return null;
    });
    await createOrFindCart(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "User not found",
    });
  });
});
