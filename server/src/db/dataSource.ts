import { DataSource } from "typeorm";
import config from "./config.js";

const AppDataSource = new DataSource({
  type: "mysql",
  host: config.HOST,
  port: config.PORT,
  username: config.USER,
  password: config.PASSWORD,
  database: config.DB,
});
