import React, { useEffect } from "react";
import Banner from "@/common/Banner";
import { assets } from "@/assets/assets";
import {
  UserPlus,
  ShieldCheck,
  KeyRound,
  ShoppingCart,
  Gem,
  Layers,
  Phone,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const SellOnline = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);
  return (
    <div className="flex flex-col">
      {/* Banner Section */}
      <div className="min-h-[80vh] flex items-center ">
        <Banner
          title="Start Selling Online with Erovians"
          description="Grow your marble and granite business by selling products online and reach customers across India with Erovians’s powerful tools for sellers."
          subdescription="Getting started is simple—just a few documents and you’re ready to sell on Erovians."
          img={assets.sell_online_banner}
        />
      </div>

      {/* Create Account Section */}
      <section
        className="bg-white py-12 px-6 md:px-16 min-h-[80vh] flex flex-col justify-center"
        id="createAccount"
      >
        {/* Title */}
        <div className="rich-text">
          <h1 className="mb-4">
            <span className="text-navyblue">Create Account</span>
          </h1>
          <p className="mb-10">
            Creating your seller account is quick and requires GST details along
            with a few business documents. Follow the steps below to ensure a
            smooth onboarding experience and start selling online.
          </p>
        </div>

        {/* Steps */}
        <div className="rounded-xl mb-12">
          <h3 className="mb-6">Steps to create your seller account -</h3>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <UserPlus className="text-navyblue w-8 h-8 mb-2" />,
                title: "Register Yourself",
                desc: "Fill details with GST and other required info",
              },
              {
                icon: <ShieldCheck className="text-navyblue w-8 h-8 mb-2" />,
                title: "Verification",
                desc: "Admin reviews documents",
              },
              {
                icon: <KeyRound className="text-navyblue w-8 h-8 mb-2" />,
                title: "Approval & Credentials",
                desc: "Credentials shared once approved",
              },
              {
                icon: <ShoppingCart className="text-navyblue w-8 h-8 mb-2" />,
                title: "Start Selling",
                desc: "List your natural stone products online",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center  rounded-lg p-4  transition h-full"
              >
                {step.icon}
                <p className="font-medium">{step.title}</p>
                <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <h3 className="text-xl font-semibold mb-6">
          Popular categories to sell
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Sell Marble Online",
              icon: <Gem className="w-6 h-6 text-navyblue mb-2" />,
            },
            {
              name: "Sell Granite Online",
              icon: <Layers className="w-6 h-6 text-navyblue mb-2" />,
            },
          ].map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 border rounded-xl bg-white text-gray-800 text-sm font-medium shadow-sm hover:shadow-md hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 h-full"
            >
              {category.icon}
              <span className="mt-2 text-base font-semibold">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* List Products Section */}
      <section
        className="py-12 px-6 md:px-16 min-h-[80vh] flex flex-col justify-center"
        id="list-product"
      >
        {/* Title */}
        <div className="rich-text">
          <h1 className="mb-4">
            <span className="text-navyblue">List Your Products</span>
          </h1>
          <p className="mb-10">
            What is a listing? A listing refers to the process of registering
            your marble and granite products on the Erovians platform, making
            them visible to customers, and enabling them to view and purchase.
            It involves creating a detailed product page that includes essential
            information such as product title, description, images, pricing, and
            other relevant details. A well-crafted listing helps attract
            potential customers and facilitates the sale of your products.
          </p>
        </div>

        {/* Tip */}
        <div className="bg-white border-l-4 border-r-3 border-navyblue p-4 mb-10 shadow-sm rounded-md">
          <p className="text-gray-700 text-sm">
            💡 Did you know that providing precise and comprehensive information
            about your product, along with clear and captivating images, can
            increase its visibility on our platform by up to{" "}
            <span className="font-semibold">15%</span>?
          </p>
        </div>

        {/* Listing Methods */}
        <h3 className="mb-6">
          Listing on Erovians can be done in 2 different ways:
        </h3>

        <div className="grid md:grid-cols-2 gap-8 flex-grow">
          {[
            {
              video: "https://www.youtube.com/embed/YOUR_VIDEO_ID_1",
              title: "1. Match with existing products",
              desc: "If your marble or granite type is already listed on Erovians, you can seamlessly link or ‘attach’ your product to the existing catalog and start selling immediately.",
            },
            {
              video: "https://www.youtube.com/embed/YOUR_VIDEO_ID_2",
              title: "2. New product",
              desc: "For marble or granite products not currently available on Erovians, you’ll need to provide complete details and create a new listing. This allows customers to discover your unique product.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-sm p-4 flex flex-col h-full hover:shadow-md transition"
            >
              <div className="relative pb-[56.25%] mb-4">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-md"
                  src={item.video}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm flex-grow">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Help and support */}
      <section className=" py-12 px-6 md:px-16" id="help-support">
        <div className="max-w-full md:flex md:items-center md:justify-between  ">
          {/* Text Section */}
          <div className="rich-text md:w-1/2 mb-8 md:mb-0">
            <h1 className=" mb-4">
              <span className="text-navyblue">
                We’re Here to Help & Support You
              </span>
            </h1>
            <p className="mb-6">
              Have questions or need assistance with selling on our platform?
              Explore our guides, FAQs, or reach out to our support team
              anytime. We’re committed to helping you succeed.
            </p>
            <a
              href="#contact-support"
              className="bg-navyblue flex w-fit gap-2  border text-white px-6 py-3 rounded-lg hover:bg-white hover:text-navyblue hover:border-navyblue"
            >
              Contact Support{" "}
              <span>
                <Phone />
              </span>
            </a>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center ">
            <img
              src={assets.sell_online_helpandsupport}
              alt="Help & Support Illustration"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellOnline;
