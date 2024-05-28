module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "review",
    {
      // fk
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      // fk
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "products",
          key: "id",
        },
      },
      description: {
        type: DataTypes.STRING(255),
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 1,
          max: 5,
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
