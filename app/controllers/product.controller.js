require('dotenv').config()
const ProductService = require("../services/product.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const path = require("path");
var res = require("express/lib/response");


const create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const data = {
            'image':  req.file.filename,
            'description': req.body.description,
            'price': req.body.price,
            'quantity': req.body.quantity,
            'name': req.body.name,
            'manufacture': req.body.manufacture,
        }
        console.log(data)
        const document = await productService.create(data);
        res.send({ success: true});
//        console.log(document)
//        if(document){
//            console.log({ success: true, product: document })
//            res.send({ success: true, product: document });
//        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

const findAll = async (req, res, next) => {
    let document = []
    try {
        const productService = new ProductService(MongoDB.client);
        const {name} = req.query;
        if (name){
            documents = await productService.findByName(name);
        }else {
            documents = await productService.find({});
        }
    }catch(error){
        return next(
            new ApiError(500,"An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

const findByPlace = async (req, res, next) => {
    let document = []
    try {
        const productService = new ProductService(MongoDB.client);
        documents = await productService.find({"manufacture":req.params.manufacture, "available": true});
    }catch(error){
        return next(
            new ApiError(500,"An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

const findByBrand = async (req, res, next) => {
    let document = []
    try {
        const productService = new ProductService(MongoDB.client);
        documents = await productService.find({"brand":req.params.brand});
    }catch(error){
        return next(
            new ApiError(500,"An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

const findOne = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "product not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const data = {
                    'image': req.file.filename,
                    'description': req.body.description,
                    'price': req.body.price,
                    'quantity': req.body.quantity,
                    'name': req.body.name,
                    'manufacture': req.body.manufacture,
                }
        const document = await productService.update(req.params.id, data);
        if (!document) {
            return next(new ApiError(404, "product not found"));
        }

        return res.send({ message: "product was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

const Delete = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "product not found"));
        }

        return res.send({ message: "product was deleted succussfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.param.id}`
            )
        );
    }
};

// Delete all contacts of a user from the database
const deleteAll = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const deletedCount = await productService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all products")
        );
    }
};

// Find all favorite contacts of a user
const findAllAvailable = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const documents = await productService.findAllAvailable();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favoite products"
            )
        );
    }
};

const unavailable = async (req, res, next) => {
    try {
        console.log(req.params.id)
        const productService = new ProductService(MongoDB.client);
        console.log(req.params.id)
        const document = await productService.update(req.params.id, {"available": false,});
        console.log(document)
        console.log('unavailable sucessfull!!!')
        if (!document){
            return next(new ApiError(404, "product not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const available = async (req, res, next) => {
    try {
        console.log(req.params.id)
        const productService = new ProductService(MongoDB.client);
        console.log(req.params.id)
        const document = await productService.update(req.params.id, {"available": true,});
        console.log(document)
        console.log('unavailable sucessfull!!!')
        if (!document){
            return next(new ApiError(404, "product not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving contact with id=${req.params.id}`)
        );
    }
};

module.exports = {
    create,
    findAll,
    findOne,
    update,
    deleteAll,
    Delete,
    findAllAvailable,
    unavailable,
    available,
    findByPlace,
    findByBrand
}