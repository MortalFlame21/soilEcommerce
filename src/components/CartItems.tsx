import { Button, Image, Form } from "react-bootstrap";

import { CartConsumer } from "./CartContext";

function CartItems() {
  const { userCart, updateItem } = CartConsumer();
  return userCart.map((cartItem) => {
    return (
      <div
        key={cartItem.item.id}
        className="d-flex gap-3 mb-3 border rounded-4 p-3 mx-auto"
        style={{ minWidth: 340, maxWidth: 540 }}
      >
        <Image
          src={"/" + cartItem.item.image}
          className="rounded-4"
          alt={cartItem.item?.name}
          style={{ width: 150, height: 150, objectFit: "cover" }}
          fluid
        />

        <div className="flex-grow-1 flex-fill">
          <h4>
            {cartItem.item?.name}{" "}
            <span className="fs-6">({cartItem.quantity})</span>
          </h4>
          <p>
            {cartItem.item?.size} {cartItem.item?.unit} -{"  "}
            <span>${cartItem.item?.price}</span>
          </p>
          <div className="d-flex">
            <Form.Control
              name="number"
              type="number"
              min="1"
              max="50"
              value={cartItem.quantity}
              className="text-center"
              onChange={(e) => {
                updateItem(cartItem.item, Number(e.target.value));
              }}
            />

            <Button
              variant="link"
              className="text-danger"
              onClick={() => {
                updateItem(cartItem.item, 0);
              }}
            >
              Remove
            </Button>
          </div>
          <p>
            <b>Total:</b> $
            {(cartItem.item?.price * cartItem.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    );
  });
}

export default CartItems;
