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

//SECTION :     tour stats
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                //!     condition - first filter documents by ratingAverage then make group ⬇️
                $match: { ratingsAverage: { $gte: 4.5 } },
            },

            {
                $group: {
                    //!  make group by id
                    // _id: null,

                    //!     make group by difficulty then i will get ( easy, medium, diffcult )
                    // _id: "$difficulty",
                    _id: { $toUpper: "$difficulty" },

                    //!     make group by ratingsAverage
                    // _id: "$ratingsAverage",

                    totalTours: { $sum: 1 },
                    numRating: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                //  1 = ace and -1 = des
                $sort: { avgPrice: 1 },
            },

            /*
            {
                //!     remove from group
                $match: { _id: { $ne: "EASY" } },
            },
            */
        ]);

        res.status(200).json({
            status: "success",
            length: stats.length,
            data: {
                stats,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

//SECTION :     monthly plan
exports.monthlyPlan = async (req, res) => {
    try {
        const year = Number(req.params.year);
        const plan = await Tour.aggregate([
            //!   it will extract each tour startDate have 3 diff date so it become single - 9 tours will be 27
            {
                $unwind: "$startDates",
            },

            //!     display those tours who satisfiy this condition
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },

            //!     group
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStart: { $sum: 1 },
                    tours: { $push: "$name" },
                    tourDate: { $push: "$startDates" },
                },
            },

            //!     show month
            {
                $addFields: { month: "$_id" },
            },

            //!     remove _id
            {
                $project: { _id: 0 },
            },

            //!     sort
            {
                $sort: { numTourStart: -1 },
            },

            //!     limit
            {
                $limit: 20,
            },
        ]);

        res.status(200).json({
            status: "success",
            totalPlan: plan.length,
            data: {
                plan,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};
