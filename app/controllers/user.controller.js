require('dotenv').config()
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const sendMail = require("./send_mail")
const bcrypt = require("bcrypt");

const securePassword = async(password)=>{
    try{
        var hashPassword = await bcrypt.hash(password,10);
        return hashPassword;
    }catch(error){
        console.log(error.message);
    }
};

const create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.create(req.body);
        const hashPassword = await securePassword(req.body.password);
        const document_update  = await userservice.update(document._id,{"password": hashPassword})

        if(!document_update.mail_verify){
//            const mailToken = jwt.sign(mailData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
            const mailInfo = await sendMail(req.body.email, `${process.env.HOST}/verify/mail/${document._id}`);
            console.log({ success: true, message: "Account created. Please Verify your E-Mail Address and Phone Number" })
            res.send({ success: true, message: "Account created. Please Verify your E-Mail Address and Phone Number" });
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the users")
        );
    }
};

const findAll = async (req, res, next) => {
    let document = []
    try {
        const userservice = new UserService(MongoDB.client);
        const {name} = req.query;
        if (name){
            documents = await userservice.findByName(name);
        }else {
            documents = await userservice.find({});
        }
    }catch(error){
        return next(
            new ApiError(500,"An error occurred while retrieving user services")
        );
    }
    return res.send(documents);
};

const findOne = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "user not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving user with id=${req.params.id}`)
        );
    }
};

const checklogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userservice = new UserService(MongoDB.client);
        const documents = await userservice.findByMail(email);
//        console.log(documents)
        if(!documents.mail_verify){
            return res.send({ message: "please verify email" });
        }
        if(documents){
            console.log(documents.password)
            const checkpass = await bcrypt.compare(password, documents.password);
            console.log(checkpass)
            if (checkpass) {
                return res.send(documents)
            } else {
                return res.send({ message: "Invalid credencial" , equal:false})
            }
        }

    }catch(error){
        return next(
            new ApiError(500,`Error retrieving user with email=${req.body.email}`)
        );
    }
};

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }

    try {
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "user not found"));
        }
        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating user with id=${req.params.id}`)
        );
    }
};

const Delete = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "user not found"));
        }

        return res.send({ message: "user was deleted succussfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete user with id=${req.param.id}`
            )
        );
    }
};

// Delete all contacts of a user from the database
const deleteAll = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        const deletedCount = await userservice.deleteAll();
        return res.send({
            message: `${deletedCount} users were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all users")
        );
    }
};

// Find all favorite contacts of a user
const findAllMailVerified = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        const documents = await userservice.findMailVerified();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favoite users"
            )
        );
    }
};

const verify = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        console.log('Start verify!!')
        console.log(req.params.id)
        const document = await userservice.update(req.params.id, {"mail_verify": true} );
        console.log(document)
        console.log('Verify sucessfull!!!')
        if (!document){
            return next(new ApiError(404, "user not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving user with id=${req.params.id}`)
        );
    }
};

const lockAcc = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        console.log(req.params.id)
        const document = await userservice.update(req.params.id, {"mail_verify": false} );
        if (!document){
            return next(new ApiError(404, "user not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving user with id=${req.params.id}`)
        );
    }
};

const unLockAcc = async (req, res, next) => {
    try {
        const userservice = new UserService(MongoDB.client);
        console.log(req.params.id)
        const document = await userservice.update(req.params.id, {"mail_verify": true} );
        if (!document){
            return next(new ApiError(404, "user not found"));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,`Error retrieving user with id=${req.params.id}`)
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
    findAllMailVerified,
    checklogin,
    lockAcc,
    unLockAcc
}