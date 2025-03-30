import React from "react";
import StarRatings from "react-star-ratings";

const ListReviews = ({ reviews }) => {
  return (
    <div className="reviews w-3/4 m-auto mb-16">
      <h3 className="font-medium text-2xl my-3">Other's Reviews:</h3>
      <hr />
      {reviews?.map((review) => (
        <div key={review?._id} className="review-card my-3">
          <div className="flex my-3">
            <div className="mr-4">
              <img
                src={
                  review?.user?.avatar
                    ? review?.user?.avatar?.url
                    : "/images/default_avatar.jpg"
                }
                alt="User Name"
                width="50"
                height="50"
                className="rounded-full"
              />
            </div>
            <div>
              <div className="star-ratings flex space-x-1 text-left">
                <StarRatings
                  rating={review?.rating}
                  starRatedColor="#ffb829"
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  starSpacing="1px"
                />
              </div>
              <p className="text-sm font-normal text-slate-500 text-left">
                by {review?.user?.name ?? "Anonymous"}
              </p>
              <p className=" text-gray-700 pt-3 text-left">{review?.comment}</p>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ListReviews;
