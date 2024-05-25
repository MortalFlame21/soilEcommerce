import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { createOrFindCart, getCart } from "../service/cart";

import { AuthConsumer } from "./AuthContext";
import { CartItem } from "../utils/cart";

type CartContextProps = {
  cartId: number | undefined;
  getUserCart: () => Promise<CartItem[]>;
  // updateItem: (p: Product, q: number) => boolean;
  // getProductInCart: (p: Product | undefined) => CartItem | undefined;
  // emptyUserCart: () => void;
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

  const [cartId, setCartId] = useState<number | undefined>(undefined);

  useEffect(() => {
    createOrFindCart()
      .then((id) => {
        if (!id) throw new Error("No id returned???");
        setCartId(id);
      })
      .catch((e) => {
        console.log(e);
        setCartId(undefined);
      });
  }, [user]);

  const getUserCart = async () => {
    if (!cartId) return [];
    const cart = await getCart(cartId);
    return cart;
  };

  const setCheckedOut = () => {
    setIsCheckedOut(!isCheckedOut);
  };

  return {
    cartId,
    getUserCart,
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
