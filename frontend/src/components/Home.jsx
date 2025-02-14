import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import HeroSection from "./layout/HeroSection";
import { useGetProductsQuery } from "../redux/api/productsApi";
import ProductItem from "./product/ProductItem";
import toast from "react-hot-toast";
import Loader from "./layout/Loader";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters";

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchValues = Object.fromEntries(searchParams);

  const page = Number(searchValues.page) || 1;
  const keyword = searchValues.keyword || "";

  // กรองเฉพาะค่าที่มีอยู่จริงเท่านั้น
  const params = Object.fromEntries(
    Object.entries({ ...searchValues, page, keyword }).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="Healthy Food for Every Lifestyle" />
      <HeroSection />

      <div className="bg-gray-100 py-16">
        <div className="mx-16 px-4">
          <h1 className="pb-5 text-left font-medium text-2xl">
            {keyword
              ? `${data?.products?.length} Products found with keyword: ${keyword}`
              : "Latest Products"}
          </h1>

          <div
            className={`grid ${
              keyword ? "md:grid-cols-[330px_1fr] md:gap-6 " : "gap-6"
            } items-start`}
          >
            {keyword && <Filters />}

            <div
              className={`grid ${
                keyword
                  ? "grid-cols-3 gap-10 "
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 "
              }`}
            >
              {data?.products?.map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <CustomPagination
              resPerPage={data?.resPerPage}
              filteredProductsCount={data?.filteredProductsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
