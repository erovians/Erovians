import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";
import { MessageCircle, Eye, X } from "lucide-react"; // Lucide icons

const Inquries = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await api.get(`/inquiry/sellerquote`);
        setQuotations(res.data.quotations);
      } catch (error) {
        console.error("Error fetching quotations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading quotations...</p>;

  if (quotations.length === 0)
    return <p className="text-center text-gray-600">No quotations found.</p>;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-8 lg:px-16">
      <h2 className="text-3xl font-bold text-navyblue mb-10 text-center pb-2 border-b-4 border-blue-100 inline-block">
        Received Quotations
      </h2>

      <div className="space-y-8">
        {quotations.map((q) => (
          <div
            key={q._id}
            className="w-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-xl font-semibold text-navyblue">
                  {q.productId?.productName || "Untitled Product"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Product ID:{" "}
                  <span className="text-gray-800 font-medium">
                    {q.productId?.id?.slice(-6)}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4 sm:mt-0">
                Date:{" "}
                <span className="font-medium text-gray-800">
                  {new Date(q.createdAt).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Details Section */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Buyer</p>
                <p className="text-base font-medium text-gray-800 truncate">
                  {q.userId?.name || "Unknown"}{" "}
                  <span className="text-gray-500 text-sm">
                    ({q.userId?.email})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-base font-medium text-gray-800">
                  {q.quantity}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-base text-gray-700 italic line-clamp-2">
                  {q.message || "No message provided."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t flex flex-col sm:flex-row justify-end gap-4">
              {/* View Details Button */}
              <button
                onClick={() => setSelectedQuotation(q)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium 
               bg-navyblue text-white border border-navyblue 
               rounded-lg hover:bg-white hover:text-navyblue 
               transition-all shadow-sm"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>

              {/* Chat Now Button */}
              <button
                onClick={() => alert("Chat feature coming soon!")}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium 
               border border-navyblue text-navyblue bg-white 
               rounded-lg hover:bg-navyblue hover:text-white 
               transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn">
            {/* Close */}
            <button
              onClick={() => setSelectedQuotation(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-semibold text-navyblue mb-6 text-center border-b pb-3">
              Quotation Details
            </h3>

            <div className="space-y-4">
              <p>
                <span className="font-semibold text-gray-700">Product:</span>{" "}
                {selectedQuotation.productId?.title || "Untitled Product"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Product ID:</span>{" "}
                {selectedQuotation.productId?.id?.slice(-6)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Buyer:</span>{" "}
                {selectedQuotation.userId?.name} (
                {selectedQuotation.userId?.email})
              </p>
              <p>
                <span className="font-semibold text-gray-700">Quantity:</span>{" "}
                {selectedQuotation.quantity}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Message:</span>{" "}
                {selectedQuotation.message || "No message provided."}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Date:</span>{" "}
                {new Date(selectedQuotation.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => alert("Chat feature coming soon!")}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Now
              </button>

              <button
                onClick={() => setSelectedQuotation(null)}
                className="flex items-center gap-2 px-6 py-2.5 bg-navyblue text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquries;
