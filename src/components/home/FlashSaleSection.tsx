import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant, Language } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface FlashSaleSectionProps {
  products: Product[];
  language: Language;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (p: Product, v?: ProductVariant) => void;
  onQuickAddToCart: (p: Product, v: ProductVariant) => void;
  onDirectOrder: (p: Product, v: ProductVariant) => void;
  onViewAllFlash: () => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  language,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder,
  onViewAllFlash
}) => {
  // 48-hour countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 36,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50/60 to-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Flash Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-amber-900/10">
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
              <span>{language === 'bn' ? 'ফ্ল্যাশ সেল' : 'FLASH SALE'}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {language === 'bn' ? 'সীমিত সময়ের ধামাকা অফার' : 'Limited Time Deals'}
            </h2>
          </div>

          {/* Live Countdown & Explore */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-white px-3 py-1.5 rounded-lg border border-stone-300 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-amber-900" />
              <span className="text-stone-500 hidden sm:inline">
                {language === 'bn' ? 'অফারের বাকি সময়:' : 'Ends in:'}
              </span>
              <div className="flex items-center gap-1 font-mono font-bold text-amber-950">
                <span className="bg-stone-900 text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-stone-900 text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-stone-900 text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <button
              onClick={onViewAllFlash}
              className="text-xs font-semibold text-amber-900 hover:text-amber-800 flex items-center gap-1 group whitespace-nowrap"
            >
              <span>{language === 'bn' ? 'সব অফার দেখুন' : 'View All'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* 4-Item Grid with Stock Urgency Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p, idx) => (
            <div key={p.id} className="flex flex-col">
              <ProductCard
                product={p}
                language={language}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onQuickAddToCart={onQuickAddToCart}
                onDirectOrder={onDirectOrder}
              />
              {/* Fabrilife Stock Urgency Meter */}
              <div className="mt-2 px-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium">
                  <span className="text-amber-900 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-700 text-amber-700" />
                    <span>{language === 'bn' ? `মাত্র ${p.stock}টি বাকি আছে` : `Only ${p.stock} left`}</span>
                  </span>
                  <span className="text-stone-400 font-mono text-[10px]">
                    {70 + idx * 8}% Sold
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-rose-600 rounded-full"
                    style={{ width: `${70 + idx * 8}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
