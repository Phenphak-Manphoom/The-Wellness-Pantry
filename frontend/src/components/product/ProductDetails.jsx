import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productsApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import MetaData from "../layout/MetaData";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data, isLoading, error, isError } = useGetProductDetailsQuery(id);
  const product = data?.product;

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState(
    product?.prices[0]?.size ?? "small"
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images[0]?.url);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Error fetching product details");
    }
  }, [isError, error]);

  useEffect(() => {
    // ตั้ง mainImage ใหม่เมื่อ product โหลดเสร็จ
    if (product?.images?.length) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  const getTotalPrice = () => {
    const priceObject = product?.prices?.find((p) => p.size === selectedSize);
    return priceObject ? (priceObject.price * quantity).toFixed(2) : "N/A";
  };

  const increaseQty = () => {
    setQuantity((prev) => Math.min(prev + 1, product?.stock ?? 1));
  };

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const setItemToCart = () => {
    const priceObject = product?.prices?.find((p) => p.size === selectedSize);
    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.image,
      size: selectedSize,
      price: priceObject ? priceObject.price : product.prices[0].price,
      stock: product.stock,
      quantity,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Item added to Cart");
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={product?.name} />
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-stretch gap-8">
            {/* ฝั่งรูปสินค้า */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="w-full h-[600px]">
                <img
                  src={mainImage}
                  alt={product?.name}
                  className="w-full h-full object-cover rounded-lg shadow-md mb-4"
                />
              </div>

              {/* รูปภาพย่อย */}
              <div className="flex space-x-4 overflow-x-auto mt-6">
                {product?.images?.map((image) => (
                  <img
                    key={image.public_id}
                    src={image.url}
                    alt={product?.name}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 hover:border-gray-600"
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>
            </div>

            {/* รายละเอียดสินค้า */}
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-3xl font-bold mb-2">{product?.name}</h2>
              <p className="text-gray-600 mb-4">Product # {product?._id}</p>

              <div className="flex items-center mb-4">
                <StarRatings
                  rating={product?.ratings ?? 0}
                  starRatedColor="#ffb829"
                  numberOfStars={5}
                  name="rating"
                  starDimension="24px"
                  starSpacing="1px"
                />
                <span className="ml-2 text-gray-600">
                  ({product?.numOfReviews ?? 0} Reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-6">{product?.description}</p>

              {/* เลือกขนาด */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size:</h3>
                <div className="flex space-x-2">
                  {product?.prices?.map((p) => (
                    <button
                      key={p.size}
                      onClick={() => setSelectedSize(p.size)}
                      className={`w-20 h-10 border-2 transition rounded-md ${
                        selectedSize === p.size
                          ? "bg-gray-400 border-black"
                          : "bg-gray-200 border-transparent"
                      }`}
                    >
                      {p.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* จำนวนสินค้า */}
              <div className="flex items-center gap-4 mt-8 mb-8">
                <button
                  onClick={decreaseQty}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="text-center w-12"
                />
                <button
                  onClick={increaseQty}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              {/* ราคา */}
              <div className="mb-4">
                <span className="text-2xl font-bold mr-2">
                  ฿{getTotalPrice()}
                </span>
              </div>

              {/* ปุ่มตะกร้า */}
              <div className="flex space-x-4 mb-6 mt-7">
                <button
                  className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={setItemToCart}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>

              {/* สถานะสินค้า */}
              <div className="pt-4">
                <span className="text-lg font-medium">Status: </span>
                <span
                  className={
                    product?.stock > 0
                      ? "text-green-700 font-bold"
                      : "text-red-900 font-medium"
                  }
                >
                  {product?.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

                <p className="pt-3 text-lg font-medium">
                  Sold by: <strong>{product?.seller}</strong>
                </p>
              </div>

              {/* รีวิว */}
              {isAuthenticated ? (
                <NewReview productId={product?._id} />
              ) : (
                <div
                  className="border border-red-100 rounded-lg my-5 p-2 text-lg bg-red-200 cursor-pointer"
                  type="alert"
                >
                  Login to post your review.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* รีวิวรายการ */}
      {product?.reviews?.length > 0 && (
        <ListReviews reviews={product?.reviews} />
      )}
    </>
  );
};

export default ProductDetails;
