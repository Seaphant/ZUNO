import { useState, memo, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Coupon } from "../lib/types";
import { getProductImageUrl } from "../lib/images";

interface CouponCardProps {
  c: Coupon;
  onSave?: (id: string) => void;
}

function CouponCard({ c, onSave }: CouponCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [imageError, setImageError] = useState(false);
  const productImageUrl = getProductImageUrl(c);
  
  const toggleQR = useCallback(() => {
    setShowQR(prev => !prev);
  }, []);
  
  const handleSave = useCallback(() => {
    onSave?.(c.id);
  }, [onSave, c.id]);
  
  const getValueColor = () => {
    if (c.type === "Amount" && c.value >= 5) return "from-emerald-400 to-teal-400";
    if (c.type === "Amount" && c.value >= 3) return "from-emerald-500 to-emerald-400";
    if (c.type === "Percent" && (c.percentOff || 0) >= 25) return "from-emerald-400 to-teal-400";
    if (c.type === "Percent" && (c.percentOff || 0) >= 15) return "from-emerald-500 to-emerald-400";
    return "from-emerald-600 to-emerald-500";
  };

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#11161c] to-[#0d1419] p-5 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 rounded-2xl transition-all duration-300" />
      <div className="relative">
        {/* Product Image */}
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10">
          {!imageError ? (
            <img
              src={productImageUrl}
              alt={c.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <span className="text-4xl">🛒</span>
            </div>
          )}
          {/* Value Badge Overlay */}
          <span className={`absolute top-3 right-3 rounded-full bg-gradient-to-r ${getValueColor()} text-white text-xs font-bold px-3 py-1.5 shadow-lg z-10`}>
            {c.type === "Amount" ? `$${c.value} off` :
             c.type === "Percent" ? `${c.percentOff}% off` : `BOGO`}
          </span>
        </div>
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Brand Name - Prominent */}
            <div className="mb-2">
              <span className="text-lg font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30 inline-block">
                {c.brand}
              </span>
            </div>
            {/* Title */}
            <h3 className="font-bold text-white mb-2 group-hover:text-emerald-100 transition-colors line-clamp-2">{c.title}</h3>
            {/* Store and Category Info */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs text-gray-400">{c.store}</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-md">{c.category}</span>
            </div>
            {c.storeLocation && (
              <div className="text-xs text-gray-500 mt-1">
                📍 {c.storeLocation}
              </div>
            )}
          </div>
        </div>
        
        {showQR && c.qrCode && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-3 bg-white/5 rounded-lg p-4">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <QRCodeSVG value={c.qrCode} size={150} />
            </div>
            <p className="text-xs text-gray-400 text-center">Scan at checkout</p>
            <button
              onClick={toggleQR}
              className="text-xs text-gray-400 hover:text-white transition-colors"
              aria-label="Close QR code"
            >
              Close
            </button>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="text-xs text-gray-400">
            <span className="text-emerald-400/60">Expires:</span> {c.expiresAt}
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleQR}
              className="text-xs rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 px-3 py-1.5 hover:from-blue-500/30 hover:to-cyan-500/30 hover:scale-105 transition-all duration-200 font-medium border border-blue-500/30"
              aria-label={showQR ? "Hide QR code" : "Show QR code"}
            >
              {showQR ? "Hide QR" : "Show QR"}
            </button>
            {onSave && (
              <button 
                onClick={handleSave}
                className="text-xs rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200 px-4 py-1.5 hover:from-emerald-500/30 hover:to-teal-500/30 hover:scale-105 transition-all duration-200 font-medium border border-emerald-500/30"
                aria-label={`Save ${c.title}`}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CouponCard);
