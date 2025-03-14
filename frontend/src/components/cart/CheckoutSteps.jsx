import React from "react";
import { Link } from "react-router-dom";

const steps = [
  { label: "Shipping", path: "/shipping", key: "shipping" },
  { label: "Confirm Order", path: "/confirm_order", key: "confirmOrder" },
  { label: "Payment", path: "/payment_method", key: "payment" },
];

const CheckoutSteps = (props) => {
  return (
    <div className="flex justify-center mt-5 space-x-4">
      {steps.map(({ label, path, key }) => (
        <Link
          key={key}
          to={props[key] ? path : "#!"}
          className={`text-sm font-medium px-4 py-2 border-b-4 transition-all duration-300 ${
            props[key]
              ? "border-blue-500 text-blue-600"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default CheckoutSteps;
