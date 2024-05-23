const db = require("../database");

const createCart = async () => {
    return await db.cart.create();
};

exports.createOrFindCart = async (req, res) => {
    try {


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
