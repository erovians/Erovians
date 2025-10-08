import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompany } from "@/redux/slice/companySlice";
import {
  Factory,
  Users,
  TrendingUp,
  Award,
  Globe,
  BadgeCheckIcon,
  Dot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CompanyOverview = ({ companyId = "6870e6e558e2ba32d6b1eb33" }) => {
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state) => state.company);
  const products = company?.products || [];
  const [activeSection, setActiveSection] = useState("overview");
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    if (companyId) dispatch(getCompany(companyId));
    console.log(company);
  }, [companyId, dispatch]);

  if (loading)
    return <p className="text-center py-20">Loading company details...</p>;

  if (error)
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          onClick={() => dispatch(getCompany(companyId))}
        >
          Retry
        </button>
      </div>
    );

  if (!company) return null;

  const companyData = {
    name:
      company?.companyBasicInfo.companyName ||
      "VOLKSCHEM CROP SCIENCE PRIVATE LIMITED",
    verified: true,
    yearEstablished:
      company?.companyBasicInfo.companyRegistrationYear || "2011",
    location: company?.companyBasicInfo.locationOfRegistration,
    employees: "11 - 50 People",
    businessType: "Manufacturer",
    revenue: "Below US$1 Million",
    description: company?.companyIntro.companyDescription,
    mainProducts: company?.companyBasicInfo?.subCategory
      ?.split(",")
      ?.map((item) => item.trim()) || [
      "PESTICIDES",
      "HERBICIDES",
      "FUNGICIDES",
      "BIO STIMULANTS",
      "PLANT GROWTH PROMOTERS",
    ],
    mainMarkets: [
      { region: "Northern Europe", percentage: "10.00%" },
      { region: "Western Europe", percentage: "10.00%" },
      { region: "Eastern Asia", percentage: "10.00%" },
    ],
    factory: {
      size: "10,000-30,000 sqm",
      location:
        "PLOT NO1SURVEY NO 264, BHAYLA, DHANVADA, Ahmedabad, Gujarat, 382210",
      productionLines: 6,
      contractManufacturing: "OEM Service Offered, Design Service Offered",
      annualOutput: "Below US$1 Million",
    },
    rndTeam: "Less than 5 People",
  };

  const productItems =
    products?.map((product, idx) => ({
      id: product._id || idx,
      name: product.productName,
      image: product.productImages?.[0] || "/api/placeholder/200/250",
      grade: product.grade,
      description: product.description,
      status: product.status,
    })) || [];

  const nextProduct = () =>
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
  const prevProduct = () =>
    setCurrentProductIndex(
      (prev) => (prev - 1 + products.length) % products.length
    );
  const visibleProducts = () =>
    Array.from(
      { length: 4 },
      (_, i) => productItems[(currentProductIndex + i) % productItems.length]
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white py-6 px-4 sticky -top-5 z-20 shadow">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={company?.companyIntro.logo} alt="Company Logo" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {companyData.name}.
          </h1>
          <div className="flex justify-center items-center gap-2 text-sm flex-wrap">
            <Badge
              className="bg-yellow-500  text-gray-900 font-semibold h-5 min-w-5 rounded-lg px-4 py-3  tabular-nums text-xs"
              variant="outline"
            >
              20 YR
            </Badge>
            {companyData.verified && (
              <div className="flex">
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  <BadgeCheckIcon />
                  Verified
                </Badge>
              </div>
            )}
            <span>{companyData.location}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden lg:sticky lg:top-50">
            {/* Outer wrapper makes it scrollable horizontally on small screens */}
            <div className="p-2 lg:p-4 overflow-x-auto">
              {/* Use flex-row on small screens, flex-col on large */}
              <div className="flex flex-row lg:flex-col gap-2 min-w-max lg:min-w-0">
                {[
                  {
                    icon: <Factory className="w-5 h-5" />,
                    label: "Company Overview",
                    section: "overview",
                  },
                  {
                    icon: <Award className="w-5 h-5" />,
                    label: "Selected Products",
                    section: "products",
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5" />,
                    label: "Production Capacity",
                    section: "capacity",
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    label: "R&D Capacity",
                    section: "r&d",
                  },
                  {
                    icon: <Globe className="w-5 h-5" />,
                    label: "Trade Capacity",
                    section: "trade",
                  },
                ].map((item) => (
                  <button
                    key={item.section}
                    onClick={() => setActiveSection(item.section)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      activeSection === item.section
                        ? "bg-navyblue text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "overview" && (
            <OverviewSection companyData={companyData} company={company} />
          )}
          {activeSection === "products" && (
            <ProductCarousel
              productItems={productItems}
              next={nextProduct}
              prev={prevProduct}
            />
          )}
          {activeSection === "capacity" && (
            <CapacitySection factory={companyData.factory} />
          )}
          {activeSection === "r&d" && (
            <RDSection rndTeam={companyData.rndTeam} />
          )}
          {activeSection === "trade" && (
            <TradeSection mainMarkets={companyData.mainMarkets} />
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------- Reusable Components ----------------
const Detail = ({ label, value, blue }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-500 mb-2">{label}</h4>
    <p className={blue ? "text-blue-600" : "text-gray-900"}>{value}</p>
  </div>
);

const OverviewSection = ({ companyData, company }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">COMPANY OVERVIEW</h2>
    </div>
    <div className="p-6 space-y-6">
      <div className="flex gap-4 overflow-x-auto py-2">
        {company?.companyIntro?.companyPhotos?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Company ${idx + 1}`}
            className="w-64 h-48 object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Basic Information</h3>
        <p className="text-gray-700 leading-relaxed">
          {companyData.description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail label="Business Type" value={companyData.businessType} />
        <Detail label="Country / Region" value={companyData.location} />
        <Detail
          label="Main Products"
          value={companyData.mainProducts.join(", ")}
          blue
        />
        <Detail label="Total Employees" value={companyData.employees} />
        <Detail label="Total Annual Revenue" value={companyData.revenue} />
        <Detail label="Year Established" value={companyData.yearEstablished} />
        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">
            Main Markets
          </h4>
          <div className="space-y-1">
            {companyData.mainMarkets.map((market, idx) => (
              <p key={idx} className="text-blue-600">
                {market.region} {market.percentage}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductCarousel = ({ productItems, next, prev }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden ">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl md:text-2xl font-bold">PRODUCTS</h2>
      <p className="text-xs md:text-sm opacity-80">
        Showing {productItems.length} products
      </p>
    </div>

    <div className="pt-6 md:p-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 ">
        {productItems.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex justify-between">
                {product.grade && (
                  <p className="text-xs text-gray-500">
                    Grade: {product.grade}
                  </p>
                )}
                {product.status && (
                  <p className="text-xs text-gray-500">
                    <Dot
                      size={15}
                      strokeWidth={10}
                      className={
                        product.status === "active"
                          ? "text-green-400"
                          : product.status === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    />
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-600 line-clamp-3">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CapacitySection = ({ factory }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">PRODUCT CAPACITY</h2>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Detail label="Factory Size" value={factory.size} />
      <Detail label="No. of Production Lines" value={factory.productionLines} />
      <Detail label="Factory Country/Region" value={factory.location} />
      <Detail
        label="Contract Manufacturing"
        value={factory.contractManufacturing}
      />
      <Detail label="Annual Output Value" value={factory.annualOutput} />
    </div>
  </div>
);

const RDSection = ({ rndTeam }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">RESEARCH & DEVELOPMENT</h2>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Research & Development</h3>
      <p className="text-gray-900">{rndTeam}</p>
    </div>
  </div>
);

const TradeSection = ({ mainMarkets }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">TRADE CAPABILITIES</h2>
    </div>
    <div className="p-6 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Main markets
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Total Revenue(%)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Main Product(s)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {mainMarkets.map((market, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3 text-gray-900">{market.region}</td>
              <td className="px-4 py-3 text-gray-900">{market.percentage}</td>
              <td className="px-4 py-3 text-gray-900">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CompanyOverview;
