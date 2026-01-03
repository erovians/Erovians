import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Mail, ArrowLeft } from "lucide-react";
import { assets } from "../assets/assets";
import Layout from "../components/common/Layout";

export default function Auth() {
  const [step, setStep] = useState("initial"); // initial, otp, signup
  const [loginMethod, setLoginMethod] = useState("mobile"); // mobile or email
  const [formData, setFormData] = useState({
    identifier: "", // mobile or email
    otp: "",
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to check if user exists
    setTimeout(() => {
      // If user exists -> go to OTP
      // If user doesn't exist -> go to signup
      const userExists = Math.random() > 0.5; // Random for demo

      if (userExists) {
        setStep("otp");
      } else {
        setStep("signup");
      }
      setLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      console.log("Login successful!");
      // Navigate to dashboard
      setLoading(false);
    }, 1000);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate signup API call
    setTimeout(() => {
      console.log("Signup successful!");
      setStep("otp");
      setLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setStep("initial");
    setFormData({
      identifier: "",
      otp: "",
      name: "",
      email: "",
      mobile: "",
    });
  };

  return (
    <Layout>
      <div className="bg-[#f8f9fa] flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* left side  */}
            <div className="hidden lg:block p-8">
              <div className="relative">
                <img
                  src={assets.SellerSignupform}
                  alt="Shopping Illustration"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* right side */}
            <div className="bg-white p-6 md:p-8 lg:p-12 flex items-center">
              <div className="w-full">
                <div className="mb-6">
                  <img
                    src={assets.logo}
                    alt="Logo"
                    className="h-10 w-auto mx-auto"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                {step === "initial" && (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Login
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Get access to your Orders, Wishlist and Recommendations
                    </p>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setLoginMethod("mobile")}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-all flex flex-col items-center ${
                          loginMethod === "mobile"
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Smartphone className="h-5 w-5 mb-1" />
                        <span className="text-xs">Mobile</span>
                      </button>
                      <button
                        onClick={() => setLoginMethod("email")}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-all flex flex-col items-center ${
                          loginMethod === "email"
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Mail className="h-5 w-5 mb-1" />
                        <span className="text-xs">Email</span>
                      </button>
                    </div>

                    <div>
                      <div className="mb-4">
                        <Input
                          type={loginMethod === "mobile" ? "tel" : "email"}
                          name="identifier"
                          placeholder={
                            loginMethod === "mobile"
                              ? "Enter Mobile Number"
                              : "Enter Email Address"
                          }
                          value={formData.identifier}
                          onChange={handleChange}
                          className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>

                      <p className="text-xs text-gray-500 mb-4">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-gray-900 hover:underline">
                          Terms of Use
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-gray-900 hover:underline">
                          Privacy Policy
                        </a>
                        .
                      </p>

                      <Button
                        onClick={handleInitialSubmit}
                        disabled={loading}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading ? "Please wait..." : "Continue"}
                      </Button>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account? Continue to get started
                      </p>
                    </div>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <button
                      onClick={resetForm}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Verify with OTP
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Sent to {formData.identifier}
                    </p>

                    <div>
                      <div className="mb-4">
                        <Input
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          value={formData.otp}
                          onChange={handleChange}
                          maxLength={6}
                          className="w-full h-12 text-base tracking-widest border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>

                      <Button
                        onClick={handleOtpSubmit}
                        disabled={loading}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </Button>
                    </div>

                    <div className="mt-4 text-center">
                      <button className="text-sm text-gray-900 hover:underline font-medium">
                        Resend OTP
                      </button>
                    </div>
                  </>
                )}

                {step === "signup" && (
                  <>
                    <button
                      onClick={resetForm}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Complete Your Profile
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      We need a few more details to create your account
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>

                      {loginMethod === "mobile" ? (
                        <div>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                      ) : (
                        <div>
                          <Input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            required
                          />
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-gray-900 hover:underline">
                          Terms of Use
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-gray-900 hover:underline">
                          Privacy Policy
                        </a>
                        .
                      </p>

                      <Button
                        onClick={handleSignupSubmit}
                        disabled={loading}
                        className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium"
                      >
                        {loading ? "Creating Account..." : "Continue"}
                      </Button>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Need help?{" "}
                        <a
                          href="#"
                          className="text-gray-900 hover:underline font-medium"
                        >
                          Contact Support
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
