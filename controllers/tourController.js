const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

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
exports.getAllTours = catchAsync(async (req, res, next) => {
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
        lengths: tours.length,
        data: {
            tours,
        },
    });
});

//SECTION :     get single tour by tour id
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError("No tour found with this id", 404));
    }

    res.status(200).json({
        status: "Success",
        data: {
            tour,
        },
    });
});

//SECTION :     create new tour
exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: "Success",
        data: {
            tour: newTour,
        },
    });
});

//SECTION :     update tour
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError("No tour found with this id", 404));
    }

    res.status(200).json({
        status: "Success",
        data: {
            tour,
        },
    });
});

//SECTION :     delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError("No tour found with this id", 404));
    }

    res.status(204).json({
        status: "success",
        message: null,
    });
});

//SECTION :     tour stats
exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

//SECTION :     monthly plan
exports.monthlyPlan = catchAsync(async (req, res, next) => {
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
});
