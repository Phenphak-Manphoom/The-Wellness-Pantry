import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product"], // เพิ่ม tag เพื่อ cache และ invalidation
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => {
        // ฟังก์ชันช่วยลบค่า undefined, null และ string ว่างออกจาก object
        const cleanParams = (obj) =>
          Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v != null && v !== "")
          );

        return {
          url: "/products",
          params: cleanParams({
            page: params?.page,
            keyword: params?.keyword,
            category: params?.category,
            "prices.price[gte]": params?.min,
            "prices.price[lte]": params?.max,
            size: params?.size,
            ratings: params?.ratings,
          }),
        };
      },
      providesTags: (
        result //providesTags ใช้ใน query เท่านั้น (ไม่ใช้ใน mutation)
      ) => (result ? [{ type: "Product", id: "LIST" }] : []), // ใช้ cache
    }),

    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),
  }),
});
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
} = productApi;
