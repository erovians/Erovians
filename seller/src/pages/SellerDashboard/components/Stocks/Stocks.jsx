import React from "react";
import { Plus } from "lucide-react";

export default function Stocks() {
  const data = [
    {
      lot: "LOT-GR-221",
      material: "Granite Noir Z",
      thickness: "20 mm",
      dimensions: "3000×1800",
      location: "Warehouse A",
      quality: "A",
      qty: "5 slabs",
    },
    {
      lot: "LOT-MA-118",
      material: "Carrara Marble",
      thickness: "30 mm",
      dimensions: "2800×1600",
      location: "Warehouse B",
      quality: "B",
      qty: "3 slabs",
    },
  ];

  return (
    <div className="w-full px-4 md:px-6 lg:px-10 py-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Stock & lots
        </h2>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100 transition">
            Export CSV
          </button>

          <button className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100 transition">
            Import CSV
          </button>

          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm flex items-center gap-2 shadow hover:opacity-90 transition">
            <Plus size={16} />
            Lot
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr className="">
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Lot
              </th>
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Material
              </th>
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Thickness
              </th>
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Dimensions
              </th>
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Location
              </th>
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Quality
              </th>
              <th className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                Qty
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="py-4 px-4">{item.lot}</td>
                <td className="py-4 px-4">{item.material}</td>
                <td className="py-4 px-4">{item.thickness}</td>
                <td className="py-4 px-4">{item.dimensions}</td>
                <td className="py-4 px-4">{item.location}</td>
                <td className="py-4 px-4">{item.quality}</td>
                <td className="py-4 px-4">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
