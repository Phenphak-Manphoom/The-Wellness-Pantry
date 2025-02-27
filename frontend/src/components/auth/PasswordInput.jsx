import React, { useState } from "react";

// Component สำหรับซ่อน/แสดง Password
const PasswordInput = ({ name, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        className="p-2 rounded-xl border w-full"
        type={showPassword ? "text" : "password"}
        name={name} // ✅ เพิ่ม name="password"
        value={value}
        placeholder="Password"
        onChange={onChange}
      />
      <svg
        onClick={() => setShowPassword(!showPassword)}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="gray"
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        viewBox="0 0 16 16"
      >
        {showPassword ? (
          <path d="M10.79 12.912L1.172 8s3-5.5 8-5.5 8 5.5 8 5.5-3 5.5-8 5.5a7.03 7.03 0 0 1-2.79-.588zM5.21 3.088A7.03 7.03 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.94 1.72-2.64 3.238l-2.06-2.06a3.5 3.5 0 0 0-4.47-4.47L5.21 3.088z"></path>
        ) : (
          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"></path>
        )}
      </svg>
    </div>
  );
};

export default PasswordInput;
