import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";
import {
  Truck,
  MapPin,
  Package,
  Clock,
  DollarSign,
  Send,
  Eye,
  Loader2,
  Upload,
} from "lucide-react";

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
  const [fetchingPartners, setFetchingPartners] = useState(true);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPartners();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function fetchPartners() {
    setFetchingPartners(true);
    try {
      const { data } = await api.get("/transport/partners");
      if (Array.isArray(data)) {
        setPartners(data);
      } else if (Array.isArray(data.partners)) {
        setPartners(data.partners);
      } else {
        setPartners([]);
      }
    } catch (err) {
      console.error("Partners fetch error:", err);
      setPartners([]);
    } finally {
      setFetchingPartners(false);
    }
  }

  async function handleEstimate() {
    setError("");
    setSuccess("");

    if (!form.from || !form.to) {
      setError("From and To addresses are required");
      return;
    }

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
    setSuccess("");
    setError("");

    try {
      const payload = { partner: form.partner, quote: { form, estimate } };
      await api.post("/transport/send-quote", payload);
      setSuccess("Quote sent successfully to partner!");
    } catch (err) {
      console.error(err);
      setError("Failed to send quote");
    } finally {
      setLoading(false);
    }
  }

  const canEstimate = !!form.from && !!form.to && !loading;
  const canSend = !!estimate && !loading;
  const hasPartners = partners.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 md:p-8">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-2">
            {/* Left: Existing Title Section */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-navyblue rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Transport Distance Estimator
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Quickly calculate road distance, ETA and cost before sending a
                  shipping quote.
                </p>
              </div>
            </div>

            {/* Right: Import Partners Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-navyblue bg-navyblue text-white text-sm font-light rounded-sm shadow-sm hover:bg-white hover:text-navyblue transition cursor-pointer w-full sm:w-auto">
              <Upload className="w-4 h-4" />
              Import Partners
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-gray-100">
          {/* Location Inputs */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                From Location
              </label>
              <input
                name="from"
                value={form.from}
                onChange={onChange}
                placeholder="Enter pickup address (street, city, country)"
                className="w-full bg-gray-50 placeholder-gray-400 p-3 pl-5 rounded-xl border-2 border-gray-200 focus:border-navyblue focus:bg-white outline-none transition-all text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Use a detailed address for a more accurate route (e.g. street +
                city).
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin className="w-4 h-4 inline mr-2 text-red-600" />
                To Location
              </label>
              <input
                name="to"
                value={form.to}
                onChange={onChange}
                placeholder="Enter delivery address (street, city, country)"
                className="w-full bg-gray-50 placeholder-gray-400 p-3 pl-5 rounded-xl border-2 border-gray-200 focus:border-navyblue focus:bg-white outline-none transition-all text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Destination where the goods will be delivered.
              </p>
            </div>
          </div>

          {/* Package Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Package className="w-4 h-4 inline mr-2 text-gray-600" />
                Weight (kg)
              </label>
              <input
                name="weight"
                value={form.weight}
                onChange={onChange}
                type="number"
                min="0"
                placeholder="0"
                className="w-full bg-gray-50 placeholder-gray-400 p-3 rounded-xl border-2 border-gray-200 focus:border-navyblue focus:bg-white outline-none transition-all text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Total weight of the shipment in kilograms.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <Package className="w-4 h-4 inline mr-2 text-gray-600" />
                Volume (m³)
              </label>
              <input
                name="volume"
                value={form.volume}
                onChange={onChange}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-gray-50 placeholder-gray-400 p-3 rounded-xl border-2 border-gray-200 focus:border-navyblue focus:bg-white outline-none transition-all text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Approximate space the shipment occupies in cubic meters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Handling Type
              </label>
              <select
                name="handling"
                value={form.handling}
                onChange={onChange}
                className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-200 focus:border-navyblue focus:bg-white outline-none transition-all cursor-pointer text-sm"
              >
                <option>Standard</option>
                <option>Fragile</option>
                <option>Oversized</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Choose special handling if the cargo needs extra care or space.
              </p>
            </div>
          </div>

          {/* Partner Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Truck className="w-4 h-4 inline mr-2 text-gray-600" />
              Select Transport Partner
            </label>
            <select
              name="partner"
              value={form.partner}
              onChange={onChange}
              disabled={fetchingPartners || !hasPartners}
              className="w-full bg-gray-50 p-3 rounded-xl border-2 border-gray-200 focus:border-navyblue focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {fetchingPartners && <option>Loading partners...</option>}
              {!fetchingPartners && !hasPartners && (
                <option>No partners available</option>
              )}
              {!fetchingPartners && hasPartners && (
                <>
                  <option value="">Select a partner</option>
                  {partners.map((p) => (
                    <option key={p._id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Optional: choose which logistics partner this quote will be sent
              to.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEstimate}
              disabled={!canEstimate}
              className="flex items-center gap-2 px-6 py-3 cursor-pointer rounded-md font-semibold text-white border border-navyblue bg-navyblue hover:bg-white hover:text-navyblue disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>Estimate</>
              )}
            </button>

            <button
              onClick={() => {
                if (!estimate) {
                  setError("Please get an estimate first");
                  return;
                }
                setShowPreview(true);
              }}
              disabled={loading || !estimate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>

            <button
              onClick={handleSendQuote}
              disabled={!canSend}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <Send className="w-5 h-5" />
              {loading ? "Sending..." : "Send Quote"}
            </button>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-green-700 font-medium text-sm">{success}</p>
            </div>
          )}
        </div>

        {/* Estimate Preview */}
        {showPreview && estimate && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Estimate Preview
                </h3>
                <p className="text-xs text-gray-500">
                  Draft summary — share internally or send to the selected
                  partner.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Trip Details */}
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-700">
                      Route & Distance
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    {form.from || "—"} → {form.to || "—"}
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {estimate.distance_km} km
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Road distance based on live routing.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-700">
                      Estimated Time
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">
                    {estimate.eta_hours} hrs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Approximate driving time under normal conditions.
                  </p>
                </div>
              </div>

              {/* Right Column - Cost Breakdown */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                  Cost Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-gray-600">Distance Cost</span>
                    <span className="font-semibold text-gray-900">
                      {estimate.breakdown.distanceCost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-gray-600">Weight Cost</span>
                    <span className="font-semibold text-gray-900">
                      {estimate.breakdown.weightCost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-gray-600">Volume Cost</span>
                    <span className="font-semibold text-gray-900">
                      {estimate.breakdown.volumeCost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-gray-600">Handling Cost</span>
                    <span className="font-semibold text-gray-900">
                      {estimate.breakdown.handlingCost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      Total Cost
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {estimate.breakdown.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
