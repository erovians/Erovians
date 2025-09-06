import React from "react";
import { assets } from "@/assets/assets"; // adjust path if needed

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Section */}
        <div>
          <img src={assets.logo} alt="Logo" className="h-12 mb-5" />
          <p className="text-sm leading-relaxed mb-6">
            Join <span className="font-semibold text-blue-400">Erovians</span> today 
            and grow your business with a trusted platform designed for sellers like you.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg">
            Get Started
          </button>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
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
          <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
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

      {/* Bottom Note */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} <span className="text-blue-400">Erovians</span>. All rights reserved.
      </div>
    </footer>
  );
}
