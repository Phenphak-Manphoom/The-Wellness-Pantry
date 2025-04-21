import React, { useEffect, useMemo, useState } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import { Table } from "flowbite-react";
import { FaEye, FaPrint } from "react-icons/fa";
import CustomPagination from "../layout/CustomPagination";
import { debounce } from "lodash";

const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderSuccess = searchParams.get("order_success");

  const entriesPerPageOptions = [5, 10, 25];
  const currentPage = Number(searchParams.get("page")) || 1;
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, orderSuccess, dispatch, navigate]);

  // Debounced search term update to avoid unnecessary re-renders
  const debouncedSearchTerm = useMemo(
    () => debounce((term) => setSearchTerm(term), 500),
    []
  );

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setSearchParams({ page: "1" });
  };

  // Memoize total orders and displayed orders
  const totalOrders = useMemo(() => data?.orders?.length || 0, [data]);
  const displayedOrders = useMemo(() => {
    return data?.orders
      ?.filter((order) => order?._id.includes(searchTerm))
      .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  }, [data?.orders, searchTerm, currentPage, entriesPerPage]);

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalOrders);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"My Orders"} />
      <div className="flex flex-col items-center min-h-screen">
        <h1 className="my-5 text-xl font-bold text-left w-full max-w-4xl px-4">
          {totalOrders} Orders
        </h1>

        {/* Show Entries and Search */}
        <div className="flex justify-between mb-4 w-full max-w-4xl px-4">
          <div className="flex items-center">
            <label className="mr-2">Show</label>
            <select
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className="border border-gray-300 rounded-md p-1"
            >
              {entriesPerPageOptions.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => debouncedSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto w-full max-w-4xl px-4 mb-5">
          <Table className="w-full text-sm text-left text-gray-500">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Payment Status</Table.HeadCell>
              <Table.HeadCell>Order Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200">
              {displayedOrders?.length > 0 ? (
                displayedOrders.map((order) => (
                  <Table.Row key={order._id}>
                    <Table.Cell>{order?._id}</Table.Cell>
                    <Table.Cell>฿{order?.totalAmount}</Table.Cell>
                    <Table.Cell>
                      {order?.paymentInfo?.status?.toUpperCase()}
                    </Table.Cell>
                    <Table.Cell>{order?.orderStatus}</Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/me/order/${order._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        <FaEye className="w-5 h-5 inline" />
                      </Link>
                      <Link
                        to={`/invoice/order/${order._id}`}
                        className="text-green-600 hover:underline ml-2"
                      >
                        <FaPrint className="w-5 h-5 inline" />
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell
                    colSpan={5}
                    className="text-center py-4 text-2xl font-medium"
                  >
                    You have no orders yet
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Showing entries */}
        <div className="w-full max-w-4xl px-4 flex justify-between">
          <div>
            Showing {startEntry} to {endEntry} of {totalOrders} entries
          </div>
        </div>

        {/* Pagination */}
        <CustomPagination
          resPerPage={entriesPerPage}
          filteredProductsCount={totalOrders}
        />
      </div>
    </>
  );
};

export default MyOrders;
