import React, { useEffect, useState } from "react";
import { useForgotPasswordMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // แยกฟังก์ชันสำหรับ toast และ navigate
  useEffect(() => {
    if (isAuthenticated) navigate("/");

    if (error) toast.error(error?.data?.message || "Something went wrong");
    if (isSuccess) toast.success("Email Sent. Please check your inbox");
  }, [error, isAuthenticated, isSuccess, navigate]);

  // ฟังก์ชันสำหรับส่งอีเมลรีเซ็ตรหัสผ่าน
  const submitHandler = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    forgotPassword({ email });
  };

  return (
    <>
      <MetaData title={"Forgot Password"} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6">
          <form onSubmit={submitHandler}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Forgot Password
            </h2>

            <div className="mb-4">
              <label
                htmlFor="email_field"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Email
              </label>
              <input
                type="email"
                id="email_field"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Email"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
