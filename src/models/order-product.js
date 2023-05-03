const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const OrderItem = sequelize.define(
  "order_product",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cost: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    // freezeTableName: true,
  }
);

module.exports = OrderItem;
