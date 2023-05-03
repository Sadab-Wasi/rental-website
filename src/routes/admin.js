// installed modules
const express = require("express");

// local modules
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/admin", adminController.getAllProducts);
router.get("/admin/create-product", adminController.getCreateProduct);
router.post("/admin/create-product", adminController.postCreateProduct);
router.get("/admin/update-product/:id", adminController.getUpdateProduct);
router.post("/admin/update-product/:id", adminController.postUpdateProduct);
router.post("/admin/delete-product/:id", adminController.postDeleteProduct);

module.exports = router;