import React, { useState } from "react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    pan: "",
    gstin: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Form Submitted ✅");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        {/* Stepper */}
        <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-600">
          <div
            className={`flex-1 text-center ${
              step === 1 ? "text-blue-600 font-bold" : ""
            }`}
          >
            EMAIL ID & GST
          </div>
          <div
            className={`flex-1 text-center ${
              step === 2 ? "text-blue-600 font-bold" : ""
            }`}
          >
            PASSWORD CREATION
          </div>
          <div
            className={`flex-1 text-center ${
              step === 3 ? "text-blue-600 font-bold" : ""
            }`}
          >
            ONBOARDING DASHBOARD
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter your details</h2>

            <input
              type="text"
              name="mobile"
              placeholder="Enter Mobile Number *"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-3 mb-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email ID *"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-3 mb-3"
            />

            <p className="mb-2 font-medium">
              What are you looking to sell on Flipkart?
            </p>
            <div className="flex gap-4 mb-4">
              <button className="flex-1 border-2 border-blue-600 text-blue-600 font-medium py-3 rounded-lg hover:bg-blue-50">
                All Categories
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50">
                Only Books{" "}
                <span className="text-sm text-gray-500">(PAN mandatory)</span>
              </button>
            </div>

            <input
              type="text"
              name="gstin"
              placeholder="Enter GSTIN"
              value={formData.gstin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-3 mb-3"
            />

            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Register & Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Password</h2>
            <input
              type="password"
              name="password"
              placeholder="Enter Password *"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-3 mb-3"
            />

            <div className="flex justify-between gap-4">
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to Seller Hub 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your onboarding is almost complete. Proceed to dashboard to set up
              your store.
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Finish & Go to Dashboard ✅
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
