import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

//register user => api/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 200, res);
});

// Login user   =>  /api/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Find user in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password); //from user model
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout user   =>  /api/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION", // ใช้ Secure cookie ใน production
    sameSite: "strict", // ลดโอกาส CSRF
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot password   =>  /api/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide a valid email", 400));
  }
  // Find user in the database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken(); //from user model
  try {
    await user.save({ validateBeforeSave: false }); // Save token and expiration

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    if (!message) {
      throw new Error("Failed to generate email content");
    }

    await sendEmail({
      email: user.email,
      subject: "TheWellnessPantry Password Recovery",
      message,
    });
    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined; //from user model
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error?.message, 500));
  }
});

// Reset password   =>  /api/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash the URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 400));
  }

  // Set the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get current user profile  =>  /api/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});
