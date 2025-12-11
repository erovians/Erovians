// controllers/transport.controller.js
import axios from "axios";

const ORS_API_KEY = process.env.ORS_API_KEY;

// ---------- Helpers / Config ----------

const mockPartners = []; // you said: no partners in DB yet

function calculatePrice({
  distanceKm,
  weightKg = 0,
  volumeM3 = 0,
  handling = "Standard",
}) {
  const BASE_FEE = 20;      // flat €
  const PRICE_PER_KM = 0.85; // €/km
  const WEIGHT_RATE = 0.1;   // €/kg
  const VOLUME_RATE = 5;     // €/m³

  let handlingSurcharge = 0;
  if (handling === "Fragile") handlingSurcharge = 15;
  if (handling === "Oversized") handlingSurcharge = 25;

  const distanceCost = distanceKm * PRICE_PER_KM;
  const weightCost = weightKg * WEIGHT_RATE;
  const volumeCost = volumeM3 * VOLUME_RATE;
  const handlingCost = handlingSurcharge;

  const total =
    BASE_FEE + distanceCost + weightCost + volumeCost + handlingCost;

  const round = (n) => Number(n.toFixed(2));

  return {
    total: round(total),
    distanceCost: round(distanceCost),
    weightCost: round(weightCost),
    volumeCost: round(volumeCost),
    handlingCost: round(handlingCost),
  };
}

// Geocode an address using ORS
async function geocodeAddress(address) {
  if (!ORS_API_KEY) {
    throw new Error("ORS_API_KEY is not set in environment variables");
  }

  const url = "https://api.openrouteservice.org/geocode/search";

  console.log("[GEOCODE] →", address);

  let res;
  try {
    res = await axios.get(url, {
      params: {
        api_key: ORS_API_KEY,
        text: address,
        size: 1,
      },
    });
  } catch (e) {
    console.error(
      "[GEOCODE HTTP ERROR]",
      e.response?.status,
      e.response?.data || e.message
    );
    const msg =
      e.response?.data?.error?.message ||
      e.response?.data?.message ||
      e.message ||
      "Failed to call ORS geocode";
    throw new Error(msg);
  }

  const features = res.data.features;
  console.log("[GEOCODE RESPONSE FEATURES LENGTH]", features?.length);

  if (!features || features.length === 0) {
    console.error("[GEOCODE] No features for:", address, res.data);
    throw new Error(`Could not geocode address: ${address}`);
  }

  const [lon, lat] = features[0].geometry.coordinates;
  console.log("[GEOCODE COORD]", { lat, lon });

  return { lat, lon };
}

// Get driving distance + duration between two coordinates
async function getRoute({ from, to }) {
  if (!ORS_API_KEY) {
    throw new Error("ORS_API_KEY is not set in environment variables");
  }

  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  console.log("[ROUTE] From:", from, "To:", to);

  let res;
  try {
    res = await axios.post(
      url,
      {
        coordinates: [
          [from.lon, from.lat], // [lon, lat]
          [to.lon, to.lat],
        ],
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (e) {
    console.error(
      "[ROUTE HTTP ERROR]",
      e.response?.status,
      e.response?.data || e.message
    );
    const msg =
      e.response?.data?.error?.message ||
      e.response?.data?.message ||
      e.message ||
      "Failed to call ORS directions";
    throw new Error(msg);
  }

  const data = res.data;

  // ORS can return either GeoJSON (features) or plain JSON (routes)
  let summary;

  if (data.features && data.features.length > 0) {
    // GeoJSON style
    summary = data.features[0].properties.summary;
  } else if (data.routes && data.routes.length > 0) {
    // Plain JSON style – this is what your log shows
    summary = data.routes[0].summary;
  } else {
    console.error("[ROUTE] No usable route data:", data);
    throw new Error("OpenRouteService returned no route data");
  }

  const distanceMeters = summary.distance;
  const durationSeconds = summary.duration;

  const distanceKm = distanceMeters / 1000;
  const etaHours = durationSeconds / 3600;

  console.log("[ROUTE SUMMARY]", {
    distanceMeters,
    distanceKm,
    durationSeconds,
    etaHours,
  });

  return {
    distanceKm,
    etaHours,
  };
}


// ---------- Controllers ----------

// GET /api/transport/partners
export const getPartners = (req, res) => {
  res.json(mockPartners); // [] for now
};

// POST /api/transport/estimate-distance
export const estimateDistanceAndPrice = async (req, res) => {
  try {
    const { from, to, weight, volume, handling, partner } = req.body;

    console.log("[ESTIMATE REQUEST BODY]", req.body);

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "From and To addresses are required" });
    }

    // 1. Geocode both addresses
    const [fromCoord, toCoord] = await Promise.all([
      geocodeAddress(from),
      geocodeAddress(to),
    ]);

    // 2. Get driving route (road distance + ETA)
    const { distanceKm, etaHours } = await getRoute({
      from: fromCoord,
      to: toCoord,
    });

    // 3. Price calculation
    const breakdown = calculatePrice({
      distanceKm,
      weightKg: Number(weight) || 0,
      volumeM3: Number(volume) || 0,
      handling: handling || "Standard",
    });

    // 4. Shape response exactly how your React expects
    const response = {
      distance_km: Number(distanceKm.toFixed(2)),
      eta_hours: Number(etaHours.toFixed(1)),
      breakdown,
      partner: partner || null,
      currency: "EUR",
    };

    console.log("[ESTIMATE RESPONSE]", response);

    res.json(response);
  } catch (err) {
    console.error("Estimate error:", err.message);
    res
      .status(500)
      .json({ message: err.message || "Failed to estimate distance" });
  }
};

// POST /api/transport/send-quote
export const sendTransportQuote = (req, res) => {
  const { partner, quote } = req.body;

  console.log("[SEND QUOTE] partner:", partner);
  console.log("[SEND QUOTE] payload:", JSON.stringify(quote, null, 2));

  return res.json({ message: "Quote sent (mock)" });
};
