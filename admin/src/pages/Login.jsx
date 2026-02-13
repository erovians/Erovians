import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Country } from 'country-state-city';
import { useDispatch, useSelector } from "react-redux";
import { loginWithPassword, clearError, clearSuccess } from "../lib/redux/auth/authSlice";
import SellerSignupform from "../assets/SellerSignupform.svg";
import seller_logo from "../assets/seller_logo.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { loading, error, success, message, userId, otpExpiresAt, requiresVerification } = useSelector((state) => state.auth);

  // Local state
  const [loginType, setLoginType] = useState("mobile");
  const [showPassword, setShowPassword] = useState(false);
  
  const allCountries = Country.getAllCountries();
  
  const [selectedCountry, setSelectedCountry] = useState(
    allCountries.find(c => c.isoCode === 'IN') || allCountries[0]
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
  });

  // Handle success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    
    if (success && message) {
      toast.success(message);
      dispatch(clearSuccess());
    }
  }, [error, success, message, dispatch]);

  // Redirect to OTP page when userId is available
  useEffect(() => {
    if (requiresVerification && userId) {
      // Store in localStorage for OTP page access
      localStorage.setItem("userId", userId);
      if (otpExpiresAt) {
        localStorage.setItem("otpExpiresAt", otpExpiresAt);
      }

      // Navigate with userId in state
      navigate("/verify-otp", {
        state: { userId }
      });
    }
  }, [requiresVerification, userId, otpExpiresAt, navigate]);

  const filteredCountries = allCountries.filter(country =>
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

    // Build identifier based on login type
    const identifier = loginType === "mobile"
      ? `+${selectedCountry.phonecode}${form.phone}`
      : form.email;

    // Validation
    if (!identifier || !form.password) {
      toast.error("Please enter all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Dispatch login action
    await dispatch(loginWithPassword({
      identifier,
      password: form.password,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full h-screen bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          
          {/* LEFT IMAGE */}
          <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-gray-100">
            <img
              src={SellerSignupform}
              alt="login"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* RIGHT FORM */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              
              {/* Logo */}
              <div className="mb-8">
                <img 
                  src={seller_logo} 
                  alt="EROVIANS" 
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Title */}
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email</span>
                  </div>
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Mobile/Email Input */}
                {loginType === "mobile" ? (
                  <div className="flex gap-3 relative">
                    {/* Country Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="w-32 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-between gap-2 px-3 bg-white hover:border-gray-400 transition-colors"
                      >
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium text-gray-700">+{selectedCountry.phonecode}</span>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute top-14 left-0 w-96 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={searchCountry}
                              onChange={(e) => setSearchCountry(e.target.value)}
                              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                          <div className="overflow-y-auto max-h-80">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.isoCode}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left ${
                                    selectedCountry.isoCode === country.isoCode ? 'bg-gray-100' : ''
                                  }`}
                                >
                                  <span className="text-xl">{country.flag}</span>
                                  <span className="text-sm flex-1">{country.name}</span>
                                  <span className="text-sm font-medium text-gray-600">+{country.phonecode}</span>
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full h-12 border-2 border-gray-300 rounded-lg px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Terms and Policy */}
                <p className="text-xs text-gray-600">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-gray-900 font-medium hover:underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-gray-900 font-medium hover:underline">
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
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;