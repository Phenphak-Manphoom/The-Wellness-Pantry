import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Lock, Image, Pencil } from "lucide-react"; // Import ไอคอน
import classNames from "classnames"; // สำหรับจัดการคลาส

const SideMenu = () => {
  const location = useLocation();

  const menuItems = useMemo(
    () => [
      {
        name: "Profile",
        url: "/me/profile",
        icon: <User size={20} className="mr-2" />,
      },
      {
        name: "Update Profile",
        url: "/me/update_profile",
        icon: <Pencil size={20} className="mr-2" />,
      },
      {
        name: "Upload Avatar",
        url: "/me/upload_avatar",
        icon: <Image size={20} className="mr-2" />,
      },
      {
        name: "Update Password",
        url: "/me/update_password",
        icon: <Lock size={20} className="mr-2" />,
      },
    ],
    []
  );

  return (
    <div className="m-auto space-y-2">
      {menuItems.map((menuItem) => (
        <Link
          key={menuItem.url}
          to={menuItem.url}
          className={classNames(
            "flex items-center px-4 py-2 font-bold rounded-lg transition duration-200",
            {
              "bg-blue-500 text-white": location.pathname.includes(
                menuItem.url
              ),
              "bg-gray-100 text-gray-700 hover:bg-gray-200":
                !location.pathname.includes(menuItem.url),
            }
          )}
        >
          {menuItem.icon} {menuItem.name}
        </Link>
      ))}
    </div>
  );
};

export default SideMenu;
