import { Offcanvas } from "react-bootstrap";
import { AuthConsumer } from "./AuthContext";

import { Button } from "react-bootstrap";
import { CartConsumer } from "./CartContext";
import CartItems from "./CartItems";
import { useNavigate } from "react-router-dom";
import { CartItem, getCartTotal } from "../utils/cart";
import { useEffect, useState } from "react";

function Cart({ toggleShowCart }: { toggleShowCart: () => void }) {
  const nav = useNavigate();
  const { user } = AuthConsumer();
  const [cart, setCart] = useState<CartItem[]>([]);
  const { getUserCart } = CartConsumer();

  useEffect(() => {
    getUserCart()
      .then((userCart) => {
        setCart([...userCart]);

        console.log(userCart);
      })
      .catch(() => {
        setCart([]);
      });
  }, [getUserCart]);

  return (
    <Offcanvas show={true} onHide={toggleShowCart} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fs-2">Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cart.length === 0 ? (
          <>
            <p className="fs-5">Your cart is currently empty &#128557;</p>
            {!user && <p className="fs-5">Login to add items!</p>}
          </>
        ) : (
          <CartItems userCart={cart} />
        )}
      </Offcanvas.Body>

      {cart.length != 0 && (
        <div className="p-3">
          <Button
            variant=""
            className="text-danger fs-6 mx-0 p-0 pb-2 w-100"
            onClick={() => {
              // emptyUserCart();
            }}
          >
            <img
              width={35}
              height={35}
              src="../src/assets/emptyCart.svg"
              alt=""
            />
            Clear Cart
          </Button>
          <div className="d-flex justify-content-between pb-3">
            <h3 className="mb-0">Total</h3>
            <p className="fs-4 mb-0">${getCartTotal(cart)}</p>
          </div>

          <Button
            className="w-100"
            variant="success"
            onClick={() => {
              toggleShowCart();
              nav("/checkout");
            }}
          >
            Check out
          </Button>
        </div>
      )}
    </Offcanvas>
  );
}

export default Cart;
