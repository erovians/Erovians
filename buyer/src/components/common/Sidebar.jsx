import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  Palette,
  Home,
  Award,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

const marbleSubcategories = [
  {
    name: "Italian Marble",
    subcategories: ["Statuario", "Carrara", "Calacatta", "Botticino"],
  },
  {
    name: "Indian Marble",
    subcategories: ["Makrana", "Rajasthan Pink", "Ambaji White"],
  },
  { name: "Imported Marble", subcategories: ["Turkish", "Egyptian", "Greek"] },
];

const graniteSubcategories = [
  {
    name: "Indian Granite",
    subcategories: ["Black Galaxy", "Tan Brown", "Kashmir White"],
  },
  {
    name: "Imported Granite",
    subcategories: ["Brazilian", "Italian", "African"],
  },
];

const popularMarbles = [
  "Imported Marble",
  "Italian Marble",
  "Flawless White Onyx",
  "Statuario Marble",
  "Carrara Marble",
];
const popularGranites = [
  "Black Galaxy",
  "Tan Brown",
  "Kashmir White",
  "Absolute Black",
  "River White",
];

const colors = [
  { name: "White", color: "#FFFFFF", border: true },
  { name: "Black", color: "#000000" },
  { name: "Gray", color: "#808080" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Brown", color: "#92400e" },
  { name: "Yellow", color: "#eab308" },
  { name: "Red", color: "#ef4444" },
];

const spaces = [
  "Living Room",
  "Kitchen",
  "Washroom",
  "Bedroom",
  "Dining Room",
  "Office",
];
const grades = ["Grade A", "Grade B", "Grade C"];
const origins = ["Dehradun", "Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu"];

const FilterSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  isCollapsed,
  setIsCollapsed, // Add this prop
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (isCollapsed) {
    return (
      <div
        className="border-b border-gray-200 py-3 px-3 hover:bg-gray-50 transition-colors group relative cursor-pointer"
        onClick={() => setIsCollapsed(false)} // Add click handler to expand
      >
        <div className="flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {title}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isOpen && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
};

const NestedCategory = ({ category, subcategories }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ml-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-3 hover:bg-blue-50 rounded-lg transition-colors group"
      >
        <span className="text-sm text-gray-700 group-hover:text-blue-600">
          {category}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="ml-4 space-y-1 mt-1">
          {subcategories.map((sub) => (
            <label
              key={sub}
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {sub}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [selectedCategory, setSelectedCategory] = useState("marbles");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Toggle Button - Moved outside the aside to avoid scrollbar interference */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50 items-center justify-center"
        style={{
          left: isCollapsed ? "80px" : "320px", // Position just outside the sidebar width
          top: "120px", // 96px (aside top) + 24px (button top-6)
          width: "32px",
          height: "32px",
        }}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <PanelLeftClose className="w-4 h-4" />
        )}
      </button>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-80"}`}
        style={{
          top: "96px", // Header height (h-24)
          height: "calc(100vh - 96px)", // Full height minus header
        }}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 mt-3.5">
          {!isCollapsed ? (
            <>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                </div>
              </div>

              <div className="px-6 pb-4">
                <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                  <button
                    onClick={() => setSelectedCategory("marbles")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      selectedCategory === "marbles"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Marbles
                  </button>
                  <button
                    onClick={() => setSelectedCategory("granite")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      selectedCategory === "granite"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Granite
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-3 py-4 flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
          )}
        </div>

        {/* Filters Content */}
        <div className="pb-20">
          <FilterSection
            title="All Subcategory"
            icon={Layers}
            defaultOpen={true}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass the prop
          >
            {!isCollapsed && (
              <div className="space-y-1">
                {(selectedCategory === "marbles"
                  ? marbleSubcategories
                  : graniteSubcategories
                ).map((cat) => (
                  <NestedCategory
                    key={cat.name}
                    category={cat.name}
                    subcategories={cat.subcategories}
                  />
                ))}
              </div>
            )}
          </FilterSection>

          <FilterSection
            title={`Popular ${
              selectedCategory === "marbles" ? "Marbles" : "Granite"
            }`}
            icon={Award}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass the prop
          >
            {!isCollapsed && (
              <div className="space-y-2">
                {(selectedCategory === "marbles"
                  ? popularMarbles
                  : popularGranites
                ).map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </FilterSection>

          <FilterSection
            title="By Color"
            icon={Palette}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass the prop
          >
            {!isCollapsed && (
              <div className="grid grid-cols-2 gap-2">
                {colors.map((color) => (
                  <label
                    key={color.name}
                    className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{
                        backgroundColor: color.color,
                        border: color.border ? "1px solid #e5e7eb" : "none",
                      }}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {color.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </FilterSection>

          <FilterSection
            title="By Spaces"
            icon={Home}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass the prop
          >
            {!isCollapsed && (
              <div className="space-y-2">
                {spaces.map((space) => (
                  <label
                    key={space}
                    className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {space}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </FilterSection>

          <FilterSection
            title="By Grade"
            icon={Award}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass the prop
          >
            {!isCollapsed && (
              <div className="flex gap-2">
                {grades.map((grade) => (
                  <label key={grade} className="flex-1 cursor-pointer">
                    <input type="radio" name="grade" className="peer sr-only" />
                    <div className="py-2 px-4 text-center border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:border-gray-300 transition-all">
                      {grade.replace("Grade ", "")}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </FilterSection>

          <FilterSection
            title="Origin"
            icon={MapPin}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass the prop
          >
            {!isCollapsed && (
              <div className="space-y-2">
                {origins.map((origin) => (
                  <label
                    key={origin}
                    className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {origin}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </FilterSection>
        </div>

        {/* Clear Filters Button - Sticky Bottom */}
        {!isCollapsed && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <button className="w-full py-2.5 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Clear All Filters
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
