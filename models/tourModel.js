const mongoose = require("mongoose");

//      tour schema
const tourSchema = new mongoose.Schema(
    {
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
            select: false,
        },

        startDates: [Date],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

//NOTE :    virtual will not work in query because virtual datas will not store in database
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

tourSchema.virtual("durationInDaysAndWeek").get(function () {
    const weeks = Math.floor(this.duration / 7);

    const days = this.duration % 7;

    if (weeks >= 1) {
        return `${weeks} Weeks and ${days} Days`;
    }

    return `${days} Days`;
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
