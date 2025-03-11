import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import MetaData from "../layout/MetaData";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;
  const navigate = useNavigate();
  const [register, { isLoading, error, data }] = useRegisterMutation();

  useEffect(() => {
    if (data) {
      toast.success("Register successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // ✅ ไปหน้า Login หลังสมัครเสร็จ
    }
  }, [data, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    register({ name, email, password });
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <MetaData title={"Register"} />
      <section className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8">
            <h2 className="font-bold text-3xl text-[#002D74]">Register</h2>
            <p className="text-sm mt-4 text-[#002D74]">
              If you already a member, easily{" "}
              <a href="/login" className="font-bold">
                log in now.
              </a>
            </p>

            <form className="flex flex-col gap-4" onSubmit={submitHandler}>
              <input
                className="p-2 mt-8 rounded-xl border"
                type="text"
                name="name"
                value={name}
                placeholder="Name"
                onChange={onChange}
              />
              <input
                className="p-2 rounded-xl border"
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={onChange}
              />
              <PasswordInput
                name="password"
                value={password}
                onChange={onChange}
              />
              <button
                className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Register"}
              </button>
            </form>
          </div>
          <div className="md:block hidden w-1/2">
            <img
              className="rounded-2xl max-h-[1600px]"
              src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="register form image"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
