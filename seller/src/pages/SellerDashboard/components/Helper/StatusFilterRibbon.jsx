import React from "react";

const StatusFilterRibbon = ({
  statusFilter,
  setStatusFilter,
  statusCounts,
}) => {
  const statuses = [
    { label: "All", value: "all", color: "bg-gray-200 text-gray-800" },
    {
      label: "Online",
      value: "active",
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Offline",
      value: "inactive",
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Pending",
      value: "pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Violation",
      value: "violation",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white rounded-b-lg">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => setStatusFilter(status.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded font-sm text-sm border transition-all duration-200 ${
            statusFilter === status.value
              ? `${status.color} border`
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
        >
          {status.label}
          <span className="px-2 py-0.5 text-black rounded-full text-xs font-semibold">
            {statusCounts[status.value]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilterRibbon;
