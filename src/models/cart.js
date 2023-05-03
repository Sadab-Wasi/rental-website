const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cart = sequelize.define(
  "cart",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    // freezeTableName: true,
  }
);

module.exports = Cart;
