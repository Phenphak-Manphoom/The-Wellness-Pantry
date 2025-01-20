import { useState } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-[#527210] p-2">
      {/* Logo Section */}
      <div className="w-full md:w-1/4 flex justify-start md:pl-5 mb-4 md:mb-0">
        <a href="/">
          <img
            src="../images/logo5.png"
            alt="The Wellness Pantry Logo"
            className="h-16 w-auto object-contain"
          />
        </a>
      </div>

      {/* User and Cart Section */}
      <div className="w-full md:w-1/4 flex flex-col md:flex-row items-center justify-center mt-4 md:mt-0 text-center space-y-4 md:space-y-0 md:space-x-4">
        <button
          type="button"
          className="relative inline-flex items-center p-3 text-base font-medium text-center text-white"
        >
          Cart
          <span className="sr-only">Notifications</span>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#f1c60b] border-2 border-white rounded-full -top-2 -end-2">
            20
          </div>
        </button>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            className="flex items-center text-white px-4 py-2"
            onClick={toggleDropdown}
          >
            <img
              src="../images/default_avatar.jpg"
              alt="User Avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>User</span>
            <svg
              className="w-4 h-4 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`absolute right-0 mt-2 bg-[#f1c60b] border z-50 border-gray-200 rounded-md shadow-lg w-48 ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            <a
              href="/admin/dashboard"
              className="block px-4 py-2 text-white hover:bg-[#527210]"
            >
              Dashboard
            </a>
            <a
              href="/me/orders"
              className="block px-4 py-2 text-white hover:bg-[#527210]"
            >
              Orders
            </a>
            <a
              href="/me/profile"
              className="block px-4 py-2 text-white hover:bg-[#527210]"
            >
              Profile
            </a>
            <a
              href="/"
              className="block px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        </div>

        <a
          href="/login"
          className="px-4 py-2 bg-[#f1c60b] text-white rounded-md"
        >
          Login
        </a>
      </div>
    </nav>
  );
};

export default Header;
