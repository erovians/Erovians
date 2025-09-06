import React from "react";
import { assets } from "@/assets/assets";
import Cards from "@/components/web/Card/Cards";

// Reusable StatCircle Component
function StatCircle({ value, label, borderColor, textColor, spin }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 mx-auto p-4">
      {/* Rotating border */}
      <div
        className={`absolute inset-0 rounded-full border-2 ${borderColor} ${
          spin ? "animate-spin-slow" : ""
        }`}
      ></div>
      {/* Inner content */}
      <div className="relative bg-white rounded-full w-full h-full flex flex-col items-center justify-center">
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-bold ${textColor}`}
        >
          {value}
        </h2>
        <p className="text-grey text-xs sm:text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const stats = [
    { value: "14 Lakh+", label: "Seller community", borderColor: "border-navyblue", textColor: "text-navyblue" },
    { value: "24×7", label: "Online Business", borderColor: "border-navyblue", textColor: "text-navyblue", spin: true },
    { value: "7", label: "days* payment", borderColor: "border-navyblue", textColor: "text-navyblue" },
    { value: "19000+", label: "Pincodes served", borderColor: "border-navyblue", textColor: "text-navyblue" },
  ];

  return (
    <> 
    <section className="relative w-full" >
      {/* Background Image */}
      <img
        src={assets.heroimg}
        alt="Erovians Seller"
        className="w-[98%] m-auto h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
      />

      {/* Bottom Stats */}
      <div
        className="
          relative mt-4
          sm:mt-6
          md:absolute md:bottom-[-100px] md:left-1/2 md:transform md:-translate-x-1/2 
          w-[100%] sm:w-[85%] lg:w-[80%] 
          mx-auto
        "
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 bg-white shadow-lg rounded-xl py-6 sm:py-8 px-4 sm:px-8 text-center">
          {stats.map((stat, index) => (
            <StatCircle key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
   
    </>
  );
}
