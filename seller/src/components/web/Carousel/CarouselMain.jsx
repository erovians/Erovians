import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {ChartNoAxesColumn} from "lucide-react";
import { assets } from "@/assets/assets";

export default function SuccessStories() {
  const feedbacks = [
    {
      name: "Ekta Shah",
      company: "Glide Route Ventures",
      feedback:
        "From 5 to 40+ brands, Erovian's seamless registration, seller support & account managers' guidance fueled our growth in beauty & grooming sectors.",
      img: "https://via.placeholder.com/100", 
    },
    {
      name: "Ravi Kumar",
      company: "Tech World",
      feedback:
        "Erovians provided the best platform for scaling our business. The onboarding was simple and support is excellent.",
      img: "https://via.placeholder.com/100",
    },
    {
      name: "Anjali Verma",
      company: "Fashion Hub",
      feedback:
        "With Erovians's guidance, our business reached new markets and expanded our product visibility like never before.",
      img: "https://via.placeholder.com/100",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % feedbacks.length);
  const handlePrev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? feedbacks.length - 1 : prev - 1
    );

  return (
    <section className="w-full py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side */}
        <div className="rich-text">
          <h1 className="mb-4">
            <span className="text-blue">Seller </span>Success Stories
          </h1>
          <p className="  mb-6" >
            14 Lakh+ sellers trust Erovians for their online business. Now its your turn to take big move with Erovians.
          </p>
          <button className="px-6 border flex gap-2 py-3 bg-blue text-white rounded-md shadow hover:bg-white hover:text-blue hover:border-blue transition cursor-pointer">
            See All Stories <ChartNoAxesColumn/>
          </button>
        </div>

        {/* Right Side */}
        <div className="relative">
          <Carousel className="w-full max-w-lg mx-auto">
            <CarouselContent>
              {feedbacks.map((f, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-white rounded-2xl shadow-lg p-8">
                    <CardContent className="flex flex-col items-center text-center space-y-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                          src={assets.ekta}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {f.name}
                        </h3>
                        <p className="text-sm text-gray-500">{f.company}</p>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed">
                        “{f.feedback}”
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
              <span onClick={handlePrev}><CarouselPrevious className=" ml-8 h-10 w-10 sm:h-15 sm:w-15 sm:ml-0 "/></span>
               <span onClick={handleNext}><CarouselNext  className="mr-8 h-10 w-10 sm:h-15 sm:w-15 sm:mr-0 " /></span>
          
          </Carousel>

          {/* Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {feedbacks.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === activeIndex ? "bg-blue" : "bg-grey"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
