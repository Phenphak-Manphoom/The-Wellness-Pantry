import React, { useState, useEffect, useCallback } from "react";
import { useUpdatePasswordMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const [updatePassword, { isLoading, error, isSuccess }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }

    if (isSuccess) {
      toast.success("Password Updated");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  // ใช้ useCallback เพื่อหลีกเลี่ยงการสร้างฟังก์ชันใหม่ในแต่ละครั้ง
  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();

      if (!oldPassword || !password) {
        setErrorMessage("Both fields are required");
        return;
      }

      if (oldPassword === password) {
        setErrorMessage("New password should be different from old password");
        return;
      }

      const userData = {
        oldPassword,
        password,
      };

      updatePassword(userData);
    },
    [oldPassword, password, updatePassword]
  );

  return (
    <UserLayout>
      <MetaData title={"Update Password"} />
      <div className="flex justify-center py-8">
        <div className="w-full max-w-md">
          <form
            className="shadow-lg rounded-lg bg-white p-6"
            onSubmit={submitHandler}
          >
            <h2 className="text-xl font-semibold mb-4">Update Password</h2>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <div className="mb-4">
              <label
                htmlFor="old_password_field"
                className="block text-sm font-medium text-gray-700"
              >
                Old Password
              </label>
              <input
                type="password"
                id="old_password_field"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="new_password_field"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="new_password_field"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold focus:outline-none ${
                isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UpdatePassword;
