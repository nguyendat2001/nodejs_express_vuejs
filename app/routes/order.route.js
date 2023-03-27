require('dotenv').config()
const express = require('express');
const orders = require("../controllers/order.controller");
const router = express.Router();

router.route("/")
    .get(orders.findAll)
    .post(orders.create);

router.route("/:id")
    .get(orders.findOne)
    .put(orders.update)
    .delete(orders.Delete);

router.route("/approve/:id").get(orders.ApproveId);
module.exports = router;