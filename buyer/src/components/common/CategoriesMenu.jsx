import { useState } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Natural Stones",
    slug: "natural-stones",
    subcategories: [
      "Marble",
      "Granite",
      "Sandstone",
      "Limestone",
      "Slate",
      "Quartzite",
      "Travertine",
    ],
  },
  {
    name: "Ceramic & Tiles",
    slug: "ceramic-tiles",
    subcategories: [
      "Floor Tiles",
      "Wall Tiles",
      "Vitrified Tiles",
      "Glazed Tiles",
      "Porcelain Tiles",
      "Mosaic Tiles",
    ],
  },
  {
    name: "Alternatives & Finishes",
    slug: "alternatives-finishes",
    subcategories: [
      "Quartz",
      "Engineered Stone",
      "Terrazzo",
      "Concrete",
      "Resin",
      "Metal Finishes",
    ],
  },
];

export default function CategoriesMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <div className="px-5 py-2.5 rounded-lg border-2 border-navyblue hover:border-blue hover:bg-lightblue transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-2 text-navyblue font-semibold text-sm">
          <Package className="h-4 w-4" />
          <span>Categories</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-162.5 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="grid grid-cols-3 gap-0">
            {categories.map((category) => (
              <div key={category.slug} className="border-r last:border-r-0 p-4">
                <Link
                  to={`/categories/${category.slug}`}
                  className="font-semibold text-navyblue hover:text-blue transition-colors flex items-center justify-between mb-3"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <ul className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link
                        to={`/categories/${category.slug}/${sub
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-700 hover:text-navyblue hover:underline transition-colors block py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t bg-lightblue p-4">
            <Link
              to="/categories"
              className="text-sm font-medium text-navyblue hover:underline flex items-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              View All Categories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
