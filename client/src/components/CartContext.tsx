import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Product } from "../utils/product";
import {
  CartItem,
  editProductInCart,
  emptyCart,
  getUserCart,
} from "../utils/cart";
import { AuthConsumer } from "./AuthContext";

type CartContextProps = {
  userCart: CartItem[];
  updateItem: (p: Product, q: number) => boolean;
  getProductInCart: (p: Product | undefined) => CartItem | undefined;
  emptyUserCart: () => void;
  isCheckedOut: boolean;
  setCheckedOut: () => void;
};

type Props = {
  children: ReactNode;
};

// global cart property, handles cart things

const UserCartContext = createContext<CartContextProps | undefined>(undefined);

function useUserCart(): CartContextProps {
  const { user } = AuthConsumer();
  const [isCheckedOut, setIsCheckedOut] = useState(false); // for checkout

  const [userCart, setUserCart] = useState<CartItem[]>(
    getUserCart(user?.email || "")
  );

  useEffect(() => {
    setUserCart(getUserCart(user?.email || ""));
  }, [user]);

  const updateItem = (p: Product, q: number) => {
    if (!user) return false;
    setUserCart(editProductInCart(user.email, p, q));
    return true;
  };

  const emptyUserCart = () => {
    if (user) setUserCart(emptyCart(user.email));
  };

  const getProductInCart = (p: Product | undefined) => {
    if (user && p) return userCart.find((pCart) => pCart.item.product_id === p.product_id);
    return undefined;
  };

  const setCheckedOut = () => {
    setIsCheckedOut(!isCheckedOut);
  };

  return {
    userCart,
    updateItem,
    getProductInCart,
    emptyUserCart,
    isCheckedOut,
    setCheckedOut,
  };
}

export function UserCartProvider({ children }: Props) {
  const auth = useUserCart();
  return (
    <UserCartContext.Provider value={auth}>{children}</UserCartContext.Provider>
  );
}

export function CartConsumer(): CartContextProps {
  const cart = useContext(UserCartContext);

  if (!cart)
    throw new Error(
      `Error in CartConsumer, cart must be undefined, cart ${cart}`
    );

  return cart;
}
