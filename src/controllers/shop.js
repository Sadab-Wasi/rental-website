const querystring = require("querystring");

const sequelize = require("../util/database");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getLatestProducts = async (req, res, next) => {
  let product_data;
  try {
    product_data = await Product.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      raw: true,
    });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    product_data = false;
  }

  const has_product = product_data.length != 0 ? product_data : false;
  const products = !has_product ? [] : product_data;

  res.render("shop/home", {
    products: products,
    pageTitle: "Home",
    path: "/",
  });
};

exports.getAllProducts = async (req, res, next) => {
  let product_data;
  try {
    product_data = await Product.findAll({
      order: [["title", "ASC"]],
      raw: true,
    });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    product_data = false;
  }

  const has_product = product_data.length != 0 ? product_data : false;
  const products = !has_product ? [] : product_data;

  res.render("shop/shop", {
    products: products,
    pageTitle: "Shop",
    path: "/shop",
  });
};

exports.getProduct = async (req, res, next) => {
  const product_id = req.params.id;

  let product_data;
  try {
    product_data = await Product.findByPk(product_id, { plain: true });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    product_data = false;
  }
  if (product_data == null || !product_data) {
    const query_notify = querystring.stringify({
      notify_topic: "Find Product",
      notify_msg: "Failed to find data in DB",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  const product = product_data;
  res.render("shop/product-info", {
    product: product,
    pageTitle: "product",
    path: "/shop/product-info",
  });
};

exports.postAddProductToCart = async (req, res, next) => {
  const product_id = req.params.id;

  // Product
  let product_data;
  try {
    product_data = await Product.findByPk(product_id);
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    product_data = false;
  }
  // No product available
  if (product_data == null || !product_data) {
    const query_notify = querystring.stringify({
      notify_topic: "Add cart",
      notify_msg: "Failed to find product",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  // Cart
  let cart_data;
  try {
    cart_data = await Cart.findAll({ limit: 1 });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Add cart",
      notify_msg: "Failed to find cart",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  // access cart for first time
  const is_first_cart = cart_data.length == 0;
  if (is_first_cart) {
    // create cart in DB
    try {
      cart_data = await Cart.create();
    } catch (error) {
      console.log("--------------------------------");
      console.log(error.toString());
      console.log("--------------------------------");

      const query_notify = querystring.stringify({
        notify_topic: "Add cart",
        notify_msg: "Failed to create cart",
        notify_status: "danger",
      });

      return res.redirect("/shop/?" + query_notify);
    }
  } else {
    cart_data = cart_data[0];
  }

  // product in cart
  let cart_products;
  try {
    cart_products = await cart_data.getProducts({ where: { id: product_id } });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Add cart",
      notify_msg: "Failed to find products in cart",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }
  const cart_product = cart_products[0];

  // Product quantity in cart
  const has_cart_product = !(cart_product == null) && !!cart_product;
  const old_quantity = has_cart_product ? cart_product.cart_product.quantity : 0;

  // increase quantity by 1
  const new_quantity = parseInt(old_quantity) + 1;

  // update cart in DB
  try {
    await cart_data.addProduct(product_data, { through: { quantity: new_quantity } });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Add cart",
      notify_msg: "Failed to add product in cart",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  const query_notify = querystring.stringify({
    notify_topic: "Add cart",
    notify_msg: "Successfully added product in cart",
    notify_status: "success",
  });

  return res.redirect("/shop/?" + query_notify);
};

exports.postDeleteProductToCart = async (req, res, next) => {
  const product_id = req.params.id;

  // Product
  let product_data;
  try {
    product_data = await Product.findByPk(product_id);
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    product_data = false;
  }
  // No product available
  if (product_data == null || !product_data) {
    const query_notify = querystring.stringify({
      notify_topic: "Delete product in cart",
      notify_msg: "Failed to find product",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  // Cart
  let cart_data;
  try {
    cart_data = await Cart.findAll({ limit: 1, order: [["id", "DESC"]] });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Delete product in cart",
      notify_msg: "Failed to find cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }
  cart_data = cart_data[0];

  const has_cart = !(cart_data == null) && !!cart_data;
  if (!has_cart) {
    const query_notify = querystring.stringify({
      notify_topic: "Delete product in cart",
      notify_msg: "Failed to find cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  // product in cart
  let cart_products;
  try {
    cart_products = await cart_data.getProducts({ where: { id: product_id } });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Delete product in cart",
      notify_msg: "Failed to find product in cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }
  const cart_product = cart_products[0];

  const has_cart_product = !(cart_product == null) && !!cart_product;
  if (!has_cart_product) {
    const query_notify = querystring.stringify({
      notify_topic: "Delete product in cart",
      notify_msg: "Failed to find product in empty cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  // delete product in cart on DB
  try {
    await cart_data.removeProduct(product_data);
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Delete product in cart",
      notify_msg: "Failed to delete product in cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  const query_notify = querystring.stringify({
    notify_topic: "Delete product in cart",
    notify_msg: "Successfully deleted product in cart",
    notify_status: "success",
  });

  return res.redirect("/cart/?" + query_notify);
};

exports.getCart = async (req, res, next) => {
  let cart_data;
  try {
    cart_data = await Cart.findAll({ limit: 1, order: [["id", "DESC"]] });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Find cart",
      notify_msg: "Failed to find cart",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }
  cart_data = cart_data[0];

  const has_cart = !(cart_data == null) && !!cart_data;
  if (!has_cart) {
    return res.render("shop/cart", {
      products: [],
      total_cost: 0,
      pageTitle: "Cart",
      path: "/cart",
    });
  }

  let cart_products;
  try {
    cart_products = await cart_data.getProducts({
      attributes: ["id", "title", "price", "imageUrl", "description", [sequelize.literal("(price*quantity)"), "cost"]],
      joinTableAttributes: ["quantity"],
      through: {
        order: [["updated_at", "DESC"]],
      },
      raw: true,
    });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Find cart",
      notify_msg: "Failed to find products in cart",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  const total = cart_products.reduce((total, value) => total + value.cost, 0);

  const products = cart_products;
  res.render("shop/cart", {
    products: products,
    total_cost: total,
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.getOrder = async (req, res, next) => {
  let order_data;
  try {
    order_data = await Order.findAll({ attributes: ["id", "created_at"], order: [["created_at", "DESC"]] });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Find Order",
      notify_msg: "Failed to find cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }
  const has_order = !(order_data == null) && !!order_data && order_data.length > 0;
  if (!has_order) {
    return res.render("shop/order", {
      products: [],
      pageTitle: "Order",
      path: "/order",
    });
  }

  let all_orders_products = [];
  for await (const single_order of order_data) {
    let order_products;
    try {
      order_products = await single_order.getProducts({
        attributes: ["id", "title"],
        joinTableAttributes: ["cost"],
        order: [["title", "ASC"]],
        raw: true,
      });
    } catch (error) {
      console.log("--------------------------------");
      console.log(error.toString());
      console.log("--------------------------------");

      const query_notify = querystring.stringify({
        notify_topic: "Find Order",
        notify_msg: "Failed to find products in order",
        notify_status: "danger",
      });

      return res.redirect("/cart/?" + query_notify);
    }
    all_orders_products.push(order_products);
  }

  const order_costs = all_orders_products.map((order) => {
    return order.reduce((total, value) => total + parseFloat(value["order_product.cost"]), 0);
  });
  return res.render("shop/order", {
    orders_dates: order_data,
    orders_products: all_orders_products,
    total_costs: order_costs,
    pageTitle: "Order",
    path: "/order",
  });
};

exports.postOrderSave = async (req, res, next) => {
  let cart_data;
  try {
    cart_data = await Cart.findAll({ limit: 1, order: [["id", "DESC"]] });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Order confirm",
      notify_msg: "Failed to find cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }
  cart_data = cart_data[0];

  const has_cart = !(cart_data == null) && !!cart_data;
  if (!has_cart) {
    const query_notify = querystring.stringify({
      notify_topic: "Order confirm",
      notify_msg: "Failed to comfirm empty cart",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  let cart_products;
  try {
    cart_products = await cart_data.getProducts({
      attributes: ["id", "title", "price", "imageUrl", "description", [sequelize.literal("(price*quantity)"), "cost"]],
      joinTableAttributes: ["quantity"],
      through: {
        order: [["updated_at", "DESC"]],
      },
      // raw: true,
    });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Order confirm",
      notify_msg: "Failed to find products in cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  // create order in DB
  let order_data;
  try {
    order_data = await Order.create();
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Order confirm",
      notify_msg: "Failed to create order",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  // update order in DB
  try {
    for await (const product_data of cart_products) {
      await order_data.addProduct(product_data, { through: { cost: parseFloat(product_data.dataValues.cost).toFixed(2) } });
    }
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Order confirm",
      notify_msg: "Failed to add product in confirm order",
      notify_status: "danger",
    });

    return res.redirect("/shop/?" + query_notify);
  }

  // delete product in cart on DB
  try {
    await cart_data.removeProducts(cart_products);
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Order confirm",
      notify_msg: "Failed to empty product in cart",
      notify_status: "danger",
    });

    return res.redirect("/cart/?" + query_notify);
  }

  const query_notify = querystring.stringify({
    notify_topic: "Order confirm",
    notify_msg: "Successfully confirmed order from cart",
    notify_status: "success",
  });

  return res.redirect("/order/?" + query_notify);
};
