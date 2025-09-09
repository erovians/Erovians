import React from "react";
import { assets } from "@/assets/assets"; // adjust path if needed
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-blue text-gray-300 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 lg:grid-cols-2">
        {/* Left Section */}
        <div>
          <img src={assets.logowhite} alt="Logo" className="h-14 mb-6" />
          <p className="text-sm leading-relaxed mb-6 max-w-sm">
            Join <span className="font-semibold text-blue-400">Erovians</span>{" "}
            today and grow your business with a trusted platform designed for
            sellers like you.
          </p>
          {/* <button className=" text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg">
        Get Started
      </button> */}
          <Button
            variant="outline"
            className="bg-white text-black py-5 px-8  border border-navyblue cursor-pointer"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2">
          {/* Middle Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {["Home", "About Us", "Services", "Contact"].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-200 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Resources</h3>
            <ul className="space-y-3 text-sm">
              {["Blog", "FAQ", "Support"].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-200 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-gray-700 mt-16 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-white">Erovians.</span> All rights reserved.
      </div>
    </footer>
  );
}
