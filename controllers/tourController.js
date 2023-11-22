const Tour = require("../models/tourModel");

//SECTION :     get all tours
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

        //  for simple filtering
        // const query = Tour.find(queryObj);

        //&     adv filtering (gte | gt | lte | lt)
        //  i can use directly but it is not user friendly
        // 127.0.0.1:5000/api/v1/tours?duration[$gte]=5&difficulty=easy

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        //  conditionally filtering like gte, gt, lte, lt
        const query = Tour.find(JSON.parse(queryStr));

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
