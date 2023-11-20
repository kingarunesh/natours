const fs = require("fs");

const express = require("express");

//SECTION :     coding start

const app = express();
app.use(express.json());

//NOTE :    get json data from json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//NOTE :    routes

//!     get all tours
app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "Success",
        length: tours.length,
        data: {
            tours,
        },
    });
});

//!     get single tour by tour id
// app.get("/api/v1/tours/:id/:x?", (req, res) => {
app.get("/api/v1/tours/:id", (req, res) => {
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
});

//!     create new tour
app.post("/api/v1/tours", (req, res) => {
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
});

//!     update tour
app.patch("/api/v1/tours/:id", (req, res) => {
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
});

//!     delete tour

app.delete("/api/v1/tours/:id", (req, res) => {
    const id = Number(req.params.id);

    if (id > tours.length - 1) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Tour ID",
        });
    }

    res.status(204).json({
        status: "Success",
        message: null,
    });
});

//NOTE :    server start
const PORT = 5000;
app.listen(PORT, () => {
    console.log();
    console.log("-----------------------------------------");
    console.log();
    console.log(`Server started on port ${PORT}...`);
});
