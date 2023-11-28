const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//SECTION :     methods
const tokenSign = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

//SECTION :         sign up
exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = tokenSign(newUser._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser,
        },
    });
});

//SECTION :     login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1)    check if user email and password exits
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // 2)    check if user email and password is correct
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(
            new AppError("Please provide correct email and password", 401),
        );
    }

    // 3)    if everything is correct then send token
    const token = tokenSign(user._id);

    res.status(200).json({
        status: "success",
        token,
    });
});

//SECTION :     protect routes
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // 1)   getting token and check if it's there
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
        console.log(token);
    }

    if (!token) {
        return next(
            new AppError(
                "You are not logged in. Please login to get access all tours",
                401,
            ),
        );
    }

    // 2)   verificartion token

    // 3)   check if user still exists

    // 4)   check user change password after the jwt was issued

    next();
});
