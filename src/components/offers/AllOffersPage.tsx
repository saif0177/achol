import React, { useState } from 'react';
import {
  Tag,
  Clock,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Truck,
  Zap,
  Percent,
  Gift,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Promotion, Language } from '../../types';
import { store } from '../../services/store';

interface AllOffersPageProps {
  language: Language;
  onBack: () => void;
  onShopOffer: (offer: Promotion) => void;
  onOpenFlashSale?: () => void;
}

export const AllOffersPage: React.FC<AllOffersPageProps> = ({
  language,
  onBack,
  onShopOffer,
  onOpenFlashSale
}) => {
  const promotions = store.getPromotions();
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = promotions.filter((p) => {
    if (filterType === 'all') return true;
    if (filterType === 'discount') return p.type === 'percentage' || p.type === 'fixed' || p.type === 'coupon';
    if (filterType === 'free_delivery') return p.type === 'free_delivery';
    if (filterType === 'flash_sale') return p.type === 'flash_sale';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </button>

          <span className="text-xs text-stone-500 font-medium">
            {language === 'bn'
              ? `${promotions.length}টি সক্রিয় অফার চলমান`
              : `${promotions.length} Active Offers Live`}
          </span>
        </div>

        {/* Hero Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-6 sm:p-10 shadow-xl border border-stone-800">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আঁচল প্রিভিলেজ হাব' : 'Aanchol Privilege Hub'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {language === 'bn' ? 'চলমান সকল বিশেষ অফার ও কুপন' : 'All Active Offers & Privileges'}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              {language === 'bn'
                ? 'খাঁটি ঢাকাই জামদানি, মসলিন ও ঐতিহ্যবাহী তাঁতের শাড়িতে ক্যাশ অন ডেলিভারিসহ আকর্ষণীয় মূল্যছাড় এবং ফ্রি শিপিং অফার।'
                : 'Verified artisan Dhakai Jamdani, Muslin, and pure handloom sarees with instant discounts, coupon vouchers, and free shipping across Bangladesh.'}
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden lg:block overflow-hidden">
            <img
              src="/src/assets/images/hero_jamdani_craft_1791268697306.jpg"
              alt="Handloom Craft"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Direct Access Callout to Dedicated For Sale Page */}
        {onOpenFlashSale && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1f0714] via-[#2c0b20] to-[#180528] border-2 border-amber-400/40 p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white text-xs font-black rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                  <span>{language === 'bn' ? 'স্পেশাল ফর সেল পেজ' : 'SPECIAL FOR SALE PAGE'}</span>
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {language === 'bn' ? '• সরাসরি লাইভ ডিল কালেকশন' : '• Live Flash Deal Collection'}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {language === 'bn'
                  ? 'সকল আকর্ষণীয় ফর সেল শাড়ি আলাদা পেজে দেখুন'
                  : 'Browse All Sarees For Sale on Dedicated Page'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                {language === 'bn'
                  ? 'কাউন্টডাউন টাইমার ও আকর্ষণীয় ছাড়ে বাছাইকৃত শাড়িসমূহ আলাদা পেজে সহজে অর্ডার করুন।'
                  : 'Live countdown timers and deepest discounts on handloom Jamdani & Silk sarees.'}
              </p>
            </div>

            <button
              onClick={onOpenFlashSale}
              className="px-6 py-4 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:via-rose-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer shrink-0 self-stretch sm:self-auto transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{language === 'bn' ? 'ফর সেল পেজ দেখুন' : 'Go to For Sale Page'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-stone-900 dark:bg-amber-950 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            {language === 'bn' ? 'সকল অফার' : 'All Offers'} ({promotions.length})
          </button>

          <button
            onClick={() => setFilterType('discount')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'discount'
                ? 'bg-stone-900 dark:bg-amber-950 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'bn' ? 'মূল্যছাড় ও কুপন' : 'Discounts & Vouchers'}</span>
          </button>

          <button
            onClick={() => setFilterType('free_delivery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'free_delivery'
                ? 'bg-stone-900 dark:bg-amber-950 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}</span>
          </button>

          <button
            onClick={() => setFilterType('flash_sale')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'flash_sale'
                ? 'bg-stone-900 dark:bg-amber-950 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Deals'}</span>
          </button>
        </div>

        {/* Promotions Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
            <Tag className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
              {language === 'bn' ? 'এই বিভাগে কোনো সক্রিয় অফার নেই' : 'No Active Offers in this Category'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'bn'
                ? 'অন্যান্য বিভাগের অফারসমূহ দেখতে ওপরের ট্যাব নির্বাচন করুন।'
                : 'Please check other offer categories or explore all sarees.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((promo) => (
              <div
                key={promo.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Media Header */}
                  <div className="relative h-44 sm:h-52 w-full bg-stone-900 overflow-hidden">
                    <img
                      src={promo.image || '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg'}
                      alt={promo.titleEn}
                      className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-amber-500 text-stone-950 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {language === 'bn' ? (promo.badgeBn || 'বিশেষ অফার') : (promo.badgeEn || 'SPECIAL OFFER')}
                    </div>

                    {/* Expiry / Validity */}
                    {promo.endDate && (
                      <div className="absolute top-3.5 right-3.5 bg-stone-950/80 backdrop-blur-md border border-white/20 text-stone-200 text-[10px] font-mono font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>
                          {language === 'bn' ? 'মেয়াদ:' : 'Ends:'}{' '}
                          {new Date(promo.endDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                        {language === 'bn' ? promo.titleBn : promo.titleEn}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {language === 'bn' ? promo.subtitleBn : promo.subtitleEn}
                    </p>

                    {/* Promo Code Box */}
                    {promo.code && (
                      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-800 dark:text-amber-400 uppercase font-semibold block">
                              {language === 'bn' ? 'প্রোমো কুপন কোড' : 'Coupon Code'}
                            </span>
                            <span className="font-mono text-sm font-bold text-amber-950 dark:text-amber-200 tracking-wider">
                              {promo.code}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleCopy(promo.code!, e)}
                          className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedCode === promo.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'কোড কপি' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Minimum Spend & Conditions */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                      {promo.minOrderAmount ? (
                        <span>
                          • {language === 'bn' ? `ন্যূনতম অর্ডার: ৳${promo.minOrderAmount.toLocaleString()}` : `Min. Order: ৳${promo.minOrderAmount.toLocaleString()}`}
                        </span>
                      ) : (
                        <span>• {language === 'bn' ? 'কোনো ন্যূনতম অর্ডারের শর্ত নেই' : 'No minimum order required'}</span>
                      )}
                      <span>• {language === 'bn' ? 'ক্যাশ অন ডেলিভারিতে প্রযোজ্য' : 'Cash on Delivery eligible'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => {
                      if (promo.type === 'flash_sale' && onOpenFlashSale) {
                        onOpenFlashSale();
                      } else {
                        onShopOffer(promo);
                      }
                    }}
                    className="w-full py-3 px-5 bg-stone-900 hover:bg-amber-900 dark:bg-amber-950 dark:hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>
                      {language === 'bn'
                        ? (promo.ctaTextBn || 'এই অফারের শাড়ি কিনুন')
                        : (promo.ctaTextEn || 'Shop This Collection')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
