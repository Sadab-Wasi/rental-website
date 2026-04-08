// built-in modules
const path = require("path");

// installed modules
require("dotenv").config({ path: "./src/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// local modules
const sequelize = require("./util/database");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const init_products = require("./data/initial_db_product.json");
const init_users = require("./data/initial_db_user.json");

// const User = require("./models/user");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartProduct = require("./models/cart-product");
const Order = require("./models/order");
const OrderProduct = require("./models/order-product");

const Host = process.env.HOST;
const Port = process.env.PORT;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --> log access events
app.use(
  morgan(":method :url :status - :response-time ms", {
    skip: function (req, res) {
      const url = req.url.split("/")[1];
      const skip_url = ["css", "img", "js", "webfonts"];

      if (skip_url.indexOf(url) != -1) {
        return res;
      }
    },
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// // Connect to user ID 1
// app.use(async (req, res, next) => {
//   let user_data;
//   try {
//     user_data = await User.findByPk(1);
//   } catch (error) {
//     console.log("--------------------------------");
//     console.log(error.toString());
//     console.log("--------------------------------");

//     user_data = false;
//   }
//   if (user_data == null || !user_data) {
//     return console.log("Current user not available");
//   }

//   // Store user data
//   req.user = user_data;

//   // console.log(req.user);
//   // const cart_data = await req.user.getCart();
//   // console.log(cart_data);

//   next();
// });

app.use(shopRoutes);
app.use(adminRoutes);

// -- DB relations
// User.hasOne(Cart);
// Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartProduct });
Cart.belongsToMany(Product, { through: CartProduct });
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

// 1. Move logic to an async function
const initDb = async () => {
  const reset_db = process.env.DB_RESET?.toLowerCase() === "true";

  try {
    await sequelize.sync({ force: reset_db });
    if (reset_db) {
      await Product.bulkCreate(init_products, { validate: true });
      console.log("DB Reset and Seeded");
    }
  } catch (err) {
    console.error("DB Sync Error:", err);
  }
};

// 2. Trigger the sync (it runs in the background)
initDb();

// 3. Export IMMEDIATELY at the top level
module.exports = app;
