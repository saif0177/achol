import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Clock, ArrowRight, Zap, Sparkles, Users, ChevronLeft, ChevronRight, Tag, Truck } from 'lucide-react';
import { Product, ProductVariant, Language, FlashSaleCampaign, Promotion } from '../../types';
import { store } from '../../services/store';
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
  onNavigateTarget?: (target: string) => void;
  onSelectOffer?: (offer: Promotion) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  language,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder,
  onViewAllFlash,
  onNavigateTarget,
  onSelectOffer
}) => {
  // Live dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 36,
    minutes: 42,
    seconds: 18
  });

  // Simulated live viewers counter for excitement
  const [liveViewers, setLiveViewers] = useState(26);

  // Active flash sale campaigns from store
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>(store.getFlashSales());

  // Carousel slide index for banner only
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    setCampaigns(store.getFlashSales());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    const viewerTimer = setInterval(() => {
      setLiveViewers((prev) => Math.floor(24 + Math.random() * 8));
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(viewerTimer);
    };
  }, []);

  // Auto-slide banner every 5 seconds across active flash sale banners
  useEffect(() => {
    if (campaigns.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [campaigns.length]);

  const currentCamp = campaigns[activeSlideIndex] || campaigns[0];

  const handleBannerClick = (campaign: FlashSaleCampaign) => {
    if (onViewAllFlash) {
      onViewAllFlash();
    } else if (campaign.targetLink && onNavigateTarget) {
      onNavigateTarget(campaign.targetLink);
    }
  };

  // Helper for per-campaign remaining time
  const getCampaignRemainingTime = (endTimeStr?: string) => {
    if (!endTimeStr) return { hours: 24, minutes: 0, seconds: 0 };
    const diff = Math.max(0, new Date(endTimeStr).getTime() - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const currentRem = currentCamp ? getCampaignRemainingTime(currentCamp.endTime) : { hours: 24, minutes: 0, seconds: 0 };

  // STABLE PRODUCT LIST: products DO NOT change when the banner slides/changes!
  // Takes a simple collection of for-sale sarees (up to 4 or 8) and keeps them constant
  const saleProducts = useMemo(() => {
    const list = products.filter((p) => p.isSale || (p.discountPercent || 0) > 0);
    if (list.length >= 4) return list.slice(0, 8);
    const storeSale = store.getProducts().filter((p) => p.isSale || (p.discountPercent || 0) > 0);
    if (storeSale.length > 0) return storeSale.slice(0, 8);
    return products.slice(0, 8);
  }, [products]);

  if (saleProducts.length === 0 && campaigns.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#120409] via-[#220716] via-[#1a0826] to-[#0d0214] text-white shadow-2xl py-12 sm:py-16">
      {/* Top Colorful Accent Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 via-fuchsia-500 via-purple-500 to-amber-300" />

      {/* Decorative High-Attraction Background Glow Rings */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Header Bar: Colorful, Attractive Badges, Title, Timer, and More Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-rose-900/40">
          
          <div className="space-y-3 max-w-2xl">
            {/* Live Excitement Pill Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-900/50 border border-amber-300/40 animate-pulse">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{language === 'bn' ? 'স্পেশাল ফর সেল অফার' : 'HOT FOR SALE DEALS'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-xs font-semibold border border-purple-500/40 backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  {language === 'bn'
                    ? `বর্তমানে ${liveViewers} জন অর্ডার করছেন`
                    : `${liveViewers} shoppers viewing now`}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/40 backdrop-blur-md">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {language === 'bn' ? (
                  <>
                    ঐতিহ্যবাহী তাঁত শাড়িতে <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">বিশেষ ছাড়</span>
                  </>
                ) : (
                  <>
                    Royal Handloom Sarees <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">For Sale</span>
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl leading-relaxed">
                {language === 'bn'
                  ? 'বাছাইকৃত খাঁটি ঢাকাই জামদানি, মসলিন ও রাজশাহী সিল্কে সর্বোচ্চ আকর্ষণীয় ছাড়! এখনই স্টক শেষ হওয়ার আগেই অর্ডার করুন।'
                  : 'Certified pure handloom Jamdani & Silk sarees at special event prices with cash on delivery nationwide.'}
              </p>
            </div>
          </div>

          {/* Luxury Colorful Countdown Timer & Noticeable More Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-5 shrink-0">
            
            {/* Glowing Obsidian-Gold-Ruby Timer Box */}
            <div className="bg-stone-950/85 backdrop-blur-md p-3.5 rounded-2xl border-2 border-amber-400/50 shadow-xl shadow-rose-950/40">
              <div className="flex items-center justify-between gap-2 text-[11px] font-black text-amber-300 uppercase tracking-wider mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span>{language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Sale Ends In:'}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>

              <div className="flex items-center gap-2 font-mono">
                <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-400/30 px-3 py-1.5 rounded-xl text-center min-w-[52px] shadow-inner">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-300 uppercase font-bold tracking-wider mt-0.5 block">
                    {language === 'bn' ? 'ঘণ্টা' : 'Hrs'}
                  </span>
                </div>
                <span className="text-xl font-black text-rose-500 animate-pulse">:</span>

                <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-400/30 px-3 py-1.5 rounded-xl text-center min-w-[52px] shadow-inner">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-300 uppercase font-bold tracking-wider mt-0.5 block">
                    {language === 'bn' ? 'মিনিট' : 'Min'}
                  </span>
                </div>
                <span className="text-xl font-black text-rose-500 animate-pulse">:</span>

                <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-rose-500/40 px-3 py-1.5 rounded-xl text-center min-w-[52px] shadow-inner bg-rose-950/20">
                  <span className="text-xl sm:text-2xl font-black text-rose-400 block leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-rose-200 uppercase font-bold tracking-wider mt-0.5 block">
                    {language === 'bn' ? 'সেকেন্ড' : 'Sec'}
                  </span>
                </div>
              </div>
            </div>

            {/* Colorful & Noticeable MORE Button */}
            <button
              onClick={onViewAllFlash}
              className="px-6 py-4 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:via-rose-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-rose-950/50 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer whitespace-nowrap self-stretch sm:self-auto transform hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{language === 'bn' ? 'আরও শাড়ি দেখুন (More)' : 'Explore More For Sale'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Sliding Promotional Banner: ONLY the banner rotates/slides, products below DO NOT change! */}
        {campaigns.length > 0 && currentCamp && (
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/30 bg-stone-950 shadow-2xl group min-h-[220px] sm:min-h-[260px] flex items-center">
            {/* Sliding Banner Background Image */}
            <img
              src={currentCamp.bannerImage || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
              alt={currentCamp.titleEn}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-102"
            />

            {/* Colorful Gradient Overlay */}
            <div
              onClick={() => handleBannerClick(currentCamp)}
              className="relative z-10 w-full p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40"
            >
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-md">
                    {currentCamp.discountPercent}% OFF
                  </span>
                  {currentCamp.badgeTextEn && (
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-md border border-amber-400/40">
                      {language === 'bn' ? currentCamp.badgeTextBn || currentCamp.badgeTextEn : currentCamp.badgeTextEn}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-amber-200 transition-colors drop-shadow-md">
                  {language === 'bn' ? currentCamp.titleBn : currentCamp.titleEn}
                </h3>
                {currentCamp.subtitleEn && (
                  <p className="text-xs sm:text-sm text-stone-200 line-clamp-2">
                    {language === 'bn' ? currentCamp.subtitleBn || currentCamp.subtitleEn : currentCamp.subtitleEn}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                {currentCamp.hasTimer && (
                  <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>
                      {String(currentRem.hours).padStart(2, '0')}h {String(currentRem.minutes).padStart(2, '0')}m {String(currentRem.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                )}
                <span className="px-5 py-3 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg inline-flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <span>{language === 'bn' ? 'সকল অফার দেখুন' : 'Explore Sale'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Slider Next/Prev Arrows */}
            {campaigns.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlideIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                  aria-label="Previous Sale Banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlideIndex((prev) => (prev + 1) % campaigns.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/30 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                  aria-label="Next Sale Banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Indicator Dots */}
            {campaigns.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                {campaigns.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlideIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-stone-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Simple & Clean Saree Grid: Products do NOT change when the banner changes! */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-extrabold flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>
                {language === 'bn' ? 'আকর্ষণীয় ফর সেল শাড়িসমূহ' : 'Featured For Sale Sarees'}
              </span>
            </span>

            {/* Header More link */}
            <button
              type="button"
              onClick={onViewAllFlash}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {saleProducts.map((p, idx) => (
              <div key={p.id} className="flex flex-col group">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-amber-900/30 bg-stone-900/80">
                  <ProductCard
                    product={p}
                    language={language}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onQuickAddToCart={onQuickAddToCart}
                    onDirectOrder={onDirectOrder}
                  />
                </div>

                {/* Scarcity Urgency Meter with Multi-color Rainbow Gradient */}
                <div className="mt-2.5 px-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium">
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                      <span>{language === 'bn' ? `মাত্র ${p.stock}টি বাকি` : `Only ${p.stock} left`}</span>
                    </span>
                    <span className="text-rose-300 font-mono text-[10px] font-bold">
                      {70 + (idx % 4) * 8}% Claimed
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${70 + (idx % 4) * 8}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call-to-Action for More Sarees on Separate Page */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={onViewAllFlash}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:via-rose-400 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-rose-950/60 hover:shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>
                {language === 'bn'
                  ? 'সকল ফর সেল শাড়ি দেখতে ক্লিক করুন (More For Sale)'
                  : 'View All Sarees For Sale (Separate Page)'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Colorful Accent Ribbon */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 via-rose-500 to-amber-400" />
    </section>
  );
};
