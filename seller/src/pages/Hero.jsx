import React from "react";
import { assets } from "@/assets/assets"; 

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* Background Image */}
      <img
        src={assets.heroimg}
        alt="Erovians Seller"
        className="w-full h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover "
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
          
          {/* Single Stat */}
          <div className="flex flex-col items-center justify-center bg-white rounded-full shadow-md border border-gray-200 w-32 h-32 sm:w-40 sm:h-40 mx-auto p-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue">
              14 Lakh+
            </h2>
            <p className="text-grey text-xs sm:text-sm mt-1">Seller community</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white rounded-full shadow-md border border-gray-200 w-32 h-32 sm:w-40 sm:h-40 mx-auto p-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue">
              24×7
            </h2>
            <p className="text-grey text-xs sm:text-sm mt-1">Online Business</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white rounded-full shadow-md border border-gray-200 w-32 h-32 sm:w-40 sm:h-40 mx-auto p-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue">
              7
            </h2>
            <p className="text-grey text-xs sm:text-sm mt-1">days* payment</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white rounded-full shadow-md border border-gray-200 w-32 h-32 sm:w-40 sm:h-40 mx-auto p-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue">
              19000+
            </h2>
            <p className="text-grey text-xs sm:text-sm mt-1">Pincodes served</p>
          </div>

        </div>
      </div>
    </section>
  );
}
