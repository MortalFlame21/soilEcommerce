// Everything related to storing and grabbing products from user cart

const CART_LIST_KEY = "__CART";

type Product = {
  name: string;
  image: string;
  description: string;
  price: number;
  onSpecial: boolean;
  size: number;
  unit: string;
};

export type CartItem = {
  Product: Product;
  product_id: number;
  quantity: number;
};

type UserCartList = { [email: string]: CartItem[] }; // email is mapped to their cart list

function getCartList(): UserCartList {
  try {
    return JSON.parse(localStorage.getItem(CART_LIST_KEY) || "{}");
  } catch {
    return {};
  }
}

// get card based on email
export function getUserCart(email: string): CartItem[] {
  try {
    return getCartList()[email] || [];
  } catch {
    return [];
  }
}

// update the quantity to q
export function editProductInCart(email: string, p: Product, q: number) {
  const storedCarts = getCartList();

  const userCart = getUserCart(email);

  const existingItem = userCart.find((cartI) => cartI.item.id === p.id);

  if (existingItem) {
    existingItem.quantity = q;

    if (q <= 0) {
      const productIndex = userCart.findIndex(
        (cartI) => cartI.item.id === p.id
      );
      userCart.splice(productIndex, 1);
    }
  } else
    userCart.push({
      item: p,
      quantity: q,
    });

  localStorage.setItem(
    CART_LIST_KEY,
    JSON.stringify({ ...storedCarts, [email]: userCart })
  );

  return userCart; // return updated cart
}

export function getCartTotal(userCart: CartItem[]) {
  const total = 1;
  // userCart.forEach((cartItem) => {
  //   total += cartItem.item.price * cartItem.quantity;
  // });
  return total.toFixed(2);
}

// empty the user cart
export function emptyCart(email: string) {
  const storedCarts = getCartList();
  const userCart = getUserCart(email);
  userCart.splice(0, userCart.length);
  localStorage.setItem(
    CART_LIST_KEY,
    JSON.stringify({ ...storedCarts, [email]: userCart })
  );
  // window.location.reload();

  return userCart; // return empty cart
}
