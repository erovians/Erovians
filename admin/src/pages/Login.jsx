import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Country } from "country-state-city";

import SellerSignupform from "../assets/SellerSignupform.svg";
import seller_logo from "../assets/seller_logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("mobile");

  // Get all countries
  const allCountries = Country.getAllCountries();

  const [selectedCountry, setSelectedCountry] = useState(
    allCountries.find((c) => c.isoCode === "IN") || allCountries[0]
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
  });

  // Filter countries based on search
  const filteredCountries = allCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
      country.phonecode.includes(searchCountry)
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchCountry("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!form.email && !form.phone) || !form.password) return;

    setLoading(true);

    try {
      const res = await api.post("/admin/login", {
        identifier:
          loginType === "mobile"
            ? `+${selectedCountry.phonecode}${form.phone}`
            : form.email,
        password: form.password,
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full h-screen bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ================= LEFT IMAGE ================= */}
          <div className="hidden lg:flex items-center justify-center p-8 bg-linear-to-br from-blue-50 to-gray-100">
            <img
              src={SellerSignupform}
              alt="login"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              {/* EROVIANS Logo */}
              <div className="mb-8">
                <img
                  src={seller_logo}
                  alt="EROVIANS"
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Login Text */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Login</h2>
              </div>

              {/* Mobile/Email Toggle */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setLoginType("mobile")}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                    loginType === "mobile"
                      ? "border-gray-900 bg-white text-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Mobile</span>
                  </div>
                </button>

                <button
                  onClick={() => setLoginType("email")}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all text-sm ${
                    loginType === "email"
                      ? "border-gray-900 bg-white text-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Email</span>
                  </div>
                </button>
              </div>

              {/* ================= FORM ================= */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mobile/Email Input */}
                {loginType === "mobile" ? (
                  <div className="flex gap-3 relative">
                    {/* Country Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                        className="w-32 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-between gap-2 px-3 bg-white hover:border-gray-400 transition-colors"
                      >
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium text-gray-700">
                          +{selectedCountry.phonecode}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {showCountryDropdown && (
                        <div className="absolute top-14 left-0 w-96 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                          {/* Search Box */}
                          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={searchCountry}
                              onChange={(e) => setSearchCountry(e.target.value)}
                              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>

                          {/* Countries List */}
                          <div className="overflow-y-auto max-h-80">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.isoCode}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left ${
                                    selectedCountry.isoCode === country.isoCode
                                      ? "bg-gray-100"
                                      : ""
                                  }`}
                                >
                                  <span className="text-xl">
                                    {country.flag}
                                  </span>
                                  <span className="text-sm flex-1">
                                    {country.name}
                                  </span>
                                  <span className="text-sm font-medium text-gray-600">
                                    +{country.phonecode}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No countries found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Input */}
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter mobile number"
                      value={form.phone}
                      onChange={handleChange}
                      className="flex-1 h-12 border-2 border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-12 border-2 border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                )}

                {/* Password Field */}
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-12 border-2 border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />

                {/* Terms and Policy */}
                <p className="text-xs text-gray-600">
                  By continuing, you agree to our{" "}
                  <a
                    href="#"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Please wait..." : "Continue"}
                </button>

                {/* Sign Up Link */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
