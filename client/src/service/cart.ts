import axios from "axios";
import config from "./config";
import { CartItem } from "../utils/cart";

// Create or find cart
const createOrFindCart = async (user_id: number | undefined) => {
  try {
    const cartIdInLocalStorage = localStorage.getItem("cart_id");
    let response;
    if (user_id) {
      response = await axios.post(`${config.HOST}/carts`, {
        user_id: user_id,
      });
    } else {
      console.log(`in cartIdInLocalStorage ${cartIdInLocalStorage}`);

      response = await axios.post(`${config.HOST}/carts`, {
        cart_id: cartIdInLocalStorage,
      });
    }
    const cartId = response.data.cart_id;

    if (cartIdInLocalStorage !== cartId) {
      localStorage.setItem("cart_id", cartId);
    }
    console.log(`cartId ${cartId}\n\n\n`);
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

//delete item from cart
const deleteItemFromCart = async (cart_id: number, product_id: number) => {
  try {
    if (!cart_id) {
      throw new Error("Cart ID is undefined");
    }
    const response = await axios.delete(
      `${config.HOST}/carts/items?cart_id=${cart_id}&product_id=${product_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete item from cart:", error);
  }
};

//check if product is in cart
const checkProductInCart = async (cart_id: number, product_id: number) => {
  try {
    if (!cart_id) {
      throw new Error("Cart ID is undefined");
    }
    const response = await axios.get(
      `${config.HOST}/carts/items?cart_id=${cart_id}&product_id=${product_id}`
    );
    if (response.data === null) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Failed to check product in cart:", error);
  }
};

//update item quantity in cart
const updateItemQuantityInCart = async (
  cart_id: number,
  product_id: number,
  quantity: number
) => {
  try {
    if (!cart_id) {
      throw new Error("Cart ID is undefined");
    }
    const response = await axios.put(`${config.HOST}/carts/items`, {
      cart_id,
      product_id,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update item quantity in cart:", error);
  }
};

//gets the users cart using the cart_id
const getCart = async (cart_id: number): Promise<CartItem[]> => {
  try {
    if (!cart_id) {
      throw new Error("Cart ID is undefined");
    }
    const response = await axios.get(
      `${config.HOST}/carts/userCart/?cart_id=${cart_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to get cart:", error);
    return [];
  }
};

export {
  createOrFindCart,
  addItemToCart,
  checkProductInCart,
  deleteItemFromCart,
  updateItemQuantityInCart,
  getCart,
};
