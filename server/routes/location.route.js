import express from "express";
import { Country, State } from "country-state-city";

const router = express.Router();

// ✅ Get all countries
router.get("/countries", (req, res) => {
  try {
    const countries = Country.getAllCountries();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch countries", error });
  }
});

// ✅ Get all states of a country
router.get("/states/:countryCode", (req, res) => {
  try {
    const { countryCode } = req.params;
    const states = State.getStatesOfCountry(countryCode);
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch states", error });
  }
});

export default router;
