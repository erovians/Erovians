// "use client";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export const Filter = ({ label, value, onChange, options }) => {
//   return (
//     <Select value={value} onValueChange={onChange}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder={label} />
//       </SelectTrigger>
//       <SelectContent>
//         {options.map((opt) => (
//           <SelectItem key={opt.value} value={opt.value}>
//             {opt.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// };
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export const Filter = ({ label, value, onChange, options, loading }) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-[180px] flex items-center justify-between">
        {/* Label or selected value */}
        <SelectValue placeholder={label} />
        {/* Spinner next to label */}
        {loading && <Spinner />}
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
