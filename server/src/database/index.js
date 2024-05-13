const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
const storeData = require("../../../client/src/data/store.json");
const fs = require('fs');
const path = require('path');

const db = {
  Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.product = require("./models/product.js")(db.sequelize, DataTypes);

// Relate post and user.
//db.post.belongsTo(db.user, { foreignKey: { name: "username", allowNull: false } });

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });

  await seedData();
};

async function seedData() {

  const countProducts = await db.product.count();

  // Only seed data if necessary.
  if (countProducts > 0)
    return;

  storeData.products.forEach(async (product) => {
    console.log(product);

    // Read the image file and convert it to base64
    let imagePath = path.join("/home/russell/rmit/full_stack_dev/project/s4018548-s4007180-a2/client/"+product.image);
    let imageAsBase64 = fs.readFileSync(imagePath, { encoding: 'binary' });

    await db.product.create({
      name: product.name,
      price: product.price,
      description: product.description,
      image: imageAsBase64,
      onSpecial: product.onSpecial,
      size: product.size,
      unit: product.unit
    });
  });

}

module.exports = db;
