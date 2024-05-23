import axios from "axios";
import config from "./config";

// Create or find cart
const createOrFindCart = async () => {
  try {
    const cartIdInLocalStorage = localStorage.getItem("cart_id");
    const response = await axios.post(`${config.HOST}/carts`, {
      cart_id: cartIdInLocalStorage,
    });
    const cartId = response.data.cart_id;

    if (cartIdInLocalStorage !== cartId) {
      localStorage.setItem("cart_id", cartId);
    }

    return cartId;
  } catch (error) {
    console.error("Failed to create or find cart:", error);
  }
};

// Add item to cart
const addItemToCart = async (
  cartId: number,
  productId: number,
  quantity: number
) => {
  try {
    const response = await axios.post(`${config.HOST}/carts/items`, {
      cartId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
};

export { createOrFindCart, addItemToCart };
