const express = require("express");

const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody,
} = require("./../controllers/tourController");

const router = express.Router();

//!      middleware
// router.param("id", (req, res, next, value) => {
//     console.log(`ID is = ${value}`);

//     next();
// });

//     check tour id
router.param("id", checkID);

// router.param("body", checkBody);

//!      routes
router.route("/").get(getAllTours).post(checkBody, createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
