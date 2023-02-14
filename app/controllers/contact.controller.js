const create = (req, res) => {
    res.send({ message: "create handler" });
};

const findAll = (req, res) => {
    res.send({ message: "findAll handler" });
};

const findOne = (req, res) => {
    res.send({ message: "findOne handler" });
};

const update = (req, res) => {
    res.send({ message: "update handler" });
};

const Delete = (req, res) => {
    res.send({ message: "delete handler" });
};

const deleteAll = (req, res) => {
    res.send({ message: "deleteAll handler" });
};

const findAllFavorite = (req, res) => {
    res.send({ message: "findAllFavorite handler" });
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