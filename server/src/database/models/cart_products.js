module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "cart_products",
    {
      // cart_id and product_id can be composite key
      cart_id: {
        // fk
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
