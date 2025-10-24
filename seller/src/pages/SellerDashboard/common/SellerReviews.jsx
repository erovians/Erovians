import React from "react";
import { StarIcon } from "lucide-react";

export default function ReviewSection() {
  const reviews = [
    {
      id: 1,
      name: "John Doe",
      date: "October 20, 2025",
      rating: 5,
      comment:
        "Amazing product! The quality is outstanding and delivery was super fast.",
    },
    {
      id: 2,
      name: "Emily Carter",
      date: "October 18, 2025",
      rating: 4,
      comment:
        "Really good, but packaging could be better. Overall satisfied with my purchase!",
    },
    {
      id: 3,
      name: "Michael Smith",
      date: "October 15, 2025",
      rating: 5,
      comment: "Exceeded my expectations. Highly recommend!",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Reviews Section */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{review.name}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`w-5 h-5 ${
                      index < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={index < review.rating ? "#FACC15" : "none"}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{review.comment}</p>
            <p className="text-sm text-gray-400 mt-1">{review.date}</p>
          </div>
        ))}
      </div>

      {/* Add Review Box (Read-Only Style) */}
      <div className="mt-8 border-t pt-5">
        <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-gray-500 text-sm">
            You must be logged in to post a review.
          </p>
        </div>
      </div>
    </div>
  );
}
