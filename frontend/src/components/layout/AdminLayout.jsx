import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  FileText,
  Users,
  Star,
} from "lucide-react";
import SideMenu from "./SideMenu";

const AdminLayout = ({ children }) => {
  const adminMenuItems = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboard size={20} className="mr-2" />,
    },
    {
      name: "New Product",
      url: "/admin/product/new",
      icon: <PlusCircle size={20} className="mr-2" />,
    },
    {
      name: "Products",
      url: "/admin/products",
      icon: <Package size={20} className="mr-2" />,
    },
    {
      name: "Orders",
      url: "/admin/orders",
      icon: <FileText size={20} className="mr-2" />,
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: <Users size={20} className="mr-2" />,
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: <Star size={20} className="mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center font-bold text-2xl">Admin Panel</h2>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-x-8 mx-auto max-w-6xl">
          <div className="w-full lg:w-1/4 mt-10">
            <SideMenu menuItems={adminMenuItems} />
          </div>
          <div className="w-full lg:w-3/4 admin-dashboard">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
