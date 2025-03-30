import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(id);
  const order = data?.order || {};

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;
  const isPaid = paymentInfo?.status === "paid";

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="Order Details" />
      <div className="flex justify-center mt-5">
        <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
          {/* Invoice Button */}
          <div className="flex justify-end mb-4">
            <a
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              href={`/invoice/order/${order?._id}`}
            >
              <i className="fa fa-print"></i> Invoice
            </a>
          </div>

          {/* Order Details Table */}
          <h3 className="text-xl font-semibold mb-4 text-left">
            Your Order Details
          </h3>
          <table className="min-w-full table-auto border mb-6 text-left">
            <tbody>
              <tr>
                <th className="px-4 py-2 t border">ID</th>
                <td className="px-4 py-2 border ">{order?._id}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left border">Status</th>
                <td
                  className={`px-4 py-2  border ${
                    isPaid ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {orderStatus}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2  border">Date</th>
                <td className="px-4 py-2 border ">
                  {new Date(order?.createdAt).toLocaleString("en-US")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Shipping Info Table */}
          <h3 className="text-xl font-semibold mb-4 text-left">
            Shipping Info
          </h3>
          <table className="min-w-full table-auto border mb-6 text-left">
            <tbody>
              <tr>
                <th className="px-4 py-2 text-left border">Name</th>
                <td className="px-4 py-2 border">{user?.name}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left border">Phone No</th>
                <td className="px-4 py-2 border">{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left border">Address</th>
                <td className="px-4 py-2 border">
                  {shippingInfo?.address}, {shippingInfo?.city},{" "}
                  {shippingInfo?.zipCode}, {shippingInfo?.country}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Info Table */}
          <h3 className="text-xl font-semibold mb-4 text-left">Payment Info</h3>
          <table className="min-w-full table-auto border mb-6 text-left">
            <tbody>
              <tr>
                <th className="px-4 py-2 text-left border">Status</th>
                <td
                  className={`px-4 py-2 border ${
                    isPaid ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {paymentInfo?.status}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left border">Method</th>
                <td className="px-4 py-2 border">{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left border">Stripe ID</th>
                <td className="px-4 py-2 border">
                  {paymentInfo?.id || "Nill"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left border">Amount Paid</th>
                <td className="px-4 py-2 border">฿{totalAmount}</td>
              </tr>
            </tbody>
          </table>

          {/* Order Items Table */}
          <h3 className="text-xl font-semibold mb-4 text-left">Order Items</h3>
          <table className="min-w-full table-auto border mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 border text-center">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-16 h-24 object-contain"
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <Link
                      to={`/products/${item?.product}`}
                      className="text-blue-500 hover:underline"
                    >
                      {item?.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    ฿{item?.price}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {item?.quantity} Piece(s)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
