const mongoose = require("mongoose");

//      tour schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Missing"],
        unique: true,
        trim: true,
    },

    duration: {
        type: Number,
        required: [true, "Duration Missing"],
    },

    maxGroupSize: {
        type: Number,
        required: [true, "Max Group Size Missing"],
    },

    difficulty: {
        type: String,
        required: [true, "Difficulty Missing"],
    },

    ratingsAverage: {
        type: Number,
        default: 4.5,
    },

    ratingsQuantity: {
        type: Number,
        default: 0,
    },

    price: {
        type: Number,
        required: [true, "Price Missing"],
    },

    priceDiscount: Number,

    summary: {
        type: String,
        trim: true,
        required: [true, "Summary Missing"],
    },

    description: {
        type: String,
        trim: true,
    },

    imageCover: {
        type: String,
        required: [true, "Image Cover Missing"],
    },

    images: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
