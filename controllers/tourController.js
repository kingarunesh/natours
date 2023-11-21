const fs = require("fs");

//      read file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//NOTE     middleware

//      check id
exports.checkID = (req, res, next, value) => {
    if (Number(req.params.id) > tours.length - 1) {
        return res.status(404).json({
            status: "Fail",
            message: "Invalid Tour ID",
        });
    }

    next();
};

//      check body
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "Fail",
            message: "Content Missing",
        });
    }

    next();
};

//NOTE :        route handler

//     get all tours
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "Success",
        requestAt: req.requestAt,
        length: tours.length,
        data: {
            tours,
        },
    });
};

//     get single tour by tour id
exports.getTour = (req, res) => {
    const id = Number(req.params.id);

    const tour = tours.find((tour) => tour.id === id);

    res.status(200).json({
        status: "Success",
        data: {
            tour,
        },
    });
};

//     create new tour
exports.createTour = (req, res) => {
    const newTour = { id: tours.length, ...req.body };
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (error) => {
        res.status(201).json({
            status: "Success",
            data: {
                tour: newTour,
            },
        });
    });
};

//     update tour
exports.updateTour = (req, res) => {
    const id = Number(req.params.id);

    // res.status(205).json({
    res.status(200).json({
        status: "Success",
        data: {
            message: "Updated...",
        },
    });
};

//     delete tour
exports.deleteTour = (req, res) => {
    //      id
    const id = Number(req.params.id);

    //      get delete tour by id
    const deleteTour = tours.find((tour) => tour.id === id);

    //      remove delete tour from tours array
    const newTours = tours.filter((tour) => tour !== deleteTour);

    //      update new tours
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), (error) => {
        res.status(204).json({
            status: "success",
            message: null,
        });
    });
};
