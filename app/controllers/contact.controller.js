const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


const create = async (req, res, next) => {
    if (!res.body?.name) {
        return next(new ApiError(400, "name cannot be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
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
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400,"Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoBD.client);
        const document = await comtactService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message:"Contact was updated successfully"});
    }catch(err){
        return next(
            new ApiError(500,`Error updating contact with id=${req.params,is}`)
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
module.exports = {
    create,
    findAll,
    findOne,
    update,
    deleteAll,
    Delete,
    findAllFavorite
}