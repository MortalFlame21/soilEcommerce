module.exports = (express, app) => {
    const controller = require("../controllers/cart.controller.js");
    const router = express.Router();

    // Create a new cart or find an existing cart.
    router.post('/', controller.createOrFindCart);
    // Add an item to the cart.
    router.post('/items', controller.addItemToCart);
    // Remove an item from the cart.
    router.delete('/items', controller.deleteItemFromCart);
    //update the quantity of the product in the cart
    router.put('/items', controller.updateItemQuantity);
    //gets the product that is in cart
    router.get('/items', controller.checkProductInCart);

    // Add routes to server.
    app.use("/carts", router);
};
