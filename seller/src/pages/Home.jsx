import { assets } from "@/assets/assets";
import Cards from "@/components/Home/Cards";
import CarouselMain from "@/components/Home/CarouselMain";
import WhySellersLove from "@/components/Home/WhySellersLove";
import Hero from "@/components/Home/Hero";
import React from "react";

const Home = () => {
  const steps = [
    {
      step: "Step 1",
      title: "Join Erovians",
      description: "Create a Seller Account",
      image: assets.joinimg,
    },
    {
      step: "Step 2",
      title: "Sell Your Products",
      description: "List and manage your products",
      image: assets.sellimg,
    },
    {
      step: "Step 3",
      title: "Build Your Brand",
      description: "Grow your business with us",
      image: assets.brandimg,
    },
  ];
  return (
    <div>
      <Hero />

      <section className="w-full px-6 py-16 mt-0 sm:mt-30  ">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 rich-text">
          <h1>
            Make <span className="text-blue">Erovians</span> Your Next Big Move
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Join thousands of sellers already growing their business with us.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-[100%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {steps.map((s, i) => (
            <div
              key={i}
              className="w-full transform transition duration-300 hover:scale-105"
            >
              <Cards {...s} />
            </div>
          ))}
        </div>
      </section>
      <WhySellersLove />
      <CarouselMain />
    </div>
  );
};

export default Home;
