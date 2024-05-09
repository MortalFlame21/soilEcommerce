// db config
import { DataSource } from "typeorm";
import config from "./config.js";
import { Users } from "./models/users.js";

import dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DB,
  entities: [Users],
  logging: true,
  synchronize: true,
});

export default AppDataSource;
