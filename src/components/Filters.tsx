import { memo, useCallback } from "react";
import { CATEGORIES } from "../lib/mock";
import StorePicker from "./StorePicker";

interface FiltersProps {
  q: string;
  store: string;
  category: string;
  sort: string;
  onChange: (patch: Partial<{ q: string; store: string; category: string; sort: string }>) => void;
}

function Filters({
  q,
  store,
  category,
  sort,
  onChange
}: FiltersProps) {
  const handleQChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ q: e.target.value });
  }, [onChange]);
  
  const handleStoreChange = useCallback((v: string) => {
    onChange({ store: v });
  }, [onChange]);
  
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ category: e.target.value });
  }, [onChange]);
  
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ sort: e.target.value });
  }, [onChange]);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#10161c] to-[#0d1419] p-4 shadow-lg">
      <input
        value={q}
        onChange={handleQChange}
        placeholder="Search brand or title…"
        className="flex-1 min-w-[200px] rounded-lg bg-[#0f151b] px-4 py-2.5 text-sm border border-white/10 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-white placeholder-gray-500"
        aria-label="Search coupons"
      />
      <StorePicker value={store} onChange={handleStoreChange} />
      <select
        className="rounded-lg border border-white/10 bg-[#0f151b] px-4 py-2.5 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
        value={category}
        onChange={handleCategoryChange}
        aria-label="Filter by category"
      >
        {["All", ...CATEGORIES].map(c => (
          <option key={c} value={c} className="bg-[#0f151b]">{c}</option>
        ))}
      </select>
      <select
        className="rounded-lg border border-white/10 bg-[#0f151b] px-4 py-2.5 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
        value={sort}
        onChange={handleSortChange}
        aria-label="Sort coupons"
      >
        <option value="value" className="bg-[#0f151b]">Best value</option>
        <option value="latest" className="bg-[#0f151b]">Latest</option>
        <option value="popular" className="bg-[#0f151b]">Popular</option>
      </select>
    </div>
  );
}

export default memo(Filters);
