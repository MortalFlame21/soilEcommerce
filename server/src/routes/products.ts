import express from "express";
import AppDataSource from "../db/dataSource.js";
import { Product } from "../db/models/product.js";

const productsRouter = express.Router(); // /products/...

productsRouter.get("/", (req, res) => {
  res.send("hello /products");
});

//create a product in the database
productsRouter.post("/", async (req, res) => {
  try {
    const { product_id, name, image, description, price, onSpecial, size, unit } =
      req.body;

    const newProduct = AppDataSource.manager.getRepository(Product).create({
      product_id: product_id,
      name: name,
      image: image,
      description: description,
      price: price,
      onSpecial: onSpecial,
      size: size,
      unit: unit,
    });

    await AppDataSource.manager.getRepository(Product).save(newProduct);

    res.send(newProduct);
  } catch (error) {
    res.send(error);
  }
});

export default productsRouter;
