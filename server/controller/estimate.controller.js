import Partner from "../models/partner.model.js";
import { geocodeAddress, getDistanceKm } from "../services/google.service.js";

// ------------------ PRICE CALCULATION ------------------
function calculatePrice(
  distanceKm,
  weightKg,
  volumeM3,
  handling,
  partnerConfig
) {
  const baseFare = 20;

  const distanceCost = distanceKm * (partnerConfig.cost_per_km ?? 0.5);
  const weightCost = (weightKg / 100) * (partnerConfig.weight_factor ?? 0.1);
  const volumeCost = volumeM3 * (partnerConfig.volume_factor ?? 5);

  const handlingCost =
    handling && handling !== "Standard"
      ? partnerConfig.handling_extra ?? 15
      : 0;

  const total = +(
    baseFare +
    distanceCost +
    weightCost +
    volumeCost +
    handlingCost
  ).toFixed(2);

  return {
    baseFare,
    distanceCost: +distanceCost.toFixed(2),
    weightCost: +weightCost.toFixed(2),
    volumeCost: +volumeCost.toFixed(2),
    handlingCost,
    total,
  };
}

// ------------------ LIST PARTNERS ------------------
export const getPartners = async (req, res) => {
  const partners = await Partner.find({}).lean();
  res.json(partners);
};

// ------------------ ESTIMATE API ------------------
export const estimateDistanceAndPrice = async (req, res) => {
  try {
    const {
      from,
      to,
      weight,
      volume,
      handling,
      partner: partnerName,
    } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To required" });
    }

    // 1) GEOCODE BOTH ADDRESSES (Nominatim)
    const fromCoord = await geocodeAddress(from);
    const toCoord = await geocodeAddress(to);

    // 2) GET DISTANCE (OSRM)
    const { distanceKm, durationHours } = await getDistance(
      fromCoord.lat,
      fromCoord.lon,
      toCoord.lat,
      toCoord.lon
    );

    // 3) FIND PARTNER CONFIG
    const partner = (await Partner.findOne({ name: partnerName }).lean()) || {};

    // 4) PRICE BREAKDOWN
    const breakdown = calculatePrice(
      distanceKm,
      Number(weight || 0),
      Number(volume || 0),
      handling,
      partner
    );

    return res.json({
      distance_km: +distanceKm.toFixed(2),
      eta_hours: +durationHours.toFixed(2),
      breakdown,
    });
  } catch (err) {
    console.error("Estimate Error:", err);
    res.status(500).json({ message: err.message });
  }
};
