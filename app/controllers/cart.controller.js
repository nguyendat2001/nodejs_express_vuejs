require('dotenv').config()
const CartService = require("../services/cart.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const path = require("path");
var res = require("express/lib/response");


const create = async (req, res, next) => {
    if (!req.body?.account_id) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const cartService = new CartService(MongoDB.client);
//        const data = {
//                "account_id": req.body.account_id,
//                "product_list":[
//                    {
//                        "product_id": req.body.product_list[0].product_id,
//                        "number": req.body.product_list[0].number
//                    }
//                ],
//                "total_cost": req.body.product_list[0].number * req.body.price
//            }
        console.log(req.body)
        const document = await cartService.create(req.body);
        console.log(document)
        if(document){
//            console.log({ success: true, cart: document })
            res.send({ success: true, cart: document });
        }
        res.send(document)
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "object not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving object id=${req.params.id}`)
        );
    }
};

const findOneByUserId = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findByUserId(req.params.id);
        if (!document){
            return next(new ApiError(404, "object not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving object id=${req.params.id}`)
        );
    }
};

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }

    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "not found"));
        }

        return res.send({ message: "updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

const Delete = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "product not found"));
        }
        return res.send({ message: "cart was deleted succussfully" });
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
const deleteProduct = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        console.log(req.params.id)
        const data = await cartService.findById(req.params.id);
        console.log(data)

        const document = await cartService.deleteProduct(req.params.id, req.body.product_id);
        return res.send(document);

    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing products")
        );
    }
};

module.exports = {
    create,
    findOne,
    update,
    Delete,
    deleteProduct,
    findOneByUserId
}