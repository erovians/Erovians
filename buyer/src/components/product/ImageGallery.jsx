import React, { useState } from "react";
import { Package } from "lucide-react";

const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPosition({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex gap-4">
        <div className="w-14 bg-gray-100 rounded"></div>
        <div className="flex-1 bg-gray-100 rounded h-96 flex items-center justify-center">
          <Package className="h-24 w-24 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 w-14">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            onMouseEnter={() => setSelectedImage(index)}
            className={`border-2 rounded overflow-hidden transition-all ${
              selectedImage === index
                ? "border-blue-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <img
              src={img}
              alt={`${productName} ${index + 1}`}
              className="w-full h-14 object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        <div
          className="relative bg-white border border-gray-300 rounded overflow-hidden cursor-crosshair"
          style={{ height: "500px" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
        >
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-contain p-8"
          />
        </div>

        {showMagnifier && (
          <div className="absolute left-full top-0 ml-4 hidden lg:block z-50">
            <div
              className="border-2 border-gray-400 rounded overflow-hidden bg-white shadow-2xl"
              style={{
                width: "500px",
                height: "500px",
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${images[selectedImage]})`,
                  backgroundSize: "250%",
                  backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
