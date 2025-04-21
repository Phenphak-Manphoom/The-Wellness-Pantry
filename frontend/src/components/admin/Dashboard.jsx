import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SalesChart from "../charts/SalesChart";
import { useLazyGetDashboardSalesQuery } from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  const [getDashboardSales, { error, isLoading, data }] =
    useLazyGetDashboardSalesQuery();

  useEffect(() => {
    if (startDate && endDate && !data) {
      fetchSalesData();
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to fetch sales data");
    }
  }, [error]);

  const fetchSalesData = () => {
    getDashboardSales({
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title="Admin Dashboard" />

      {/* Date Pickers & Fetch Button */}
      <div className="flex flex-wrap items-end gap-4 px-4 pt-6">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border border-gray-300 rounded px-3 py-2 w-44"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border border-gray-300 rounded px-3 py-2 w-44"
          />
        </div>
        <button
          onClick={fetchSalesData}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Fetch
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-10">
        <div className="bg-green-500 text-white rounded shadow p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Sales</h3>
          <p className="text-3xl font-bold">฿{data?.totalSales?.toFixed(2)}</p>
        </div>

        <div className="bg-red-500 text-white rounded shadow p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Orders</h3>
          <p className="text-3xl font-bold">{data?.totalNumOrders}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="px-4 my-12">
        <SalesChart salesData={data?.sales} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
