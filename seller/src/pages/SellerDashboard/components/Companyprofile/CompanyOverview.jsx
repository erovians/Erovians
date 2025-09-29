import React from "react";

const CompanyOverview = ({ company }) => {
  if (!company) {
    return (
      <div className="text-center py-20 text-gray-500">
        No Company Data Available
      </div>
    );
  }

  const { companyBasicInfo, companyIntro } = company;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header: Logo & Company Name */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow">
        <img
          src={companyIntro.logo}
          alt={`${companyBasicInfo.companyName} Logo`}
          className="w-24 h-24 object-cover rounded-full border-2 border-blue-500"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {companyBasicInfo.companyName}
          </h1>
          <p className="text-gray-500 mt-1">
            Legal Owner: {companyBasicInfo.legalowner}
          </p>
          <p className="text-gray-500 mt-1">
            Registered at: {companyBasicInfo.locationOfRegistration}
          </p>
        </div>
      </div>

      {/* Company Description */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          About the Company
        </h2>
        <p className="text-gray-700">{companyIntro.companyDescription}</p>
      </div>

      {/* Company Media */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Media</h2>
        <div className="grid grid-cols-3 gap-4">
          {companyIntro.companyPhotos.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`Company Photo ${idx + 1}`}
              className="w-full h-40 object-cover rounded-lg"
            />
          ))}
        </div>
        {companyIntro.companyVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {companyIntro.companyVideos.map((video, idx) => (
              <video
                key={idx}
                src={video}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      {/* Company Basic Info */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Company Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-medium">Address</h3>
            <p>{companyBasicInfo.address.street}</p>
            <p>
              {companyBasicInfo.address.city},{" "}
              {companyBasicInfo.address.stateOrProvince}
            </p>
            <p>
              {companyBasicInfo.address.countryOrRegion} -{" "}
              {companyBasicInfo.address.postalCode}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Category</h3>
            <p>Main: {companyBasicInfo.mainCategory}</p>
            <p>Sub: {companyBasicInfo.subCategory}</p>
          </div>
          <div>
            <h3 className="font-medium">Payment & Currency</h3>
            <p>Currency: {companyBasicInfo.acceptedCurrency}</p>
            <p>
              Payment Types: {companyBasicInfo.acceptedPaymentType.join(", ")}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Languages Spoken</h3>
            <p>{companyBasicInfo.languageSpoken.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
