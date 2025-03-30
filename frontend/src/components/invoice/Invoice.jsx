import React, { useEffect, useMemo } from "react";
import MetaData from "../layout/MetaData";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import { FaDownload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);
  
  const order = data?.order || {};
  const { shippingInfo, orderItems, paymentInfo, user } = order;

  // Handle error in a useEffect hook
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  // Memoizing calculated values
  const formattedCreatedAt = useMemo(() => {
    return new Date(order?.createdAt).toLocaleString("en-US");
  }, [order?.createdAt]);

  const handleDownload = async () => {
    try {
      const input = document.getElementById("order_invoice");
      const canvas = await html2canvas(input);
      const pdf = new jsPDF();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        0
      );
      pdf.save(`invoice_${order?._id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen mb-10 bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex justify-center space-x-4 ">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out flex items-center"
          aria-label="Download Invoice"
          onClick={handleDownload}
        >
          <FaDownload className="mr-2" />
          Download Invoice
        </button>
      </div>

      <MetaData title={"Order Invoice"} />

      <div
        id="order_invoice"
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="px-6 py-8 sm:p-10 bg-gradient-to-r from-orange-50 to-zinc-100">
          <div className="flex justify-between items-center mb-8">
            <img
              src="/images/logo5.png"
              alt="Company Logo"
              className="h-32 w-auto rounded-full"
            />
            <div className="text-right">
              <h2 className="text-3xl font-extrabold text-indigo-600">
                INVOICE
              </h2>
              <p className="text-gray-600 font-medium">INVOICE #{order?._id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bill To:
              </h3>
              <p className="text-gray-600">{user?.name}</p>
              <p className="text-gray-600">
                {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.zipCode}, {shippingInfo?.country}
              </p>
              <p className="text-gray-600">{shippingInfo?.phoneNo}</p>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{formattedCreatedAt}</p>
              <p className="text-gray-600">{paymentInfo?.status}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invoice Details:
              </h3>
              <p className="text-gray-600">ShopIT</p>
              <p className="text-gray-600">
                455 Foggy Heights, AZ 85004, US
              </p>
              <p className="text-gray-600">(602) 519-0450</p>
              <p className="text-gray-600">
                <a href="mailto:info@shopit.com">info@shopit.com</a>
              </p>
            </div>
          </div>

          <table className="w-full text-left mb-8" aria-label="Services Table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-gray-700 font-bold uppercase py-2">ID</th>
                <th className="text-gray-700 font-bold uppercase py-2">NAME</th>
                <th className="text-gray-700 font-bold uppercase py-2">PRICE</th>
                <th className="text-gray-700 font-bold uppercase py-2">QTY</th>
                <th className="text-gray-700 font-bold uppercase py-2">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item) => (
                <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td className="py-4 text-gray-700">{item?.product}</td>
                  <td className="py-4 text-gray-700">{item?.name}</td>
                  <td className="py-4 text-gray-700">฿{item?.price}</td>
                  <td className="py-4 text-gray-700">{item?.quantity}</td>
                  <td className="py-4 text-gray-700">฿{item?.price * item?.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-8">
            <div className="w-48">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">SUBTOTAL</span>
                <span className="text-gray-900">฿{order?.itemsPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">TAX(15%)</span>
                <span className="text-gray-900">฿{order?.taxAmount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">SHIPPING</span>
                <span className="text-gray-900">฿{order?.shippingAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-indigo-600">฿{order?.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Terms and Payment Information
            </h3>
            <p className="text-gray-600 mb-2">
              A finance charge of 1.5% will be made on unpaid balances after 30 days.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
};


export default Invoice;
