import React from "react";
import MetaData from "./layout/MetaData";
import HeroSection from "./layout/HeroSection";

const Home = () => {
  return (
    <>
      <MetaData title={"Healthy Food for Every Lifestyle"} />
      <HeroSection />
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-5 w-full h-[520px] overflow-hidden">
              <div className="relative overflow-hidden h-[220px]">
                <img
                  className="object-cover w-full h-full"
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                  alt="Product"
                />
              </div>
              <div className="flex items-center justify-center mt-4">
                <span className="text-yellow-500 text-lg">
                  &#9733; &#9733; &#9733; &#9733; &#9734;
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">
                Product Name
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
                ante justo.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-700 font-semibold text-right">
                  Size:
                </span>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  S
                </div>

                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  M
                </div>

                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  L
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 w-full">
                <span className="text-gray-900 font-bold text-xl">$29.99</span>
                <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-5 w-full h-[520px] overflow-hidden">
              <div className="relative overflow-hidden h-[220px]">
                <img
                  className="object-cover w-full h-full"
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                  alt="Product"
                />
              </div>
              <div className="flex items-center justify-center mt-4">
                <span className="text-yellow-500 text-lg">
                  &#9733; &#9733; &#9733; &#9733; &#9734;
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">
                Product Name
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
                ante justo.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-700 font-semibold text-right">
                  Size:
                </span>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  S
                </div>

                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  M
                </div>

                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  L
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 w-full">
                <span className="text-gray-900 font-bold text-xl">$29.99</span>
                <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-5 w-full h-[520px] overflow-hidden">
              <div className="relative overflow-hidden h-[220px]">
                <img
                  className="object-cover w-full h-full"
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                  alt="Product"
                />
              </div>
              <div className="flex items-center justify-center mt-4">
                <span className="text-yellow-500 text-lg">
                  &#9733; &#9733; &#9733; &#9733; &#9734;
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">
                Product Name
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
                ante justo.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-700 font-semibold text-right">
                  Size:
                </span>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  S
                </div>

                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  M
                </div>

                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  L
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 w-full">
                <span className="text-gray-900 font-bold text-xl">$29.99</span>
                <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">
                  View Details
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-5 w-full h-[520px] overflow-hidden">
              <div className="relative overflow-hidden h-[220px]">
                <img
                  className="object-cover w-full h-full"
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                  alt="Product"
                />
              </div>
              <div className="flex items-center justify-center mt-4">
                <span className="text-yellow-500 text-lg">
                  &#9733; &#9733; &#9733; &#9733; &#9734;
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">
                Product Name
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
                ante justo.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-700 font-semibold text-right">
                  Size:
                </span>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  S
                </div>

                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  M
                </div>

                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full text-sm font-bold text-gray-700">
                  L
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 w-full">
                <span className="text-gray-900 font-bold text-xl">$29.99</span>
                <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
