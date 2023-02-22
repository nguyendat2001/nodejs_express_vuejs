require('dotenv').config()
const express = require('express');
const contracts = require("../controllers/contact.controller");
const router = express.Router();
const jwt = require('jsonwebtoken')
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

router.route("/")
    .get(contracts.findAll)
    .post(contracts.create)
    .delete(contracts.deleteAll);

router.route("/favorite")
    .get(contracts.findAllFavorite);

router.route("/:id")
    .get(contracts.findOne)
    .put(contracts.update)
    .delete(contracts.Delete);

router.route("/verify/mail/:id").get(contracts.verify);

module.exports = router;