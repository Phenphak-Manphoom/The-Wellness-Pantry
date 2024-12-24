import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orders.js";
import Product from "../models/product.js";
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

// Get current user orders  =>  /api/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get order details  =>  /api/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    order,
  });
});

// Get all orders - ADMIN  =>  /api/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    success: true,
    orders,
  });
});

// Update Order - ADMIN  =>  /api/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // Validate order status
  const validStatuses = ["Processing", "Shipped", "Delivered"];
  if (!validStatuses.includes(req.body.orderStatus)) {
    return next(new ErrorHandler("Invalid order status", 400));
  }

  // Update products stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product.toString());

    if (!product) {
      return next(new ErrorHandler("No Product found with this ID", 404));
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  order.orderStatus = req.body.orderStatus;
  if (req.body.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save();

  res.status(200).json({
    success: true,
  });
});

// Delete order  =>  /api/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
