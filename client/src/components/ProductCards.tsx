import { Link } from "react-router-dom";
import productsData from "../data/store.json";
import { Button, Card, Col } from "react-bootstrap";
import { CartConsumer } from "./CartContext";
import { toast } from "react-toastify";

function ProductCards() {
  const numberOfProducts = productsData.products.length;
  const products = [];

  const { updateItem, getProductInCart } = CartConsumer();

  for (let i = 0; i < numberOfProducts; i++) {
    const productInCart = getProductInCart(productsData.products[i]);
    products.push(
      <Col
        key={i}
        xxl={3}
        xl={6}
        lg={6}
        md={6}
        sm={6}
        xs={6}
        style={{ marginBottom: "2rem" }}
        className="align-content-center"
      >
        <Card
          className="mx-auto align-content-center"
          style={{ minHeight: 350, maxHeight: 350, maxWidth: 280 }}
        >
          <Card.Body className="">
            <Link
              to={"/product/" + productsData.products[i].id}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{ maxHeight: 180, minHeight: 100, overflow: "hidden" }}
              >
                {productsData.products[i].onSpecial ? (
                  <div
                    className=""
                    style={{
                      position: "absolute",
                      top: "20px",
                      zIndex: "3",
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <img src="src/assets/specials/special2.svg" />
                  </div>
                ) : null}
                <div
                  style={{
                    maxHeight: "160px",
                  }}
                  className="rounded-2 overflow-hidden"
                >
                  <img
                    src={productsData.products[i].image}
                    className="mx-auto d-block rounded-2"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>

              <p className="pt-4">
                <b>
                  {productsData.products[i].name} |{" "}
                  {productsData.products[i].size}{" "}
                  {productsData.products[i].unit}
                </b>
              </p>
              <p>
                <b>${productsData.products[i].price}</b>
              </p>
            </Link>

            <Button
              variant="success"
              className="rounded-2 position-absolute d-flex justify-content-center"
              style={{
                bottom: 30,
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: "70%",
              }}
              onClick={() => {
                if (
                  updateItem(
                    productsData.products[i],
                    (productInCart?.quantity ?? 0) + 1
                  )
                )
                  toast.success(
                    `Added ${productsData.products[
                      i
                    ].name.toLowerCase()} to cart`
                  );
                else toast.warning("Login to add items to cart.");
              }}
            >
              Add to cart
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  return products;
}
export default ProductCards;
