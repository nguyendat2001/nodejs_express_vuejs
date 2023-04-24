const express = require("express");
const app = express();

app.use(express.static('public')); //to access the files in public folder
app.use(express.json());

// app.get('/', (req, res) => {
//     res.json({ message: "Wellcome to contract book appliation." });
// });

const userRouter = require("./app/routes/user.route");
const productRouter = require("./app/routes/product.route");
const cartRouter = require("./app/routes/cart.route");
const orderRouter = require("./app/routes/order.route");
const ApiError = require("./app/api-error");

app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts/", cartRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "resource not found"));
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;