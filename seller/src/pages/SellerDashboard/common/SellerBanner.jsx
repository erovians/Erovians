import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessStories() {
  const feedbacks = [
    {
      img: "https://cdn.prod.website-files.com/605826c62e8de87de744596e/65d811b0e861a69b3c91050a_31%20Insanely%20Powerful%20Online%20Promotion%20Ideas%20For%20eCommerce.webp",
    },
    {
      img: "https://cdn.prod.website-files.com/605826c62e8de87de744596e/6705422840d87b202d78b115_6620c3271e8ba235629f427d_Forever%252021%2520PLP%2520(1).webp",
    },
    {
      img: "https://cdn.prod.website-files.com/605826c62e8de87de744596e/6705422840d87b202d78b115_6620c3271e8ba235629f427d_Forever%252021%2520PLP%2520(1).webp",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section>
      <div className="relative w-full">
        <Carousel className="w-full max-w-lg overflow-hidden">
          <CarouselContent
            className="transition-transform duration-500"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {feedbacks.map((f, index) => (
              <CarouselItem key={index} className="w-full flex-shrink-0">
                <div className="relative">
                  <Card className=" overflow-hidden">
                    <CardContent className="flex flex-col items-center text-center p-0">
                      <img
                        src={f.img}
                        alt={`Story ${index + 1}`}
                        className="object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Indicators overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {feedbacks.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-blue-600 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
