"use client";
import { Input } from "@/components/ui/input";

export const Search = ({ value, onChange, placeholder }) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
      className="w-[250px]"
    />
  );
};
