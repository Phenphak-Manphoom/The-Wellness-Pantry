import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { getPriceQueryParams } from "../../helpers/helpers";
import { PRODUCT_CATEGORIES } from "../../constants/constants";

const Filters = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const SIZES = ["small", "medium", "large"]; // size options

  // กำหนดค่าจาก URLParams เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (searchParams.has("size")) setSelectedSize(searchParams.get("size"));
    if (searchParams.has("category"))
      setSelectedCategory(searchParams.getAll("category"));
    if (searchParams.has("ratings"))
      setSelectedRatings(searchParams.getAll("ratings"));
    if (searchParams.has("min")) setMin(searchParams.get("min"));
    if (searchParams.has("max")) setMax(searchParams.get("max"));
  }, [searchParams]);

  // แสดงค่าที่เลือกเมื่อมีการเปลี่ยนแปลง
  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategory.includes(category)
      ? selectedCategory.filter((item) => item !== category)
      : [...selectedCategory, category];
    setSelectedCategory(updatedCategories);
    let newSearchParams = new URLSearchParams(searchParams);
    // ใช้ append แทน set เพื่อรองรับหลายค่า
    newSearchParams.delete("category"); // ลบค่า category เดิม
    updatedCategories.forEach((cat) => newSearchParams.append("category", cat)); // ใช้ append สำหรับหลายค่า
    navigate("?" + newSearchParams.toString());
  };

  const handleRatingChange = (rating) => {
    // ถ้ากดที่ rating ที่มีอยู่แล้ว (หมายถึงเอาออก) จะทำการลบออก
    const updatedRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter((item) => item !== rating)
      : [...selectedRatings, rating];

    // ถ้าเลือก 4 ดาวหรือมากกว่า จะทำการลบ rating ที่ต่ำกว่าออก
    const ratingsToKeep = updatedRatings.filter(
      (r) => parseInt(r) >= parseInt(rating)
    );

    // ตั้งค่าใหม่ให้กับ selectedRatings
    setSelectedRatings(ratingsToKeep);

    // ใช้ URLSearchParams เพื่ออัพเดต query string
    let newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("ratings"); // ลบค่า ratings เดิม
    ratingsToKeep.forEach((rating) => newSearchParams.set("ratings", rating)); // ใช้ set แทน append เพื่อแทนที่ค่าด้วยค่าใหม่
    navigate("?" + newSearchParams.toString()); // นำทางไปยัง URL ใหม่
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (e.target.name === "min") setMin(value);
    else if (e.target.name === "max") setMax(value);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    let newSearchParams = new URLSearchParams(searchParams);
    newSearchParams = getPriceQueryParams(newSearchParams, "min", min);
    newSearchParams = getPriceQueryParams(newSearchParams, "max", max);
    if (selectedSize) {
      newSearchParams.set("size", selectedSize);
    } else {
      newSearchParams.delete("size");
    }
    navigate("?" + newSearchParams.toString());
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Filters</h3>
      <hr className="mb-4" />

      {/* 🔹 ฟิลเตอร์ขนาด (Size) */}
      <h5 className="text-md font-medium mb-3">Size</h5>
      <div className="flex gap-2 mb-4">
        {SIZES.map((size) => (
          <div key={size} className="flex items-center mb-2">
            <input
              type="radio"
              name="size"
              value={size}
              checked={selectedSize === size}
              onChange={() => setSelectedSize(size)}
              className="mr-2"
            />
            <label>{size}</label>
          </div>
        ))}
      </div>

      {/* 🔹 ฟิลเตอร์ราคา */}
      <h5 className="text-md font-medium mb-3">Price</h5>
      <form className="flex gap-2" onSubmit={handleButtonClick}>
        <input
          type="number"
          className="border p-2 rounded w-1/3"
          placeholder="Min ($)"
          name="min"
          value={min}
          onChange={handlePriceChange}
        />
        <input
          type="number"
          className="border p-2 rounded w-1/3"
          placeholder="Max ($)"
          name="max"
          value={max}
          onChange={handlePriceChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          GO
        </button>
      </form>

      <hr className="my-4" />

      {/* ฟิลเตอร์หมวดหมู่ */}
      <h5 className="text-md font-medium mb-3">Category</h5>
      {PRODUCT_CATEGORIES.map((category) => (
        <div key={category} className="flex items-center mb-2">
          <input
            type="checkbox"
            value={category}
            checked={selectedCategory.includes(category)}
            onChange={() => handleCategoryChange(category)}
            className="mr-2"
          />
          <label>{category}</label>
        </div>
      ))}

      <hr className="my-4" />

      {/* ฟิลเตอร์การให้คะแนน */}
      <h5 className="text-md font-medium mb-3">Ratings</h5>
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center mb-2">
          <input
            type="checkbox"
            value={rating}
            checked={selectedRatings.includes(rating.toString())}
            onChange={() => handleRatingChange(rating.toString())}
            className="mr-2"
          />
          <StarRatings
            rating={rating}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            starDimension="21px"
            starSpacing="1px"
          />
        </div>
      ))}
    </div>
  );
};

export default Filters;
