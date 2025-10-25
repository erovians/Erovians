"use client";
import React, { useState, useEffect } from "react";
import { MoveDownRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper: Generate month days
function generateMonthDays(year, month, dataFromBackend = null) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    name: (i + 1).toString(),
    Product: dataFromBackend?.[i]?.Product ?? Math.floor(Math.random() * 5000),
    Category:
      dataFromBackend?.[i]?.Category ?? Math.floor(Math.random() * 4000),
  }));
}

const weeklyDataExample = [
  { name: "Week 1", Product: 12000, Category: 8000 },
  { name: "Week 2", Product: 15000, Category: 1100 },
  { name: "Week 3", Product: 1000, Category: 9500 },
  { name: "Week 4", Product: 18000, Category: 13500 },
];

function generateStats(view) {
  if (view === "daily") return { searches: 12, clicks: 54, inquiries: 8 };
  if (view === "weekly") return { searches: 56, clicks: 124, inquiries: 60 };
  return { searches: 100, clicks: 230, inquiries: 95 };
}

export default function SellerChart() {
  const [view, setView] = useState("weekly");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ searches: 0, clicks: 0, inquiries: 0 });

  useEffect(() => {
    if (view === "daily" || view === "monthly") {
      const today = new Date();
      setData(generateMonthDays(today.getFullYear(), today.getMonth()));
    } else {
      setData(weeklyDataExample);
    }
    setStats(generateStats(view));
  }, [view]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Dropdown */}
      <div className="flex justify-start mb-3">
        <Select
          value={view}
          onValueChange={setView}
        >
          <SelectTrigger className="border p-2 rounded w-1/8">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        {/* <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="px-3 py-1 rounded border border-gray-300 bg-white shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select> */}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded text-start">
          <h4 className="text-xs sm:text-sm text-gray-500">Product Searches</h4>
          <p className="text-sm sm:text-lg font-semibold flex gap-1">
            {stats.searches}
            <MoveDownRight
              color="#FF0000"
              size={14}
              className="relative -bottom-2"
            />
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded text-start">
          <h4 className="text-xs sm:text-sm text-gray-500">Product Clicks</h4>
          <p className="text-sm sm:text-lg font-semibold">{stats.clicks}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded text-start">
          <h4 className="text-xs sm:text-sm text-gray-500">
            Product Inquiries
          </h4>
          <p className="text-sm sm:text-lg font-semibold">{stats.inquiries}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="Product"
              stroke="#8884d8"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Category"
              stroke="#82ca9d"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
