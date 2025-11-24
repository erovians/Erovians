import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios.utils";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      const res = await api.get("/contracts");
      setContracts(res.data);
    };
    fetchContracts();
  }, []);

  return (
    <div className="w-full text-white rounded-xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Contracts (from Orders)</h2>

        <button
          className="px-6 py-2 rounded-lg bg-navyblue text-white font-semibold text-sm hover:opacity-90"
          onClick={() => navigate("/sellerdashboard/contracts/create")}
        >
          + Contract
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead className="text-black text-sm">
            <tr>
              <th className="pb-2">Contract ID</th>
              <th className="pb-2">Order</th>
              <th className="pb-2">Client</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Created</th>
            </tr>
          </thead>

          <tbody>
            {contracts.map((c) => (
              <tr
                key={c._id}
                className="border border-white/10 text-black rounded-lg bg-gray-200"
              >
                <td className="px-4 py-4">{c.contractId}</td>
                <td className="px-4 py-4">{c.order.slice(-8)}</td>
                <td className="px-4 py-4">{c.client}</td>
                <td className="px-4 py-4">
                  <span className="bg-green-700 text-white text-xs px-3 py-1 rounded-full">
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {new Date(c.created).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
