const AppError = require("./../utils/appError");

const handleCastErrorDB = (error) => {
    const message = `Invalid ${error.path} : ${error.value}`;

    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value is ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
    const errors = Object.values(error.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(", ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () => {
    return new AppError(
        "Invalid Token. Please login again to get new token",
        401,
    );
};

const handleTokenExpiredError = () => {
    return new AppError(
        "Your token is Expired, Please login again to generate new token",
        401,
    );
};

const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
        error: error,
    });
};

const sendErrorProd = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        console.error("💥ERROR : ", error);

        res.status(500).json({
            status: "error",
            message: "something went wrong",
        });
    }
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, res);
    } else if (process.env.NODE_ENV === "production") {
        // let newError = { ...error };
        let newError = Object.create(error);

        if (newError.name === "CastError") {
            newError = handleCastErrorDB(newError);
        }

        if (newError.code === 11000) {
            newError = handleDuplicateFieldsDB(newError);
        }

        if (newError.name === "ValidationError") {
            newError = handleValidationErrorDB(newError);
        }

        if (newError.name === "JsonWebTokenError") {
            newError = handleJWTError();
        }

        if (newError.name === "TokenExpiredError") {
            newError = handleTokenExpiredError();
        }

        //
        sendErrorProd(newError, res);
    }
};
