const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

//NOTE :        Envirment Variables
// console.log(app.get("env"));
// console.log(process.env);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log();
    console.log("-----------------------------------------");
    console.log();
    console.log(`Server started on port ${PORT}...`);
});
