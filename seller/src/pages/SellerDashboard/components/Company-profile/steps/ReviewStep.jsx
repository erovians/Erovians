import React from "react";

export default function ReviewStep({ formData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Your Details</h3>
      <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      <p className="text-gray-600">Check all information before submitting.</p>
    </div>
  );
}
