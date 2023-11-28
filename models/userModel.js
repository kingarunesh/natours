const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//SECTION :     user schema
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
        select: false,
    },

    passwordConfirm: {
        type: String,
        required: [true, "User must have confirm password"],
        validate: {
            //!     this only works on save not on update
            validator: function (currentPasswordConfirm) {
                return this.password === currentPasswordConfirm;
            },
            message: "Password and passwordConfirm is not same 😔",
        },
    },
});

//SECTION :     incrypt user password before save in database
userSchema.pre("save", async function (next) {
    //!     run fun if password was modifed
    if (!this.isModified("password")) return next();

    //!     has the password
    this.password = await bcrypt.hash(this.password, 10);

    //!     remove confrim password from database
    this.passwordConfirm = undefined;

    next();
});

//SECTION :     instance method for all user documents
//!     here we can't access 'this'
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
