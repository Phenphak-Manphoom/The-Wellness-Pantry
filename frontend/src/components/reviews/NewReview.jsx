import React, { useEffect, useRef, useState } from "react";
import StarRatings from "react-star-ratings";
import {
  useCanUserReviewQuery,
  useSubmitReviewMutation,
} from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";

const NewReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitReview, { isLoading, error, isSuccess }] =
    useSubmitReviewMutation();
  const { data } = useCanUserReviewQuery(productId);
  const canReview = data?.canReview;

  const modalRef = useRef(null); // ใช้ useRef แทนการใช้ document.getElementById

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review Posted");
    }
  }, [error, isSuccess]);

  const submitHandler = () => {
    const reviewData = { rating, comment, productId };
    submitReview(reviewData);
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("hidden");
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.add("hidden");
    }
  };

  return (
    <div className="w-full flex justify-start">
      {canReview && (
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition"
          onClick={openModal}
        >
          Submit Your Review
        </button>
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-lg font-semibold">Submit Review</h5>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          <StarRatings
            rating={rating}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            changeRating={(e) => setRating(e)}
          />

          <textarea
            name="review"
            className="w-full border p-2 rounded mt-4"
            placeholder="Enter your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button
            className="bg-green-500 text-white w-full py-2 rounded mt-4 hover:bg-green-600 transition"
            onClick={() => {
              submitHandler();
              closeModal(); // ปิด modal หลังจาก submit
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReview;
