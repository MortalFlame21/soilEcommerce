// NOTE: turn to review.test.js

const db = require("../database");
const { create } = require("../controllers/review.controller");

// don't query the db during unit tests, we'll refer to the mock review table below
jest.mock("../database");

module.exports = () => {
  describe("Test 'review/' route", () => {
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

    describe("1. Creating a product review, test POST method", () => {
      test.todo("todo");
    });

    describe("2. Deleting a product review, test DELETE method", () => {
      test.todo("todo");
    });

    describe("3. Getting the existing review(s), test GET method", () => {
      test.todo("todo");
    });
  });
};
