import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { calculateOrderCost } from "../../helpers/helpers";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");

  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      navigate("/");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCost(cartItems);

    if (method === "COD") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: { status: "Not Paid" },
        paymentMethod: "COD",
      };
      createNewOrder(orderData);
    }

    if (method === "Card") {
      alert("Card");
    }
  };

  return (
    <>
      <MetaData title="Payment Method" />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={submitHandler}>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Select Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment_mode"
                  value="COD"
                  className="w-4 h-4 accent-blue-600"
                  onChange={(e) => setMethod("COD")}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Card"
                  className="w-4 h-4 accent-blue-600"
                  onChange={(e) => setMethod("Card")}
                />
                <span>Card - VISA, MasterCard</span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
