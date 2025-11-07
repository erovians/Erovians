import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInquiries } from "../../../redux/slice/inquirySlice";
import { useNavigate } from "react-router-dom";

const Inquiries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list: quotations,
    loading,
    error,
  } = useSelector((state) => state.inquiries);

  useEffect(() => {
    dispatch(fetchInquiries());
  }, [dispatch]);

  if (loading)
    return <p className="text-center text-gray-500">Loading inquiries...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (quotations.length === 0)
    return <p className="text-center text-gray-600">No inquiries found.</p>;

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl text-navyblue pl-2 sm:pl-5">
        Inquiries
      </h1>

      {quotations.map((q) => (
        <div
          key={q._id}
          className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          {/* Inquiry Info */}
          <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
            <div>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Inquiry ID:{" "}
                <span className="text-gray-800 font-medium">
                  {q._id?.slice(-6)}
                </span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
                Updated:{" "}
                {new Date(q.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | Created:{" "}
                {new Date(q.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3 w-full sm:w-[35%] md:w-[30%] lg:w-[25%]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              {q.productId?.productName?.[0]?.toUpperCase() || "?"}
            </div>
            <p className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px]">
              {q.productId?.productName}
            </p>
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto text-xs sm:text-sm">
            <p className="text-gray-700 max-w-[120px] truncate">
              {q.message ? q.message.slice(0, 20) + "..." : "No message"}
            </p>
            <p className="text-gray-800 font-medium max-w-[100px] truncate text-left sm:text-center">
              {q.userId?.username || "Unknown"}
            </p>
            <p
              className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium text-center ${
                q.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {q.status || "Ongoing"}
            </p>

            <button
              onClick={() =>
                navigate(`/sellerdashboard/messages/inquirydetail/${q._id}`)
              }
              className="text-blue-600 font-medium hover:underline hover:cursor-pointer"
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inquiries;
