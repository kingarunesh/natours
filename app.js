const fs = require("fs");

const express = require("express");
const morgan = require("morgan");

//SECTION :     coding start

const app = express();

//NOTE :        middleware

//  morgan
app.use(morgan("dev"));

//  for request json body
app.use(express.json());

//  simple middleware
app.use((req, res, next) => {
    console.log("Middleware 👋");

    next();
});

app.use((req, res, next) => {
    req.requestAt = new Date().toLocaleString();

    next();
});

//NOTE :    get json data from json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//NOTE :    routes handler

//!     get all tours
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "Success",
        requestAt: req.requestAt,
        length: tours.length,
        data: {
            tours,
        },
    });
};

//!     get single tour by tour id
const getTour = (req, res) => {
    const id = Number(req.params.id);

    //%     not working
    // if (id > tours.length) {
    //     return res.status(404).json({
    //         status: "Fail",
    //         message: "Invalid Tour ID",
    //     });
    // }

    const tour = tours.find((tour) => tour.id === id);

    if (!tour) {
        return res.status(404).json({
            status: "Fail",
            message: "Invalid Tour ID",
        });
    }

    res.status(200).json({
        status: "Success",
        data: {
            tour,
        },
    });
};

//!     create new tour
const createTour = (req, res) => {
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

//!     update tour
const updateTour = (req, res) => {
    const id = Number(req.params.id);

    if (id > tours.length - 1) {
        return res.status(404).json({
            status: "Fail",
            message: "Invalid Tour ID",
        });
    }

    // res.status(205).json({
    res.status(200).json({
        status: "Success",
        data: {
            message: "Updated...",
        },
    });
};

//!     delete tour
const deleteTour = (req, res) => {
    //      id
    const id = Number(req.params.id);

    //      get delete tour by id
    const deleteTour = tours.find((tour) => tour.id === id);

    //      remove delete tour from tours array
    const newTours = tours.filter((tour) => tour !== deleteTour);

    //      if id is invalid return
    if (!deleteTour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Tour ID",
        });
    }

    //      update new tours
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), (error) => {
        res.status(204).json({
            status: "success",
            message: null,
        });
    });
};

//!     get all users
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//!     get user
const getUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//!     create user
const createUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//!     update user
const updateUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//!     delete user
const deleteUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//NOTE :    routes

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);
app.route("/api/v1/users/:id").get(getUser).patch(updateUser).delete(deleteUser);

//NOTE :    server start
const PORT = 5000;
app.listen(PORT, () => {
    console.log();
    console.log("-----------------------------------------");
    console.log();
    console.log(`Server started on port ${PORT}...`);
});
