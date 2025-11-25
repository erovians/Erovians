import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { saveAs } from "file-saver";
import api from "@/utils/axios.utils";
import AddLotModal from "./AddLotModal";
import { toast } from "sonner";

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  // Fetch stocks
  const fetchStocks = async () => {
    const res = await api.get("/stocks");

    setStocks(res.data);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Download excel
  const downloadExcel = async () => {
    const response = await api.get("/stocks/export", {
      responseType: "blob",
    });
    saveAs(response.data, "stocks.xlsx");
  };

  // Import excel with loader
  const importFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/stocks/import", formData);
      toast.success(data.message)
      fetchStocks();
    } catch(err){
      console.error("Import error:", err);

    // Safely extract backend error message
    const backendData = err.response?.data;

    const message =
      backendData?.message ||           // e.g. "No valid stock rows found..."
      backendData?.error ||             // e.g. detailed error from catch
      err.message ||                    // Axios / JS error message
      "Something went wrong while importing stocks.";
      alert(message)
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-10 py-6">
      <AddLotModal
        open={openModal}
        setOpen={setOpenModal}
        refresh={fetchStocks}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Stock & lots
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadExcel}
            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100"
          >
            Export CSV
          </button>

          {/* IMPORT BUTTON WITH SPINNER */}
          <label
            className={`px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm flex items-center gap-2 transition cursor-pointer
              ${
                importLoading
                  ? "opacity-60 pointer-events-none"
                  : "hover:bg-gray-100"
              }
            `}
          >
            {importLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>Import CSV</>
            )}

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={importFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-navyblue text-white rounded-full text-sm flex items-center gap-2 shadow"
          >
            <Plus size={16} /> Lot
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4">Lot</th>
              <th className="py-3 px-4">Material</th>
              <th className="py-3 px-4">Thickness</th>
              <th className="py-3 px-4">Dimensions</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Quality</th>
              <th className="py-3 px-4">Qty</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
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
