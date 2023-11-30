const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

//SECTION :     methods
const tokenSign = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = tokenSign(user._id);

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
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

    // const token = tokenSign(newUser._id);

    // res.status(201).json({
    //     status: "success",
    //     token,
    //     data: {
    //         user: newUser,
    //     },
    // });

    createSendToken(newUser, 201, res);
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
    // const token = tokenSign(user._id);

    // res.status(200).json({
    //     status: "success",
    //     token,
    // });

    createSendToken(user, 200, res);
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

//!     this is also working fine and more understandble than jonas
// exports.myRestrictTo = (req, res, next) => {
//     const permissions = ["admin", "lead-guide"];

//     if (!permissions.includes(req.user.role)) {
//         return next(
//             new AppError(
//                 "You do not have permission to perform this action",
//                 403,
//             ),
//         );
//     }

//     next();
// };

//SECTION :     forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // check user is giving email or not
    if (!req.body.email) {
        return next(new AppError("Please provide email", 400));
    }

    // 1)  get user by posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError("User does not exists", 404));
    }

    // 2)  generate random token for reset password
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // 3)  send to user email for reset password
    const resetURL = `${req.protocol}://${req.get(
        "host",
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't send then feel free ignore this mail`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (Valid for 10 mintues)",
            message,
        });

        res.status(200).json({
            status: "success",
            message: "Reset Password Token send to your email successfully",
        });
    } catch (error) {
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                "There was an error on sending email, Please try again later.",
                500,
            ),
        );
    }
});

//SECTION :     reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) if token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError("Token is invalid or expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    // 3) update changePasswordAt property for the user
    // 4) log the user and send jwt token
    // const token = tokenSign(user._id);

    // res.status(200).json({
    //     status: "success",
    //     token,
    // });

    createSendToken(user, 200, res);
});

//SECTION :     update login user password
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) get user from collections
    const user = await User.findById(req.user.id).select("+password");
    console.log(user);

    // 2) check if current password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(
            new AppError("Your current currect password is wrong", 401),
        );
    }

    // 3) update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    // 4) login user and send jwt token
    createSendToken(user, 200, res);
});
