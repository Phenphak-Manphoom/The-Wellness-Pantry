import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import MetaData from "../layout/MetaData";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (error) toast.error(error?.data?.message);
  }, [isAuthenticated, error, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <>
      <MetaData title={"Login"} />
      <section className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8">
            <h2 className="font-bold text-3xl text-[#002D74]">Login</h2>
            <p className="text-sm mt-4 text-[#002D74]">
              If you are already a member, log in now.
            </p>

            <form className="flex flex-col gap-4" onSubmit={submitHandler}>
              <input
                className="p-2 mt-8 rounded-xl border"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
              />
              <PasswordInput
                name="password" // ✅ เพิ่ม name
                value={formData.password}
                onChange={handleChange}
              />
              <button
                className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </button>
            </form>

            <div className="mt-10 text-sm border-b border-gray-500 py-5">
              <a href="/password/forgot">Forgot password?</a>
            </div>

            <div className="mt-4 text-sm flex justify-between items-center">
              <p>If you don't have an account..</p>
              <a
                href="/register"
                className="text-white bg-[#002D74] rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
              >
                Register
              </a>
            </div>
          </div>
          <div className="md:block hidden w-1/2">
            <img
              className="rounded-2xl"
              src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="Login"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
