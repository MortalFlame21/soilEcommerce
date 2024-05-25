import { Button, Image, Form } from "react-bootstrap";

import { CartItem } from "../utils/cart";

function CartItems({ userCart }: { userCart: CartItem[] }) {
  return userCart.map((cartItem) => {
    return (
      <div
        key={cartItem.Product.id}
        className="d-flex gap-3 mb-3 border rounded-4 p-3 mx-auto"
        style={{ minWidth: 340, maxWidth: 540 }}
      >
        <Image
          src={"/" + cartItem.Product.image}
          className="rounded-4"
          alt={cartItem.Product?.name}
          style={{ width: 150, height: 150, objectFit: "cover" }}
          fluid
        />

        <div className="flex-grow-1 flex-fill">
          <h4>
            {cartItem.Product?.name}{" "}
            <span className="fs-6">({cartItem.quantity})</span>
          </h4>
          <p>
            {cartItem.Product?.size} {cartItem.Product?.unit} -{"  "}
            <span>${cartItem.Product?.price}</span>
          </p>
          <div className="d-flex">
            <Form.Control
              name="number"
              type="number"
              min="1"
              max="50"
              value={cartItem.quantity}
              className="text-center"
              onChange={() => {
                // updateItem(cartItem.item, Number(e.target.value));
              }}
            />

            <Button
              variant="link"
              className="text-danger"
              onClick={() => {
                // updateItem(cartItem.item, 0);
              }}
            >
              Remove
            </Button>
          </div>
          <p>
            <b>Total:</b> $
            {(cartItem.Product?.price * cartItem.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    );
  });
}

export default CartItems;
