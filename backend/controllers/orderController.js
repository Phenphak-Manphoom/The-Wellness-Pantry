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
  const { page = 1, limit = 10 } = req.query; // กำหนดค่าเริ่มต้น page และ limit
  const skip = (page - 1) * limit;

  const [orders, totalOrders] = await Promise.all([ 
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // เรียงลำดับจากใหม่ไปเก่า
      .select(
        "shippingInfo paymentInfo  user orderItems paymentMethod  itemsPrice taxAmount  shippingAmount totalAmount orderStatus createdAt updatedAt"
      ) // เลือกเฉพาะฟิลด์ที่ต้องการ
      .skip(skip) // ข้ามตามหน้าปัจจุบัน
      .limit(Number(limit)), // กำหนดจำนวนเอกสารต่อหน้า
    Order.countDocuments({ user: req.user._id }), // นับคำสั่งซื้อทั้งหมด
  ]);

  res.status(200).json({
    success: true,
    orders,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit), // จำนวนหน้าทั้งหมด
    page: Number(page), // หน้าปัจจุบัน
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
  const { page = 1, limit = 10 } = req.query; // กำหนดค่าเริ่มต้น page และ limit
  const skip = (page - 1) * limit;

  const orders = await Order.find()
    .skip(skip) // ข้ามเอกสาร
    .limit(limit); // จำกัดจำนวนเอกสารต่อหน้า

  const totalOrders = await Order.countDocuments(); // นับจำนวนคำสั่งซื้อทั้งหมด

  res.status(200).json({
    success: true,
    orders,
    totalOrders, // จำนวนคำสั่งซื้อทั้งหมด
    page, // หน้าปัจจุบัน
    totalPages: Math.ceil(totalOrders / limit), // จำนวนหน้าทั้งหมด
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

    // ตรวจสอบว่าสต็อกเพียงพอหรือไม่
    if (product.stock < item.quantity) {
      return next(
        new ErrorHandler(`Not enough stock for product: ${product.name}`, 400)
      );
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
