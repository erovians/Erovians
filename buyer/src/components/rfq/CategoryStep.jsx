import React from "react";

const categories = [
  {
    id: 1,
    name: "Natural Stones",
    slug: "natural-stones",
    icon: "🪨",
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
    id: 2,
    name: "Ceramic & Tiles",
    slug: "ceramic-tiles",
    icon: "🔲",
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
    id: 3,
    name: "Alternatives & Finishes",
    slug: "alternatives-finishes",
    icon: "✨",
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

const CategoryStep = ({ formData, setFormData, errors, setErrors }) => {
  const handleCategorySelect = (cat) => {
    setFormData({
      ...formData,
      category: cat.slug,
      categoryName: cat.name,
      subcategories: [],
    });
    setErrors({ ...errors, category: "" });
  };

  const handleSubcategoryToggle = (sub) => {
    const newSubs = formData.subcategories.includes(sub)
      ? formData.subcategories.filter((s) => s !== sub)
      : [...formData.subcategories, sub];

    setFormData({ ...formData, subcategories: newSubs });
    setErrors({ ...errors, subcategories: "" });
  };

  return (
    <div
      className="space-y-4 flex flex-col"
      style={{ minHeight: formData.category ? "auto" : "400px" }}
    >
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Select Product Category
        </h2>
        <p className="text-xs text-gray-600">
          Choose the category that best matches your requirement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategorySelect(cat)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              formData.category === cat.slug
                ? "border-navyblue bg-lightblue"
                : "border-gray-200 hover:border-navyblue"
            }`}
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">
              {cat.name}
            </h3>
            <p className="text-[10px] text-gray-500">
              {cat.subcategories.length} options
            </p>
          </div>
        ))}
      </div>
      {errors.category && (
        <p className="text-red-500 text-xs">{errors.category}</p>
      )}

      {/* Subcategories */}
      {formData.category && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
            Select Subcategories (Multiple allowed)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories
              .find((c) => c.slug === formData.category)
              ?.subcategories.map((sub) => (
                <label
                  key={sub}
                  className={`border-2 rounded-lg p-2 cursor-pointer transition-all text-xs ${
                    formData.subcategories.includes(sub)
                      ? "border-navyblue bg-lightblue text-navyblue font-semibold"
                      : "border-gray-200 hover:border-navyblue"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.subcategories.includes(sub)}
                    onChange={() => handleSubcategoryToggle(sub)}
                    className="mr-1.5"
                  />
                  {sub}
                </label>
              ))}
          </div>
          {errors.subcategories && (
            <p className="text-red-500 text-xs mt-1">{errors.subcategories}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryStep;
