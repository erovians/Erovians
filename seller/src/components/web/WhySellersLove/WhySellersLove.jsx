import React from "react";
import { assets } from "@/assets/assets"; // for seller image only

// Reusable Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white shadow-md rounded-xl p-6">
    <div className="h-8 w-8 mb-4 text-blue">{icon}</div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default function WhySellersLove() {
  const features = [
    {
      title: "Wider Reach",
      description:
        "Connect with millions of active customers across India and expand your business footprint nationwide.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path strokeWidth="2" d="M2 12h20M12 2c3 4 3 16 0 20" />
        </svg>
      ),
    },
    {
      title: "Hassle-Free Setup",
      description:
        "Start selling online in minutes with our easy registration process—no complex steps, no delays.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeWidth="2" d="M13 2L3 14h7v8l10-12h-7z" />
        </svg>
      ),
    },
    {
      title: "Faster Growth",
      description:
        "Boost visibility, get featured in seasonal campaigns, and watch your brand scale with ease.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
        </svg>
      ),
    },
    {
      title: "Dedicated Support",
      description:
        "Get expert guidance, marketing insights, and training resources to make your selling journey smooth.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="2"
            d="M12 22c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
          />
          <path strokeWidth="2" d="M12 8v4l3 3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-[98%] m-auto px-6 py-5 sm:py-16">
      {/* Top Heading */}
      <div className="text-center md:text-left mb-12 rich-text">
        <h1 className="">
          Why do <span className="text-blue">brands</span> choose to grow with{" "}
          <span className="text-blue">Erovians?</span>
        </h1>
        <p className="mt-4 max-w-3xl">
          Erovians helps thousands of businesses build their digital presence,
          reach new customers, and scale faster. Our platform is designed to
          make selling simple, profitable, and sustainable for every brand.
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left - Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

       {/* Right - Seller Image */}
<div className="flex justify-center md:justify-end pr-0 sm:pr-20">
  <img
    src={assets.whysellerlove}
    alt="Seller"
    className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-xl xl:max-w-lg object-contain"
  />
</div>

      </div>
    </section>
  );
}
