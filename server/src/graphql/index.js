const { gql } = require("apollo-server-express");
const db = require("../database/");
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();
const REVIEW_ADDED = 'REVIEW_ADDED';


const typeDefs = gql`
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
        review_created: String!,
        username: String!
        
        
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

    type Query {
        all_reviews: [Review]
        latest_reviews: [Review]
        numUsers: Int
        numProducts: Int
        numReviews: Int
    }

    type Subscription {
        latest_reviews: [Review]
    }
`;

const resolvers = {
    Query: {
        all_reviews: async () => {
            const reviews = await db.review.findAll({
                include: [{
                    model: db.users,
                    as: 'User',
                    attributes: ['username']
                }]
            });

            return reviews.map(review => ({
                ...review.get(),
                username: review.User.username
            }));
        },
        numUsers: async () => {
            const numUsers = await db.users.count();
            return numUsers;
        },
        numProducts: async () => {
            const numProducts = await db.product.count();
            return numProducts;
        },
        numReviews: async () => {
            const numReviews = await db.review.count();
            return numReviews;
        },
    },
    Subscription: {
        latest_reviews: {
            subscribe: () => pubsub.asyncIterator([REVIEW_ADDED]),
        },
    },
};

module.exports = {
    typeDefs, resolvers
};
