import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import HeroSection from "./layout/HeroSection";
import { useGetProductsQuery } from "../redux/api/productsApi";
import ProductItem from "./product/ProductItem";
import toast from "react-hot-toast";
import Loader from "./layout/Loader";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const params={page}
  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Healthy Food for Every Lifestyle"} />
      <HeroSection />
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h1 className="pb-5 text-left font-medium text-2xl">
            Latest Products
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data?.products?.map((product) => (
              <ProductItem product={product} />
            ))}
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
