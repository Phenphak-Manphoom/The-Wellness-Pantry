import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["User"], // ✅ ใช้ร่วมกับ providesTags/invalidatesTags
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => `/me`,
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log(error);
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query(body) {
        return {
          url: "/me/update",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true)); // เริ่มการโหลดก่อน
        try {
          await queryFulfilled; // รอให้ mutation สำเร็จ
          dispatch(userApi.endpoints.getMe.initiate()); // ดึงข้อมูลใหม่หลังจากอัปเดต
        } catch (error) {
          console.error("Error updating profile:", error);
        } finally {
          dispatch(setLoading(false)); // ปิดสถานะการโหลดหลังจากเสร็จสิ้น
        }
      },
      invalidatesTags: ["User"], // เมื่อข้อมูล user อัปเดตจะให้ invalidate cache
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: "/me/upload_avatar",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userApi.endpoints.getMe.initiate()); // ✅ โหลดข้อมูลใหม่หลังอัปโหลด
        } catch (error) {
          console.error("Error uploading avatar:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/password/update",
          method: "PUT",
          body,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query({ token, body }) {
        return {
          url: `/password/reset/${token}`,
          method: "PUT",
          body,
        };
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = userApi;
