import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    sizes: [
      {
        type: String,
        required: true,
        enum: ["small", "medium", "large"], // ขนาดที่ต้องการให้เลือก
      },
    ],
    prices: [
      {
        size: {
          type: String,
          required: true,
          enum: ["small", "medium", "large"], // ต้องตรงกับ sizes
        },
        price: {
          type: Number,
          required: [true, "Please enter price for the size"],
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Ratings cannot be negative"],
      max: [5, "Ratings cannot exceed 5"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product category"],
      enum: {
        values: [
          "Meals",
          "Snacks & Desserts",
          "Drinks",
          "Breakfast",
          "Kids Healthy Food",
          "Healthy Oils & Spreads",
          "Organic",
        ],
        message: "Please select correct category",
      },
    },
    seller: {
      type: String,
      required: [true, "Please enter product seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      min: [0, "Stock cannot be negative"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [0, "Rating cannot be negative"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
