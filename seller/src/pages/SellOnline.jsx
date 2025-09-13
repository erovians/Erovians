import React, { useEffect } from "react";
import Banner from "@/common/Banner";
import { assets } from "@/assets/assets";
import { Link, useLocation } from "react-router-dom";
import {
  UserPlus,
  ShieldCheck,
  KeyRound,
  ShoppingCart,
  Gem,
  Layers,
  Phone,
} from "lucide-react";

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
    <>
      {/* Banner Section */}
      <Banner
        title="Start Selling Online with Erovians"
        description="Grow your marble and granite business by selling products online and reach customers across India with Erovians’s powerful tools for sellers."
        subdescription="Getting started is simple—just a few documents and you’re ready to sell on Erovians."
        img={assets.sell_online_banner}
      />
      {/* Create Account Section */}
      <section
        className="bg-white px-6 md:py-12 md:px-16 flex flex-col justify-center"
        id="CreateAccount"
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
        className="py-6 px-6 md:py-12 md:px-16 flex flex-col justify-center"
        id="list-product"
      >
        {/* Title */}
        <div className="rich-text">
          <h1 className="mb-4">
            <span className="text-navyblue">List Your Products</span>
          </h1>
          <p className="mb-10">
            Listing your products on{" "}
            <span className="font-semibold">Erovians </span>
            means showcasing your marble and granite collections to a wide
            customer base. A product listing is more than just adding details –
            it’s about creating a complete product page that highlights key
            information such as product name, description, images,
            specifications, and pricing. A well-optimized listing not only makes
            your product discoverable but also helps build trust and encourages
            customers to make confident purchase decisions.
          </p>
        </div>

        {/* Tip */}
        <div className="bg-white border-l-4 border-r-3 border-navyblue p-4 mb-10 shadow-sm rounded-md">
          <p className="text-gray-700 text-sm">
            💡 Pro Tip: Products with detailed descriptions, accurate
            specifications, and high-quality images are proven to attract up to{" "}
            <span className="font-semibold">15% more customer engagement</span>{" "}
            and significantly improve sales on the Erovians platform.
          </p>
        </div>

        {/* Listing Methods */}
        <h3 className="mb-6 font-semibold text-lg text-gray-900">
          You can list your products on Erovians in two simple ways:
        </h3>

        <div className="grid md:grid-cols-2 gap-8 flex-grow">
          {[
            {
              image: assets.listprodcut_img1,
              title: "1. Match with Existing Category",
              desc: "If your marble or granite type is already available on Erovians, you can easily link your product to our existing catalog. This quick method saves time and lets you start selling instantly while benefiting from the visibility of an already established product page.",
            },
            {
              image: assets.listprodcut_img2,
              title: "2. Create a New Category",
              desc: "For unique or new varieties of marble and granite not listed yet, you can create a fresh product entry. By adding high-quality images, detailed descriptions, and accurate specifications, you ensure that your product stands out and reaches potential buyers effectively.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-b-3 border-navyblue p-4 flex flex-col h-full hover:shadow-md transition"
            >
              <div className="relative mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover rounded-md"
                />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm flex-grow">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Help and support */}
      <section className=" py-6 px-6 md:py-12 md:px-16" id="help&support">
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
    </>
  );
};

export default SellOnline;
