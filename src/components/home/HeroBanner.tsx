import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { Banner, Language } from '../../types';
import { translations } from '../../i18n/translations';

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
  const t = translations[language];

  // Active banners only
  const activeBanners = banners.filter((b) => b.isActive);

  // Auto-slide every 6 seconds if multiple banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return null; // As requested: If no banner assigned, slot remains empty!
  }

  const current = activeBanners[currentIndex];

  // Countdown timer calculations
  const calculateTimeLeft = () => {
    if (!current.countdownTarget) return null;
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
    if (!current.hasCountdown || !current.countdownTarget) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative w-full overflow-hidden bg-stone-900 border-b border-stone-800">
      {/* Visual background image with measured contrast scrim for WCAG AA readability */}
      <div className="relative h-[520px] sm:h-[560px] lg:h-[600px] w-full flex items-center">
        {current.image ? (
          <div className="absolute inset-0">
            <img
              src={current.image}
              alt={current.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Scrim gradient: 60-30-10 measured overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-stone-950/30" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40" />
        )}

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-medium">
              <span className="w-6 h-[1px] bg-amber-400" />
              <span>{language === 'bn' ? 'আঁচল হেরিটেজ এক্সক্লুসিভ' : 'Aanchol Heritage Masterpiece'}</span>
            </div>

            {/* Title with anti-orphan balance */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              {language === 'bn' ? current.titleBn : current.titleEn}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl font-normal">
              {language === 'bn' ? current.subtitleBn : current.subtitleEn}
            </p>

            {/* Countdown widget if offer active */}
            {current.hasCountdown && timeLeft && (
              <div className="pt-1">
                <div className="inline-flex flex-row flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 px-3 py-1.5 bg-stone-900/80 backdrop-blur-md rounded-lg border border-amber-900/50 max-w-full">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.countdownEndsIn}:</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-center">
                    <div className="px-2 py-0.5 bg-stone-950 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">{timeLeft.days}</span>
                      <span className="text-[9px] uppercase text-stone-400">{t.days}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-2 py-0.5 bg-stone-950 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">{timeLeft.hours}</span>
                      <span className="text-[9px] uppercase text-stone-400">{t.hours}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-2 py-0.5 bg-stone-950 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">{timeLeft.minutes}</span>
                      <span className="text-[9px] uppercase text-stone-400">{t.minutes}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-2 py-0.5 bg-stone-950 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">{timeLeft.seconds}</span>
                      <span className="text-[9px] uppercase text-stone-400">{t.seconds}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA action button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onCtaClick(current.ctaLink || 'shop')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-700 hover:bg-amber-600 text-stone-950 font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>{language === 'bn' ? current.ctaTextBn : current.ctaTextEn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span>✓ Cash on Delivery</span>
                <span>·</span>
                <span>✓ Verified Weavers</span>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel slide controls */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
              }
              className="p-2 rounded-full bg-stone-950/60 text-white hover:bg-amber-700 transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="p-2 rounded-full bg-stone-950/60 text-white hover:bg-amber-700 transition-colors"
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
