// db config
import { DataSource } from "typeorm";
import config from "./config.js";
import { Users } from "./models/users.js";

const AppDataSource = new DataSource({
  type: "mysql",
  host: config.HOST,
  port: config.PORT,
  username: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  entities: [Users],
  logging: true,
  synchronize: true,
});

export default AppDataSource;
