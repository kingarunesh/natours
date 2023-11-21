const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

//NOTE :        database connection
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB)
    .then((con) => {
        console.log("database started...");
    })
    .catch((error) => console.log(error));

//      tour schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have name"],
        unique: true,
    },

    rating: {
        type: Number,
        default: 4.5,
    },

    price: {
        type: Number,
        required: [true, "A tour must have price"],
    },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
    name: "Jantar Mantra",
    price: 349,
});

testTour
    .save()
    .then((document) => {
        console.log(document);
        console.log("New Document Inserted to Database");
    })
    .catch((error) => console.log(`💥ERROR : ${error}`));

//NOTE :        Envirment Variables
// console.log(app.get("env"));
// console.log(process.env);

//NOTE :        server listing
/* eslint-disable */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log();
    console.log("-----------------------------------------");
    console.log();
    console.log(`Server started on port ${PORT}...`);
});
