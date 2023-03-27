require('dotenv').config()
const express = require('express');
const carts = require("../controllers/cart.controller");
const router = express.Router();

router.route("/")
    .post(carts.create);

router.route("/:id")
    .get(carts.findOne)
    .put(carts.update)
    .delete(carts.Delete);

router.route("/deleteOneProduct/:id").post(carts.deleteProduct);
router.route("/findByUserId/:id").get(carts.findOneByUserId);

module.exports = router;