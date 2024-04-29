import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProduct } from "../utils/product";
import { CartConsumer } from "../components/CartContext";

function ProductDetails() {
  const product = getProduct(Number(useParams().id || "0") || 0); // if NaN then it defaults to 0

  const { updateItem, getProductInCart } = CartConsumer();
  const productInCart = getProductInCart(product);
  const [quantity, setQuantity] = useState(productInCart?.quantity || 1);
  const prevQuantity = useRef(quantity);

  useEffect(() => {
    setQuantity(() => productInCart?.quantity || 1);
  }, [productInCart]);

  if (!product) return <Navigate to="/404" replace />;
  document.title = "SOIL | Product";

  const changeQuantity = (q: number) => {
    prevQuantity.current = quantity;
    // refactor: make this better ;-;
    if (isNaN(q)) q = prevQuantity.current;
    else if (q <= 0) q = 1;
    else if (q >= 50) q = 50;
    setQuantity(q);
    if (productInCart) updateItem(product, q); // only update if in cart
  };

  const removeProductFromCart = () => {
    if (productInCart && updateItem(product, 0))
      toast.info(`Removed ${product.name.toLowerCase()} from cart`);
    setQuantity(1);
  };

  return (
    <Container fluid className="col-lg-8 mb-5">
      <Row className="pt-4">
        <Link to="/specials" className="pb-3">
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/ios-glyphs/30/long-arrow-left.png"
            alt="long-arrow-left"
            className="me-2"
          />
          Back to products
        </Link>

        <Col xs={12} md={6}>
          <div style={{ position: "relative" }}>
            {product.onSpecial && (
              <div
                className="mx-3 my-3"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  zIndex: "3",
                  width: "100px",
                  height: "100px",
                }}
              >
                <img src="/src/assets/specials/special2.svg" />
              </div>
            )}
            <Image
              src={`/${product.image}`}
              className="rounded-4"
              alt={product.name}
              fluid
            />
          </div>
        </Col>
        <Col>
          <h2 className="pt-4">${product.price}</h2>
          <h3 className="fw-bold">
            {product.name} | {product.size} {product.unit}
          </h3>

          {product.onSpecial && (
            <div className="pb-4">
              <span className="bg-warning rounded-3 py-1 px-3">
                On special!
              </span>
            </div>
          )}

          <div className="d-flex justify-content-start align-items-center gap-2">
            <InputGroup className="w-25">
              <InputGroup.Text
                onClick={() => {
                  changeQuantity(quantity - 1);
                }}
              >
                -
              </InputGroup.Text>
              <Form.Control
                name="number"
                value={quantity}
                className="text-center"
                onChange={(e) => {
                  changeQuantity(Number(e.target.value));
                }}
              />
              <InputGroup.Text
                onClick={() => {
                  changeQuantity(quantity + 1);
                }}
              >
                +
              </InputGroup.Text>
            </InputGroup>

            {/* TODO: REMOVE LATER */}
            {/* <p>{productInCart?.quantity}</p> */}

            {!productInCart && (
              <Button
                variant="success"
                onClick={() => {
                  if (updateItem(product, quantity))
                    toast.success(
                      `Added ${quantity} ${product.name.toLowerCase()} to cart!`
                    );
                  else toast.warning("Login to add product!");
                }}
              >
                Add to cart
              </Button>
            )}

            {productInCart && (
              <Button
                variant="danger"
                onClick={() => {
                  removeProductFromCart();
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Col>
        <div className="pt-4 mw500">
          <h4 className="">Product details</h4>
          <p>{product.description}</p>
        </div>
      </Col>
    </Container>
  );
}

export default ProductDetails;
