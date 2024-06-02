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
`);

graphql.root = {
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
    latest_reviews: async () => {
        const reviews = await db.review.findAll({
            include: [{
                model: db.users,
                as: 'User',
                attributes: ['username']
            }],
            order: [['review_created', 'DESC']],
            limit: 2
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
    addAdmin: async () => { },
    blockUser: async () => { },
    unblockUser: async () => { },
    addProduct: async () => { },
    editProduct: async () => { },
    deleteProduct: async () => { },
};

module.exports = graphql;
