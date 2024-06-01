const { buildSchema } = require("graphql");
const db = require("../database/");

const graphql = {};

graphql.schema = buildSchema(`
    type Admin {
        admin_id: Int!,
        user_id: Int!
    }

    type User {
        user_id: Int,
        username: String!,
        email: String!,
        hash: String!,
        date_joined: String!
    }

    type Review {
        id: Int!,
        stars: Int!,
        title: String!,
        description: String!,
        user_id: Int!,
        product_id: Int!,
        review_created: String!
    }

    type Product {
        id: Int!,
        name: String!,
        image: String!,
        description: String!,
        price: String!,
        onSpecial:  Boolean!,
        size: Int!,
        unit: String!
    }
`);

graphql.root = {
  addAdmin: async () => {},
  blockUser: async () => {},
  unblockUser: async () => {},
  addProduct: async () => {},
  editProduct: async () => {},
  deleteProduct: async () => {},
};

module.exports = graphql;
