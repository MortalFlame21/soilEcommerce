const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
const storeData = require("../../../client/src/data/store.json");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = {
  Op: Sequelize.Op,
};

// init db
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

// models
db.users = require("./models/user.js")(db.sequelize, DataTypes);
db.product = require("./models/product.js")(db.sequelize, DataTypes);

// Relate post and user.
//db.post.belongsTo(db.user, { foreignKey: { name: "username", allowNull: false } });

db.sync = async () => {
  // Sync schema
  await db.sequelize.sync();

  await seedData();
  await seedUsers();
};

async function seedData() {
  const countProducts = await db.product.count();

  // Only seed data if necessary.
  if (countProducts > 0) return;

  storeData.products.forEach(async (product) => {
    console.log(product);

    await db.product.create({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      onSpecial: product.onSpecial,
      size: product.size,
      unit: product.unit,
    });
  });
}

async function seedUsers() {
  // ! NO VALIDATION IS SET HERE !
  const defaultUsers = [
    {
      username: "test@TEST.com",
      email: "test@TEST.com",
      hash: "test@TEST.com",
    },
    {
      username: "username",
      email: "email@email.com",
      hash: "hash",
    },
  ];

  // simple solution for existing users
  defaultUsers.forEach(async (user) => {
    try {
      user.hash = await bcrypt.hash(user.hash, 1); // 1 salt round
      await db.users.create(user);
    } catch (e) {
      console.log("User exists skip");
    }
  });
}

module.exports = db;
