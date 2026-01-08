// src/components/Sidebar/MobileFilterButton.jsx
import { SlidersHorizontal } from "lucide-react";

const MobileFilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-navyblue text-white p-4 rounded-full shadow-2xl hover:bg-blue transition-all z-30 flex items-center gap-2 lg:hidden"
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span className="font-medium">Filters</span>
    </button>
  );
};

export default MobileFilterButton;
