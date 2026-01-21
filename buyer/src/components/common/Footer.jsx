import React from "react";
import { Link } from "react-router-dom";
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
import { assets } from "../../assets/assets";

export default function Footer() {
  return (
    <footer className="text-white flex flex-col">
      <div className="bg-navyblue px-4 sm:px-6 md:px-8 py-12 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
        <div className="lg:col-span-1">
          <Link to="/">
            <img
              src={assets.logowhite}
              alt="Erovians Logo"
              className="h-12 md:h-14 mb-6 cursor-pointer"
            />
          </Link>
          <p className="text-sm leading-5 text-white/90 mb-8">
            <span className="font-semibold text-white">Erovians</span> is a
            digital marketplace built for the stone industry. We connect buyers
            and sellers of marble, granite, and natural stones through a
            transparent, reliable, and easy-to-use platform.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
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
            <li>
              <Link
                to="/contact"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>
            </li>
            <li>
              <Link
                to="/refund-policy"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refund</span>
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Info className="w-4 h-4" />
                <span>Help Center</span>
              </Link>
            </li>
            <li>
              <Link
                to="/live-chat"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Live Chat</span>
              </Link>
            </li>
            <li>
              <Link
                to="/track-order"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Package className="w-4 h-4" />
                <span>Check Order Status</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            Selling
          </h1>
          <ul className="space-y-3">
            <li>
              <Link
                to="/become-seller"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Store className="w-4 h-4" />
                <span>Start Selling</span>
              </Link>
            </li>
            <li>
              <Link
                to="/seller-verification"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <FileCheck className="w-4 h-4" />
                <span>Seller Verification</span>
              </Link>
            </li>
            <li>
              <Link
                to="/partnership"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Erovians Partnership</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-white" />
            Payment
          </h1>
          <ul className="space-y-3">
            <li>
              <Link
                to="/product-monitor"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Package className="w-4 h-4" />
                <span>Product Monitor Service</span>
              </Link>
            </li>
            <li>
              <Link
                to="/money-back-policy"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Money Back Policy</span>
              </Link>
            </li>
            <li>
              <Link
                to="/how-to-pay"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <CreditCard className="w-4 h-4" />
                <span>How to Pay?</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h1 className="text-white font-bold text-base md:text-lg mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-white" />
            Erovians
          </h1>
          <ul className="space-y-3">
            <li>
              <Link
                to="/about"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link
                to="/news"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Newspaper className="w-4 h-4" />
                <span>News Center</span>
              </Link>
            </li>
            <li>
              <Link
                to="/social"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
                <span>Social Links</span>
              </Link>
            </li>
            <li>
              <Link
                to="/company-info"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <FileCheck className="w-4 h-4" />
                <span>Erovians Information</span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="flex items-center gap-2.5 hover:translate-x-1 transition-transform text-sm text-white/80 hover:text-white"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-900 py-5 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-300">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
          <Link
            to="/help"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help Center
          </Link>
          <span className="hidden sm:inline text-gray-600">|</span>
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="hidden sm:inline text-gray-600">|</span>
          <Link
            to="/terms-of-service"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </div>
        <p className="text-sm text-center sm:text-right">
          © 2026 Erovians. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
