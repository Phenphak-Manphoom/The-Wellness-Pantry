import React from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { calculateOrderCost } from "../../helpers/helpers";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

  return (
    <>
      <MetaData title={"Confirm Order Info"} />
      <CheckoutSteps shipping confirmOrder />

      <div className="flex flex-col min-h-screen mx-20 mt-6 text-left lg:flex-row justify-between px-5 gap-6 items-start">
        {/* Shipping Info & Cart Items */}
        <div className="lg:w-2/3 mt-5 flex flex-col flex-grow ">
          <h4 className="mb-3 font-semibold text-lg">Shipping Info</h4>
          <p>
            <b>Name:</b> {user?.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo?.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b> {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.zipCode}, {shippingInfo?.country}
          </p>
          <hr className="my-4" />

          <h4 className="mt-4 font-semibold text-lg">Your Cart Items:</h4>
          {cartItems?.map((item) => (
            <div
              key={item.product}
              className="flex items-center justify-between py-2 border-b"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <Link
                to={`/product/${item.product}`}
                className="flex-1 ml-4 text-blue-600 hover:underline"
              >
                {item.name}
              </Link>
              <p>
                {item.quantity} x ฿{item.price} ={" "}
                <b>฿{(item.quantity * item.price).toFixed(2)}</b>
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 mt-5 ml-3 bg-gray-100 p-6 rounded-lg shadow-md self-start">
          <h4 className="font-semibold text-lg">Order Summary</h4>
          <hr className="my-2" />
          <p>
            Subtotal: <span className="font-semibold">฿{itemsPrice}</span>
          </p>
          <p>
            Shipping: <span className="font-semibold">฿{shippingPrice}</span>
          </p>
          <p>
            Tax: <span className="font-semibold">฿{taxPrice}</span>
          </p>
          <hr className="my-2" />
          <p className="text-lg font-bold">
            Total: <span>฿{totalPrice}</span>
          </p>
          <hr className="my-4" />
          <Link
            to="/payment_method"
            className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Proceed to Payment
          </Link>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
