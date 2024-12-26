import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

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
    product,
  });
});

// Get single product details   =>  /api/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
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

//delete product   =>  /api/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    message: "Product Deleted",
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
