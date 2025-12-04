import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";

export default function TransportEstimate() {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({
    from: "",
    to: "",
    weight: "",
    volume: "",
    handling: "Standard",
    partner: "",
  });
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function fetchPartners() {
    try {
      const { data } = await api.get("/transport/partners");

      if (Array.isArray(data)) {
        setPartners(data);
      } else if (Array.isArray(data.partners)) {
        setPartners(data.partners);
      } else {
        setPartners([]);
        console.error("Unexpected partners format:", data);
      }
    } catch (err) {
      console.error("Partners fetch error:", err);
      setPartners([]);
    }
  }

  async function handleEstimate() {
    setError("");
    if (!form.from || !form.to)
      return setError("From and To addresses are required");
    setLoading(true);
    try {
      const res = await api.post("/transport/estimate-distance", {
        from: form.from,
        to: form.to,
        weight: Number(form.weight),
        volume: Number(form.volume),
        handling: form.handling,
        partner: form.partner,
      });
      setEstimate(res.data);
      setShowPreview(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to estimate");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendQuote() {
    if (!estimate) return;
    setLoading(true);
    try {
      const payload = { partner: form.partner, quote: { form, estimate } };
      await api.post("/transport/send-quote", payload);
      alert("Quote sent to partner");
    } catch (err) {
      console.error(err);
      alert("Failed to send quote");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md text-gray-700 max-w-6xl mx-auto border border-gray-200">
      <h1 className="mb-20 disable bg-gray-50 w-fit p-2 font-bold">
        This will not gonna work until the Google Map API will not integrated
        with it .
      </h1>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Transport — Distance Estimate
        </h2>
        {/* <button className="px-4 py-2 border rounded-xl text-sm text-gray-600 border-gray-300 hover:bg-gray-100">
          Import partners
        </button> */}
      </div>

      {/* TOP INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="from"
          value={form.from}
          onChange={onChange}
          placeholder="From address"
          className="bg-white placeholder-gray-400 p-4 rounded-xl border border-gray-300 focus:border-navyblue focus:border-none focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <input
          name="to"
          value={form.to}
          onChange={onChange}
          placeholder="To address"
          className="bg-white placeholder-gray-400 p-4 rounded-xl border border-gray-300 focus:border-navyblue focus:border-none focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <input
          name="weight"
          value={form.weight}
          onChange={onChange}
          type="number"
          placeholder="Weight (kg)"
          className="bg-white placeholder-gray-400 p-4 rounded-xl border border-gray-300 focus:border-navyblue focus:border-none focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <input
          name="volume"
          value={form.volume}
          onChange={onChange}
          type="number"
          step="0.01"
          placeholder="Volume (m³)"
          className="bg-white placeholder-gray-400 p-4 rounded-xl border border-gray-300 focus:border-navyblue focus:border-none focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <select
          name="handling"
          value={form.handling}
          onChange={onChange}
          className="bg-white p-4 rounded-xl border border-gray-300 focus:border-navyblue focus:border-none focus:ring-2 focus:ring-blue-200 outline-none"
        >
          <option>Standard</option>
          <option>Fragile</option>
          <option>Oversized</option>
        </select>
      </div>

      {/* PARTNER SELECT */}
      <div className="mt-4">
        <select
          name="partner"
          value={form.partner}
          onChange={onChange}
          className="w-full bg-white p-4 rounded-xl border border-gray-300 focus:border-navyblue focus:border-none  focus:ring-2 focus:ring-blue-200 outline-none"
        >
          {partners.map((p) => (
            <option key={p._id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => {
            if (!estimate) {
              setError("Please estimate first.");
              return;
            }
            setShowPreview(true);
          }}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
        >
          Preview
        </button>

        <button
          onClick={handleEstimate}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-navyblue hover:bg-white cursor-pointer border border-navyblue hover:text-navyblue transition shadow-sm"
        >
          {loading ? "Estimating…" : "Estimate"}
        </button>

        <button
          onClick={handleSendQuote}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
        >
          Send quote to partner
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* PREVIEW CARD */}
      {showPreview && estimate && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Estimate Preview
          </h3>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Distance: </strong> {estimate.distance_km} km
              </p>
              <p>
                <strong>ETA: </strong> {estimate.eta_hours} hours
              </p>
            </div>

            <div>
              <p>
                <strong>Total: </strong> {estimate.breakdown.total}
              </p>
              <p className="font-medium mt-1">Breakdown:</p>
              <ul className="ml-4">
                <li>Distance: {estimate.breakdown.distanceCost}</li>
                <li>Weight: {estimate.breakdown.weightCost}</li>
                <li>Volume: {estimate.breakdown.volumeCost}</li>
                <li>Handling: {estimate.breakdown.handlingCost}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
