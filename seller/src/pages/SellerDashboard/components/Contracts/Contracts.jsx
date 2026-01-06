// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "@/utils/axios.utils";

// export default function Contracts() {
//   const [contracts, setContracts] = useState([]);
//   const navigate = useNavigate();

//   const fetchContracts = async () => {
//     const res = await api.get("/contracts");
//     setContracts(res.data);
//   };

//   useEffect(() => {
//     fetchContracts();
//   }, []);

//   const handleStatusChange = async (id, newStatus) => {
//     if (newStatus === "Completed") {
//       await api.put(`/contracts/update/${id}`, { status: "Completed" });
//       fetchContracts();
//     }
//   };

//   return (
//     <div className="w-full text-white rounded-xl p-6 border border-white/10">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-black">
//           Contracts (from Orders)
//         </h2>

//         <button
//           className="px-6 py-2 rounded-lg bg-navyblue text-white font-semibold text-sm hover:opacity-90"
//           onClick={() => navigate("/sellerdashboard/contracts/create")}
//         >
//           + Contract
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-separate border-spacing-y-3">
//           <thead className="text-black text-sm">
//             <tr>
//               <th className="pb-2">Contract ID</th>
//               <th className="pb-2">Order</th>
//               <th className="pb-2">Client</th>
//               <th className="pb-2">Status</th>
//               <th className="pb-2">Created</th>
//             </tr>
//           </thead>

//           <tbody>
//             {contracts.map((c) => (
//               <tr
//                 key={c._id}
//                 className="border border-white/10 text-black rounded-lg bg-gray-200"
//               >
//                 <td className="px-4 py-4">{c.contractId}</td>
//                 <td className="px-4 py-4">{c.order.slice(-8)}</td>
//                 <td className="px-4 py-4">{c.client}</td>

//                 {/* Status Select */}
//                 <td className="px-4 py-4">
//                   <select
//                     value={c.status}
//                     disabled={c.status === "Completed"}
//                     onChange={(e) => handleStatusChange(c._id, e.target.value)}
//                     className={`text-xs px-3 py-1 rounded-full text-white ${
//                       c.status === "Completed"
//                         ? "bg-green-700 no-arrow cursor-not-allowed"
//                         : "bg-yellow-500"
//                     }`}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Completed">Completed</option>
//                   </select>
//                 </td>

//                 <td className="px-4 py-4">
//                   {new Date(c.created).toLocaleDateString()}
//                 </td>

//                 {/* Download PDF Button */}
//                 <td className="px-4 py-4">
//                   <button
//                     className="px-4 py-2 text-xs rounded bg-navyblue text-white hover:opacity-90"
//                     onClick={() =>
//                       window.open(
//                         `${import.meta.env.VITE_API_URL}/contracts/download/${
//                           c._id
//                         }`
//                       )
//                     }
//                   >
//                     Generate PDF
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios.utils";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();

  const fetchContracts = async () => {
    const res = await api.get("/contracts");
    setContracts(res.data);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "Completed") {
      await api.put(`/contracts/update/${id}`, { status: "Completed" });
      fetchContracts();
    }
  };

  return (
    <div className="w-full text-white rounded-xl p-4 sm:p-6 border border-white/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-black">
          Contracts (from Orders)
        </h2>

        <button
          className="flex items-center justify-center gap-2 px-4 py-2 border border-navyblue bg-navyblue text-white text-sm font-light rounded-sm shadow-sm hover:bg-white hover:text-navyblue transition cursor-pointer w-full sm:w-auto"
          onClick={() => navigate("/sellerdashboard/contracts/create")}
        >
          + Contract
        </button>
      </div>

      {/* Responsive Table / Cards */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead className="text-black text-sm">
            <tr>
              <th className="pb-2">Contract ID</th>
              <th className="pb-2">Order</th>
              <th className="pb-2">Client</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Created</th>
              <th className="pb-2">Action</th>
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

                {/* Status */}
                <td className="px-4 py-4">
                  <select
                    value={c.status}
                    disabled={c.status === "Completed"}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className={`text-xs px-3 py-1 rounded-full text-white ${
                      c.status === "Completed"
                        ? "bg-green-700 no-arrow cursor-not-allowed"
                        : "bg-yellow-500"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                <td className="px-4 py-4">
                  {new Date(c.created).toLocaleDateString()}
                </td>

                <td className="px-4 py-4">
                  <button
                    className="px-4 py-2 text-xs rounded bg-navyblue text-white hover:opacity-90"
                    onClick={() =>
                      window.open(
                        `${import.meta.env.VITE_API_URL}/contracts/download/${
                          c._id
                        }`
                      )
                    }
                  >
                    Generate PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW for small screens */}
      <div className="md:hidden flex flex-col gap-4">
        {contracts.map((c) => (
          <div
            key={c._id}
            className="bg-gray-200 text-black rounded-lg p-4 border border-white/10"
          >
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Contract ID</span>
              <span className="font-semibold">{c.contractId}</span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">Order</span>
              <span>{c.order.slice(-8)}</span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">Client</span>
              <span>{c.client}</span>
            </div>

            <div className="flex justify-between mt-3">
              <span className="text-xs text-gray-600">Status</span>
              <select
                value={c.status}
                disabled={c.status === "Completed"}
                onChange={(e) => handleStatusChange(c._id, e.target.value)}
                className={`text-xs ml-2 px-2 py-1 rounded-full text-white ${
                  c.status === "Completed"
                    ? "bg-green-700 cursor-not-allowed"
                    : "bg-yellow-500"
                }`}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">Created</span>
              <span>{new Date(c.created).toLocaleDateString()}</span>
            </div>

            <button
              className="mt-4 w-full px-4 py-2 text-xs rounded bg-navyblue text-white hover:opacity-90"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_API_URL}/contracts/download/${c._id}`
                )
              }
            >
              Generate PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
