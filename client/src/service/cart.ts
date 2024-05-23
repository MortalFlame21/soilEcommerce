import axios from "axios";
import config from "./config";

// Create or find cart
const createOrFindCart = async () => {
  try {
    const response = await axios.post(`${config.HOST}/carts`);
    return response.data;
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
