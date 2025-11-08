import { memo, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";

function NavBar() {
  const linkClass = useMemo(
    () => "text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5",
    []
  );
  
  const activeClass = useMemo(
    () => "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-500/30",
    []
  );

  const getNavLinkClassName = (isActive: boolean) => {
    return `${linkClass} ${isActive ? activeClass : ""}`;
  };

  return (
    <header className="border-b border-white/10 bg-gradient-to-b from-[#0d141a]/95 to-[#0a1115]/95 backdrop-blur-xl shadow-lg">
      <nav className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Zuno home">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-lg group-hover:bg-emerald-400/40 transition-all duration-300" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg" aria-hidden="true">Z</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
              ZUNO
            </span>
            <span className="text-xs text-gray-400 -mt-1">Deals & Savings</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <NavLink 
            to="/search" 
            className={({ isActive }) => getNavLinkClassName(isActive)}
            aria-label="Search coupons"
          >
            Search
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => getNavLinkClassName(isActive)}
            aria-label="View saved coupons"
          >
            Dashboard
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default memo(NavBar);
