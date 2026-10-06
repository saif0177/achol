import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  Tag
} from 'lucide-react';
import { Product, ProductVariant, Language, FlashSaleCampaign } from '../../types';
import { store } from '../../services/store';
import { ProductCard } from '../product/ProductCard';

interface FlashSalePageProps {
  language: Language;
  onBack: () => void;
  onSelectProduct: (product: Product, selectedVariant?: ProductVariant) => void;
  onQuickAddToCart: (product: Product, variant: ProductVariant) => void;
  onDirectOrder: (product: Product, variant: ProductVariant) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const FlashSalePage: React.FC<FlashSalePageProps> = ({
  language,
  onBack,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder,
  wishlist,
  onToggleWishlist
}) => {
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>(store.getFlashSales());
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );

  // Active campaign
  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 48,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter sale products
  const allSaleProducts = store
    .getProducts()
    .filter((p) => p.isSale || (p.discountPercent && p.discountPercent > 0));

  const [minDiscountFilter, setMinDiscountFilter] = useState<number>(0);

  const filteredProducts = allSaleProducts.filter((p) => {
    if (!minDiscountFilter) return true;
    return (p.discountPercent || 0) >= minDiscountFilter;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20">
      {/* 1. Top Breadcrumbs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-amber-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <Zap className="w-3.5 h-3.5 fill-rose-600" />
            <span>{language === 'bn' ? 'ফ্ল্যাশ সেল স্পেশাল' : 'Flash Sale Special Page'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* 2. Hero Flash Sale Campaign Banner with Real-time Countdown */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-rose-950 text-white shadow-xl p-6 sm:p-10 border border-rose-900/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 text-xs font-bold border border-rose-500/40 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'bn' ? 'সীমিত সময়ের ধামাকা অফার' : 'Limited Time Flash Event'}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {activeCampaign
                ? language === 'bn'
                  ? activeCampaign.titleBn
                  : activeCampaign.titleEn
                : language === 'bn'
                ? 'ঐতিহ্যবাহী জামদানি ও সিল্ক ফ্ল্যাশ সেল'
                : 'Royal Heritage Sarees Flash Sale'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {language === 'bn'
                ? 'বাছাইকৃত খাঁটি হস্তচালিত তাঁতের ঢাকাই জামদানি, মসলিন ও রাজশাহী সিল্কে সর্বোচ্চ ২০% পর্যন্ত নগদ ছাড়! সাথে থাকছে সারাদেশে ফ্রি হোম ডেলিভারি।'
                : 'Enjoy exclusive limited-run promotional prices on verified pure handloom sarees. Delivered with 100% Free Shipping and Cash on Delivery nationwide.'}
            </p>

            {/* Countdown Clock */}
            {activeCampaign?.hasTimer !== false && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Flash Sale Ends In:'}</span>
                </span>

                <div className="flex items-center gap-2 font-mono">
                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10 min-w-[54px]">
                    <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider">
                      {language === 'bn' ? 'ঘণ্টা' : 'Hours'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-rose-500">:</span>

                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10 min-w-[54px]">
                    <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider">
                      {language === 'bn' ? 'মিনিট' : 'Mins'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-rose-500">:</span>

                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10 min-w-[54px]">
                    <span className="text-xl sm:text-2xl font-bold text-amber-400 block leading-none">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider">
                      {language === 'bn' ? 'সেকেন্ড' : 'Secs'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Campaign Selector Tabs (if multiple campaigns from admin) */}
        {campaigns.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
              {language === 'bn' ? 'অন্যান্য ক্যাম্পেইন:' : 'Other Campaigns:'}
            </span>
            {campaigns.map((camp) => (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCampaignId === camp.id
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {language === 'bn' ? camp.titleBn : camp.titleEn}
              </button>
            ))}
          </div>
        )}

        {/* 4. Filter Buttons Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <Tag className="w-4 h-4 text-rose-600" />
            <span>
              {language === 'bn'
                ? `মোট ${filteredProducts.length}টি স্পেশাল অফার শাড়ি`
                : `Showing ${filteredProducts.length} Flash Sale Sarees`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-medium mr-1">
              {language === 'bn' ? 'ছাড় অনুযায়ী ফিল্টার:' : 'Filter Discount:'}
            </span>
            <button
              onClick={() => setMinDiscountFilter(0)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                minDiscountFilter === 0
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'সব ছাড়' : 'All Deals'}
            </button>
            <button
              onClick={() => setMinDiscountFilter(10)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                minDiscountFilter === 10
                  ? 'bg-rose-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              10%+ OFF
            </button>
            <button
              onClick={() => setMinDiscountFilter(15)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                minDiscountFilter === 15
                  ? 'bg-rose-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              15%+ OFF
            </button>
          </div>
        </div>

        {/* 5. Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              language={language}
              isWishlisted={wishlist.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
              onDirectOrder={onDirectOrder}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
