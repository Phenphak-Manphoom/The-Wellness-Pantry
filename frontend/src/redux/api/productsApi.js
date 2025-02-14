import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => {
        // ฟังก์ชันช่วยลบค่า undefined, null และ string ว่างออกจาก object
        const cleanParams = (obj) =>
          Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v != null && v !== "")
          );

        const queryObj = cleanParams({
          page: params?.page,
          keyword: params?.keyword,
          category: params?.category,
          "prices.price[gte]": params?.min,
          "prices.price[lte]": params?.max,
          size: params?.size,
          ratings: params?.ratings,
        });

        console.log("📤 Redux Toolkit Query sending params:", queryObj); // Debug

        return {
          url: "/products",
          params: queryObj,
        };
      },
    }),

    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
    }),
  }),
});
export const { useGetProductsQuery, useGetProductDetailsQuery } = productApi;
