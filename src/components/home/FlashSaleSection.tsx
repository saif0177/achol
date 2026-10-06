import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, Sparkles, Tag, Users, ExternalLink } from 'lucide-react';
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

  const handleBannerClick = (campaign: FlashSaleCampaign) => {
    if (campaign.targetLink && onNavigateTarget) {
      onNavigateTarget(campaign.targetLink);
    } else {
      onViewAllFlash();
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

        {/* CUSTOM PROMOTIONAL DEAL BANNERS (Requirement 1 & 2: Different small banners, image-only Photoshop graphics, individual timers & buttons) */}
        {campaigns.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লাইভ অফার ও ক্যাম্পেইন ব্যানার' : 'Live Deal & Promotional Banners'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {campaigns.map((camp) => {
                const rem = getCampaignRemainingTime(camp.endTime);

                // Option A: Pure Graphic Image Banner (Requirement 2: "just image only not any text or something... upload image like from Photoshop")
                if (camp.displayMode === 'image_only') {
                  return (
                    <div
                      key={camp.id}
                      onClick={() => handleBannerClick(camp)}
                      className="group relative rounded-2xl overflow-hidden border border-white/20 shadow-xl cursor-pointer hover:border-amber-400/50 transition-all transform hover:-translate-y-1"
                    >
                      <img
                        src={camp.bannerImage || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
                        alt={camp.titleEn}
                        className="w-full h-44 sm:h-52 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                      />

                      {/* Optional Timer on Image-Only Banner */}
                      {camp.hasTimer && (
                        <div className="absolute top-3 right-3 bg-stone-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/30 text-white flex items-center gap-2 shadow-lg">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {String(rem.hours).padStart(2, '0')}:{String(rem.minutes).padStart(2, '0')}:{String(rem.seconds).padStart(2, '0')}
                          </span>
                        </div>
                      )}

                      {/* Optional Button on Graphic Banner if enabled */}
                      {camp.showButton && (
                        <div className="absolute bottom-3 right-3">
                          <span className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1">
                            <span>{language === 'bn' ? camp.buttonTextBn || 'দেখুন' : camp.buttonTextEn || 'Shop'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                // Option B: Styled Campaign Banner with Rich Text, Timer & Action Button
                return (
                  <div
                    key={camp.id}
                    onClick={() => handleBannerClick(camp)}
                    className="group relative rounded-2xl overflow-hidden border border-amber-500/30 bg-stone-900/90 shadow-xl cursor-pointer hover:border-amber-400 transition-all transform hover:-translate-y-1 flex flex-col justify-between p-5 min-h-[180px]"
                  >
                    {/* Background photo with gradient overlay */}
                    <img
                      src={camp.bannerImage || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
                      alt={camp.titleEn}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent pointer-events-none" />

                    {/* Top row */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-xs">
                          {camp.discountPercent}% OFF
                        </span>
                        {camp.badgeTextEn && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded-md border border-amber-400/30">
                            {language === 'bn' ? camp.badgeTextBn || camp.badgeTextEn : camp.badgeTextEn}
                          </span>
                        )}
                      </div>

                      {camp.hasTimer && (
                        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/20 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>
                            {String(rem.hours).padStart(2, '0')}:{String(rem.minutes).padStart(2, '0')}:{String(rem.seconds).padStart(2, '0')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle details */}
                    <div className="relative z-10 space-y-1 my-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                        {language === 'bn' ? camp.titleBn : camp.titleEn}
                      </h3>
                      {camp.subtitleEn && (
                        <p className="text-xs text-stone-300 line-clamp-2">
                          {language === 'bn' ? camp.subtitleBn || camp.subtitleEn : camp.subtitleEn}
                        </p>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                        <span>{language === 'bn' ? 'আঁচল এক্সক্লুসিভ' : 'Aanchol Exclusive'}</span>
                      </span>

                      {camp.showButton !== false && (
                        <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                          <span>{language === 'bn' ? camp.buttonTextBn || 'অফার দেখুন' : camp.buttonTextEn || 'Claim Deal'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4-Item Grid with Stock Urgency & Aesthetic Cards */}
        {products.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>{language === 'bn' ? 'টপ ফ্ল্যাশ সেল শাড়ি' : 'Featured Flash Sale Sarees'}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 4).map((p, idx) => (
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

                  {/* Fabrilife Stock Urgency Meter */}
                  <div className="mt-2.5 px-1 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium">
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                        <span>{language === 'bn' ? `মাত্র ${p.stock}টি বাকি আছে` : `Only ${p.stock} left in stock`}</span>
                      </span>
                      <span className="text-stone-400 font-mono text-[10px]">
                        {72 + idx * 7}% Claimed
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/60">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${72 + idx * 7}%` }}
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
