import { memo, useMemo } from "react";
import { STORES, STORE_LOCATIONS } from "../lib/mock";

interface StorePickerProps {
  value: string;
  onChange: (s: string) => void;
}

function StorePicker({ value, onChange }: StorePickerProps) {
  const options = useMemo(() => STORES.filter(s => s !== "All"), []);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <select
      className="rounded-lg border border-white/10 bg-[#0f151b] px-4 py-2.5 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
      value={value}
      onChange={handleChange}
      aria-label="Select store"
    >
      <option value="All" className="bg-[#0f151b]">All Stores</option>
      {options.map(s => {
        const location = STORE_LOCATIONS[s];
        const displayText = location ? `${s} - ${location.city}` : s;
        return (
          <option key={s} value={s} className="bg-[#0f151b]">
            {displayText}
          </option>
        );
      })}
    </select>
  );
}

export default memo(StorePicker);
