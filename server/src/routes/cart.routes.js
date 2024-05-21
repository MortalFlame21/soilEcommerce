module.exports = (express, app) => {
    const controller = require("../controllers/cart.controller.js");
    const router = express.Router();

    // Create a new cart or find an existing cart.
    router.post('/', controller.createOrFindCart);
    // Add an item to the cart.
    router.post('/items', controller.addItemToCart);

    // Add routes to server.
    app.use("/carts", router);
};
