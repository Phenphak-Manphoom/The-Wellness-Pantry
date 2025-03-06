import React, { useMemo } from "react";
import SideMenu from "./SideMenu";

const UserLayout = ({ children }) => {
  const sideMenu = useMemo(() => <SideMenu />, []); // จำผลของ SideMenu หากไม่ต้องการให้รีเรนเดอร์ใหม่ทุกครั้ง

  return (
    <div className="min-h-screen">
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center font-bold text-2xl">User Settings</h2>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-x-8 mx-auto max-w-6xl">
          <div className="w-full lg:w-1/4 mt-10">{sideMenu}</div>{" "}
          {/* ใช้ useMemo */}
          <div className="w-full lg:w-3/4 user-dashboard">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
