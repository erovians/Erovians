import React from "react";

const Step2 = ({ formData, errors, onFormChange, onBack, onContinue }) => {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {/* Seller Name */}
      <div>
        <input
          type="text"
          name="sellername"
          placeholder="Enter Your Full Name *"
          value={formData.sellername}
          onChange={onFormChange}
          autoComplete="off"
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
        />
        <p className="text-xs text-gray-500 mt-1">
          Only letters and spaces allowed
        </p>
        {errors.sellername && (
          <p className="text-red-500 text-sm mt-1">{errors.sellername}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          name="password"
          placeholder="Create Password *"
          value={formData.password}
          onChange={onFormChange}
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={onFormChange}
          className="w-full px-4 py-3 border rounded-md text-sm outline-none focus:border-[#0c2c43] focus:ring-1 focus:ring-[#0c2c43]"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 font-semibold w-full sm:w-auto hover:text-gray-700 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="bg-[#0c2c43] text-white px-6 py-2 rounded-md font-bold w-full sm:w-auto hover:bg-[#1a4361] transition"
        >
          Continue →
        </button>
      </div>
    </form>
  );
};

export default Step2;
