import React from "react";
import { Construction, Home, Hammer, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";


const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* Construction Icons Animation */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <Hammer
              className="w-12 h-12 text-orange-500 animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <Construction
              className="w-16 h-16 text-amber-600 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <Wrench
              className="w-12 h-12 text-orange-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Under Construction
          </h1>

          <div className="w-32 h-1 bg-linear-to-r from-orange-400 to-amber-500 mx-auto mb-6"></div>

          <p className="text-xl text-gray-600 mb-4">
            We're working hard to bring you something amazing!
          </p>

          <p className="text-gray-500 mb-8">
            This page is currently being built. Check back soon for updates.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-orange-400 to-amber-500 h-3 rounded-full animate-pulse"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Progress: 65%</p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center gap-4 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
            <div
              className="w-2 h-2 rounded-full bg-amber-300 animate-ping"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-orange-300 animate-ping"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>
      </div>
  
  );
};

export default UnderConstruction;