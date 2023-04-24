require('dotenv').config()
const express = require('express');
const products = require("../controllers/product.controller");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const auths = require("../auth/auth");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));


const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join('./public/images'));
        console.log("file saved in "+path.join('./public/images'));
    },
    filename:function(req, file, cb){
        var name = Date.now()+path.extname(file.originalname);
        console.log(file)
        cb(null,name);
    }
});
const upload = multer({storage:storage});


router.route("/")
    .get(auths.verifyToken,auths.verifyAdmin,products.findAll)
    .post(auths.verifyToken,auths.verifyAdmin,upload.single('file'),products.create)
    .delete(auths.verifyToken,auths.verifyAdmin,products.deleteAll);

router.route("/findallavailable")
    .get(products.findAllAvailable);

router.route("/findByPlace/:manufacture")
    .get(products.findByPlace);

router.route("/findByBrand/:brand")
    .get(products.findByBrand);

router.route("/:id")
    .get(products.findOne)
    .put(auths.verifyToken,auths.verifyAdmin,upload.single('file'),products.update)
    .delete(auths.verifyToken,auths.verifyAdmin,products.Delete);

router.route("/unavailable/:id").get(auths.verifyToken,auths.verifyAdmin,products.unavailable);
router.route("/available/:id").get(auths.verifyToken,auths.verifyAdmin,products.available);

module.exports = router;