const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

//SECTION :     coding start

const app = express();

//NOTE :        middleware

// console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//  for request json body
app.use(express.json());

//  simple middleware
// app.use((req, res, next) => {
//     console.log("Middleware 👋");

//     next();
// });

app.use((req, res, next) => {
    req.requestAt = new Date().toLocaleString();

    next();
});

//!     static files
app.use(express.static(`${__dirname}/public`));

//NOTE :    routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//SECTION :     routes handle which is not discribe
app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "Fail",
        message: `${req.originalUrl} is not defined 💥`,
    });
});

//NOTE :    export app for server
module.exports = app;
