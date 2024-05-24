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
  cart_id: number,
  product_id: number,
  quantity: number
) => {
  try {
    if (!cart_id) {
      throw new Error("Cart ID is undefined");
    }
    const response = await axios.post(`${config.HOST}/carts/items`, {
      cart_id,
      product_id,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
};

export { createOrFindCart, addItemToCart };
