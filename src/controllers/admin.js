const querystring = require("querystring");

const Product = require("../models/product");

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

  return res.render("admin/products", {
    products: products,
    pageTitle: "Admin",
    path: "/admin",
  });
};

exports.getCreateProduct = (req, res, next) => {
  const product = {
    id: 0,
    title: "",
    imageUrl: "",
    price: "",
    description: "",
  };

  res.render("admin/edit-product", {
    product: product,
    pageTitle: "Create product",
    path: "/admin/create-product",
  });
};

exports.postCreateProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Create data in DB
  try {
    await Product.create({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Add Product",
      notify_msg: "Failed to create data in DB",
      notify_status: "danger",
    });
    return res.redirect("/admin/?" + query_notify);
  }

  const query_notify = querystring.stringify({
    notify_topic: "Add Product",
    notify_msg: "Successfully created data in DB",
    notify_status: "success",
  });
  return res.redirect("/admin/?" + query_notify);
};

exports.getUpdateProduct = async (req, res, next) => {
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

  const product = product_data;
  return res.render("admin/edit-product", {
    product: product,
    pageTitle: "Update product",
    path: "/admin/update-product",
  });
};

exports.postUpdateProduct = async (req, res, next) => {
  const product_id = req.params.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  let product_data;
  // Find data on DB
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
      notify_topic: "Update Product",
      notify_msg: "Failed to find data in DB",
      notify_status: "danger",
    });

    return res.redirect("/admin/update-product/" + product_id + "?" + query_notify);
  }

  // Update data in DB
  try {
    // save locally
    await product_data.update(
      {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      {
        where: { id: product_id },
        returning: true,
        plain: true,
      }
    );

    // save database
    await product_data.save();
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    product_data = false;
  }
  if (product_data == null || !product_data) {
    const query_notify = querystring.stringify({
      notify_topic: "Update Product",
      notify_msg: "Failed to update data in DB",
      notify_status: "danger",
    });

    return res.redirect("/admin/update-product/" + product_id + "?" + query_notify);
  }

  const query_notify = querystring.stringify({
    notify_topic: "Update Product",
    notify_msg: "Successfully updated in DB",
    notify_status: "success",
  });
  return res.redirect("/admin/?" + query_notify);
};

exports.postDeleteProduct = async (req, res, next) => {
  const product_id = req.params.id;

  // Delete data in DB
  try {
    await Product.destroy({ where: { id: product_id } });
  } catch (error) {
    console.log("--------------------------------");
    console.log(error.toString());
    console.log("--------------------------------");

    const query_notify = querystring.stringify({
      notify_topic: "Delete Product",
      notify_msg: "Failed to delete data in DB",
      notify_status: "danger",
    });
    return res.redirect("/admin/?" + query_notify);
  }

  const query_notify = querystring.stringify({
    notify_topic: "Delete Product",
    notify_msg: "Successfully deleted data in DB",
    notify_status: "success",
  });
  return res.redirect("/admin/?" + query_notify);
};
