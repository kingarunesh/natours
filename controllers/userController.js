const User = require("./../models/userModel");

//SECTION :     get all users
exports.getAllUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "tempory delete later",
        message: "This route not defiend yet 💥",
        lengths: users.length,
        data: {
            users,
        },
    });
};

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
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "unOfficaly - Delete Later",
        message: "This route not defiend yet 💥",
    });
};
