// db config
import { DataSource } from "typeorm";
import { Users } from "./models/users.js";
import { Product } from "./models/product.js";

import dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DB,
  entities: [Users, Product],
  logging: true,
  synchronize: true,
});

export default AppDataSource;
