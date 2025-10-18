import React, { useState } from "react";
import { StarIcon } from "lucide-react"; 


const mockReviews = [
  {
    id: 1,
    name: "Jane Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    rating: 5,
    date: "2025-10-15",
    comment: "Amazing service! Highly recommend.",
    image:  "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "https://i.pravatar.cc/40?img=2",
    rating: 4,
    date: "2025-10-10",
    comment: "Very good, but can improve delivery time.",
  },
  {
    id: 3,
    name: "John Smith",
    avatar: "https://i.pravatar.cc/40?img=2",
    rating: 4,
    date: "2025-10-10",
    comment: "Very good, but can improve delivery time.",
  },
];

export default function ReviewSection() {
  const [reviews, setReviews] = useState(mockReviews);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || newReview.comment.trim() === "") return;

    const review = {
      id: Date.now(),
      name: "Current User",
      avatar: "https://i.pravatar.cc/40",
      rating: newReview.rating,
      date: new Date().toISOString(),
      comment: newReview.comment,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: "" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-sm space-y-8">
      {/* Summary */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Reviews</h2>
        <p className="text-yellow-500 text-xl font-bold mt-2 flex items-center justify-center">
          {averageRating.toFixed(1)}
          <StarIcon className="w-5 h-5 ml-1" />
        </p>
        <p className="text-gray-500">{reviews.length} reviews</p>
      </div>

      {/* Write a review */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md space-y-4">
        <h3 className="font-semibold text-gray-700">Write a Review</h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`w-6 h-6 cursor-pointer ${
                newReview.rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              strokeWidth={2}
              fill={newReview.rating >= star ? "#FACC15" : "none"}
            />
          ))}
        </div>

        {/* Comment */}
        <textarea
          rows={3}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Share your thoughts..."
          value={newReview.comment}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, comment: e.target.value }))
          }
        />

        <button
          type="submit"
          className="bg-navyblue text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">{review.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-4 h-4 ${
                    review.rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                  strokeWidth={2}
                  fill={review.rating >= star ? "#FACC15" : "none"}
                />
              ))}
            </div>

            <p className="text-gray-700">{review.comment}</p>

            {review.image && (
              <div className="mt-3">
                <img
                  src={review.image}
                  alt="Review"
                  className="max-w-xs rounded border"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
