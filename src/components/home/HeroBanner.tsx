import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Ticket, Check, Zap, Sparkles } from 'lucide-react';
import { Banner, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { handleImageError, FALLBACK_BANNER_IMAGE } from '../../utils/imageHelper';

interface HeroBannerProps {
  banners: Banner[];
  language: Language;
  onCtaClick: (destination: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  language,
  onCtaClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const t = translations[language];

  // Active banners only
  const activeBanners = banners.filter((b) => b.isActive);
  const current = activeBanners[currentIndex] || activeBanners[0];

  // Auto-slide every 6 seconds if multiple banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Countdown timer calculations
  const calculateTimeLeft = () => {
    if (!current?.countdownTarget) return null;
    const difference = +new Date(current.countdownTarget) - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!current?.hasCountdown || !current?.countdownTarget) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [current]);

  if (activeBanners.length === 0 || !current) {
    return null; // As requested: If no banner assigned, slot remains empty!
  }

  // Check if banner is graphic image-only mode
  const isImageOnly = Boolean((current as any).displayMode === 'image_only' || (!current.titleEn?.trim() && !current.titleBn?.trim()));
  const isEntireClickable = Boolean(current.isEntireBannerClickable);
  const isFlashDeal = current.bannerType === 'flash_deal';
  const isGeneralPromo = current.bannerType === 'general_promotion';

  return (
    <div className={`relative w-full overflow-hidden bg-stone-900 border-b ${isFlashDeal ? 'border-amber-500/50 shadow-inner' : 'border-stone-800'}`}>
      {/* Visual background image with measured contrast scrim for WCAG AA readability */}
      <div 
        onClick={() => {
          if (isEntireClickable) {
            onCtaClick(current.ctaLink || 'shop');
          }
        }}
        className={`relative h-[340px] sm:h-[380px] lg:h-[400px] w-full flex items-center group ${isEntireClickable ? 'cursor-pointer' : 'cursor-default'}`}
        title={isEntireClickable ? 'Click anywhere to visit banner offer' : undefined}
      >
        {current.image ? (
          <div className="absolute inset-0">
            <img
              src={current.image}
              alt={current.titleEn || 'Hero Promotion Banner'}
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, FALLBACK_BANNER_IMAGE)}
              className="w-full h-full object-cover object-center transform scale-102 group-hover:scale-104 transition-transform duration-1000 ease-out"
            />
            {/* Scrim gradient: 60-30-10 measured overlay only when text content is present */}
            {!isImageOnly && (
              <>
                <div className={`absolute inset-0 ${isFlashDeal ? 'bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-amber-950/40' : 'bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40'}`} />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />
              </>
            )}
          </div>
        ) : (
          <div className={`absolute inset-0 ${isFlashDeal ? 'bg-gradient-to-br from-stone-950 via-[#260714] to-amber-950/60' : 'bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40'}`} />
        )}

        {/* Content Box (hidden in image-only mode) */}
        {!isImageOnly && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 w-full">
          <div className="max-w-2xl space-y-2.5 sm:space-y-3.5">
            
            {/* Kicker Tag / Distinctive Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isFlashDeal ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg border border-amber-300/40 animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{language === 'bn' ? '⚡ এক্সক্লুসিভ ফ্ল্যাশ ডিল' : '⚡ EXCLUSIVE FLASH DEAL'}</span>
                </div>
              ) : isGeneralPromo ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '✨ নতুন কালেকশন ও উন্মোচন' : '✨ NEW COLLECTION & SHOWCASE'}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-amber-300 font-bold">
                  <span className="w-5 h-[1.5px] bg-amber-400" />
                  <span>{language === 'bn' ? 'আঁচল হেরিটেজ এক্সক্লুসিভ' : 'Aanchol Heritage Masterpiece'}</span>
                </div>
              )}

              {/* Prominent Discount Text Badge */}
              {current.discountText && (
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 text-xs font-black uppercase tracking-wider shadow-md">
                  {current.discountText}
                </span>
              )}
            </div>

            {/* Title with anti-orphan balance */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18] text-balance drop-shadow-sm group-hover:text-amber-100 transition-colors">
              {language === 'bn' ? current.titleBn : current.titleEn}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal line-clamp-2">
              {language === 'bn' ? current.subtitleBn : current.subtitleEn}
            </p>

            {/* Countdown widget if offer active */}
            {current.hasCountdown && timeLeft && (
              <div className="pt-0.5">
                <div className={`inline-flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 px-3 py-1.5 bg-stone-950/90 backdrop-blur-md rounded-xl max-w-full shadow-lg ${isFlashDeal ? 'border-2 border-amber-400/60' : 'border border-amber-900/50'}`}>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{current.timerLabel || t.countdownEndsIn}:</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-center">
                    <div className="px-2 py-0.5 bg-stone-900/90 rounded-md border border-stone-800 flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.days}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.days}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-2 py-0.5 bg-stone-900/90 rounded-md border border-stone-800 flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.hours}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.hours}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-2 py-0.5 bg-stone-900/90 rounded-md border border-stone-800 flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.minutes}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.minutes}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-2 py-0.5 bg-stone-900/90 rounded-md border border-stone-800 flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.seconds}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.seconds}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA action button & Optional Coupon Pill */}
            <div className="pt-1.5 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCtaClick(current.ctaLink || 'shop');
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer ${
                  isFlashDeal
                    ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                }`}
              >
                <span>{language === 'bn' ? current.ctaTextBn : current.ctaTextEn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Coupon section with Copy button (Requirement 3) */}
              {current.couponCode && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(current.couponCode || '');
                    setCopiedCoupon(true);
                    setTimeout(() => setCopiedCoupon(false), 2000);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-950/85 backdrop-blur-md rounded-xl border border-amber-500/50 cursor-pointer hover:bg-stone-900 transition-colors shadow-md"
                  title="Click to copy coupon code"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {current.couponCode}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500 text-stone-950 rounded-md text-[10px] font-bold flex items-center gap-1">
                    {copiedCoupon ? (
                      <>
                        <Check className="w-2.5 h-2.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <span>Copy</span>
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-[11px] text-stone-400">
                <span>✓ Cash on Delivery</span>
                <span>·</span>
                <span>✓ 100% Genuine Handloom</span>
                {isEntireClickable && (
                  <>
                    <span>·</span>
                    <span className="text-amber-400/90 font-medium">⚡ Click anywhere to visit</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
        )}

        {/* Carousel slide controls */}
        {activeBanners.length > 1 && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="absolute bottom-6 right-8 z-20 flex items-center gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
              }}
              className="p-2 rounded-full bg-stone-950/60 text-white hover:bg-amber-700 transition-colors cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
              }}
              className="p-2 rounded-full bg-stone-950/60 text-white hover:bg-amber-700 transition-colors cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
