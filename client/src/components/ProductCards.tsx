import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import productsData from "../data/store.json";
import { Button, Card, Col } from "react-bootstrap";
import { CartConsumer } from "./CartContext";
import { toast } from "react-toastify";

import { allProducts, ProductType, productImageByID } from "../service/product";

function ProductCards() {
  const { updateItem, getProductInCart } = CartConsumer();
  const [data, setData] = useState<ProductType[] | null>(null);

  useEffect(() => {
    allProducts().then(async (products) => {
      const productsWithImages = await Promise.all(
        products.map(async (product: ProductType, index: number) => {
          const base64image = await productImageByID(index + 1);
          return { ...product, image: base64image };
        })
      );
      setData(productsWithImages);
    });
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  const numberOfProducts = data.length;
  const products = [];

  for (let i = 0; i < numberOfProducts; i++) {
    const productInCart = getProductInCart(data[i]);

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
              to={"/product/" + data[i].product_id}
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
                    src={`data:image/jpg;base64,${data[i].image}`}
                    className="mx-auto d-block rounded-2"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>

              <p className="pt-4">
                <b>
                  {data[i].name} | {data[i].size} {data[i].unit}
                </b>
              </p>
              <p>
                <b>${data[i].price}</b>
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
                if (updateItem(data[i], (productInCart?.quantity ?? 0) + 1))
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
