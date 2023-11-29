const { promisify } = require("util");
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
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
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
    // console.log(user);

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
        // console.log(token);
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
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decode);

    // 3)   check if user still exists
    const currentUser = await User.findById(decode.id);

    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging with this token doesnot exists",
                401,
            ),
        );
    }

    // 4)   check user change password after the jwt was issued
    if (currentUser.changePasswordAfter(decode.iat)) {
        return next(
            new AppError(
                "User recently changed password, please login to get again new token",
                401,
            ),
        );
    }

    // you can access procted routes

    req.user = currentUser;

    next();
});

//SECTION :         route permissions
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403,
                ),
            );
        }

        next();
    };
};
