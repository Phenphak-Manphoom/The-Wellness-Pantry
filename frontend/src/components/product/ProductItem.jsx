import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  const availableSizes = product.prices?.map((p) => p.size) || [];
  const defaultSize = availableSizes.includes("small")
    ? "small"
    : availableSizes[0] || "";
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [showTooltip, setShowTooltip] = useState(false);

  const getPriceBySize = (size) => {
    const priceObject = product.prices?.find((p) => p.size === size);
    return priceObject ? priceObject.price : "N/A";
  };

  // ดึง URL รูปภาพจาก product.images ถ้ามีหลายภาพ
  const imageUrls = product?.images?.map((image) => image.url) || [];
  const defaultImage = imageUrls[0] || "/default.jpg"; // fallback สำหรับกรณีไม่มีรูป

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full overflow-hidden">
      <div
        className="relative overflow-hidden h-[220px]"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img
          className="object-cover w-full h-full"
          src={defaultImage}
          alt={product.name}
        />
        {showTooltip && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded-md">
            {product.name}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mt-4">
        <StarRatings
          rating={product?.ratings || 0}
          starRatedColor="#ffb829"
          numberOfStars={5}
          name="rating"
          starDimension="18px"
          starSpacing="1px"
        />
        <span className="pt-1 ps-2 text-gray-500">
          {" "}
          ({product.numOfReviews || 0})
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mt-4 text-left truncate">
        <Link to={`/product/${product._id}`}>{product.name}</Link>
      </h3>

      {availableSizes.length > 0 && (
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-700 font-semibold text-left">Size:</span>
          {availableSizes.map((size) => (
            <div
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex items-center justify-center ${
                selectedSize === size ? "bg-gray-400" : "bg-gray-200"
              } ${
                size === "small"
                  ? "w-6 h-6"
                  : size === "medium"
                  ? "w-8 h-8"
                  : size === "large"
                  ? "w-10 h-10"
                  : "w-12 h-12" // Extra Large
              } rounded-full text-sm font-bold text-gray-700 cursor-pointer`}
            >
              {size[0].toUpperCase()}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 w-full">
        <span className="text-gray-900 font-bold text-xl">
          ฿{getPriceBySize(selectedSize)}
        </span>
        <Link
          to={`/product/${product._id}`}
          className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
