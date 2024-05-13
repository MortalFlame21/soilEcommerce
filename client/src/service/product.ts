import axios from "axios";
import config from "./config";

export async function findProductByID(id: number) {
  try {
    const res = await axios.get(`${config.HOST}/products/${id}`);
    return res.data.length > 0;
  } catch {
    return false;
  }
}

export async function allProducts() {
  try {
    const res = await axios.get(`${config.HOST}/products`);
    return res.data;
  } catch {
    return [];
  }
}
