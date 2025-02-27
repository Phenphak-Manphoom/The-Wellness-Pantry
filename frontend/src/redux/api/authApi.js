import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";
import { setUser, setIsAuthenticated } from "../features/userSlice";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include", // ให้ส่ง cookies/session ไปด้วย
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/register",
          method: "POST",
          body,
        };
      },
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //     await dispatch(userApi.endpoints.getMe.initiate(null));
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
    }),
    login: builder.mutation({
      query(body) {
        return {
          url: "/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userApi.endpoints.getMe.initiate(null)); // ดึงข้อมูลผู้ใช้
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"], // ✅ ให้ข้อมูล User อัปเดตหลังจาก login
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setUser(null)); // เคลียร์ข้อมูลผู้ใช้
          dispatch(setIsAuthenticated(false)); // ตั้งค่าให้ไม่ได้ล็อกอินแล้ว
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
      invalidatesTags: ["User"], // ✅ รีเฟรชข้อมูล User หลัง logout
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;

/**
   * providesTags หรือ invalidatesTags ใน mutation นี้ 
   * เพราะการใช้ tags เช่น providesTags และ invalidatesTags 
   * มักจะใช้กับ queries (การดึงข้อมูล) หรือ 
   * mutations ที่มีผลกระทบกับข้อมูลที่คุณต้องการจัดการ cache หรือ invalidate
   * providesTags ใช้เมื่อคุณดึงข้อมูลจาก API และต้องการเก็บข้อมูลนั้นไว้ใน cache เพื่อให้สามารถใช้ข้อมูลนั้นในภายหลังโดยไม่ต้องดึงใหม่จาก API
     invalidatesTags ใช้เมื่อคุณทำการเปลี่ยนแปลงข้อมูล (เช่น การเพิ่ม ลบ หรืออัปเดตข้อมูล) และต้องการให้ Redux คอยติดตามและทำการอัปเดตข้อมูลที่มีอยู่ใน cache หรือ invalidate cache
   */
