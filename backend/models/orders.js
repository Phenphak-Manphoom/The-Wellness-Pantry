import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phoneNo: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true }, // เปลี่ยนเป็น Number เพื่อคำนวณได้ง่ายขึ้น
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Card"],
    },
    paymentInfo: {
      id: { type: String },
      status: { type: String },
    },
    itemsPrice: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    shippingAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
