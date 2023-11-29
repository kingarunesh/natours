const express = require("express");

const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    top5ByRatingsAverage,
    getTourStats,
    monthlyPlan,
} = require("../controllers/tourController");

const {
    protect,
    restrictTo,
    myRestrictTo,
} = require("./../controllers/authController");

//SECTION :     routers

const router = express.Router();

//!      routes
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router.route("/monthly-plan/:year").get(monthlyPlan);

router.route("/top-5-by-ratingsAverage").get(top5ByRatingsAverage, getAllTours);

router.route("/").get(protect, getAllTours).post(createTour);

router
    .route("/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);
// .delete(protect, myRestrictTo, deleteTour);

module.exports = router;
