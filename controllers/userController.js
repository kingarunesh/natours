const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

//SECTION :     methods
const filterObj = (obj, ...allowedFileds) => {
    const newObject = {};

    Object.keys(obj).forEach((el) => {
        if (allowedFileds.includes(el)) newObject[el] = obj[el];
    });

    return newObject;
};

//SECTION :     update profile ( update me )
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) create error if user post password
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route not for password update, Please use /update-password route.",
                400,
            ),
        );
    }

    // 2) update user
    const filterBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true,
    });

    // 3) send response
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

//SECTION :     delete own account
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

//SECTION :     get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        lengths: users.length,
        data: {
            users,
        },
    });
});

//SECTION :     get user
exports.getUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//SECTION :     create user
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//SECTION :     update user
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "Undefiend",
        message: "This route not defiend yet 💥",
    });
};

//SECTION :     delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
    });
});
