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
    return <p className="text-center text-gray-500">Loading quotations...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (quotations.length === 0)
    return <p className="text-center text-gray-600">No quotations found.</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-3xl text-navyblue p-2 pl-5">Inquiries</h1>

      {quotations.map((q) => (
        <div
          key={q._id}
          className="flex flex-wrap items-center justify-between w-full bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 px-4 py-3"
        >
          <div className="flex items-center gap-4 w-full h-16 sm:w-auto">
            <div>
              <p className="text-xs text-gray-500">
                Inquiry ID:{" "}
                <span className="text-gray-800 font-medium">
                  {q._id?.slice(-6)}
                </span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Updated on:{" "}
                {new Date(q.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | Created on:{" "}
                {new Date(q.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              {q.productId?.productName?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-xs text-gray-500 truncate max-w-[140px]">
                {q.productId?.productName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 text-sm">
            <p className="text-gray-700 w-[100px] truncate">
              {q.message ? q.message.slice(0, 20) + "..." : "Message"}
            </p>
            <p className="text-gray-800 w-[100px] truncate text-center">
              {q.userId?.username || "Unknown"}
            </p>
            <p
              className={`w-[80px] text-center px-2 py-1 rounded-md text-xs font-medium ${
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
              className="text-blue-600 text-sm font-medium hover:underline hover:cursor-pointer"
            >
              View details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inquiries;
