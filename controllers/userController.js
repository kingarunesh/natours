const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

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
