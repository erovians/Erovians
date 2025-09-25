import React, { useState, useEffect } from "react";
import { MoveDownRight, MoveUpLeft } from "lucide-react";
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

// Helper to generate daily data for a month
function generateMonthDays(year, month, dataFromBackend = null) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data = [];
  for (let day = 1; day <= daysInMonth; day++) {
    data.push({
      name: day.toString(),
      Product:
        dataFromBackend?.[day - 1]?.Product ?? Math.floor(Math.random() * 5000),
      Category:
        dataFromBackend?.[day - 1]?.Category ??
        Math.floor(Math.random() * 4000),
    });
  }
  return data;
}

// Example weekly data
const weeklyDataExample = [
  { name: "Week 1", Product: 12000, Category: 8000 },
  { name: "Week 2", Product: 15000, Category: 1100 },
  { name: "Week 3", Product: 1000, Category: 9500 },
  { name: "Week 4", Product: 18000, Category: 13500 },
];

// Example stats API result (replace with real API fetch)
function generateStats(view) {
  if (view === "daily") {
    return { searches: 12, clicks: 54, inquiries: 8 };
  } else if (view === "weekly") {
    return { searches: 56, clicks: 124, inquiries: 60 };
  } else {
    return { searches: 100, clicks: 230, inquiries: 95 };
  }
}

export default function SellerChart() {
  const [view, setView] = useState("weekly");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ searches: 0, clicks: 0, inquiries: 0 });

  useEffect(() => {
    async function fetchData() {
      if (view === "daily" || view === "monthly") {
        const today = new Date();
        const monthDays = generateMonthDays(
          today.getFullYear(),
          today.getMonth()
        );
        setData(monthDays);
      } else if (view === "weekly") {
        setData(weeklyDataExample);
      }

      // Fetch stats (replace this with real API call)
      const fetchedStats = generateStats(view);
      setStats(fetchedStats);
    }
    fetchData();
  }, [view]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Dropdown selector */}
      <div className="flex justify-start mb-4">
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="px-4 py-1 rounded border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navyblue"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded text-start">
          <h4 className="text-grey">Product Searches</h4>
          <p className="text-lg font-semibold flex gap-1">
            {stats.searches}
            <MoveDownRight
              color="#FF0000"
              size={15}
              className="relative -bottom-2"
            />
          </p>
        </div>
        <div className="bg-white p-4 rounded  text-start">
          <h4 className="text-grey">Product Clicks</h4>
          <p className="text-lg font-semibold">{stats.clicks}</p>
        </div>
        <div className="bg-white p-4 rounded text-start">
          <h4 className="text-grey">Product Inquiries</h4>
          <p className="text-lg font-semibold">{stats.inquiries}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
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
