const db = require("../database");

const createCart = async () => {
    return await db.cart.create();
};

exports.createOrFindCart = async (req, res) => {
    try {
        // 1. Check for existing cart in cookie
        let cartId = req.cookies.cartId;

        if (!cartId) {
            // 2. No cart found, create a new one
            const newCart = await createCart();
            cartId = newCart.cart_id;

            // 3. Store the cart ID in a cookie (adjust expiration as needed)
            res.cookie('cartId', cartId, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                httpOnly: false,
            });
        }

        // 4. Fetch the cart from the database (whether existing or new)
        const cart = await db.cart.findByPk(cartId);

        // 5. Send the cart data in the response (or use as needed)
        res.json(cart);
    } catch (error) {
        console.error("Error in createOrFindCart:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addItemToCart = async (req, res) => {
    const item = await db.cartItem.create({
        cartId: req.body.cartId,
        productId: req.body.productId,
        quantity: req.body.quantity
    });

    res.json(item);
};
