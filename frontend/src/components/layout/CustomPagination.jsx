import React from "react";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageCount = Math.max(1, Math.ceil(filteredProductsCount / resPerPage));

  const handlePageClick = ({ selected }) => {
    const newPage = selected + 1; // ReactPaginate นับหน้าเริ่มจาก 0
    if (newPage > 1) {
      searchParams.set("page", newPage);
    } else {
      searchParams.delete("page"); // ลบ page=1 ออกจาก URL
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex justify-center mt-4">
      {filteredProductsCount > resPerPage && (
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          forcePage={page > 0 ? page - 1 : 0}
          containerClassName="flex space-x-2 mb-10"
          pageLinkClassName="px-4 py-2 border rounded-full text-gray-700 hover:bg-orange-300 hover:text-black"
          activeLinkClassName="bg-orange-500 text-white"
          previousLabel="Prev"
          nextLabel="Next"
        />
      )}
    </div>
  );
};

export default CustomPagination;
