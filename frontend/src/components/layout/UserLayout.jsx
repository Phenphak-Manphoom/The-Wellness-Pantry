import React from "react";
import { User, Lock, Image, Pencil } from "lucide-react";
import SideMenu from "./SideMenu";

const UserLayout = ({ children }) => {
  const userMenuItems = [
    { name: "Profile", url: "/me/profile", icon: <User size={20} /> },
    {
      name: "Update Profile",
      url: "/me/update_profile",
      icon: <Pencil size={20} />,
    },
    {
      name: "Upload Avatar",
      url: "/me/upload_avatar",
      icon: <Image size={20} />,
    },
    {
      name: "Update Password",
      url: "/me/update_password",
      icon: <Lock size={20} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center font-bold text-2xl">User Settings</h2>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-x-8 mx-auto max-w-6xl">
          <div className="w-full lg:w-1/4 mt-10">
            <SideMenu menuItems={userMenuItems} />
          </div>
          <div className="w-full lg:w-3/4 user-dashboard">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
