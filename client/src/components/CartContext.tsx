import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  addItemToCart,
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
  addItem: (pId: number, q: number) => Promise<boolean>;
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
    async function setCartAndId() {
      if (!user) {
        const cart_id = await createOrFindCart(undefined);
        setCartId(cart_id);
        if (cart_id) setUserCart(await getCart(cart_id));
        return;
      }

      try {
        const cart_id = await createOrFindCart(user?.user_id);
        setCartId(cart_id);
        if (cart_id) setUserCart(await getCart(cart_id));
      } catch {
        setCartId(undefined);
        setUserCart([]);
      }
    }
    setCartAndId();
  }, [user, cartId]);

  const deleteItem = async (product_id: number) => {
    if (!cartId) return false;
    try {
      const success = await deleteItemFromCart(cartId, product_id);
      const cart = await getCart(cartId);
      setUserCart([...cart]);
      return success;
    } catch (e) {
      return false;
    }
  };

  const updateItem = async (product_id: number, quanity: number) => {
    if (!cartId) return false;
    try {
      const success = await updateItemQuantityInCart(
        cartId,
        product_id,
        quanity
      );
      const cart = await getCart(cartId);
      setUserCart([...cart]);
      console.log(success);
      return success;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const addItem = async (product_id: number, quanity: number) => {
    if (!cartId) return false;
    try {
      const success = await addItemToCart(cartId, product_id, quanity);
      const cart = await getCart(cartId);
      setUserCart([...cart]);
      console.log(success);
      return success;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const setCheckedOut = () => {
    setIsCheckedOut(!isCheckedOut);
  };

  return {
    cartId,
    userCart,
    updateItem,
    deleteItem,
    addItem,
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
