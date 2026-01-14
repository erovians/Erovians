import { Tag } from "lucide-react";

const PriceUnitFilter = ({ selected, onChange }) => {
  const priceUnits = ["sq.ft", "sq.m", "piece"];

  return (
    <div className="space-y-3">
      {priceUnits.map((unit) => (
        <label
          key={unit}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">{unit}</span>
          </div>
          <input
            type="checkbox"
            checked={selected.includes(unit)}
            onChange={() => {
              if (selected.includes(unit)) {
                onChange(selected.filter((u) => u !== unit));
              } else {
                onChange([...selected, unit]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default PriceUnitFilter;
