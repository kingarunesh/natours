const mongoose = require("mongoose");
const validator = reuqire("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have name"],
    },

    email: {
        type: String,
        required: [true, "User must have email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
    },

    photo: {
        type: String,
    },

    password: {
        type: String,
        required: [true, "User must have password"],
        minlength: 8,
    },

    passwordConfirm: {
        type: String,
        required: [true, "User must have confirm password"],
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
