import React from "react";
import { Link, useLocation } from "react-router-dom";

import classNames from "classnames"; // สำหรับจัดการคลาส

const SideMenu = ({ menuItems }) => {
  const location = useLocation();

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
          {menuItem.icon &&
            (typeof menuItem.icon === "string" ? (
              <i className={`${menuItem.icon} mr-2`} />
            ) : (
              <span className="mr-2">{menuItem.icon}</span>
            ))}
          {menuItem.name}
        </Link>
      ))}
    </div>
  );
};

export default SideMenu;
