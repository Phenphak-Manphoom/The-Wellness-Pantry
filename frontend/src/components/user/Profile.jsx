import React, { useMemo } from "react";
import UserLayout from "../layout/UserLayout";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  // ใช้ useMemo เพื่อจำค่าภาพโปรไฟล์และข้อมูลผู้ใช้
  const avatarUrl = useMemo(() => {
    return user?.avatar?.url || "/images/default_avatar.jpg";
  }, [user?.avatar]);

  if (!user) {
    return <div>Loading...</div>; // ถ้าไม่มีข้อมูลผู้ใช้
  }

  return (
    <UserLayout>
      <MetaData title={"Your Profile"} />
      <div className="flex flex-col md:flex-row justify-evenly mt-5 items-center user-info">
        <div className="w-full md:w-1/3 flex justify-center">
          <figure className="w-full h-full md:w-56 md:h-56">
            <img
              className="rounded-full object-cover w-full h-full"
              src={avatarUrl}
              alt={user?.name}
            />
          </figure>
        </div>

        <div className="w-full md:w-2/5 text-center md:text-left">
          <h4 className="font-semibold text-2xl text-slate-600">Full Name</h4>
          <p className="mb-4">{user?.name}</p>

          <h4 className="font-semibold text-2xl text-slate-600">
            Email Address
          </h4>
          <p className="mb-4">{user?.email}</p>

          <h4 className="font-semibold text-2xl text-slate-600">Joined On</h4>
          <p>{user?.createdAt?.substring(0, 10)}</p>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
