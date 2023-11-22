const express = require("express");

const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    top5ByRatingsAverage,
} = require("../controllers/tourController");

//SECTION :     routers

const router = express.Router();

//!      routes
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/top-5-by-ratingsAverage").get(top5ByRatingsAverage, getAllTours);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
