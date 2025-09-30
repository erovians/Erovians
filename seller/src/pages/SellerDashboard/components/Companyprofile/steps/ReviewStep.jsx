import React from "react";
import {
  Info,
  CreditCard,
  Building2,
  MapPin,
  Image as ImageIcon,
  Video,
} from "lucide-react";

export default function ReviewStep({ formData }) {
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
    <div className="max-w-6xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg space-y-10">
      {/* Header */}
      <div className="flex items-center gap-6 border-b pb-6">
        {logo && (
          <img
            src={URL.createObjectURL(logo)}
            alt="Company Logo"
            className="h-24 w-24 rounded-xl border object-contain shadow-md"
          />
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{companyName}</h1>
          <p className="text-teal-600 font-medium text-lg">
            Shipping and Freight Forwarding
          </p>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* About Us */}
        <section className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Company Description
            </h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {companyDescription}
          </p>
        </section>

        {/* Accepted Transactions */}
        <section className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Accepted Transactions
            </h3>
          </div>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-medium">Currencies:</span>{" "}
              {acceptedCurrency.join(", ")}
            </p>
            <p>
              <span className="font-medium">Payment Types:</span>{" "}
              {acceptedPaymentType.join(", ")}
            </p>
          </div>
        </section>

        {/* Company Snapshot */}
        <section className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Company Snapshot
            </h3>
          </div>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-medium">Legal Owner:</span> {legalowner}
            </p>
            <p>
              <span className="font-medium">Registered Year:</span>{" "}
              {companyRegistrationYear}
            </p>
            <p>
              <span className="font-medium">Registration Location:</span>{" "}
              {locationOfRegistration}
            </p>
            <p>
              <span className="font-medium">Main Category:</span> {mainCategory}
            </p>
            <p>
              <span className="font-medium">Core Products:</span>{" "}
              {mainProduct.join(", ")}
            </p>
            <p>
              <span className="font-medium">Languages Spoken:</span>{" "}
              {languageSpoken.join(", ")}
            </p>
            <p>
              <span className="font-medium">Attended Trade Shows:</span>{" "}
              {attendedTradeShows}
            </p>
          </div>
        </section>

        {/* Headquarters Address */}
        {address && (
          <section className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Headquarters Address
              </h3>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.stateOrProvince} {address.postalCode}
              </p>
              <p>{address.countryOrRegion}</p>
            </div>
          </section>
        )}
      </div>

      {/* Media Gallery */}
      <section className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-800">Media Gallery</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Photos */}
          {companyPhotos?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-700">
                  Company Photos ({companyPhotos.length})
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {companyPhotos.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Company Photo ${idx + 1}`}
                    className="h-28 w-full object-cover rounded-lg border shadow-sm hover:scale-105 transition"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {companyVideos?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-700">
                  Company Videos ({companyVideos.length})
                </h4>
              </div>
              <div className="flex flex-col gap-4">
                {companyVideos.map((file, idx) => (
                  <video
                    key={idx}
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-full h-40 rounded-lg border shadow-sm hover:scale-[1.02] transition"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <p className="text-gray-500 text-center text-sm">
        This is how your live company page will look. If everything looks perfect,
        proceed to the final submission step.
      </p>
    </div>
  );
}
