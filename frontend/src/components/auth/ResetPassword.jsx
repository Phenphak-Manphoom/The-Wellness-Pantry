import React, { useEffect, useState, useCallback } from "react";
import { useResetPasswordMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { token } = useParams();

  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  // ตรวจสอบ authentication
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // ตรวจสอบ error และ success
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
    if (isSuccess) {
      toast.success("Password reset successfully");
      navigate("/login");
    }
  }, [error, isSuccess, navigate]);

  // จัดการเปลี่ยนค่า input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ฟังก์ชันส่งข้อมูล
  const submitHandler = (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (!password.trim() || !confirmPassword.trim()) {
      return toast.error("Please fill in both fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    resetPassword({ token, body: { password, confirmPassword } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={submitHandler}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            New Password
          </h2>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold focus:outline-none ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Setting..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
