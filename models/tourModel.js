const mongoose = require("mongoose");
const slugify = require("slugify");

//SECTION :      tour schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name Missing"],
            unique: true,
            trim: true,
        },

        slug: String,

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

//SECTION :    virtual will not work in query because virtual datas will not store in database
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

//SECTION :     document middleware ( save() & create() )
//!     runs before .save() and .create() only [ it will run before save document in database ]

//!     in pre have this keyword for access document from tourSchema || post have document to access document

tourSchema.pre("save", function (next) {
    //  in pre save we have this
    // console.log(this)
    this.slug = slugify(this.name, { lower: true });

    next();
});

tourSchema.post("save", function (document, next) {
    console.log(document);

    next();
});

//SECTION :     tour collections
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
