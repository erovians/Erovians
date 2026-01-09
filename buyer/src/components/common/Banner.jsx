import { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { assets } from "../../assets/assets";

const Banner = () => {
  const slides = [
    {
      id: 1,
      image: assets.banner1,
      bg: "bg-gradient-to-r from-blue-500 to-purple-600",
    },
    {
      id: 2,
      image: assets.banner2,
      bg: "bg-gradient-to-r from-green-500 to-teal-600",
    },
    {
      id: 3,
      image: assets.banner3,
      bg: "bg-gradient-to-r from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="w-full hidden lg:block">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-64 md:h-80 lg:h-full overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback gradient if image fails */}
                <div
                  className={`w-full h-full ${slide.bg} items-center justify-center text-white text-3xl font-bold hidden`}
                >
                  {slide.title}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 " />
        <CarouselNext className="right-4 " />
      </Carousel>
    </div>
  );
};

export default Banner;
