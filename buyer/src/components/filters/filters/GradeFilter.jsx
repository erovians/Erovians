import { Award } from "lucide-react";

const GradeFilter = ({ selected, onChange }) => {
  const grades = ["A", "B", "C"];

  return (
    <div className="space-y-3">
      {grades.map((grade) => (
        <label
          key={grade}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">
              Grade {grade}
            </span>
          </div>
          <input
            type="checkbox"
            checked={selected.includes(grade)}
            onChange={() => {
              if (selected.includes(grade)) {
                onChange(selected.filter((g) => g !== grade));
              } else {
                onChange([...selected, grade]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default GradeFilter;
