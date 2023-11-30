const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

//SECTION :     coding start

const app = express();

//NOTE :        middleware

// console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//NOTE :    limit access to url
const limiter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this ip address, please try again 1 hour",
});

// after /api all path have controll
app.use("/api", limiter);

//!  for request json body
app.use(express.json());

//!     static files
app.use(express.static(`${__dirname}/public`));

//  simple middleware
// app.use((req, res, next) => {
//     console.log("Middleware 👋");

//     next();
// });

app.use((req, res, next) => {
    req.requestAt = new Date().toISOString();

    next();
});

//NOTE :    routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//SECTION :     routes handle which is not discribe
app.all("*", (req, res, next) => {
    next(new AppError(`This url '${req.originalUrl}' is not defined 💥`, 404));
});

app.use(globalErrorHandler);

//NOTE :    export app for server
module.exports = app;
