import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Clock,
  ArrowLeft,
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
  Gift,
  Truck,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Product, ProductVariant, Language, FlashSaleCampaign } from '../../types';
import { store } from '../../services/store';
import { ProductCard } from '../product/ProductCard';

interface FlashSalePageProps {
  language: Language;
  onBack: () => void;
  onSelectProduct: (product: Product, selectedVariant?: ProductVariant) => void;
  onQuickAddToCart: (product: Product, variant: ProductVariant) => void;
  onDirectOrder: (product: Product, variant: ProductVariant) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigateToOffers?: () => void;
}

export const FlashSalePage: React.FC<FlashSalePageProps> = ({
  language,
  onBack,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder,
  wishlist,
  onToggleWishlist,
  onNavigateToOffers
}) => {
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>(store.getFlashSales());
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Auto-slide banner carousel every 5 seconds, BUT products below will NOT change!
  useEffect(() => {
    if (campaigns.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [campaigns.length]);

  const activeCampaign = campaigns[activeBannerIndex] || campaigns[0];

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 48,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // STABLE PRODUCTS LIST: banners change above, but products do NOT change with banner change!
  const allSaleProducts = useMemo(() => {
    return store
      .getProducts()
      .filter((p) => p.isSale || (p.discountPercent && p.discountPercent > 0));
  }, []);

  const [minDiscountFilter, setMinDiscountFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'discount' | 'price_low' | 'price_high' | 'featured'>('discount');

  const filteredProducts = useMemo(() => {
    let list = allSaleProducts.filter((p) => {
      if (!minDiscountFilter) return true;
      return (p.discountPercent || 0) >= minDiscountFilter;
    });

    if (sortBy === 'discount') {
      list = [...list].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else if (sortBy === 'price_low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [allSaleProducts, minDiscountFilter, sortBy]);

  return (
    <div className="bg-[#FAF8F5] dark:bg-stone-950 min-h-screen pb-20">
      {/* 1. Top Breadcrumbs & Quick Access */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onNavigateToOffers && (
              <button
                onClick={onNavigateToOffers}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer hidden sm:inline-flex items-center gap-1"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সকল অফার ও কুপন দেখুন' : 'View All Offers'}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-white font-black bg-gradient-to-r from-rose-600 to-amber-600 px-3 py-1 rounded-full shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
              <span>{language === 'bn' ? 'ফর সেল স্পেশাল পেজ' : 'For Sale Exclusive Page'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* 2. Hero Colorful Sliding Banner: The banner rotates across campaigns, but product list below does NOT change! */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b0811] via-[#290a1e] to-[#140526] text-white shadow-2xl p-6 sm:p-10 border-2 border-amber-400/40">
          {/* Decorative Glowing Orbs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Media Carousel Background */}
          {activeCampaign && (
            <div className="absolute inset-0 z-0 opacity-25">
              <img
                src={activeCampaign.bannerImage || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
                alt={activeCampaign.titleEn}
                className="w-full h-full object-cover object-center transition-all duration-700"
              />
            </div>
          )}

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                <span>{language === 'bn' ? 'ফর সেল ধামাকা অফার' : 'Limited Time For Sale'}</span>
              </div>

              {activeCampaign?.discountPercent && (
                <span className="px-3 py-1 bg-amber-400 text-stone-950 font-black text-xs rounded-full">
                  {activeCampaign.discountPercent}% OFF
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-950/60 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/40">
                <Truck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সরাসরি ফ্রি হোম ডেলিভারি' : 'Free Home Delivery'}</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {activeCampaign
                ? language === 'bn'
                  ? activeCampaign.titleBn
                  : activeCampaign.titleEn
                : language === 'bn'
                ? 'ঐতিহ্যবাহী জামদানি ও সিল্ক শাড়ি ফর সেল'
                : 'Royal Heritage Handloom Sarees For Sale'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              {language === 'bn'
                ? 'বাছাইকৃত খাঁটি হস্তচালিত তাঁতের ঢাকাই জামদানি, মসলিন ও রাজশাহী সিল্কে সর্বোচ্চ আকর্ষণীয় নগদ ছাড়! সারাদেশে ১০০% ফ্রি ডেলিভারি ও ক্যাশ অন ডেলিভারি।'
                : 'Enjoy verified artisan handloom sarees at direct promotional discounts. Delivered with 100% Free Shipping and Cash on Delivery nationwide.'}
            </p>

            {/* Countdown Clock with Luxury Obsidian-Gold Styling */}
            <div className="pt-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>{language === 'bn' ? 'এই বিশেষ অফার শেষ হতে বাকি:' : 'Flash Sale Ends In:'}</span>
              </span>

              <div className="flex items-center gap-2 font-mono">
                <div className="bg-stone-950/90 border border-amber-400/40 px-3.5 py-2 rounded-xl text-center min-w-[56px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-300 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'ঘণ্টা' : 'Hours'}
                  </span>
                </div>
                <span className="text-xl font-black text-rose-500">:</span>

                <div className="bg-stone-950/90 border border-amber-400/40 px-3.5 py-2 rounded-xl text-center min-w-[56px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-300 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'মিনিট' : 'Mins'}
                  </span>
                </div>
                <span className="text-xl font-black text-rose-500">:</span>

                <div className="bg-stone-950/90 border border-rose-500/40 px-3.5 py-2 rounded-xl text-center min-w-[56px] shadow-lg bg-rose-950/20">
                  <span className="text-xl sm:text-2xl font-black text-rose-400 block leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-rose-200 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'সেকেন্ড' : 'Secs'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Slider Navigation Controls (arrows and dots) */}
          {campaigns.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveBannerIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer z-20"
                aria-label="Previous Campaign Banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveBannerIndex((prev) => (prev + 1) % campaigns.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer z-20"
                aria-label="Next Campaign Banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                {campaigns.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveBannerIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeBannerIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-stone-500'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 3. Filter Bar (Discount and Sort): products below are stable and DO NOT change when banner rotates! */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
            <Tag className="w-4 h-4 text-rose-600" />
            <span>
              {language === 'bn'
                ? `মোট ${filteredProducts.length}টি ফর সেল শাড়ি পাওয়া গেছে`
                : `Showing ${filteredProducts.length} Sarees For Sale`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Discount Filter Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 dark:text-stone-500 font-semibold mr-1">
                {language === 'bn' ? 'ছাড়:' : 'Discount:'}
              </span>
              <button
                onClick={() => setMinDiscountFilter(0)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  minDiscountFilter === 0
                    ? 'bg-stone-950 dark:bg-amber-950 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {language === 'bn' ? 'সবগুলো' : 'All'}
              </button>
              <button
                onClick={() => setMinDiscountFilter(10)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  minDiscountFilter === 10
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                10%+
              </button>
              <button
                onClick={() => setMinDiscountFilter(15)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  minDiscountFilter === 15
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                15%+
              </button>
              <button
                onClick={() => setMinDiscountFilter(20)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  minDiscountFilter === 20
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                20%+
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs border-l border-stone-200 dark:border-stone-800 pl-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold px-2.5 py-1.5 rounded-xl border-none outline-none cursor-pointer"
              >
                <option value="discount">{language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Highest Discount'}</option>
                <option value="price_low">{language === 'bn' ? 'কম দাম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price_high">{language === 'bn' ? 'বেশি দাম থেকে কম' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Products Grid: displays all for-sale sarees reliably */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="flex flex-col group">
              <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <ProductCard
                  product={prod}
                  language={language}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                  onQuickAddToCart={onQuickAddToCart}
                  onDirectOrder={onDirectOrder}
                />
              </div>

              {/* Stock Meter */}
              <div className="mt-2 px-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{language === 'bn' ? `মাত্র ${prod.stock}টি অবশিষ্ট` : `Only ${prod.stock} left`}</span>
                  </span>
                  <span className="font-mono text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                    {language === 'bn' ? 'ফ্ল্যাশ সেল স্টক' : 'Flash Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
