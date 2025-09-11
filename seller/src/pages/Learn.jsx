import { assets } from "@/assets/assets";
import Banner from "@/common/Banner";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Learn = () => {
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

  const banners = [
    assets.heroimg,
    assets.heroimg,
    assets.heroimg,
    assets.heroimg,
    assets.heroimg,
  ];

  return (
    <>
      {/* Hero Banner */}
      <Banner
        title="Grow Your Business with Erovians"
        description="Sell your products online and reach crores of customers through Erovians’s selling tools for suppliers"
        subdescription="Don’t have a GSTIN or have a Composition GSTIN? You can still sell on Erovians."
        img={assets.learn_banner_img}
      />

      {/* Testimonials / Banner Carousel Section */}
      <div
        className="flex flex-col w-full mt-10 px-4 py-10 min-h-fit"
        id="whatSellerSays"
      >
        {/* Section Heading */}
        <div className="mb-6 rich-text text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            What Our <span className="text-navyblue">Sellers</span> Say?
          </h1>
          <p className="mt-2 text-gray-700 text-base md:text-lg">
            Hear from our trusted partners who are growing with Erovians
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full flex justify-center py-12">
          <Carousel className="w-full max-w-6xl relative">
            <CarouselContent className="flex gap-4">
              {banners.map((banner, index) => (
                <CarouselItem
                  key={index}
                  className="flex-shrink-0 w-64 md:w-80 lg:w-96"
                >
                  <Card className="hover:scale-105 transition-transform duration-300 shadow-lg overflow-hidden">
                    <CardContent className="flex items-center justify-center p-0 h-[300px] md:h-[400px] lg:h-[500px]">
                      <img
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="hidden md:flex w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-100 transition-colors absolute left-0 top-1/2 -translate-y-1/2 z-10">
              &#10094;
            </CarouselPrevious>
            <CarouselNext className="hidden md:flex w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-100 transition-colors absolute right-0 top-1/2 -translate-y-1/2 z-10">
              &#10095;
            </CarouselNext>
          </Carousel>
        </div>
      </div>

      {/* Accrodian */}
    <section className="w-full flex justify-center py-10 px-4 bg-gray-50" >
      <div className="w-full max-w-3xl rich-text">
        {/* Section Heading */}
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-8">
          Commonly <span className="text-navyblue">Asked </span> Questions
        </h1>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full divide-y">
            <AccordionItem value="item-1" className="py-4">
              <AccordionTrigger className="text-base font-medium text-gray-900">
                I have a Composition GSTIN. Can I sell on Erovians?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                Yes, you can sell on Erovians with a Composition GSTIN. However,
                certain categories may have restrictions depending on compliance
                and GST rules.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="py-4">
              <AccordionTrigger className="text-base font-medium text-gray-900">
                I don’t have a GSTIN. Can I still register as a seller?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                Yes! Even if you don’t have a GSTIN or have a Composition GSTIN,
                you can still sell on Erovians. We provide a simple onboarding
                process for all sellers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="py-4">
              <AccordionTrigger className="text-base font-medium text-gray-900">
                What documents are required to start selling on Erovians?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                To get started, you need a valid bank account, PAN card, and
                business details. GSTIN is optional for certain categories and
                sellers under Composition schemes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="py-4">
              <AccordionTrigger className="text-base font-medium text-gray-900">
                How does Erovians support new sellers?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                We provide dedicated seller support, training resources, and
                easy-to-use tools to help you list products, manage inventory,
                and reach crores of customers online.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="py-4">
              <AccordionTrigger className="text-base font-medium text-gray-900">
                What are the benefits of selling on Erovians?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                With Erovians, you get access to a large customer base, low
                commission rates, reliable logistics support, and secure
                payments—all designed to grow your business faster.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default Learn;
