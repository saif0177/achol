import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Truck,
  Zap,
  Ruler,
  CheckCircle2,
  ChevronDown,
  Bell
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  cartSubtotal?: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (categoryId: string) => void;
  activeView: string;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onOpenTracking: () => void;
  onOpenSareeGuide?: () => void;
  onOpenFlashSale?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  cartCount,
  cartSubtotal = 0,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenAdmin,
  onOpenSearch,
  onSelectCategory,
  onNavigateHome,
  onNavigateShop,
  onOpenTracking,
  onOpenSareeGuide,
  onOpenFlashSale,
  onOpenNotifications,
  unreadNotificationsCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  // Rotating top announcement ticker messages
  const announcements = [
    {
      bn: '🔥 ঈদ ধামাকা: ৩টি শাড়ির অর্ডারে ফ্রি হোম ডেলিভারি + ৫% ছাড় | কোড: AANCHOL500',
      en: '🔥 Special Offer: Free Delivery on 3 sarees + Extra 5% Off | Code: AANCHOL500'
    },
    {
      bn: '📞 ভিডিও কলে শাড়ির কাজ দেখতে হটলাইনে কল করুন: 09612-444888 (সকাল ১০টা - রাত ১০টা)',
      en: '📞 Direct WhatsApp & Video Preview Hotline: +880 1700-000000 (10 AM - 10 PM)'
    },
    {
      bn: '🚚 সারাদেশে ক্যাশ অন ডেলিভারি · পার্সেল খুলে দেখে মূল্য পরিশোধের সুবিধা',
      en: '🚚 Cash on Delivery Nationwide · Inspect saree before payment'
    }
  ];

  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <>
      {/* 1. Top Announcement Marquee Ticker */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center border-b border-stone-800 tracking-wide flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium truncate transition-opacity duration-300">
              {language === 'bn'
                ? announcements[announcementIndex].bn
                : announcements[announcementIndex].en}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-stone-400 shrink-0">
            <a
              href="tel:09612444888"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Hotline: 09612-444888</span>
            </a>
            <span>·</span>
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Truck className="w-3 h-3 text-amber-400" />
              <span>{t.navTrackOrder}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-amber-900 flex items-center justify-center text-amber-50 font-serif font-bold text-lg shadow-sm">
                আ
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
                    {t.brandName}
                  </span>
                  <span title="Verified Authentic">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-stone-500 font-sans block -mt-0.5">
                  Heritage Sarees Dhaka
                </span>
              </div>
            </button>
          </div>

          {/* Central Search Bar (Fabrilife-style prominent search) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl text-xs text-stone-500 cursor-pointer transition-colors shadow-inner"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <span className="truncate">
                {language === 'bn'
                  ? 'শাড়ির নাম, কোড (JM-108) বা রঙ খুঁজুন...'
                  : 'Search by Saree name, code, fabric, or color...'}
              </span>
              <kbd className="hidden lg:inline-block ml-auto px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-400 font-mono">
                ESC
              </kbd>
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Mobile Search Icon */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Search"
            >
              <Search className="w-5 h-5 text-stone-700" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden text-xs font-semibold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 transition-colors ${
                  language === 'en'
                    ? 'bg-amber-900 text-white font-bold'
                    : 'bg-stone-50 text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('bn')}
                className={`px-2 py-1 transition-colors ${
                  language === 'bn'
                    ? 'bg-amber-900 text-white font-bold'
                    : 'bg-stone-50 text-stone-600 hover:text-stone-900'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Notifications Feature (Replaced redundant bottom-nav buttons as requested) */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title={language === 'bn' ? 'বিজ্ঞপ্তি ও আপডেট' : 'Notifications'}
              >
                <Bell className="w-5 h-5 text-stone-700" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button (Fabrilife-style with Live Amount & Count) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-stone-50 hover:bg-amber-900 rounded-xl transition-all text-xs font-bold shadow-sm ml-1 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-stone-400 font-normal">
                  {t.navCart}
                </span>
                <span className="font-mono text-[11px] font-bold text-white">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              </div>
              <span className="bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded text-[11px]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* 3. Secondary Category Bar (Fabrilife signature design!) */}
        <div className="hidden lg:flex bg-[#FAF8F5] border-t border-stone-200 px-4 sm:px-6 lg:px-8 py-2 text-xs font-semibold text-stone-700">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 xl:gap-8">
              {onOpenFlashSale && (
                <button
                  onClick={onOpenFlashSale}
                  className="flex items-center gap-1.5 text-rose-700 hover:text-rose-800 font-bold transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-rose-600" />
                  <span>{language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale'}</span>
                </button>
              )}

              <button
                onClick={() => onSelectCategory('dhakai-jamdani')}
                className="hover:text-amber-900 transition-colors cursor-pointer"
              >
                {t.navJamdani}
              </button>
              <button
                onClick={() => onSelectCategory('dhakai-muslin')}
                className="hover:text-amber-900 transition-colors cursor-pointer"
              >
                {t.navMuslin}
              </button>
              <button
                onClick={() => onSelectCategory('tangail-taat')}
                className="hover:text-amber-900 transition-colors cursor-pointer"
              >
                {t.navTaat}
              </button>
              <button
                onClick={() => onSelectCategory('rajshahi-silk')}
                className="hover:text-amber-900 transition-colors cursor-pointer"
              >
                {t.navSilk}
              </button>
              <button
                onClick={() => onSelectCategory('bridal-festive')}
                className="hover:text-amber-900 transition-colors cursor-pointer text-amber-950 font-bold"
              >
                {language === 'bn' ? 'বিয়ে ও বধূ কাতান' : 'Bridal & Festive'}
              </button>
              <button
                onClick={onNavigateShop}
                className="hover:text-amber-900 transition-colors cursor-pointer text-amber-900 font-bold"
              >
                {language === 'bn' ? 'সব শাড়ি' : 'All Sarees'}
              </button>
            </div>

            {/* Measurement Guide Link */}
            {onOpenSareeGuide && (
              <button
                onClick={onOpenSareeGuide}
                className="flex items-center gap-1.5 text-stone-600 hover:text-amber-900 font-medium transition-colors cursor-pointer shrink-0"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-800" />
                <span>{language === 'bn' ? 'শাড়ির মাপ ও বহর গাইড' : 'Drape & Size Guide'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-900 flex items-center justify-center text-amber-50 font-serif font-bold text-sm">
                  আ
                </div>
                <span className="font-serif text-xl font-bold text-stone-900">
                  {t.brandName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 py-6 text-sm font-semibold text-stone-800">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
              >
                {t.navHome}
              </button>
              <button
                onClick={() => {
                  onNavigateShop();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-amber-900 font-bold"
              >
                {t.navShop}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('dhakai-jamdani');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
              >
                {t.navJamdani}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('dhakai-muslin');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
              >
                {t.navMuslin}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('tangail-taat');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
              >
                {t.navTaat}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('rajshahi-silk');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
              >
                {t.navSilk}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('bridal-festive');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
              >
                {language === 'bn' ? 'বিয়ে ও বধূ কাতান' : 'Bridal & Festive'}
              </button>
              {onOpenSareeGuide && (
                <button
                  onClick={() => {
                    onOpenSareeGuide();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-amber-900"
                >
                  📏 {language === 'bn' ? 'শাড়ির মাপ ও বহর গাইড' : 'Drape & Size Guide'}
                </button>
              )}
              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-600"
              >
                🚚 {t.navTrackOrder}
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-stone-200 flex flex-col gap-3">
              <a
                href="tel:09612444888"
                className="flex items-center gap-2 py-2 px-3 text-xs text-stone-700 font-semibold"
              >
                <Phone className="w-4 h-4 text-amber-900" />
                <span>Hotline: 09612-444888</span>
              </a>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-3 text-xs text-stone-500 hover:text-amber-900"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.navAdmin}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
