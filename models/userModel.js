const crypto = require("crypto");
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

    role: {
        type: String,
        enum: ["user", "admin", "guide", "lead-guide"],
        default: "user",
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
            //!     this only works on save and create not on update
            validator: function (currentPasswordConfirm) {
                return this.password === currentPasswordConfirm;
            },
            message: "Password and passwordConfirm is not same 😔",
        },
    },

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

//SECTION :     filter active user
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
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

//SECTION :     change - passwordChangedAt
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

//SECTION :     instance method for all user documents
//!     here we can't access 'this'

//NOTE :    compare login password
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//NOTE :    check change password
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );

        // console.log(changedTimeStamp);
        // console.log(JWTTimeStamp);

        return JWTTimeStamp < changedTimeStamp;
    }

    //      false meaning password is not changed
    return false;
};

//NOTE :    forgot password
userSchema.methods.createPasswordResetToken = function () {
    // generate token to send user for reset password
    const resetToken = crypto.randomBytes(32).toString("hex");

    // generate fake token to database
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    console.log({
        resetToken,
        passwordResetToken: this.passwordResetToken,
    });

    // add 10 min after token will expires
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
