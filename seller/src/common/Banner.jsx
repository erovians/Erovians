import React from "react";

const Banner = ({ title, img, description, subdescription }) => {
  return (
    <section className="w-full h-[100%]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 md:gap-10 items-center">
        {/* Left Section */}
        <div className="space-y-6 rich-text text-center sm:text-start">
          <h1
            className="leading-snug"
          >
            <span className="text-3xl sm:text-5xl text-navyblue">{title}</span>
          </h1>
          <p className="text-gray-700 text-lg">{description} </p>

          <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
            <span className="text-grey text-sm">{subdescription}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={img} // replace with your image
            alt="Erovians Seller"
            className="w-full max-w-md lg:max-w-lg object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
