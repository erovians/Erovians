"use client";
import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 300 },
  { name: "Product D", value: 200 },
];

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={16}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SellerPieChart() {
  const [outerRadius, setOuterRadius] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setOuterRadius(90);
      else if (width < 768) setOuterRadius(100);
      else setOuterRadius(140);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%" >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={renderCustomizedLabel}
          dataKey="value"
          outerRadius={outerRadius}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: "14px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
