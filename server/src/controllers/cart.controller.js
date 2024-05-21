const db = require("../database");

exports.createOrFindCart = async (req, res) => {
    try {


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create/find cart' });
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
