import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useLogoutMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const { isLoading } = useGetMeQuery(undefined, { skip: !!user });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logoutHandler = async () => {
    try {
      await logout().unwrap(); // ✅ รอให้ API logout ทำงานเสร็จ
      navigate(0); // รีโหลดหน้าใหม่
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-[#527210] p-2">
      {/* Logo Section */}
      <div className="w-full md:w-1/4 flex justify-start md:pl-5 mb-4 md:mb-0">
        <Link to="/">
          <img
            src="/images/logo5.png"
            alt="The Wellness Pantry Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>
      </div>

      {/* User and Cart Section */}
      <div className="w-full md:w-1/4 flex flex-col md:flex-row items-center justify-center mt-4 md:mt-0 text-center space-y-4 md:space-y-0 md:space-x-4">
        <a
          href="/cart"
          type="button"
          className="relative inline-flex items-center p-3 mr-4 text-base font-medium text-center text-white"
        >
          Cart
          <span className="sr-only">Notifications</span>
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#f1c60b] border-2 border-white rounded-full -top-2 -end-2">
            {cartItems.length}
          </div>
        </a>

        {/* Dropdown Menu */}
        {user ? (
          <div className="relative">
            <button
              className="flex items-center text-white px-4 py-2"
              onClick={toggleDropdown}
            >
              <img
                src={user?.avatar?.url || "/images/default_avatar.jpg"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{user?.name}</span>
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
              className={`absolute right-0 mt-2 bg-[#f1c60b] border z-50 border-gray-200 rounded-md shadow-lg w-48 transition-opacity duration-300 ${
                isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 text-white hover:bg-[#527210]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/me/orders"
                className="block px-4 py-2 text-white hover:bg-[#527210]"
                onClick={() => setIsDropdownOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/me/profile"
                className="block px-4 py-2 text-white hover:bg-[#527210]"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/"
                className="block px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={() => {
                  logoutHandler();
                  setIsDropdownOpen(false);
                }}
              >
                Logout
              </Link>
            </div>
          </div>
        ) : (
          !isLoading && (
            <Link
              to="/login"
              className="px-4 py-2  bg-[#f1c60b] text-white rounded-md"
            >
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Header;
