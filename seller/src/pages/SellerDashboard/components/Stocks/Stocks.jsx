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

  const fetchStocks = async () => {
    const res = await api.get("/stocks");
    setStocks(res.data.stocks);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const downloadExcel = async () => {
    const response = await api.get("/stocks/export", {
      responseType: "blob",
    });
    saveAs(response.data, "stocks.csv");
  };

  const importFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/stocks/import", formData);
      toast.success(data.message);
      fetchStocks();
    } catch (err) {
      const backend = err.response?.data;
      const msg =
        backend?.message ||
        backend?.error ||
        err.message ||
        "Something went wrong while importing.";
      alert(msg);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
      <AddLotModal
        open={openModal}
        setOpen={setOpenModal}
        refresh={fetchStocks}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Stock & Lots
        </h2>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Export */}
          <button
            onClick={downloadExcel}
            className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100"
          >
            Export CSV
          </button>

          {/* Import */}
          <label
            className={`flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm flex items-center justify-center gap-2 cursor-pointer transition
              ${
                importLoading
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-gray-100"
              }`}
          >
            {importLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import CSV"
            )}

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={importFile}
              className="hidden"
            />
          </label>

          {/* Add Lot */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-navyblue text-white rounded-full text-sm flex items-center justify-center gap-2 shadow"
          >
            <Plus size={16} /> Lot
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="border rounded-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-gray-700 ">
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

        {/* Mobile Card View */}
        <div className="sm:hidden">
          {stocks.map((item, i) => (
            <div
              key={i}
              className="border-b-2 border-r-3 border-r-blue-600 shadow-sm mb-5 border-blue-500 p-4"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lot</span>
                <span>{item.lot}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Material</span>
                <span>{item.material}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Thickness</span>
                <span>{item.thickness}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Dimensions</span>
                <span>{item.dimensions}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Location</span>
                <span>{item.location}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Quality</span>
                <span>{item.quality}</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Qty</span>
                <span>{item.qty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
