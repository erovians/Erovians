import React from "react";
import { assets } from "@/assets/assets";
import {
  Mail,
  Phone,
  MessageCircle,
  Package,
  DollarSign,
  ShoppingBag,
  Info,
  Newspaper,
  Share2,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CreditCard,
  Store,
  FileCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white flex flex-col">
      <div className="bg-navyblue px-4 sm:px-6 md:px-8 py-12 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
        <div className="lg:col-span-1">
          <img
            src={assets.logowhite}
            alt="Erovians Logo"
            className="h-12 md:h-14 mb-6"
          />
          <p className="text-sm leading-5 text-white/90 mb-8">
            <span className="font-semibold text-white">Erovians</span> is a
            digital marketplace built for the stone industry. We connect buyers
            and sellers of marble, granite, and natural stones through a
            transparent, reliable, and easy-to-use platform.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-white" />
            Support
          </h1>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <RefreshCw className="w-4 h-4" />
              <span>Refund</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Info className="w-4 h-4" />
              <span>Help Center</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Package className="w-4 h-4" />
              <span>Check Order Status</span>
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            Selling
          </h1>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Store className="w-4 h-4" />
              <span>Start Selling</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <FileCheck className="w-4 h-4" />
              <span>Seller Verification</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              <span>Erovians Partnership</span>
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-white" />
            Payment
          </h1>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Package className="w-4 h-4" />
              <span>Product Monitor Service</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              <span>Money Back Policy</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <CreditCard className="w-4 h-4" />
              <span>How to Pay?</span>
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-white" />
            Erovians
          </h1>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Info className="w-4 h-4" />
              <span>About</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Newspaper className="w-4 h-4" />
              <span>News Center</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Share2 className="w-4 h-4" />
              <span>Social Links</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <FileCheck className="w-4 h-4" />
              <span>Erovians Information</span>
            </li>
            <li className="flex items-center gap-2.5 hover:translate-x-1 transition-transform cursor-pointer text-sm text-white/80 hover:text-white">
              <Phone className="w-4 h-4" />
              <span>Contact Us</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-900 py-5 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-300">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
          <a
            href="#"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help Center
          </a>
          <span className="hidden sm:inline text-gray-600">|</span>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <span className="hidden sm:inline text-gray-600">|</span>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
        <p className="text-sm text-center sm:text-right">
          © 2026 Erovians. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
