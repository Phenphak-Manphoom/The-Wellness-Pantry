import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandle = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-40 pointer-events-none">
      <h1 className="text-white  text-center xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl font-semibold pointer-events-auto">
        🍎 Healthy Meals, Just a Click Away 🥗
      </h1>
      <form
        className="w-full mx-auto mt-6 pointer-events-auto"
        onSubmit={submitHandle}
      >
        <div className="xl:w-1/2 lg:w-[60%] md:w-[70%] sm:w-[70%] xs:w-[90%] mx-auto flex gap-2">
          <input
            type="text"
            className="border border-gray-400 w-full p-2 rounded-md text-xl pl-2"
            placeholder="Enter Product Name ..."
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="px-[10px] p-[10px] bg-[#527210] shadow-xl text-lg text-white rounded-md font-semibold"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
