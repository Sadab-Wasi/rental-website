// built-in modules
const path = require("path");

// installed modules
require("dotenv").config({ path: "../.env" });
const Sequelize = require("sequelize");

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  // logging: console.log,
  //   logging: (...msg) => console.log(msg),
    logging: false,
});

module.exports = sequelize;
