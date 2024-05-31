import axios from "axios";
import config from "./config";

export async function getProductReviews(
  product_id: number,
  user_id: number | undefined
) {
  try {
    const res = await axios.get(
      `${config.HOST}/reviews/?product_id=${product_id}&user_id=${
        user_id || ""
      }`
    );
    return res.data;
  } catch {
    return [];
  }
}

export async function createReview(
  user_id: number,
  product_id: number,
  title: string,
  description: string,
  stars: number
) {
  try {
    const res = await axios.post(`${config.HOST}/reviews/`, {
      user_id: user_id,
      product_id: product_id,
      title: title,
      description: description,
      stars: stars,
    });
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function updateReview(
  user_id: number,
  product_id: number,
  title: string,
  description: string,
  stars: number
) {
  try {
    const res = await axios.patch(`${config.HOST}/reviews/`, {
      user_id: user_id,
      title: title,
      product_id: product_id,
      description: description,
      stars: stars,
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function deleteReview(user_id: number, product_id: number) {
  try {
    const res = await axios.delete(
      `${config.HOST}/reviews/?user_id=${user_id}&product_id=${product_id}`
    );
    return res.data;
  } catch {
    return [];
  }
}
