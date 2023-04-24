require('dotenv').config()
const express = require('express');
const carts = require("../controllers/cart.controller");
const auths = require("../auth/auth");
const router = express.Router();

router.route("/")
    .post(carts.create);

router.route("/:id")
    .get(carts.findOne)
    .put(carts.update)
    .delete(carts.Delete);

router.route("/deleteOneProduct/:id").post(carts.deleteProduct);
router.route("/deleteAllProduct/:id").get(carts.deleteAllProduct);
router.route("/findByUserId/:id").get(auths.verifyToken,auths.verifyUser,carts.findOneByUserId);

module.exports = router;