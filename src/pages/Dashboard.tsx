import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchCoupons, apiCouponToCoupon, fetchUserCoupons } from "../lib/api";
import { COUPONS } from "../lib/mock";
import CouponCard from "../components/CouponCard";
import { savedCouponsStorage } from "../lib/utils";
import type { Coupon } from "../lib/types";

export default function Dashboard() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedCoupons, setSavedCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadSavedCoupons = async () => {
      setLoading(true);
      const savedIdsList = savedCouponsStorage.get();
      setSavedIds(savedIdsList);

      if (savedIdsList.length === 0) {
        setSavedCoupons([]);
        setLoading(false);
        return;
      }

      // Try to fetch from API first
      // For now, use a dummy userId - in production, get from auth
      const userId = 'user-' + localStorage.getItem('userId') || 'default-user';
      
      const result = await fetchUserCoupons(userId, 'saved');
      if (result.success && result.data && result.data.length > 0) {
        // Convert API user coupons to frontend format
        const coupons = result.data
          .map((uc: any) => uc.couponId)
          .filter(Boolean)
          .map(apiCouponToCoupon);
        setSavedCoupons(coupons);
      } else {
        // Fallback to local storage + mock data
        const mockCoupons = COUPONS.filter(c => savedIdsList.includes(c.id));
        setSavedCoupons(mockCoupons);
      }
      
      setLoading(false);
    };

    loadSavedCoupons();
  }, []);

  const remove = useCallback((id: string) => {
    savedCouponsStorage.remove(id);
    const updatedIds = savedCouponsStorage.get();
    setSavedIds(updatedIds);
    
    // Update saved coupons list
    const updatedCoupons = savedCoupons.filter(c => c.id !== id);
    setSavedCoupons(updatedCoupons);
  }, [savedCoupons]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
        <h1 className="text-3xl font-bold text-white">Your Saved Coupons</h1>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <div className="text-sm text-gray-400">Loading saved coupons…</div>
          </div>
        </div>
      ) : savedCoupons.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg text-gray-300 mb-2">Nothing saved yet</p>
          <p className="text-sm text-gray-400">Find amazing deals on the Search page</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedCoupons.map(c => (
            <div key={c.id} className="space-y-3">
              <CouponCard c={c} />
              <button
                onClick={() => remove(c.id)}
                className="w-full text-sm rounded-lg bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-200 px-4 py-2 hover:from-red-500/30 hover:to-rose-500/30 hover:scale-105 transition-all duration-200 font-medium border border-red-500/30">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
