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
            <h2 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h2>
            <ul className="space-y-3 text-sm">
              {["Sell Online", "Fee & Commission", "Grow", "Learn"].map(
                (link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors duration-200 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Right Section */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-5">Resources</h2>
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
      <div className="border-t border-gray-700 mt-16 pt-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Legal Links */}
          <ul className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <li>
              <a
                href="/legal/privacy-policy"
                className="hover:text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/legal/terms-of-use"
                className="hover:text-blue-400 hover:underline"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href="/legal/cookie-policy"
                className="hover:text-blue-400 hover:underline"
              >
                Cookie Policy
              </a>
            </li>
            <li>
              <a
                href="/legal/community-guidelines"
                className="hover:text-blue-400 hover:underline"
              >
                Community Guidelines
              </a>
            </li>
            <li>
              <a
                href="/legal/shipping-policy"
                className="hover:text-blue-400 hover:underline"
              >
                Shipping Policy
              </a>
            </li>
            <li>
              <a
                href="/legal/seller-agreement"
                className="hover:text-blue-400 hover:underline"
              >
                Seller Agreement
              </a>
            </li>
          </ul>

          {/* Right: Copyright */}
          <div className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="text-white">Erovians.</span> All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
