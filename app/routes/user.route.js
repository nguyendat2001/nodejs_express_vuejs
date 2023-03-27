require('dotenv').config()
const express = require('express');
const users = require("../controllers/user.controller");
const router = express.Router();

router.route("/")
    .get(users.findAll)
    .post(users.create)
    .delete(users.deleteAll);

router.route("/findallmailverify")
    .get(users.findAllMailVerified);

router.route("/login")
    .post(users.checklogin);

router.route("/:id")
    .get(users.findOne)
    .put(users.update)
    .delete(users.Delete);

router.route("/verify/mail/:id").get(users.verify);
router.route("/lockUser/:id").get(users.lockAcc);
router.route("/unLockUser/:id").get(users.lockAcc);

module.exports = router;