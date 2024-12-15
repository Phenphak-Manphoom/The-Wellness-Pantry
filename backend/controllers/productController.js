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
