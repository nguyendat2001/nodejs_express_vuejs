const express = require('express');
const contracts = require("../controllers/contact.controller");
const router = express.Router();

router.route("/")
    .get(contracts.findAll)
    .post(contracts.create)
    .delete(contracts.Delete);

router.route("/favorite")
    .get(contracts.findAllFavorite);

router.route("/:id")
    .get(contracts.findOne)
    .put(contracts.update)
    .delete(contracts.Delete);

module.exports = router;