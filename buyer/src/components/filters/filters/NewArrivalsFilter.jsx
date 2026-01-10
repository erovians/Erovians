import { Sparkles } from "lucide-react";

const NewArrivalsFilter = ({ checked, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all has-checked:border-blue-600 has-checked:bg-linear-to-r has-checked:from-blue-50 has-checked:to-indigo-50">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <div>
            <span className="block text-sm font-bold text-gray-900">
              Show New Products
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Products added in last 7 days
            </span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </label>
    </div>
  );
};

export default NewArrivalsFilter;
