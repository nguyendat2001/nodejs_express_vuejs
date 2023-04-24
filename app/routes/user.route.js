require('dotenv').config()
const express = require('express');
const users = require("../controllers/user.controller");
const router = express.Router();
const auths = require("../auth/auth");

router.route("/")
    .get(auths.verifyToken, auths.verifyAdmin,users.findAll)
    .post(users.create)
    .delete(auths.verifyToken, auths.verifyAdmin, users.deleteAll);

router.route("/findallmailverify")
    .get(auths.verifyToken,auths.verifyAdmin,users.findAllMailVerified);

router.route("/login")
    .post(auths.login);

router.route("/logout/:id")
    .get(auths.logout);

router.route("/:id")
    .get(auths.verifyToken,users.findOne)
    .put(auths.verifyToken,users.update)
    .delete(auths.verifyToken,users.Delete);

router.route("/refreshToken")
    .post(auths.refreshToken);

router.route("/verify/mail/:id").get(users.verify);
router.route("/lockUser/:id").get(users.lockAcc);
router.route("/unLockUser/:id").get(users.unLockAcc);

module.exports = router;