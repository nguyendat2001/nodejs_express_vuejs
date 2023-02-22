require('dotenv').config()
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const sendMail = require("./send_mail")
const jwt = require('jsonwebtoken')

const create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        if(!document.mail_verify){
//            const mailToken = jwt.sign(mailData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
            const mailInfo = await sendMail(req.body.email, `${process.env.HOST}/verify/mail/${document._id}`);
            console.log({ success: true, message: "Account created. Please Verify your E-Mail Address and Phone Number" })
            res.send({ success: true, message: "Account created. Please Verify your E-Mail Address and Phone Number" });
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

const findAll = async (req, res, next) => {
    let document = []
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if (name){
            documents = await contactService.findByName(name);
        }else {
            documents = await contactService.find({});
        }
    }catch(error){
        return next(
            new ApiError(500,"An error occurred while retrieving contacts")
        );
    }
    return res.send(documents);
};

const findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "contact not found"));
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
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

const Delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        return res.send({ message: "Contact was deleted succussfully" });
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
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

// Find all favorite contacts of a user
const findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favoite contacts"
            )
        );
    }
};

const verify = async (req, res, next) => {

    try {
        const contactService = new ContactService(MongoDB.client);
        console.log('Start verify!!')
        console.log(req.params.id)
//        const data = await contactService.findById(req.params.id);
//        console.log(data._id)
        const document = await contactService.update(req.params.id, {"mail_verify": true} );
        console.log(document)
        console.log('Verify sucessfull!!!')
        if (!document){
            return next(new ApiError(404, "contact not found"));
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
    verify,
    findAllFavorite
}