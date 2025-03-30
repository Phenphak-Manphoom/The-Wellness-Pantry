import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { calculateOrderCost } from "../../helpers/helpers";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/api/orderApi.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();
  const [
    stripeCheckoutSession,
    { data: checkoutData, error: checkoutError, isLoading },
  ] = useStripeCheckoutSessionMutation();

  useEffect(() => {
    if (checkoutData) {
      window.location.href = checkoutData?.url;
    }

    if (checkoutError) {
      toast.error(checkoutError?.data?.message || "Payment failed.");
    }
  }, [checkoutData, checkoutError]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Order creation failed.");
    }

    if (isSuccess) {
      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess, navigate]);

  const handlePaymentMethodChange = (method) => {
    setMethod(method);
  };

  const createOrder = (paymentMethod) => {
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCost(cartItems);
    const orderData = {
      shippingInfo,
      orderItems: cartItems,
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: totalPrice,
    };

    if (paymentMethod === "COD") {
      createNewOrder({
        ...orderData,
        paymentMethod: "COD",
        paymentInfo: { status: "Not Paid" },
      });
    } else if (paymentMethod === "Card") {
      stripeCheckoutSession(orderData);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!method) {
      toast.error("Please select a payment method.");
      return;
    }

    createOrder(method);
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
              {["COD", "Card"].map((payMethod) => (
                <label
                  key={payMethod}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment_mode"
                    value={payMethod}
                    className="w-4 h-4 accent-blue-600"
                    onChange={() => handlePaymentMethodChange(payMethod)}
                  />
                  <span>
                    {payMethod === "COD"
                      ? "Cash on Delivery"
                      : "Card - VISA, MasterCard"}
                  </span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={isLoading || !method}
            >
              {isLoading ? "Processing..." : "CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
