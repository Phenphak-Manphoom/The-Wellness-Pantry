import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { countries } from "countries-list";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../redux/features/cartSlice";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);
  const countriesList = Object.values(countries);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (shippingInfo) {
      setValue("address", shippingInfo.address);
      setValue("city", shippingInfo.city);
      setValue("zipCode", shippingInfo.zipCode);
      setValue("phoneNo", shippingInfo.phoneNo);
      setValue("country", shippingInfo.country);
    }
  }, [shippingInfo, setValue]);

  const onSubmit = (data) => {
    dispatch(saveShippingInfo(data));
    navigate("/confirm_order");
  };

  return (
    <>
      <MetaData title="Shipping Info" />
      <CheckoutSteps shipping />

      <div className="flex justify-center min-h-screen items-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Shipping Info
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register("city", { required: "City is required" })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone No
              </label>
              <input
                type="tel"
                {...register("phoneNo", {
                  required: "Phone number is required",
                })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phoneNo && (
                <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="number"
                {...register("zipCode", { required: "Zip Code is required" })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                {...register("country", { required: "Country is required" })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Country</option>
                {countriesList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
