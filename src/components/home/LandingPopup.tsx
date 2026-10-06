import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, ArrowRight, Tag } from 'lucide-react';
import { Language, LandingPopupConfig } from '../../types';
import { store } from '../../services/store';

interface LandingPopupProps {
  language: Language;
  onNavigateShop: () => void;
}

export const LandingPopup: React.FC<LandingPopupProps> = ({ language, onNavigateShop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<LandingPopupConfig>(store.getLandingPopupConfig());

  useEffect(() => {
    const currentConfig = store.getLandingPopupConfig();
    setConfig(currentConfig);

    if (!currentConfig.isActive) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('aanchol_landing_popup_dismissed');
    if (!isDismissed) {
      // Gentle appearance delay after landing
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('aanchol_landing_popup_dismissed', 'true');
  };

  const handleCopyCode = () => {
    if (config.discountCode) {
      navigator.clipboard.writeText(config.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCtaClick = () => {
    handleClose();
    onNavigateShop();
  };

  if (!isOpen || !config.isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-amber-900/20 transform transition-all animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center transition-colors shadow-md"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner Media */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-900 overflow-hidden">
          <img
            src={config.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'}
            alt="Promotion Banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          <div className="absolute top-3.5 left-3.5 bg-amber-500 text-stone-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'bn' ? 'বিশেষ উপহার' : 'Limited Offer'}</span>
          </div>

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

          {/* Discount Code Box */}
          {config.discountCode && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                onClick={handleCopyCode}
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
              onClick={handleCtaClick}
              className="w-full py-3 px-6 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <span>{language === 'bn' ? config.ctaTextBn : config.ctaTextEn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="w-full sm:w-auto py-2.5 px-4 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              {language === 'bn' ? 'পরে দেখব' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
