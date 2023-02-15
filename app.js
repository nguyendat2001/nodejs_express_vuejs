const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//     res.json({ message: "Wellcome to contract book appliation." });
// });

const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "resource not found"));
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;