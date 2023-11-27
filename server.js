const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", (error) => {
    console.log(error.name);
    console.log(error.message);

    console.log("UNCAUGHT EXCEPTION ERROR 💥");
    process.exit(1);
});

//NOTE :        database connection
const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
    console.log("database started...");
});
// .catch((error) => console.log("ERROR"));

//NOTE :        server listing
/* eslint-disable */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log();
    console.log("-----------------------------------------");
    console.log();
    console.log(`Server started on port ${PORT}...`);
});

process.on("unhandledRejection", (error) => {
    // console.log(error);
    console.log(error.name);
    console.log(error.message);

    console.log("UNHANDLE REJECTION, Shutting down 💥");

    server.close(() => {
        process.exit(1);
    });
});
