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
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="hidden lg:block w-14 bg-gray-100 rounded"></div>
        <div className="flex-1 bg-gray-100 rounded h-96 flex items-center justify-center">
          <Package className="h-24 w-24 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Desktop: Thumbnails on LEFT (Column) */}
      <div className="hidden lg:flex flex-col gap-3 w-14">
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

      {/* Main Content Wrapper */}
      <div className="flex-1">
        {/* Main Image */}
        <div className="relative">
          <div
            className="relative bg-white border border-gray-300 rounded overflow-hidden cursor-crosshair h-50 lg:h-125"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseLeave={() => setShowMagnifier(false)}
          >
            <img
              src={images[selectedImage]}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Magnifier - Desktop only */}
          {showMagnifier && (
            <div className="absolute left-full top-0 ml-15 hidden lg:block z-10">
              <div
                className="border-2 border-gray-400 rounded overflow-hidden bg-white shadow-2xl"
                style={{
                  width: "720px",
                  height: "620px",
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

        {/* Mobile/Tablet: Thumbnails at BOTTOM (Horizontal Row) */}
        <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`border-2 rounded overflow-hidden transition-all shrink-0 ${
                selectedImage === index
                  ? "border-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ width: "64px", height: "64px" }}
            >
              <img
                src={img}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
