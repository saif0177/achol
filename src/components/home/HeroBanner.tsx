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

  return (
    <div className="relative w-full overflow-hidden bg-stone-900 border-b border-stone-800">
      {/* Visual background image with measured contrast scrim for WCAG AA readability */}
      <div className="relative h-[340px] sm:h-[380px] lg:h-[400px] w-full flex items-center">
        {current.image ? (
          <div className="absolute inset-0">
            <img
              src={current.image}
              alt={current.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000 ease-out"
            />
            {/* Scrim gradient: 60-30-10 measured overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40" />
        )}

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 w-full">
          <div className="max-w-2xl space-y-2.5 sm:space-y-3.5">
            
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-amber-300 font-bold">
              <span className="w-5 h-[1.5px] bg-amber-400" />
              <span>{language === 'bn' ? 'আঁচল হেরিটেজ এক্সক্লুসিভ' : 'Aanchol Heritage Masterpiece'}</span>
            </div>

            {/* Title with anti-orphan balance */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18] text-balance drop-shadow-sm">
              {language === 'bn' ? current.titleBn : current.titleEn}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal line-clamp-2">
              {language === 'bn' ? current.subtitleBn : current.subtitleEn}
            </p>

            {/* Countdown widget if offer active */}
            {current.hasCountdown && timeLeft && (
              <div className="pt-0.5">
                <div className="inline-flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 px-3 py-1 bg-stone-950/85 backdrop-blur-md rounded-lg border border-amber-900/50 max-w-full">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.countdownEndsIn}:</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-center">
                    <div className="px-1.5 py-0.5 bg-stone-900 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.days}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.days}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-1.5 py-0.5 bg-stone-900 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.hours}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.hours}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-1.5 py-0.5 bg-stone-900 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.minutes}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.minutes}</span>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold">:</span>
                    <div className="px-1.5 py-0.5 bg-stone-900 rounded flex items-baseline gap-1">
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{timeLeft.seconds}</span>
                      <span className="text-[8px] uppercase text-stone-400">{t.seconds}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA action button */}
            <div className="pt-1.5 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onCtaClick(current.ctaLink || 'shop')}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{language === 'bn' ? current.ctaTextBn : current.ctaTextEn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 text-[11px] text-stone-400">
                <span>✓ Cash on Delivery</span>
                <span>·</span>
                <span>✓ 100% Genuine Handloom</span>
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
