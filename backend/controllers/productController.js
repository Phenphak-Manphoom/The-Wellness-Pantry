import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/orders.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

export const getProduct = catchAsyncErrors(async (req, res) => {
  const resPerPage = 4;

  const apiFilters = new APIFilters(Product.find(), req.query)
    .search()
    .filter();

  const filteredProductsCount = await apiFilters.query.clone().countDocuments();

  apiFilters.pagination(resPerPage);

  const products = await apiFilters.query;

  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
});

//create new product  => /api/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// Get single product details   =>  /api/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id).populate(
    "reviews.user"
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
  });
});

// Get products - ADMIN   =>  /api/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const keyword = req.query.keyword || "";
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  const query = {};

  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }

  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort({ [sortBy]: order })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    totalProducts,
    products,
  });
});

// update product details   =>  /api/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });
  res.status(200).json({
    product,
  });
});

// Upload product images   =>  /api/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const images = req?.body?.images;

  if (!images || !Array.isArray(images) || images.length === 0) {
    return next(new ErrorHandler("No images provided", 400));
  }

  const uploader = async (image) => {
    try {
      const result = await upload_file(image, "the-wellness-pantry/products");

      if (!result?.public_id || !result?.url) {
        throw new ErrorHandler("Image upload failed", 500);
      }

      return {
        public_id: result.public_id,
        url: result.url, // ใช้ secure_url ใน upload_file อยู่แล้ว
      };
    } catch (error) {
      // Log ข้อผิดพลาด และส่ง error กลับให้กับ client
      console.error("Image upload failed:", error);
      throw new ErrorHandler("Failed to upload image", 500);
    }
  };

  const urls = await Promise.allSettled(images.map(uploader));

  // เอาผลลัพธ์ที่สำเร็จออกมา และเอาผลลัพธ์ที่ล้มเหลวไป log ไว้
  const successfulUploads = urls
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const failedUploads = urls.filter((result) => result.status === "rejected");

  if (failedUploads.length > 0) {
    console.error("Failed image uploads:", failedUploads);
    return next(new ErrorHandler("Some image uploads failed", 500));
  }

  // เพิ่ม urls ที่อัปโหลดแล้วใน images ของสินค้า
  product.images = [...(product.images || []), ...successfulUploads];

  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product image   =>  /api/admin/products/:id/delete_image
export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  // ค้นหาสินค้า
  let product = await Product.findById(req?.params?.id);

  // ตรวจสอบว่าสินค้าไม่พบ
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // ตรวจสอบว่า imgId มีหรือไม่
  const { imgId } = req.body;
  if (!imgId) {
    return next(new ErrorHandler("Image ID not provided", 400));
  }

  // ลบไฟล์จาก Cloudinary
  const isDeleted = await delete_file(imgId);

  // หากลบไฟล์สำเร็จ
  if (isDeleted) {
    product.images = product?.images?.filter((img) => img.public_id !== imgId);

    // บันทึกการเปลี่ยนแปลง
    await product?.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      product,
    });
  } else {
    return next(
      new ErrorHandler("Failed to delete image from Cloudinary", 500)
    );
  }
});

//delete product   =>  /api/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  // ค้นหาสินค้า
  const product = await Product.findById(req?.params?.id);

  // ตรวจสอบว่าสินค้าพบหรือไม่
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // หากสินค้ามีภาพที่ต้องลบ
  if (product?.images?.length > 0) {
    try {
      // ลบไฟล์ทั้งหมดใน product.images โดยใช้ Promise.all เพื่อทำงานพร้อมกัน
      await Promise.all(
        product?.images.map((image) => delete_file(image.public_id))
      );
    } catch (err) {
      return next(
        new ErrorHandler("Failed to delete images from Cloudinary", 500)
      );
    }
  }

  // ลบสินค้า
  await product.deleteOne();

  // ส่งผลลัพธ์กลับ
  res.status(200).json({
    message: "Product Deleted successfully",
  });
});

// Create/Update product review   =>  /api/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!rating || !comment || !productId) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if the user has already reviewed the product
  const existingReviewIndex = product.reviews.findIndex(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReviewIndex !== -1) {
    // Update the existing review
    product.reviews[existingReviewIndex].comment = comment;
    product.reviews[existingReviewIndex].rating = rating;
  } else {
    // Add a new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Update product ratings
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review added/updated successfully",
  });
});

// Get product reviews   =>  /api/reviews
export const getProductReviews = catchAsyncErrors(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete product review   =>  /api/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res) => {
  const { productId, id: reviewId } = req.query;

  if (!productId || !reviewId) {
    return next(new ErrorHandler("Product ID and Review ID are required", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== reviewId.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  await Product.findByIdAndUpdate(
    productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

// Can user review   =>  /api/can_review
export const canUserReview = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({
    canReview: true,
  });
});
