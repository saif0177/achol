import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, ArrowRight, Tag, Clock } from 'lucide-react';
import { Language, LandingPopupConfig } from '../../types';
import { store } from '../../services/store';
import { handleImageError, FALLBACK_BANNER_IMAGE } from '../../utils/imageHelper';

interface LandingPopupProps {
  language: Language;
  onNavigateShop: (destination?: string) => void;
}

export const LandingPopup: React.FC<LandingPopupProps> = ({ language, onNavigateShop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<LandingPopupConfig | null>(null);

  // Live timer state for popups with timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Check if dismissed or already shown in this browsing session to prevent repeated pop-ups on refresh
    try {
      if (
        sessionStorage.getItem('aanchol_popup_dismissed_session') === 'true' ||
        sessionStorage.getItem('aanchol_popup_shown_session') === 'true'
      ) {
        return;
      }
    } catch {}

    // Pick randomly from all active landing popups (Requirement 3: random rotation on landing)
    const randomConfig = store.getRandomActiveLandingPopup();
    if (!randomConfig || !randomConfig.isActive) return;

    // Check expiration: Expired popups must automatically stop appearing
    if (randomConfig.endTime && new Date(randomConfig.endTime).getTime() <= Date.now()) {
      return;
    }

    // Check cooldown
    const lastShown = Number(localStorage.getItem('aanchol_last_popup_shown') || '0');
    const cooldownMinutes = randomConfig.cooldownMinutes ?? 30;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    if (Date.now() - lastShown < cooldownMs) {
      return;
    }

    setConfig(randomConfig);

    // Calculate initial timer if present
    if (randomConfig.hasTimer && randomConfig.endTime) {
      const calculateTimeLeft = () => {
        const diff = Math.max(0, new Date(randomConfig.endTime!).getTime() - Date.now());
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
      };
      setTimeLeft(calculateTimeLeft());
    }

    // Mark as shown immediately in sessionStorage so refresh does NOT repeatedly trigger popup
    try {
      sessionStorage.setItem('aanchol_popup_shown_session', 'true');
      localStorage.setItem('aanchol_last_popup_shown', String(Date.now()));
    } catch {}

    // Configurable appearance delay after landing (pop-up timing)
    const delayMs = (randomConfig.delaySeconds !== undefined ? randomConfig.delaySeconds : 1.2) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard escape listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Countdown timer tick
  useEffect(() => {
    if (!config?.hasTimer) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config?.hasTimer]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('aanchol_popup_dismissed_session', 'true');
      sessionStorage.setItem('aanchol_popup_shown_session', 'true');
      localStorage.setItem('aanchol_last_popup_shown', String(Date.now()));
    } catch {}
  };

  const handleCopyCode = () => {
    if (config?.discountCode) {
      navigator.clipboard.writeText(config.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCtaClick = () => {
    handleClose();
    onNavigateShop(config?.ctaLink || 'shop');
  };

  if (!isOpen || !config || !config.isActive) return null;

  const isFlashDeal = config.popupType === 'flash_deal';
  const isGeneralPromo = config.popupType === 'general_promotion';
  const isEntireClickable = Boolean(config.isEntireBannerClickable);

  // Mode 1: Dedicated Image-Only Banner (Photoshop/Designer banner, tap anywhere to redirect)
  if (config.displayMode === 'image_only') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Pure Graphic Banner Dialog - Click anywhere to redirect */}
        <div 
          onClick={handleCtaClick}
          className="relative w-full max-w-xl bg-transparent rounded-3xl overflow-hidden z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 cursor-pointer group"
          title="Click anywhere to open offer link"
        >
          {/* Close button (stops propagation so user can dismiss) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-stone-950/80 hover:bg-stone-950 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 border border-white/20 cursor-pointer"
            title="Close Banner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clickable Graphic Image from Photoshop/Designer */}
          <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={config.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
              alt={config.titleEn || 'Promotional Banner'}
              onError={(e) => handleImageError(e, FALLBACK_BANNER_IMAGE)}
              className="w-full h-auto max-h-[80vh] object-contain sm:object-cover group-hover:scale-102 transition-transform duration-500"
            />

            {/* Tap anywhere indicator */}
            <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1 border border-white/20 pointer-events-none">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{language === 'bn' ? 'অফার দেখতে স্পর্শ করুন' : 'Tap to open offer'}</span>
            </div>

            {/* Optional Floating Countdown Timer on Image if enabled */}
            {config.hasTimer && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/40 text-white flex items-center gap-3 shadow-xl pointer-events-none">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{config.timerLabel || (language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Offer Ends In:')}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-400">
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mode 2: Standard Luxury Popup Card with Copyable Code, Timer & Details
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div 
        onClick={isEntireClickable ? handleCtaClick : undefined}
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border transform transition-all animate-in fade-in zoom-in-95 duration-300 group ${
          isFlashDeal 
            ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-rose-950/30' 
            : 'border-amber-900/20 hover:shadow-amber-900/10'
        } ${isEntireClickable ? 'cursor-pointer' : ''}`}
        title={isEntireClickable ? 'Click anywhere to visit destination' : undefined}
      >
        {/* Close Button: stopPropagation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner Media */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-900 overflow-hidden">
          <img
            src={config.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
            alt="Promotion Banner"
            onError={(e) => handleImageError(e, FALLBACK_BANNER_IMAGE)}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
            {isFlashDeal ? (
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-amber-300/40 animate-pulse">
                <span>⚡ {language === 'bn' ? 'ফ্ল্যাশ ডিল' : 'FLASH DEAL'}</span>
              </div>
            ) : isGeneralPromo ? (
              <div className="bg-stone-900/90 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-400/40 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন ঘোষণা' : 'Announcement'}</span>
              </div>
            ) : (
              <div className="bg-amber-500 text-stone-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'bn' ? 'বিশেষ অফার' : 'Special Offer'}</span>
              </div>
            )}

            {config.discountText && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                {config.discountText}
              </span>
            )}
          </div>

          {/* Timer pill on banner */}
          {config.hasTimer && (
            <div className={`absolute top-3.5 right-14 backdrop-blur-md text-amber-300 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
              isFlashDeal ? 'bg-rose-950/90 border border-amber-400' : 'bg-stone-950/80 border border-amber-400/30'
            }`}>
              <Clock className="w-3 h-3 text-amber-400" />
              <span>
                {config.timerLabel ? `${config.timerLabel}: ` : ''}
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
              {language === 'bn' ? config.titleBn : config.titleEn}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-stone-50 to-white text-center sm:text-left">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'bn' ? config.subtitleBn : config.subtitleEn}
          </p>

          {/* Discount Code Box (stopPropagation on copy button) */}
          {config.discountCode && !isGeneralPromo && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-default"
            >
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 uppercase font-semibold block">
                    {language === 'bn' ? 'কুপন কোড' : 'Discount Coupon'}
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-950 tracking-wider">
                    {config.discountCode}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyCode();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'bn' ? 'কপি হয়েছে!' : 'COPIED!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'কোড কপি করুন' : 'Copy Code'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 font-medium pt-1">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{language === 'bn' ? 'সারাদেশে ফ্রি হোম ডেলিভারি' : 'Free Home Delivery'}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on Delivery (COD)'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCtaClick();
              }}
              className={`w-full py-3 px-6 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                isFlashDeal
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-black'
                  : 'bg-stone-900 hover:bg-amber-900'
              }`}
            >
              <span>{language === 'bn' ? config.ctaTextBn : config.ctaTextEn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="w-full sm:w-auto py-2.5 px-4 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'পরে দেখব' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
