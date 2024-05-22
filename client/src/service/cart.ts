import axios from "axios";
import config from "./config";

// Create or find cart
const createOrFindCart = async () => {
  try {
    // Try to get an existing cart
    const response = await axios.post(`${config.HOST}/carts/`);
    if (response.data.cart_id) {
      // If a cart exists, return its ID
      return response.data.cart_id;
    }
  } catch (error) {
    console.error("Failed to find cart:", error);
  }

  try {
    // If no cart exists, create a new one
    const response = await axios.post(`${config.HOST}/carts/`);
    return response.data.cartId;
  } catch (error) {
    console.error("Failed to create cart:", error);
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
