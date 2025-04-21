import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Table } from "flowbite-react";
import { FaImage, FaPencilAlt, FaTrash } from "react-icons/fa";
import CustomPagination from "../layout/CustomPagination";
import { debounce } from "lodash";

const ListProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error } = useGetAdminProductsQuery({
    page: currentPage,
    limit: entriesPerPage,
    keyword,
    sortBy,
    order,
  });

  const [
    deleteProduct,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteProductMutation();

  const debouncedSetKeyword = useMemo(
    () => debounce((value) => setKeyword(value), 500),
    []
  );

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setSearchParams({ page: "1" });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const [newSortBy, newOrder] = value.split(",");
    setSortBy(newSortBy);
    setOrder(newOrder);
    setSearchParams({ page: "1" });
  };

  const deleteProductHandler = (id) => {
    deleteProduct(id);
  };

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(deleteError?.data?.message);
    if (isSuccess) toast.success("Product Deleted");
  }, [error, deleteError, isSuccess]);

  if (isLoading) return <Loader />;

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalProducts);

  return (
    <AdminLayout>
      <MetaData title="All Products" />
      <div className="flex flex-col items-center min-h-screen">
        <h1 className="my-5 text-xl font-bold text-left w-full max-w-6xl px-4">
          {totalProducts} Products
        </h1>

        {/* Filters: Show Entries, Search, Sort */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 w-full max-w-6xl px-4 gap-3">
          <div className="flex items-center gap-2">
            <label>Show</label>
            <select
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className="border border-gray-300 rounded-md p-1"
            >
              {[5, 10, 25].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <input
            type="text"
            placeholder="Search"
            onChange={(e) => debouncedSetKeyword(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          />

          <select
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="createdAt,desc">Newest First</option>
            <option value="createdAt,asc">Oldest First</option>
            <option value="name,asc">Name A-Z</option>
            <option value="name,desc">Name Z-A</option>
            <option value="stock,asc">Stock: Low to High</option>
            <option value="stock,desc">Stock: High to Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full max-w-6xl px-4 mb-5">
          <Table className="w-full text-sm text-left text-gray-700">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Stock</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <Table.Row key={product._id}>
                    <Table.Cell>{product._id}</Table.Cell>
                    <Table.Cell>
                      {product.name?.length > 30
                        ? product.name.slice(0, 30) + "..."
                        : product.name}
                    </Table.Cell>
                    <Table.Cell>{product.stock}</Table.Cell>
                    <Table.Cell className="space-x-2">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        <FaPencilAlt className="inline w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/products/${product._id}/upload_images`}
                        className="text-green-600 hover:underline"
                      >
                        <FaImage className="inline w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProductHandler(product._id)}
                        disabled={isDeleteLoading}
                        className="text-red-600 hover:underline"
                      >
                        <FaTrash className="inline w-4 h-4" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={4} className="text-center py-4 text-lg">
                    No products found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Showing entries */}
        <div className="w-full max-w-6xl px-4 flex justify-between">
          <div>
            Showing {startEntry} to {endEntry} of {totalProducts} entries
          </div>
        </div>

        {/* Pagination */}
        <CustomPagination
          resPerPage={entriesPerPage}
          filteredProductsCount={totalProducts}
        />
      </div>
    </AdminLayout>
  );
};

export default ListProducts;
