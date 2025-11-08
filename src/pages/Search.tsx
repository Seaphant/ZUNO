import { useEffect, useState, useMemo, useCallback } from "react";
import CouponCard from "../components/CouponCard";
import Filters from "../components/Filters";
import { fetchCoupons, apiCouponToCoupon } from "../lib/api";
import { searchCoupons, STORE_LOCATIONS, SOUTH_SAN_JOSE_CENTER, MAX_RADIUS_MILES } from "../lib/mock";
import type { Coupon } from "../lib/types";
import { calculateDistance } from "../lib/utils";
import { savedCouponsStorage } from "../lib/utils";

export default function Search() {
  const [q, setQ] = useState("");
  const [store, setStore] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"value" | "latest" | "popular">("value");
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLocationFilter, setShowLocationFilter] = useState(true);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      // Try API first, fallback to mock data
      const apiResult = await fetchCoupons({
        q: q || undefined,
        store: store !== "All" ? store : undefined,
        category: category !== "All" ? category : undefined,
        sort: sort === "popular" ? "popular" : sort === "value" ? "value" : "latest",
        limit: 100
      });

      let data: Coupon[] = [];

      if (apiResult.success && apiResult.data) {
        // Convert API response to frontend format
        data = apiResult.data.map(apiCouponToCoupon);
      } else {
        // Fallback to mock data
        console.warn("API unavailable, using mock data:", apiResult.error);
        data = await searchCoupons({ q, store, category, sort });
      }
      
      // Filter by South San Jose radius if location filter is enabled
      if (showLocationFilter) {
        data = data.filter(coupon => {
          const storeInfo = STORE_LOCATIONS[coupon.store];
          if (!storeInfo) return false;
          const distance = calculateDistance(
            SOUTH_SAN_JOSE_CENTER.lat,
            SOUTH_SAN_JOSE_CENTER.lng,
            storeInfo.lat,
            storeInfo.lng
          );
          return distance <= MAX_RADIUS_MILES;
        });
      }
      
      setItems(data);
    } catch (error) {
      console.error("Error searching coupons:", error);
      // Fallback to mock data on error
      try {
        const mockData = await searchCoupons({ q, store, category, sort });
        setItems(mockData);
      } catch (mockError) {
        console.error("Mock data also failed:", mockError);
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [q, store, category, sort, showLocationFilter]);

  useEffect(() => {
    run();
  }, [run]);

  const onSave = useCallback((id: string) => {
    savedCouponsStorage.add(id);
  }, []);

  const availableStores = useMemo(() => 
    Array.from(new Set(items.map(i => i.store))).filter(Boolean),
    [items]
  );
  
  const storeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.store] = (counts[item.store] || 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
        <h1 className="text-2xl font-bold text-white">Search Coupons</h1>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showLocationFilter}
            onChange={(e) => setShowLocationFilter(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-[#0f151b] text-emerald-500 focus:ring-emerald-500"
          />
          <span>📍 South San Jose only (within {MAX_RADIUS_MILES} miles)</span>
        </label>
      </div>

      <Filters
        q={q} 
        store={store} 
        category={category} 
        sort={sort}
        onChange={(p) => {
          if (p.q !== undefined) setQ(p.q);
          if (p.store !== undefined) setStore(p.store);
          if (p.category !== undefined) setCategory(p.category);
          if (p.sort !== undefined) setSort(p.sort as "value" | "latest" | "popular");
        }}
      />

      {availableStores.length > 0 && store === "All" && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="text-sm font-semibold text-emerald-200 mb-2">Available Stores in South San Jose:</div>
          <div className="flex flex-wrap gap-2">
            {availableStores.map(s => (
              <div key={s} className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
                {s} ({storeCounts[s]})
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <div className="text-sm text-gray-400">Loading deals…</div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-lg text-gray-300 mb-2">No results found</div>
          <div className="text-sm text-gray-400">Try a different store or category</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(c => <CouponCard key={c.id} c={c} onSave={onSave}/>)}
        </div>
      )}
    </div>
  );
}
