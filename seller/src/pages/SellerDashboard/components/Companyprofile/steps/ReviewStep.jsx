import React from "react";
import {
  Mail,
  Calendar,
  FileText,
  DollarSign,
  Building2,
  MapPin,
  Package,
  Languages,
  Award,
} from "lucide-react";

export default function ReviewStep({ formData = {} }) {
  const {
    companyName,
    legalowner,
    companyDescription,
    companyRegistrationYear,
    locationOfRegistration,
    mainCategory,
    mainProduct,
    acceptedCurrency,
    acceptedPaymentType,
    languageSpoken,
    attendedTradeShows,
    address,
    logo,
    companyPhotos,
    companyVideos,
  } = formData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 ">
      <div className="w-full bg-white shadow-2xl overflow-hidden">
        {/* Header with Gradient
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h1 className="sm:text-3xl font-bold text-white drop-shadow-lg">
            Review & Confirm Company Details
          </h1>
          <p className="text-blue-100 mt-1 md:text-sm text-xs">
            Please review all information before submitting
          </p>
        </div> */}

        <div className="md:p-8 ">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Company Logo and Name Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-gray-800 font-bold text-2xl overflow-hidden shadow-lg ring-2 ring-gray-200">
                    {logo ? (
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : companyName ? (
                      companyName.substring(0, 2).toUpperCase()
                    ) : (
                      "IC"
                    )}
                  </div>  
                  <div>
                    <h3 className="sm:text-xl md:text-2xl font-bold text-gray-900">
                      {companyName || "Company Name"}
                    </h3>
                    {mainCategory && (
                      <p className="text-sm text-gray-600 mt-0.5">
                        {mainCategory}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-navyblue" />
                  </div>
                  Basic Information
                </h2>

                <div className="space-y-3 text-sm">
                  {legalowner && (
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="w-4 h-4 text-navyblue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Legal Owner</p>
                        <p className="font-semibold text-gray-900">
                          {legalowner}
                        </p>
                      </div>
                    </div>
                  )}

                  {companyRegistrationYear && (
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="w-4 h-4 text-navyblue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Founding Date</p>
                        <p className="font-semibold text-gray-900">
                          {companyRegistrationYear}
                        </p>
                      </div>
                    </div>
                  )}

                  {locationOfRegistration && (
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-4 h-4 text-navyblue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">
                          Registration Location
                        </p>
                        <p className="font-semibold text-gray-900">
                          {locationOfRegistration}
                        </p>
                      </div>
                    </div>
                  )}

                  {mainProduct && mainProduct.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Package className="w-4 h-4 navyblue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Main Products</p>
                        <p className="font-semibold text-gray-900">
                          {mainProduct.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {languageSpoken && languageSpoken.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Languages className="w-4 h-4 text-navyblue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Languages</p>
                        <p className="font-semibold text-gray-900">
                          {languageSpoken.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {attendedTradeShows && (
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Award className="w-4 h-4 text-navyblue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">Trade Shows</p>
                        <p className="font-semibold text-gray-900">
                          {attendedTradeShows}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Card */}
              {address && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-green-600" />
                    </div>
                    Headquarters Address
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1 ml-8">
                    {address.street && (
                      <p className="font-medium">{address.street}</p>
                    )}
                    {(address.city ||
                      address.stateOrProvince ||
                      address.postalCode) && (
                      <p>
                        {[
                          address.city,
                          address.stateOrProvince,
                          address.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {address.countryOrRegion && (
                      <p className="text-gray-600">{address.countryOrRegion}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Information Card */}
              {(acceptedCurrency?.length > 0 ||
                acceptedPaymentType?.length > 0) && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    Payment Information
                  </h2>

                  <div className="space-y-4">
                    {acceptedCurrency && acceptedCurrency.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium">
                          Accepted Currency
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {acceptedCurrency.map((cur, i) => (
                            <span
                              key={i}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                            >
                              {cur}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {acceptedPaymentType && acceptedPaymentType.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium">
                          Payment Methods
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {acceptedPaymentType.map((pay, i) => (
                            <span
                              key={i}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                            >
                              {pay}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Description Card */}
              {companyDescription && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FileText className="w-3 h-3 text-amber-600" />
                    </div>
                    Company Description
                  </h3>

                  <div
                    className="max-h-60 overflow-y-scroll"
                    style={{
                      scrollbarWidth: "thin", // For Firefox
                      scrollbarColor: "#9CA3AF #F3F4F6", // thumb color, track color
                    }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {companyDescription}
                    </p>

                    {/* Webkit scrollbar for Chrome, Edge, Safari */}
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 8px;
                      }
                      div::-webkit-scrollbar-track {
                        background: #f3f4f6; /* track color */
                        border-radius: 8px;
                      }
                      div::-webkit-scrollbar-thumb {
                        background-color: #9ca3af; /* thumb color */
                        border-radius: 8px;
                      }
                    `}</style>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Media Gallery */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  Media Gallery
                </h2>

                {/* Photo Grid */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-3 font-medium">
                    Company Photos
                  </p>
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-80 border rounded-xl">
                    {companyPhotos && companyPhotos.length > 0 ? (
                      companyPhotos.slice(0, companyPhotos.length).map((photo, idx) => (
                        <div
                          key={idx}
                          className="aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-blue-400"
                        >
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Company photo ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">No photo</p>
                          </div>
                        </div>
                        <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">No photo</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {companyPhotos?.length  && (
                    <div className="mt-3 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                       total {companyPhotos.length} photos
                      </span>
                    </div>
                  )}
                </div>

                {/* Video */}
                <div>
                  <p className="text-xs text-gray-500 mb-3 font-medium">
                    Company Video
                  </p>
                  <div className="relative aspect-video rounded-xl bg-gray-100 overflow-hidden shadow-md hover:shadow-xl transition-shadow border-2 border-gray-200">
                    {companyVideos && companyVideos.length > 0 ? (
                      <video
                        src={URL.createObjectURL(companyVideos[0])}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg ring-4 ring-gray-200">
                          <svg
                            className="w-8 h-8 text-gray-600 ml-1"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M4 3l8 5-8 5V3z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          No Company Video
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload a video to showcase your company
                        </p>
                      </div>
                    )}
                  </div>

                  {companyVideos?.length > 1 && (
                    <div className="mt-3 text-center">
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        +{companyVideos.length - 1} more videos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
