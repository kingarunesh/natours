const Tour = require("../models/tourModel");

//SECTION :        route handler

//!     get all tours
exports.getAllTours = async (req, res) => {
    try {
        //&     get all tours
        // const tours = await Tour.find();

        //&     direct filtering
        // const tours = await Tour.find({ duration: 5, difficulty: "easy" });

        // const tours = await Tour.find()
        //     .where("duration")
        //     .equals(5)
        //     .where("difficulty")
        //     .equals("easy");

        //&     filter object from url
        // const tours = await Tour.find(req.query);

        //&     filtering tours and exclude others type
        // const tours = await Tour.find(req.query);

        const queryObj = { ...req.query };
        const excludesFields = ["page", "limit", "sort", "fields"];
        excludesFields.forEach((el) => delete queryObj[el]);

        const query = Tour.find(queryObj);

        const tours = await query;

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

//!     get single tour by tour id
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

//!     create new tour
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

//!     update tour
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

//!     delete tour
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
