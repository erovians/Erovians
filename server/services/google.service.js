import axios from "axios";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

export async function geocodeAddress(address) {

  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const res = await axios.get(url, {
    params: {
      address,
      key: GOOGLE_KEY,
    },
  });

  if (!res.data.results.length) throw new Error("Unable to get geocode address");

  const location = res.data.results[0].geometry.location;
  return { lat: location.lat, lon: location.lng };
}

export async function getDistanceKm(fromAddress, toAddress) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

  const res = await axios.get(url, {
    params: {
      origins: fromAddress,
      destinations: toAddress,
      key: GOOGLE_KEY,
    },
  });

  const row = res.data.rows[0].elements[0];

  if (row.status !== "OK") throw new Error("Distance not found");

  const distanceMeters = row.distance.value;
  const durationSeconds = row.duration.value;

  return {
    distanceKm: distanceMeters / 1000,
    durationHours: durationSeconds / 3600,
  };
}
