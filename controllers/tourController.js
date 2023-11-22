const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

//SECTION :     middleware
exports.aliasTopTours = (req, res, next) => {
    req.query.sort = "price,-ratingsAverage";
    req.query.limit = "5";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";

    next();
};

exports.top5ByRatingsAverage = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = "-ratingsAverage";
    req.query.fields = "name,price,duration,ratingsAverage";

    next();
};

//SECTION :     get all tours
exports.getAllTours = async (req, res) => {
    try {
        //NOTE :    result query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const tours = await features.query;

        //NOTE     send response to user
        res.status(200).json({
            status: "success",
            length: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

//SECTION :     get single tour by tour id
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: "Success",
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            // message: "Fail to fetch tour data",
            message: error,
        });
    }
};

//SECTION :     create new tour
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "Success",
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            // message: "Invalid Data Sent 💥",
            message: error,
        });
    }
};

//SECTION :     update tour
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "Success",
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            // message: "Fail to update, please check id",
            message: error,
        });
    }
};

//SECTION :     delete tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            message: null,
        });
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            // message: "Fail to delete document, please check id",
            message: error,
        });
    }
};
