const db = require("../database");
const user = require("../database/models/user");

const createCart = async (id) => {
    try {
        if (id) {
            return await db.cart.create({
                user_id: id
            });
        };
        return await db.cart.create();
    } catch (error) {
        console.error("Error in createCart:", error);

    }
};


exports.createOrFindCart = async (req, res) => {
    try {
        const { cart_id: cartId, user_id: userId } = req.body;

        let cart = null;
        if (cartId) {
            cart = await db.cart.findByPk(cartId);
        }
        if (userId) {
            cart = await db.cart.findOne({ where: { user_id: userId } });
        }
        if (cart === null) {
            cart = await createCart(userId);
        }

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
