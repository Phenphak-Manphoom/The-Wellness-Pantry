import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useUpdateProfileMutation } from "../../redux/api/userApi";
import UserLayout from "../layout/UserLayout";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
    }

    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }

    if (isSuccess) {
      toast.success("User Updated");
      navigate("/me/profile");
    }
  }, [user, error, isSuccess, navigate]);

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();

      // ตรวจสอบว่า fields ไม่ว่าง
      if (!name || !email) {
        setErrorMessage("Name and Email are required");
        return;
      }

      // ส่งข้อมูลไปยัง API
      const userData = { name, email };
      updateProfile(userData);
    },
    [name, email, updateProfile]
  );

  return (
    <UserLayout>
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Update Profile
          </h2>

          {/* แสดงข้อผิดพลาดหากมี */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}

          <form onSubmit={submitHandler}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name_field"
                className="block text-gray-700 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email_field"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UpdateProfile;
