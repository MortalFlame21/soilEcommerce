import express from "express";
import AppDataSource from "../db/dataSource.js";
import { Product } from "../db/models/product.js";

const productsRouter = express.Router(); // /products/...

productsRouter.get("/", (req, res) => {
  res.send("hello /products");
});

productsRouter.post("/", async (req, res) => {
  try {
    const { product_id, name, price, description, image, onSale, size, unit } =
      req.body;

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values([
        {
          product_id: product_id,
          name: name,
          image: image,
          description: description,
          price: price,
          onSale: onSale,
          size: size,
          unit: unit,
        },
      ])
      .execute();

    res.send("product created");
  } catch {
    res.send("error");
  }
});

export default productsRouter;
