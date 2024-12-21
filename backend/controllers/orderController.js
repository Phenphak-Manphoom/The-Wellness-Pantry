import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orders.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order  =>  /api/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  // ตรวจสอบว่าข้อมูลสำคัญครบถ้วน
  if (
    !orderItems ||
    !shippingInfo ||
    !itemsPrice ||
    !totalAmount ||
    !paymentMethod
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});
