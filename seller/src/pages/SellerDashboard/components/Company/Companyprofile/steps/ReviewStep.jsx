import React from "react";
import {
  Building2,
  MapPin,
  Calendar,
  User,
  Package,
  Globe,
  DollarSign,
  CreditCard,
  FileText,
  Factory,
  Award,
  CheckCircle2,
} from "lucide-react";

const InfoRow = ({ label, value, fullWidth = false }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div
      className={`grid ${
        fullWidth ? "grid-cols-1" : "grid-cols-3"
      } gap-4 py-3 border-b border-gray-100 last:border-0`}
    >
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div
        className={`${
          fullWidth ? "col-span-1" : "col-span-2"
        } text-sm text-gray-900`}
      >
        {displayValue}
      </div>
    </div>
  );
};

const Section = ({ title, children, icon: Icon }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-navyblue">
      {Icon && <Icon className="w-5 h-5 text-navyblue" />}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-0">{children}</div>
  </div>
);

const Badge = ({ text, variant = "primary" }) => {
  const variants = {
    primary: "bg-navyblue text-white",
    secondary: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} mr-2 mb-2`}
    >
      {text}
    </span>
  );
};

export default function ReviewStep({ formData = {} }) {
  const {
    companyName,
    company_registration_number,
    legalowner,
    companyDescription,
    companyRegistrationYear,
    locationOfRegistration,
    mainCategory,
    mainProduct,
    acceptedCurrency,
    acceptedPaymentType,
    languageSpoken,
    tradeCapabilities,
    address,
    totalEmployees,
    businessType,
    factorySize,
    factoryCountryOrRegion,
    contractManufacturing,
    numberOfProductionLines,
    annualOutputValue,
    rdTeamSize,
    logo,
    logoUrl,
    companyPhotos,
    companyPhotosUrl,
    companyVideos,
    companyVideosUrl,
    registration_documents,
    registrationDocsUrl,
  } = formData;

  const getLogoPreview = () => {
    if (logo instanceof File) return URL.createObjectURL(logo);
    if (logoUrl) return logoUrl;
    return null;
  };

  const getAllPhotos = () => {
    const newPhotos = (companyPhotos || []).map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    const existingPhotos = (companyPhotosUrl || []).map((url) => ({
      url,
      isNew: false,
    }));
    return [...existingPhotos, ...newPhotos];
  };

  const getAllVideos = () => {
    const newVideos = (companyVideos || []).map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    const existingVideos = (companyVideosUrl || []).map((url) => ({
      url,
      isNew: false,
    }));
    return [...existingVideos, ...newVideos];
  };

  const getTotalDocs = () => {
    return (
      (registrationDocsUrl?.length || 0) + (registration_documents?.length || 0)
    );
  };

  const logoPreview = getLogoPreview();
  const allPhotos = getAllPhotos();
  const allVideos = getAllVideos();
  const totalDocs = getTotalDocs();

  const fullAddress = address
    ? [
        address.street,
        address.city,
        address.stateOrProvince,
        address.postalCode,
        address.countryOrRegion,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navyblue to-blue-900 text-white px-8 py-6 rounded-t-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Review Your Information</h2>
        </div>
        <p className="text-blue-100 text-sm">
          Please verify all details before submission
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
        {/* Left Column - Image/Media Section */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Company Logo */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                Company Logo
              </h4>
              <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <Building2 className="w-20 h-20 text-gray-300" />
                )}
              </div>
            </div>

            {/* Company Photos */}
            {allPhotos.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                  Company Photos ({allPhotos.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {allPhotos.slice(0, 4).map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={photo.url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.isNew && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {allPhotos.length > 4 && (
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    +{allPhotos.length - 4} more photos
                  </p>
                )}
              </div>
            )}

            {/* Videos */}
            {allVideos.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                  Company Videos ({allVideos.length})
                </h4>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <video
                    src={allVideos[0].url}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
                {allVideos.length > 1 && (
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    +{allVideos.length - 1} more videos
                  </p>
                )}
              </div>
            )}

            {/* Documents */}
            {totalDocs > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-navyblue" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Documents
                      </h4>
                      <p className="text-xs text-gray-500">
                        Registration files
                      </p>
                    </div>
                  </div>
                  <div className="bg-navyblue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {totalDocs}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Information Section */}
        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            {/* Company Basic Information */}
            <Section title="Company Information" icon={Building2}>
              <InfoRow label="Company Name" value={companyName} />
              <InfoRow
                label="Registration Number"
                value={company_registration_number}
              />
              <InfoRow label="Legal Owner" value={legalowner} />
              <InfoRow
                label="Registration Year"
                value={companyRegistrationYear}
              />
              <InfoRow
                label="Registration Location"
                value={locationOfRegistration}
              />
              <InfoRow label="Business Type" value={businessType} />
              {companyDescription && (
                <div className="py-3 border-b border-gray-100 last:border-0">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Company Description
                  </div>
                  <div className="text-sm text-gray-900 leading-relaxed">
                    {companyDescription}
                  </div>
                </div>
              )}
            </Section>

            {/* Categories & Products */}
            {(mainCategory?.length > 0 || mainProduct?.length > 0) && (
              <Section title="Categories & Products" icon={Package}>
                {mainCategory && mainCategory.length > 0 && (
                  <div className="py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-3">
                      Main Categories
                    </div>
                    <div>
                      {mainCategory.map((cat, i) => (
                        <Badge key={i} text={cat} variant="primary" />
                      ))}
                    </div>
                  </div>
                )}
                {mainProduct && mainProduct.length > 0 && (
                  <div className="py-3">
                    <div className="text-sm font-medium text-gray-600 mb-3">
                      Main Products
                    </div>
                    <div>
                      {mainProduct.map((prod, i) => (
                        <Badge key={i} text={prod} variant="secondary" />
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Address */}
            {fullAddress && (
              <Section title="Address" icon={MapPin}>
                <InfoRow label="Full Address" value={fullAddress} />
              </Section>
            )}

            {/* Factory & Production */}
            <Section title="Production Information" icon={Factory}>
              <InfoRow label="Total Employees" value={totalEmployees} />
              <InfoRow label="Factory Size" value={factorySize} />
              <InfoRow
                label="Factory Location"
                value={factoryCountryOrRegion}
              />
              <InfoRow
                label="Production Lines"
                value={numberOfProductionLines}
              />
              <InfoRow label="Annual Output Value" value={annualOutputValue} />
              <InfoRow label="R&D Team Size" value={rdTeamSize} />
              {contractManufacturing && (
                <div className="py-3">
                  <Badge
                    text="Contract Manufacturing Available"
                    variant="success"
                  />
                </div>
              )}
            </Section>

            {/* Payment & Trade */}
            <Section title="Payment & Trade" icon={CreditCard}>
              {acceptedCurrency && acceptedCurrency.length > 0 && (
                <div className="py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-600 mb-3">
                    Accepted Currencies
                  </div>
                  <div>
                    {acceptedCurrency.map((cur, i) => (
                      <Badge key={i} text={cur} variant="primary" />
                    ))}
                  </div>
                </div>
              )}
              {acceptedPaymentType && acceptedPaymentType.length > 0 && (
                <div className="py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-600 mb-3">
                    Payment Methods
                  </div>
                  <div>
                    {acceptedPaymentType.map((pay, i) => (
                      <Badge key={i} text={pay} variant="secondary" />
                    ))}
                  </div>
                </div>
              )}
              {tradeCapabilities && tradeCapabilities.length > 0 && (
                <div className="py-3">
                  <div className="text-sm font-medium text-gray-600 mb-3">
                    Trade Capabilities
                  </div>
                  <div>
                    {tradeCapabilities.map((cap, i) => (
                      <Badge key={i} text={cap} variant="secondary" />
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Languages */}
            {languageSpoken && languageSpoken.length > 0 && (
              <Section title="Languages" icon={Globe}>
                <div className="py-3">
                  {languageSpoken.map((lang, i) => (
                    <Badge key={i} text={lang} variant="primary" />
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 rounded-b-lg border-t-2 border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-medium">
            Review complete. Click submit to finalize your company profile.
          </span>
        </div>
      </div>
    </div>
  );
}
