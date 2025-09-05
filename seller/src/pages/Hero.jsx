import React from "react";
import { assets } from "@/assets/assets";

export default function Hero() {
  return (
    <>
     
      <section className="relative w-full">
        {/* Background Image */}
        <img
          src={assets.heroimg}
          alt="Erovians Seller"
          className="w-full h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
        />

        {/* Bottom Stats */}
        <div
          className="
            relative mt-6
            md:absolute md:bottom-[-100px] md:left-1/2 md:transform md:-translate-x-1/2 
            w-full sm:w-[85%] lg:w-[80%] 
            mx-auto
          "
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 bg-white shadow-lg rounded-xl py-6 sm:py-8 px-4 sm:px-8 text-center">
            
            {/* Reusable Stat Box */}
            {[
              { value: "14 Lakh+", label: "Seller community", color: "blue-500" },
              { value: "24×7", label: "Online Business", color: "green-500" },
              { value: "7", label: "days* payment", color: "red-500" },
              { value: "19000+", label: "Pincodes served", color: "purple-500" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 mx-auto p-4"
              >
                {/* Rotating border (only animate for the 2nd one here, can add to all if needed) */}
                <div
                  className={`absolute inset-0 rounded-full border-2 border-${stat.color} ${
                    idx === 1 ? "animate-spin-slow" : ""
                  }`}
                ></div>

                {/* Inner content */}
                <div className="relative bg-white rounded-full w-full h-full flex flex-col items-center justify-center ">
                  <h2
                    className={`text-xl sm:text-2xl md:text-3xl font-bold text-${stat.color}`}
                  >
                    {stat.value}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
