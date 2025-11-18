import React, { memo } from "react";
import { Flag, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatSmartDate } from "@/utils/formatDate.utils";

// const formatTime = (dateString) => {
//   if (!dateString) return "--:--";
//   const date = new Date(dateString);
//   return date.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };

// const formatDate = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// };

const CountryFlag = ({ code }) => {
  if (!code) return null;
  try {
    const chars = [...code.toUpperCase()].map((c) => 127397 + c.charCodeAt());
    return <span className="ml-1.5">{String.fromCodePoint(...chars)}</span>;
  } catch {
    return null;
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStatusConfig = (status) => {
  const configs = {
    Ongoing: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    Completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    Pending: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    Cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
    },
  };
  return configs[status] || configs.Ongoing;
};

const InquiryItem = ({ inquiry, selected, onSelect, onView }) => {
  const {
    _id,
    productId,
    userId,
    message,
    owner,
    status = "Ongoing",
    country,
    countryCode,
    user,
    seller,
    createdAt,
    updatedAt,
    isFlagged = false,
    unread = false,
  } = inquiry;

  console.log(inquiry);

  const inquiryId = _id ? _id.slice(-10) : "----------";
  const username = user?.name || "John Doe";
  const productName = productId?.productName || "Product";
  const initials = getInitials(username);
  const statusConfig = getStatusConfig(status);

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-lg border transition-all hover:shadow-sm ${
        selected
          ? "bg-orange-50 border-orange-200"
          : unread
          ? "bg-blue-50 border-blue-100"
          : "bg-white border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Left section: Checkbox, Flag, Refresh */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(_id)}
          className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
        />
        <button
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            isFlagged ? "text-orange-600" : "text-gray-400"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Toggle flag:", _id);
          }}
        >
          <Flag
            className="w-4 h-4"
            fill={isFlagged ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Meta section: ID, timestamps, user info */}
      <div className="w-72 min-w-0 flex flex-col gap-2">
        {/* Inquiry ID and timestamps */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Inquiry ID:</span>
            <span className="text-xs font-medium text-gray-900">
              {inquiryId}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Updated: <span>{formatSmartDate(updatedAt)}</span>
            &nbsp;•&nbsp; Created: <span>{formatSmartDate(createdAt)}</span>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            <Avatar>
              <AvatarImage src={user.profileImage} alt="@shadcn" />
              <AvatarFallback> {initials}</AvatarFallback>
            </Avatar>
          </div>

          {/* Username and country */}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {username}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="truncate">{country || "Country/region"}</span>
              <CountryFlag code={countryCode} />
            </div>
          </div>

          {/* Platform badges */}
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              L
            </span>
            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
              1688
            </span>
          </div>
        </div>
      </div>

      {/* Message section */}
      <div className="flex-1 min-w-0 px-4">
        <div className="text-sm text-gray-700 truncate">
          {message || "No message content"}
        </div>
      </div>

      {/* Right section: Owner, Status, Actions */}
      <div className="flex items-center gap-4 min-w-fit">
        {/* Owner */}
        <div className="text-sm text-gray-700 w-28 truncate">{productName}</div>

        {/* Status badge */}
        <div
          className={`px-3 py-1 rounded-full border text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          {status}
        </div>

        {/* View details button */}
        <button
          onClick={() => onView(_id)}
          className="px-4 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap transition-colors"
        >
          View details
        </button>
      </div>

      {/* Unread indicator */}
      {unread && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
      )}
    </div>
  );
};

export default memo(InquiryItem);
