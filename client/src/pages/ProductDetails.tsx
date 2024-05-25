import {
  Container,
  Row,
  Col,
  Image,
  Form,
  InputGroup,
  Spinner,
  Button,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { findProductByID, ProductType } from "../service/product";
import {
  createOrFindCart,
  addItemToCart,
  checkProductInCart,
  deleteItemFromCart,
  updateItemQuantityInCart,
} from "../service/cart";

function ProductDetails() {
  const productID = Number(useParams().id);

  const [cartId, setCartId] = useState<number | null>(null);
  const [productInCartData, setProductInCart] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // useEffect for cartId
  useEffect(() => {
    createOrFindCart().then((value) => {
      if (value !== null) {
        setCartId(value);
      } else {
        console.error("Failed to create or find cart");
      }
    });
  }, []);

  // useEffect for productInCart
  useEffect(() => {
    if (cartId !== null) {
      checkProductInCart(cartId, productID).then((value) => {
        if (value !== null) {
          setProductInCart(value);
          console.log(value);
        }
      });
    }
  }, [cartId, productID, quantity]);

  //useEffect for quantity
  useEffect(() => {
    if (cartId !== null) {
      checkProductInCart(cartId, productID).then((value) => {
        if (value !== null) {
          setQuantity(value.quantity);
          console.log(value);
        }
      });
    }
  }, [cartId, productID]);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect for getting product by ID
  useEffect(() => {
    setIsLoading(true);
    findProductByID(productID).then((res) => {
      setProduct(res);
      setIsLoading(false);
    });
  }, [productID]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!product) return <Navigate to="/404" replace />;
  document.title = "SOIL | Product";

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
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                    if (cartId !== null && productInCartData !== null) {
                      updateItemQuantityInCart(
                        cartId,
                        product.id,
                        Number(quantity - 1)
                      );
                    }
                  }
                }}
              >
                -
              </InputGroup.Text>
              <Form.Control
                name="number"
                value={quantity}
                className="text-center"
                onChange={(e) => {
                  console.log(e.target.value);
                  if (e.target.value === "") {
                    setQuantity(Number("")); // set the value as it is
                  } else if (!isNaN(Number(e.target.value))) {
                    if (Number(e.target.value) < 1) {
                      setQuantity(1);
                    } else {
                      setQuantity(Number(e.target.value));
                      //setQuantity(Number(e.target.value));
                      if (cartId !== null && productInCartData !== null) {
                        updateItemQuantityInCart(
                          cartId,
                          product.id,
                          Number(e.target.value)
                        );
                      }
                    }
                  }
                }}
              />
              <InputGroup.Text
                onClick={() => {
                  setQuantity(quantity + 1);
                  if (cartId !== null && productInCartData !== null) {
                    updateItemQuantityInCart(
                      cartId,
                      product.id,
                      Number(quantity + 1)
                    );
                  }
                }}
              >
                +
              </InputGroup.Text>
            </InputGroup>

            {productInCartData === null && (
              <Button
                variant="success"
                onClick={() => {
                  if (cartId !== null) {
                    addItemToCart(cartId, product.id, quantity)
                      .then((value) => {
                        console.log(value);
                        setProductInCart(value);
                        toast.success("Item added to cart");
                      })
                      .catch((error) => {
                        console.error(error);
                        toast.error("Failed to add item to cart");
                      });
                  }
                }}
              >
                Add to cart
              </Button>
            )}

            {productInCartData !== null && (
              <Button
                variant="danger"
                onClick={() => {
                  if (cartId !== null) {
                    deleteItemFromCart(cartId, product.id)
                      .then((value) => {
                        console.log(value);
                        setProductInCart(null);
                        toast.success("Item removed from cart");
                      })
                      .catch((error) => {
                        console.error(error);
                        toast.error("Failed to remove item from cart");
                      });
                  }
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
