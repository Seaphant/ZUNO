import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { fetchCoupons, apiCouponToCoupon } from "../lib/api";
import { COUPONS } from "../lib/mock";
import type { Coupon } from "../lib/types";

export default function Home() {
  const [trendingCoupons, setTrendingCoupons] = useState<Coupon[]>(COUPONS.slice(0, 9));

  useEffect(() => {
    // Fetch trending coupons from API
    const loadTrendingCoupons = async () => {
      try {
        const result = await fetchCoupons({ sort: 'popular', limit: 9 });
        if (result.success && result.data) {
          setTrendingCoupons(result.data.map(apiCouponToCoupon));
        } else {
          // Fallback to mock data
          setTrendingCoupons(COUPONS.slice(0, 9));
        }
      } catch (error) {
        console.error('Error loading trending coupons:', error);
        setTrendingCoupons(COUPONS.slice(0, 9));
      }
    };
    loadTrendingCoupons();
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent rounded-3xl blur-3xl" />
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Find the best local grocery deals
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            No paywalls. No ad clutter. Just pure value.
          </p>
          <Link 
            to="/search" 
            className="inline-block mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 font-semibold hover:from-emerald-400 hover:to-teal-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
            aria-label="Start searching for coupons"
          >
            Start searching →
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Trending near you</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingCoupons.map(c => (
            <CouponCard key={c.id} c={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
