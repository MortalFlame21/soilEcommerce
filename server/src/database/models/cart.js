module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "cart",
    {
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // ???????
      },
      // fk
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
