// installed modules
const express = require("express");

// local modules
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getLatestProducts);
router.get("/shop", shopController.getAllProducts);
router.get('/shop/product-info/:id', shopController.getProduct);
router.post("/shop/add-cart/:id", shopController.postAddProductToCart);
router.post("/shop/delete-cart/:id", shopController.postDeleteProductToCart);
router.get("/cart", shopController.getCart);
router.get("/order", shopController.getOrder);
router.post("/order/save", shopController.postOrderSave);


module.exports = router;
