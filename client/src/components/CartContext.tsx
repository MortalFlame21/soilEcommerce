import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createOrFindCart,
  deleteItemFromCart,
  getCart,
  updateItemQuantityInCart,
} from "../service/cart";

import { AuthConsumer } from "./AuthContext";
import { CartItem } from "../utils/cart";

type CartContextProps = {
  cartId: number | undefined;
  userCart: CartItem[];
  deleteItem: (pId: number) => Promise<boolean>;
  updateItem: (pId: number, q: number) => Promise<boolean>;
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
  const [userCart, setUserCart] = useState<CartItem[]>([]);

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

    if (cartId)
      getCart(cartId)
        .then((userCart) => {
          setUserCart([...userCart]);
        })
        .catch(() => {
          setUserCart([]);
        });
    else setUserCart([]);
  }, [user, cartId]);

  const deleteItem = async (product_id: number) => {
    if (!cartId) return false;
    const success = await deleteItemFromCart(cartId, product_id);
    const cart = await getCart(cartId);
    setUserCart([...cart]);
    return success;
  };

  const updateItem = async (product_id: number, quanity: number) => {
    if (!cartId) return false;
    const success = await updateItemQuantityInCart(cartId, product_id, quanity);
    const cart = await getCart(cartId);
    setUserCart([...cart]);
    return success;
  };

  const setCheckedOut = () => {
    setIsCheckedOut(!isCheckedOut);
  };

  return {
    cartId,
    userCart,
    updateItem,
    deleteItem,
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
