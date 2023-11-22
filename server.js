const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
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

//NOTE :        server listing
/* eslint-disable */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log();
    console.log("-----------------------------------------");
    console.log();
    console.log(`Server started on port ${PORT}...`);
});
