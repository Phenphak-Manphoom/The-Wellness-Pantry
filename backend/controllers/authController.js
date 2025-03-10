import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";

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

// Upload user avatar   =>  /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(
    req.body.avatar,
    "the-wellness-pantry/avatars"
  );

  // Remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });

  res.status(200).json({
    user,
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
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

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

// Update Password  =>  /api/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // ตรวจสอบ input ที่จำเป็น
  const { oldPassword, password } = req.body;

  if (!oldPassword || !password) {
    return next(
      new ErrorHandler("Please provide both old and new password", 400)
    );
  }

  // ค้นหา user และโหลด field password
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // ตรวจสอบ old password
  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // ตั้งรหัสผ่านใหม่
  user.password = password;

  // บันทึกข้อมูล user
  await user.save();

  // ส่ง response
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Update User Profile  =>  /api/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  // ตรวจสอบ input ที่จำเป็น
  if (!name || !email) {
    return next(new ErrorHandler("Name and Email are required", 400));
  }

  // เตรียมข้อมูลใหม่สำหรับอัปเดต
  const newUserData = { name, email };

  // อัปเดตข้อมูลในฐานข้อมูล
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true, // ส่งข้อมูลใหม่กลับมา
    runValidators: true, // ตรวจสอบ validation schema ใน model
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // ส่ง response
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// Get all Users - ADMIN  =>  /api/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10, keyword = "" } = req.query;

  // กรองผู้ใช้ด้วย keyword
  const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

  // ดึงข้อมูลผู้ใช้
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // ส่งจำนวนผู้ใช้ทั้งหมดสำหรับ pagination
  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    totalUsers,
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: Number(page),
  });
});

// Get User Details - ADMIN  =>  /api/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler(`User not found with ID: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Details - ADMIN  =>  /api/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  const newUserData = { name, email, role };

  const user = await User.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler(`User not found with ID: ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: user,
  });
});

// Delete User - ADMIN  =>  /api/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  // TODO - Remove user avatar from cloudinary

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
