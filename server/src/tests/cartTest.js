const db = require("../database");
const {
  createOrFindCart,
  addItemToCart,
  emptyCart,
} = require("../controllers/cart.controller");

// don't query the db during unit tests, we'll refer to the mock cart table below
jest.mock("../database");

// mockDbTable
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

// mockDbProductTable
const mockProductTable = [
  {
    data: {
      cart_id: 19,
      product_id: 2,
      quantity: 5,
    },
    save: jest.fn(),
  },
  {
    data: {
      cart_id: 17,
      product_id: 5,
      quantity: 12,
    },
    save: jest.fn(),
  },
];

const mockRequestBodyProducts = [
  // Non-logged user adds 5
  {
    cart_id: 19,
    product_id: 2,
    quantity: 5,
  },
  // Logged user adds 4 to existing of 8
  {
    cart_id: 17,
    product_id: 3,
    quantity: 4,
  },
  // Invalid body
  {
    cart_id: null,
    product_id: 10,
    quantity: null,
  },
];

const mockRequestQueryProduct = [
  // Logged user emptys cart
  {
    cart_id: 19,
    user_id: 2,
  },
  // Non-logged user emptys cart
  {
    cart_id: 19,
    user_id: null,
  },
  // Invalid query
  {
    cart_id: null,
    user_id: "",
  },
];

module.exports = () => {
  describe("Test 'carts/' route", () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
      mockRequest = {
        body: {},
        query: {},
      };

      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    describe("1. Getting or creating the cart_id, test GET method", () => {
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

    describe("2. Adding a product to a shopping cart, test POST method", () => {
      test("Non-logged in user with cart_id adds new product to cart", async () => {
        // fake body req
        mockRequest.body = mockRequestBodyProducts.at(0);

        // fake return
        db.cart_products.findOrCreate.mockImplementationOnce(() => {
          return [mockProductTable.at(0), true]; // true being item was created
        });
        await addItemToCart(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProductTable.at(0));
      });

      test("Logged in user adds to existing product in cart", async () => {
        // fake body req
        mockRequest.body = mockRequestBodyProducts.at(0);

        // fake return
        db.cart_products.findOrCreate.mockImplementationOnce(() => {
          return [mockProductTable.at(0), false]; // true being item was created
        });
        await addItemToCart(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProductTable.at(0));
      });

      test("Invalid body request to route", async () => {
        // fake body req
        mockRequest.body = mockRequestBodyProducts.at(2);

        // fake return
        db.cart_products.findOrCreate.mockImplementationOnce(() => {
          return {
            type: "throw",
            value: {
              error: "Error with cart_id and quantity",
            },
          };
        });
        await addItemToCart(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(500);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: "An error occurred while adding the item to the cart",
        });
      });
    });

    describe("3. Empty the shopping cart, test DELETE method", () => {
      test("Empty the logged in user cart", async () => {
        // fake query req
        mockRequest.query = mockRequestQueryProduct.at(0);

        // fake returns
        db.cart_products.destroy(() => {});
        await emptyCart(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Cart emptied",
        });
      });

      test("Empty the not logged in user cart", async () => {
        // fake query req
        mockRequest.query = mockRequestQueryProduct.at(1);

        // fake return
        db.cart.destroy(() => {});
        db.cart_products.destroy(() => {});
        await emptyCart(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Cart emptied",
        });
      });

      test("Empty the non existing cart with invalid query", async () => {
        // fake query req
        mockRequest.query = mockRequestQueryProduct.at(2);

        // fake return
        db.cart.destroy(() => {});
        db.cart_products.destroy(() => {});

        await emptyCart(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1); // invalid requst query will not cause an error
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Cart emptied",
        });
      });
    });
  });
};
