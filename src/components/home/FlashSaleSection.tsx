import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Clock, ArrowRight, Sparkles, Star, Tag, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductVariant, Language, Promotion } from '../../types';
import { store } from '../../services/store';
import { ProductCard } from '../product/ProductCard';

interface FlashSaleSectionProps {
  products?: Product[];
  language: Language;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (p: Product, v?: ProductVariant) => void;
  onQuickAddToCart: (p: Product, v: ProductVariant) => void;
  onDirectOrder: (p: Product, v: ProductVariant) => void;
  onViewAllFlash: () => void;
  onNavigateTarget?: (target: string) => void;
  onSelectOffer?: (offer: Promotion) => void;
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
  onSelectOffer
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Live dynamic countdown timer for the special showcase window
  const [timeLeft, setTimeLeft] = useState(() => {
    // 24-hour cycle timer
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, endOfDay.getTime() - now.getTime());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  // Curated up to 8 top rated / special weaves for horizontal single-row scroll
  const curatedProducts = useMemo(() => {
    if (products && products.length > 0) {
      return [...products].slice(0, 8);
    }
    return store.getTopRated(8);
  }, [products]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [curatedProducts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = Math.min(scrollContainerRef.current.clientWidth * 0.75, 480);
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (curatedProducts.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 bg-gradient-to-b from-amber-50/50 via-stone-50/70 to-amber-50/30 dark:from-stone-900/90 dark:via-stone-900/60 dark:to-stone-950 border-y border-amber-200/60 dark:border-stone-800 transition-colors">
      {/* Subtle top heritage gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Header Bar: Clean & Elegant with Title, Live Countdown Timer, Navigation Arrows, and More Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-amber-200/70 dark:border-stone-800">
          
          {/* Title & Heritage Eyebrow */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  {language === 'bn' ? 'বিশেষ ঐতিহ্যবাহী সংস্করণ' : 'Special Curated Edition'}
                </span>
              </div>
              <span className="sm:hidden text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-amber-200 dark:border-stone-700">
                {language === 'bn' ? 'সোয়াইপ করুন ➔' : 'Swipe ➔'}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {language === 'bn' ? 'টপ রেটেড উইভস' : 'Top Rated Weaves'}
            </h2>
            
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl">
              {language === 'bn'
                ? 'কারিগরদের হাতে বোনা শীর্ষ রেটিংপ্রাপ্ত ঐতিহ্যবাহী ঢাকাই জামদানি, মসলিন ও খাঁটি সিল্কের অনন্য সম্ভার।'
                : 'Master artisan Dhakai Jamdani, royal Muslin, and pure silk handlooms praised by saree connoisseurs.'}
            </p>
          </div>

          {/* Action Group: Timer, Desktop Navigation Arrows & Explore Button */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Elegant Live Countdown Timer */}
            <div className="flex items-center gap-2.5 bg-white dark:bg-stone-950 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">
                  {language === 'bn' ? 'সময় বাকি:' : 'Ends In:'}
                </span>
              </div>

              {/* Time Blocks */}
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
                <span className="bg-amber-50 dark:bg-stone-900 px-2 py-1 rounded border border-amber-200/60 dark:border-stone-700 min-w-[28px] text-center">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">:</span>
                <span className="bg-amber-50 dark:bg-stone-900 px-2 py-1 rounded border border-amber-200/60 dark:border-stone-700 min-w-[28px] text-center">
                  {pad(timeLeft.minutes)}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">:</span>
                <span className="bg-amber-50 dark:bg-stone-900 px-2 py-1 rounded border border-amber-200/60 dark:border-stone-700 min-w-[28px] text-center">
                  {pad(timeLeft.seconds)}
                </span>
              </div>
            </div>

            {/* Desktop Horizontal Scroll Arrows (Single Row Navigation on Computer) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-stone-950 p-1 rounded-xl border border-amber-200 dark:border-stone-800 shadow-xs">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-amber-100/70 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={language === 'bn' ? 'বামে স্ক্রোল করুন' : 'Scroll left'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-amber-100/70 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={language === 'bn' ? 'ডানে স্ক্রোল করুন' : 'Scroll right'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Noticeable "Explore All" Button */}
            <button
              onClick={onViewAllFlash}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-950 dark:hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-2 group cursor-pointer border border-stone-800 dark:border-amber-800"
              title={language === 'bn' ? 'সকল শাড়ি ও অফার দেখুন' : 'Explore All & Offers'}
            >
              <span>
                {language === 'bn' ? 'সবগুলো দেখুন' : 'Explore All'}
              </span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-300" />
            </button>

          </div>
        </div>

        {/* ONLY ONE ROW of "Top Rated Weaves" on Computer & Mobile with Horizontal Scroll */}
        {/* On Mobile: smaller cards (w-[40vw] xs:w-[38vw] max-w-[165px]) so they are nicely proportioned */}
        {/* On Computer: single row of generous cards (w-[260px] md:w-[280px] lg:w-[295px]) with smooth horizontal scrolling */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex flex-row flex-nowrap gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-amber-300/70 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent touch-pan-x"
        >
          {curatedProducts.map((p) => (
            <div
              key={p.id}
              className="w-[40vw] xs:w-[38vw] min-w-[135px] max-w-[165px] sm:w-[260px] sm:min-w-0 sm:max-w-none md:w-[280px] lg:w-[295px] shrink-0 snap-start transition-transform duration-200 hover:-translate-y-1"
            >
              <ProductCard
                product={p}
                language={language}
                isWishlisted={wishlist.includes(p.id)}
                isListView={false}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onQuickAddToCart={onQuickAddToCart}
                onDirectOrder={onDirectOrder}
              />
            </div>
          ))}
        </div>

        {/* Bottom Special Callout: Links directly to All Offers */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 bg-white/70 dark:bg-stone-950/60 p-3.5 sm:px-5 rounded-2xl border border-amber-200/60 dark:border-stone-800/80">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Tag className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              {language === 'bn'
                ? 'সকল সিজনাল ছাড়, ক্যাম্পেইন ও প্রাইভেট কুপন কোড দেখতে আমাদের "অল অফার" পেজ ভিজিট করুন।'
                : 'Looking for seasonal promotions, flash campaigns & discount codes? Find them on the All Offers page.'}
            </span>
          </div>

          <button
            onClick={onViewAllFlash}
            className="font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-200 hover:underline flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সকল অফার দেখুন' : 'View All Offers'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Subtle bottom heritage gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
};
