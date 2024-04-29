import store from "../data/store.json";

// Everything related to storing and grabbing products

const PRODUCT_LIST_KEY = "__PRODUCTS";

export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  onSpecial: boolean;
  size: number;
  unit: string;
};

export type ProductList = Product[]; // list of products

// intialises the products for the website
export function initProducts() {
  localStorage.setItem(PRODUCT_LIST_KEY, JSON.stringify(store.products));
}

export function getProductList(): ProductList {
  try {
    return JSON.parse(localStorage.getItem(PRODUCT_LIST_KEY) || "[]");
  } catch {
    return [];
  }
}

// get product on :id
export function getProduct(id: number): Product | undefined {
  const productList = getProductList();
  let product = undefined;
  productList.forEach((p) => {
    if (p.id === id) product = p;
  });
  return product;
}
