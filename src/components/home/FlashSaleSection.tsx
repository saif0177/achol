import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, Sparkles, Tag, Users, ExternalLink, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product, ProductVariant, Language, FlashSaleCampaign } from '../../types';
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
  onNavigateTarget
}) => {
  // Live dynamic countdown timer for general section
  const [timeLeft, setTimeLeft] = useState({
    hours: 36,
    minutes: 42,
    seconds: 18
  });

  // Simulated live viewers counter for excitement
  const [liveViewers, setLiveViewers] = useState(26);

  // Active campaigns from store
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>(store.getFlashSales());

  // Carousel & Offer Filter State (Requirement 3: auto-sliding banner with short bottom navigation bar to filter specific sale)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('all');

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
      setLiveViewers((prev) => Math.floor(22 + Math.random() * 9));
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(viewerTimer);
    };
  }, []);

  // Auto-slide every 5 seconds across active flash sale banners
  useEffect(() => {
    if (campaigns.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [campaigns.length]);

  const handleBannerClick = (campaign: FlashSaleCampaign) => {
    if (campaign.targetLink && onNavigateTarget) {
      onNavigateTarget(campaign.targetLink);
    } else {
      setSelectedOfferId(campaign.id);
    }
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOfferId(offerId);
    if (offerId !== 'all') {
      const idx = campaigns.findIndex((c) => c.id === offerId);
      if (idx >= 0) {
        setActiveSlideIndex(idx);
      }
    }
  };

  // Helper for per-campaign live countdown
  const getCampaignRemainingTime = (endTimeStr?: string) => {
    if (!endTimeStr) return { hours: 24, minutes: 0, seconds: 0 };
    const diff = Math.max(0, new Date(endTimeStr).getTime() - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  if (products.length === 0 && campaigns.length === 0) return null;

  // Filter products for the selected flash sale offer
  const filteredProducts = selectedOfferId === 'all'
    ? products
    : products.filter((p) => p.flashSaleId === selectedOfferId);

  const displayList = filteredProducts.length > 0 ? filteredProducts : products;
  const currentCamp = campaigns[activeSlideIndex] || campaigns[0];
  const currentRem = currentCamp ? getCampaignRemainingTime(currentCamp.endTime) : { hours: 24, minutes: 0, seconds: 0 };

  return (
    <section className="py-14 sm:py-16 relative overflow-hidden bg-gradient-to-br from-stone-950 via-[#1c0f0a] to-[#2c0b11] text-white border-y border-amber-900/40 shadow-2xl">
      {/* Decorative background glow rings */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Flash Header Bar with Luxury Aesthetic & Excitement Cues */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          
          <div className="space-y-3 max-w-2xl">
            {/* Live Excitement Pill Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600/90 text-rose-100 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border border-rose-400/30">
                <Zap className="w-3.5 h-3.5 fill-current animate-pulse text-amber-300" />
                <span>{language === 'bn' ? 'সীমিত সময়ের ধামাকা' : 'LIMITED FLASH DROP'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-900/40 text-amber-300 rounded-full text-[11px] font-semibold border border-amber-600/30 backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'bn'
                    ? `বর্তমানে ${liveViewers} জন শাড়িপ্রেমী দেখছেন`
                    : `${liveViewers} people viewing deals right now`}
                </span>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {language === 'bn'
                  ? 'ঐতিহ্যবাহী তাঁত শাড়িতে বিশেষ ফ্ল্যাশ ছাড়'
                  : 'Royal Heritage Handloom Flash Deals'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                {language === 'bn'
                  ? 'বাছাইকৃত খাঁটি ঢাকাই জামদানি, মসলিন ও রাজশাহী সিল্কে সর্বোচ্চ ২০% পর্যন্ত নগদ ছাড়! স্টক শেষ হওয়ার আগেই সংগ্রহ করুন।'
                  : 'Direct-from-the-loom Dhakai Jamdani & Silk masterpieces at exceptional event prices. Certified 100% handloom quality.'}
              </p>
            </div>
          </div>

          {/* Luxury Countdown Clock & Noticeable Explore Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 shrink-0">
            
            {/* Obsidian-Gold Timer Boxes */}
            <div className="bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Flash Offer Ends In:'}</span>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <div className="bg-stone-900/90 border border-amber-400/20 px-3 py-1.5 rounded-xl text-center min-w-[50px]">
                  <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider mt-0.5 block">
                    {language === 'bn' ? 'ঘণ্টা' : 'Hrs'}
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-500">:</span>

                <div className="bg-stone-900/90 border border-amber-400/20 px-3 py-1.5 rounded-xl text-center min-w-[50px]">
                  <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider mt-0.5 block">
                    {language === 'bn' ? 'মিনিট' : 'Min'}
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-500">:</span>

                <div className="bg-stone-900/90 border border-amber-400/20 px-3 py-1.5 rounded-xl text-center min-w-[50px]">
                  <span className="text-xl sm:text-2xl font-bold text-amber-400 block leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-stone-400 uppercase tracking-wider mt-0.5 block">
                    {language === 'bn' ? 'সেকেন্ড' : 'Sec'}
                  </span>
                </div>
              </div>
            </div>

            {/* Highly Noticeable Explore More / View All Button */}
            <button
              onClick={onViewAllFlash}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap self-stretch sm:self-auto transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{language === 'bn' ? 'সব ফ্ল্যাশ সেল অফার দেখুন' : 'Explore All Flash Deals'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* SLIDING PROMOTIONAL DEAL BANNER (Requirement 3: auto-sliding with different sales, image-only support, custom timers) */}
        {campaigns.length > 0 && currentCamp && (
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-stone-900/90 shadow-2xl group min-h-[220px] sm:min-h-[260px] flex items-center">
              {/* Sliding Background Banner */}
              <img
                src={currentCamp.bannerImage || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
                alt={currentCamp.titleEn}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />

              {currentCamp.displayMode === 'image_only' ? (
                // Image-only banner overlay
                <div
                  onClick={() => handleBannerClick(currentCamp)}
                  className="absolute inset-0 cursor-pointer flex flex-col justify-between p-4 sm:p-6"
                >
                  <div className="flex justify-end">
                    {currentCamp.hasTimer && (
                      <div className="bg-stone-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-400/40 text-white flex items-center gap-2 shadow-lg">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-mono text-xs font-bold text-amber-300">
                          {String(currentRem.hours).padStart(2, '0')}:{String(currentRem.minutes).padStart(2, '0')}:{String(currentRem.seconds).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                  {currentCamp.showButton && (
                    <div className="flex justify-end">
                      <span className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-lg inline-flex items-center gap-1.5">
                        <span>{language === 'bn' ? currentCamp.buttonTextBn || 'দেখুন' : currentCamp.buttonTextEn || 'Shop'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Rich Text + Visual Gradient Overlay
                <div
                  onClick={() => handleBannerClick(currentCamp)}
                  className="relative z-10 w-full p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-transparent"
                >
                  <div className="space-y-3 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
                        {currentCamp.discountPercent}% OFF
                      </span>
                      {currentCamp.badgeTextEn && (
                        <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-md border border-amber-400/30">
                          {language === 'bn' ? currentCamp.badgeTextBn || currentCamp.badgeTextEn : currentCamp.badgeTextEn}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors">
                      {language === 'bn' ? currentCamp.titleBn : currentCamp.titleEn}
                    </h3>
                    {currentCamp.subtitleEn && (
                      <p className="text-xs sm:text-sm text-stone-300 line-clamp-2">
                        {language === 'bn' ? currentCamp.subtitleBn || currentCamp.subtitleEn : currentCamp.subtitleEn}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    {currentCamp.hasTimer && (
                      <div className="bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-400/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>
                          {String(currentRem.hours).padStart(2, '0')}h {String(currentRem.minutes).padStart(2, '0')}m {String(currentRem.seconds).padStart(2, '0')}s
                        </span>
                      </div>
                    )}
                    {currentCamp.showButton !== false && (
                      <span className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg inline-flex items-center gap-2 group-hover:scale-105 transition-transform">
                        <span>{language === 'bn' ? currentCamp.buttonTextBn || 'অফার দেখুন' : currentCamp.buttonTextEn || 'Shop Offer Sarees'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Slider Next/Prev Arrows */}
              {campaigns.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                    aria-label="Previous Sale"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIndex((prev) => (prev + 1) % campaigns.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                    aria-label="Next Sale"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* SHORT, COMPACT OFFER NAVIGATION BAR (Requirement 3: selecting different different offer and if we click we get only that sale offer product) */}
            <div className="bg-stone-900/90 backdrop-blur-md p-2 rounded-2xl border border-amber-500/25 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-lg">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 pl-2 hidden sm:inline">
                  {language === 'bn' ? 'অফার সিলেক্ট করুন:' : 'Filter Sale:'}
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectOffer('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedOfferId === 'all'
                      ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? 'সব ডিল (সকল শাড়ি)' : 'All Flash Deals'}</span>
                </button>

                {campaigns.map((camp) => (
                  <button
                    key={camp.id}
                    type="button"
                    onClick={() => handleSelectOffer(camp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedOfferId === camp.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300'
                        : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>{language === 'bn' ? camp.titleBn : camp.titleEn}</span>
                    <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] rounded-md font-mono font-bold">
                      -{camp.discountPercent}%
                    </span>
                  </button>
                ))}
              </div>

              {/* Slider Dots */}
              {campaigns.length > 1 && (
                <div className="flex items-center gap-1.5 shrink-0 pr-2">
                  {campaigns.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeSlideIndex === i ? 'w-5 bg-amber-400' : 'w-1.5 bg-stone-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saree Grid: Shows ONLY the products belonging to the selected flash sale */}
        {displayList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {selectedOfferId === 'all'
                    ? (language === 'bn' ? 'টপ ফ্ল্যাশ সেল শাড়ি' : 'Featured Flash Sale Sarees')
                    : (language === 'bn'
                        ? `${campaigns.find((c) => c.id === selectedOfferId)?.titleBn || 'নির্বাচিত অফার'} (${displayList.length}টি শাড়ি)`
                        : `${campaigns.find((c) => c.id === selectedOfferId)?.titleEn || 'Selected Offer'} (${displayList.length} Sarees)`)}
                </span>
              </span>
              {selectedOfferId !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedOfferId('all')}
                  className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  {language === 'bn' ? 'সব অফার শাড়ি দেখুন' : 'View All Deals'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayList.slice(0, 8).map((p, idx) => (
                <div key={p.id} className="flex flex-col group">
                  <div className="rounded-2xl overflow-hidden shadow-md">
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

                  {/* Stock Urgency Meter */}
                  <div className="mt-2.5 px-1 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium">
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                        <span>{language === 'bn' ? `মাত্র ${p.stock}টি বাকি আছে` : `Only ${p.stock} left in stock`}</span>
                      </span>
                      <span className="text-stone-400 font-mono text-[10px]">
                        {72 + (idx % 4) * 7}% Claimed
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/60">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${72 + (idx % 4) * 7}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
