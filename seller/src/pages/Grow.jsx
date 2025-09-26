import React, { useEffect } from "react";
import Banner from "@/common/Banner";
import { assets } from "@/assets/assets";
import { useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Grow = () => {
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
        title="Grow Your Business with Erovians"
        description="Grow your marble and granite business by selling products online and reach customers across India with Erovians’s powerful tools for sellers."
        subdescription="Getting started is simple—just a few documents and you’re ready to sell on Erovians."
        img={assets.grow_banner_img}
      />
      {/* Create Account Section */}
      <section className="bg-white md:py-10 px-6 md:px-16" id="VerifiedBadge">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="rich-text" >
            <h1 className="mb-4">
              <span className="text-navyblue">Verified Badge</span>
            </h1>
            <p className="mb-6 leading-relaxed">
              Become a trusted seller on{" "}
              <span className="font-semibold">Erovians</span>
              by earning your Verified Badge. This badge shows customers that
              you are an <strong>authentic and authorized seller</strong>,
              giving buyers confidence in your products. A verified profile not
              only builds trust but also helps boost your sales and visibility
              across the platform.
            </p>

            <h3 className="mb-2">Why get Verified?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✔</span>
                Gain customer trust with the official verification badge
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✔</span>
                Higher visibility and credibility on product listings
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✔</span>
                Boost sales by attracting serious buyers
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✔</span>
                Stand out from unverified competitors
              </li>
            </ul>
          </div>
          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src={assets.grow_verified} // 🔄 replace with your image/icon
              alt="Verified Badge"
            />
          </div>
        </div>
      </section>

      {/* Advertise Products Section */}
      <section
        className="md:py-10 px-6 md:px-16 bg-white"
        id="AdvertiseProducts"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-10 items-center">
          {/* Right Image */}
          <div className="flex justify-center ">
            <img
              src={assets.grow_advertised}
              alt="advertise_products"
              className="md:h-fit w-full "
            />
          </div>
          {/* Left Content */}
          <div className="rich-text">
            <h1 className="mb-4">
              <span className="text-navyblue">Advertise Your Products</span>
            </h1>
            <p className="mb-6 text-gray-600 leading-relaxed">
              Supercharge your online business with Erovians Advertising, a
              powerful marketing solution that enables you to showcase your
              products to millions of Erovians customers every day. With
              Erovians Advertising, you can expand your reach, boost sales, and
              accelerate the growth of your online business. Maximise your
              visibility, engage with potential customers, and unlock new
              opportunities for success.
            </p>

            <h3 className="mb-2">
              Benefits of running Erovians Ads for your business:
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔</span>
                Higher Visibility: Increase your products visibility by
                appearing in top search results
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔</span>
                Actionable Insights: With insights on competition, customer
                data, and actionable insights you have control over the campaign
                to work in your favour
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Erovians Value Services */}
      <section
        className="bg-gray-50 py-6 md:py-12 px-6 md:px-16"
        id="EroviansValueServices"
      >
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-8 rich-text">
            <h1 className="mb-2">
              <span className="text-navyblue"> Erovians Value Services</span>
            </h1>
            <div className="w-20 h-1 bg-navyblue rounded"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="rich-text">
              {/* Account Management */}
              <h3 className="mb-2">Account Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Unlock the power of{" "}
                <span className="font-semibold">
                  Dedicated Account Management
                </span>
                services to efficiently manage your business on Erovians. With
                Erovians Account Manager, you'll have an expert to guide you in
                areas like optimizing product listings, boosting sales, setting
                competitive pricing, and improving delivery speed. Tap into
                personalized support to attract more customers and take your
                business to new heights.
              </p>

              {/* Premium Catalogue Services */}
              <h3 className="mb-2">Premium Catalogue Services</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                In the stone and granite industry, presentation matters as much
                as quality. Erovians Premium Catalogue Services ensure your
                products are showcased with stunning visuals, technical details,
                and interactive tools. Maximize visibility, build trust, and win
                more customers with professional services crafted for stone &
                granite sellers.
              </p>

              {/* Services Offered */}
              <h4 className="text-lg font-semibold mb-4">Services Offered:</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-navyblue w-5 h-5" />
                  Professional product photography & video (textures, finishes,
                  slabs)
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle className="text-navyblue w-5 h-5" />
                  Augmented Reality (AR) preview in kitchens, flooring &
                  interiors
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-navyblue w-5 h-5" />
                  360° stone and granite product showcase
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-navyblue w-5 h-5" />
                  Rich product descriptions with technical details (size,
                  thickness, finish)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-navyblue w-5 h-5" />
                  Quotation & material calculator tools for bulk buyers
                </li>
              </ul>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img
                src={assets.EroviansValueServices}
                alt="Erovians Value Services"
                className="rounded-xl "
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Grow;
