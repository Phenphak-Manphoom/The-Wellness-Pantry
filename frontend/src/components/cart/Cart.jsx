import React from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { setCartItem, removeCartItem } from "../../redux/features/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const increaseQty = (item, quantity) => {
    const newQty = quantity + 1;
    if (newQty > item?.stock) return;
    setItemToCart(item, newQty);
  };

  const decreaseQty = (item, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    setItemToCart(item, newQty);
  };

  const setItemToCart = (item, newQty) => {
    const cartItem = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      stock: item?.stock,
      quantity: newQty,
    };

    dispatch(setCartItem(cartItem));
  };

  const removeCartItemHandler = (id) => {
    dispatch(removeCartItem(id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MetaData title={"Your Cart"} />

      {/* ทำให้ส่วนนี้ขยายเต็มพื้นที่ที่เหลือ */}
      <div className="flex-grow">
        {cartItems?.length === 0 ? (
          <h2 className="mt-5 text-center text-xl font-semibold">
            Your Cart is Empty
          </h2>
        ) : (
          <>
            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              Your Cart: <b>{cartItems?.length} items</b>
            </h2>

            <div className="flex flex-col lg:flex-row justify-between">
              <div className="w-full lg:w-2/3">
                {cartItems?.map((item) => (
                  <div key={item.product}>
                    <hr className="my-4 border-gray-300" />
                    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-md">
                      <div className="w-24 h-24">
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 px-4">
                        <Link
                          to={`/products/${item?.product}`}
                          className="text-lg font-medium text-blue-600 hover:underline"
                        >
                          {item?.name}
                        </Link>
                      </div>

                      <div className="text-lg font-semibold text-gray-700">
                        ${item?.price}
                      </div>

                      <div className="flex items-center">
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md"
                          onClick={() => decreaseQty(item, item.quantity)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="w-12 text-center border border-gray-300 mx-2 rounded-md"
                          value={item?.quantity}
                          readOnly
                        />
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded-md"
                          onClick={() => increaseQty(item, item.quantity)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-red-600 hover:text-red-800 mx-4 text-2xl"
                        onClick={() => removeCartItemHandler(item?.product)}
                      >
                        <RiDeleteBin6Fill />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-1/3 mt-6 lg:mt-0 p-6 bg-white shadow-md rounded-md">
                <h4 className="text-xl font-semibold mb-4">Order Summary</h4>
                <hr className="border-gray-300 mb-4" />
                <p className="text-lg">
                  Units:{" "}
                  <span className="font-semibold">
                    {cartItems?.reduce((acc, item) => acc + item?.quantity, 0)}{" "}
                    (Units)
                  </span>
                </p>
                <p className="text-lg mt-2">
                  Est. total:{" "}
                  <span className="font-semibold text-green-600">
                    $
                    {cartItems
                      ?.reduce(
                        (acc, item) => acc + item?.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>
                <hr className="border-gray-300 my-4" />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600">
                  Check out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
