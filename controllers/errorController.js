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

    if (process.env.NODE_DEV === "development") {
        sendErrorDev(error, res);
    } else if (process.env.NODE_DEV === "production") {
        sendErrorProd(error, res);
    }
};
