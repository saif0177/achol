import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Tag,
  Copy,
  Check,
  Truck,
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Promotion, Product, ProductVariant, Language } from '../../types';
import { store } from '../../services/store';
import { ProductCard } from '../product/ProductCard';

interface OfferDetailPageProps {
  offer: Promotion;
  language: Language;
  onBack: () => void;
  onSelectProduct: (product: Product, selectedVariant?: ProductVariant) => void;
  onQuickAddToCart: (product: Product, variant: ProductVariant) => void;
  onDirectOrder: (product: Product, variant: ProductVariant) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onApplyCouponToCart?: (code: string) => void;
}

export const OfferDetailPage: React.FC<OfferDetailPageProps> = ({
  offer,
  language,
  onBack,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder,
  wishlist,
  onToggleWishlist,
  onApplyCouponToCart
}) => {
  const [copied, setCopied] = useState(false);

  // Live Countdown Timer for this specific offer
  const [remainingTime, setRemainingTime] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 24,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    if (!offer.endDate) return;

    const calcTime = () => {
      const diff = new Date(offer.endDate!).getTime() - Date.now();
      if (diff <= 0) {
        setRemainingTime({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemainingTime({ hours, minutes, seconds, isExpired: false });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [offer.endDate]);

  const handleCopyCode = () => {
    if (!offer.code) return;
    navigator.clipboard?.writeText(offer.code);
    setCopied(true);
    if (onApplyCouponToCart) {
      onApplyCouponToCart(offer.code);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  // Requirement 11 & 13: Fetch ONLY the products associated with this specific offer
  const offerProducts = store.getProductsForPromotion(offer);

  const title = language === 'bn' ? offer.titleBn : offer.titleEn;
  const subtitle = language === 'bn' ? (offer.subtitleBn || offer.subtitleEn) : offer.subtitleEn;
  const badge = language === 'bn' ? (offer.badgeBn || 'বিশেষ অফার') : (offer.badgeEn || 'SPECIAL OFFER');

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 pb-20 transition-colors">
      
      {/* Top Breadcrumb Bar */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'bn' ? 'সকল অফারে ফিরে যান' : 'Back to All Offers'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-300 dark:border-amber-700">
              {offerProducts.length} {language === 'bn' ? 'টি শাড়ি অন্তর্ভুক্ত' : 'Sarees in Offer'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* Dedicated Hero Banner for this Specific Offer */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-2xl border border-amber-500/30">
          {/* Background image if provided */}
          {offer.image && (
            <img
              src={offer.image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
            />
          )}

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-6 bg-gradient-to-r from-stone-950 via-stone-950/90 to-amber-950/70">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </span>

              {offer.hasFreeDelivery && (
                <span className="px-3 py-1 bg-emerald-600/90 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}</span>
                </span>
              )}

              {offer.discountPercent && (
                <span className="px-3 py-1 bg-amber-500 text-stone-950 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
                  {offer.discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="space-y-2 max-w-2xl">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Offer Perks: Timer + Coupon Code */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Live Countdown if offer has endDate */}
              {offer.endDate && !remainingTime.isExpired && (
                <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-400/30 flex items-center gap-2.5 shadow-md">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <div className="text-xs">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      {language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Offer Ends In:'}
                    </span>
                    <span className="font-mono text-sm font-bold text-amber-300">
                      {String(remainingTime.hours).padStart(2, '0')}h {String(remainingTime.minutes).padStart(2, '0')}m {String(remainingTime.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>
              )}

              {/* Coupon Box if promo code exists */}
              {offer.code && (
                <div className="bg-amber-950/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-400/40 flex items-center gap-3 shadow-md">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold block">
                      {language === 'bn' ? 'কুপন কোড' : 'Coupon Code'}
                    </span>
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {offer.code}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="ml-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-stone-950" />
                        <span>{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-950" />
                        <span>{language === 'bn' ? 'কোড নিন' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specific Products Grid (ONLY products belonging to this specific offer) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>
                  {language === 'bn' ? 'অফারের অন্তর্ভুক্ত শাড়িসমূহ' : 'Sarees in this Offer'}
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {language === 'bn'
                  ? `এই বিশেষ অফারের জন্য বাছাইকৃত মোট ${offerProducts.length}টি শাড়ি পাওয়া যাচ্ছে।`
                  : `Showing all ${offerProducts.length} authentic sarees specifically assigned to this offer.`}
              </p>
            </div>
          </div>

          {offerProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif text-base font-bold text-stone-800 dark:text-stone-200">
                {language === 'bn' ? 'এই অফারে বর্তমানে কোনো শাড়ি যুক্ত নেই' : 'No Sarees Assigned to this Offer'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'অ্যাডমিন প্যানেল থেকে এই অফারের ক্যাটাগরি বা পণ্যে শাড়ি যুক্ত করা যাবে।'
                  : 'Products can be assigned to this promotional category from the Admin Portal.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {offerProducts.map((product) => (
                <div key={product.id} className="flex flex-col">
                  <ProductCard
                    product={product}
                    language={language}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onSelectProduct={onSelectProduct}
                    onQuickAddToCart={onQuickAddToCart}
                    onDirectOrder={onDirectOrder}
                  />
                  {offer.hasFreeDelivery && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <Truck className="w-3 h-3" />
                        <span>{language === 'bn' ? 'ফ্রি ডেলিভারি প্রযোজ্য' : 'Free Delivery Eligible'}</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
