import React, { useState, useEffect, useRef } from 'react';
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
  Bell,
  Sun,
  Moon,
  Globe,
  Settings,
  Sparkles
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
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
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
  unreadNotificationsCount = 0,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  // Desktop Menu Dropdown state
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  // Close desktop menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Truck className="w-3 h-3 text-amber-400" />
              <span>{t.navTrackOrder}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo (On mobile: no site navigation drawer button as requested in Requirement 8) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-amber-900 flex items-center justify-center text-amber-50 font-serif font-bold text-lg shadow-sm">
                আ
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors">
                    {t.brandName}
                  </span>
                  <span title="Verified Authentic">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans block -mt-0.5">
                  Heritage Sarees Dhaka
                </span>
              </div>
            </button>
          </div>

          {/* Central Search Bar (Desktop Prominent Search) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-500 dark:text-stone-400 cursor-pointer transition-colors shadow-inner"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <span className="truncate">
                {language === 'bn'
                  ? 'শাড়ির নাম, কোড (JM-108) বা রঙ খুঁজুন...'
                  : 'Search by Saree name, code, fabric, or color...'}
              </span>
              <kbd className="hidden lg:inline-block ml-auto px-1.5 py-0.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-[10px] text-stone-400 font-mono">
                ESC
              </kbd>
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Mobile Actions: Logo, Search, Notification, Account as requested in Requirement 8 */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Notification Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="md:hidden relative p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                )}
              </button>
            )}

            {/* Mobile Quick Account / Wishlist Button */}
            <button
              onClick={onOpenAccount}
              className="md:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              title="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Desktop Wishlist / Love Button (Requirement 2 & 9) */}
            <button
              onClick={onOpenWishlist}
              className="hidden md:flex relative p-2.5 text-stone-700 dark:text-stone-300 hover:text-rose-600 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title={language === 'bn' ? 'পছন্দের তালিকা (Wishlist)' : 'Wishlist'}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[17px] h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Desktop Cart Button (Directly runnable on navigation bar as requested in Requirement 3) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-stone-900 dark:bg-amber-950 text-stone-50 hover:bg-amber-900 dark:hover:bg-amber-900 border border-stone-800 dark:border-amber-800 rounded-xl transition-all text-xs font-bold shadow-sm cursor-pointer"
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

            {/* Desktop MENU Button (Requirement 3: Menu containing English to Bangla, Dark/White mode, Notifications, Account) */}
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  desktopMenuOpen
                    ? 'bg-amber-900 text-white border-amber-900 shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <Menu className="w-4 h-4" />
                <span>{language === 'bn' ? 'মেনু' : 'Menu'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    desktopMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Desktop Menu Dropdown Modal */}
              {desktopMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Language Switcher (English to Bangla) */}
                  <div className="space-y-1.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          onLanguageChange('bn');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                          language === 'bn'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>বাংলা (বাং)</span>
                      </button>

                      <button
                        onClick={() => {
                          onLanguageChange('en');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                          language === 'en'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>English (EN)</span>
                      </button>
                    </div>
                  </div>

                  {/* Dark Mode to White Mode Toggle */}
                  <div className="space-y-1.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                      <span>{language === 'bn' ? 'থিম / মোড' : 'Theme Mode'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onToggleDarkMode && onToggleDarkMode()}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                          !isDarkMode
                            ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-600" />
                        <span>White / Light</span>
                      </button>

                      <button
                        onClick={() => onToggleDarkMode && onToggleDarkMode()}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                          isDarkMode
                            ? 'bg-stone-800 text-amber-300 border-stone-700 font-bold'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Notifications in Menu */}
                  {onOpenNotifications && (
                    <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          onOpenNotifications();
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300">
                            <Bell className="w-4 h-4" />
                          </div>
                          <span>
                            {language === 'bn' ? 'বিজ্ঞপ্তি ও অফার' : 'Notifications & Drops'}
                          </span>
                        </div>
                        {unreadNotificationsCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                            {unreadNotificationsCount} new
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[10px]">0 new</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Account Section inside Menu */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider px-2">
                      {language === 'bn' ? 'অ্যাকাউন্ট ও সার্ভিস' : 'Account & Services'}
                    </div>

                    <button
                      onClick={() => {
                        onOpenAccount();
                        setDesktopMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer transition-colors"
                    >
                      <User className="w-4 h-4 text-amber-700" />
                      <span>{language === 'bn' ? 'আমার অ্যাকাউন্ট (৩৫০ পয়েন্ট)' : 'My Account (350 Royalty Pts)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenTracking();
                        setDesktopMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer transition-colors"
                    >
                      <Truck className="w-4 h-4 text-amber-700" />
                      <span>{t.navTrackOrder}</span>
                    </button>

                    {onOpenSareeGuide && (
                      <button
                        onClick={() => {
                          onOpenSareeGuide();
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer transition-colors"
                      >
                        <Ruler className="w-4 h-4 text-amber-700" />
                        <span>{language === 'bn' ? 'শাড়ির মাপ ও বহর গাইড' : 'Saree Drape Guide'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenAdmin();
                        setDesktopMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-400 text-xs font-bold cursor-pointer transition-colors"
                    >
                      <Settings className="w-4 h-4 text-amber-800" />
                      <span>{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Master Portal'}</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. Secondary Category Bar (Fabrilife signature design!) */}
        <div className="hidden lg:flex bg-[#FAF8F5] dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 px-4 sm:px-6 lg:px-8 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 xl:gap-8">
              {onOpenFlashSale && (
                <button
                  onClick={onOpenFlashSale}
                  className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 hover:text-rose-800 font-bold transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span>{language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale'}</span>
                </button>
              )}

              <button
                onClick={() => onSelectCategory('dhakai-jamdani')}
                className="hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navJamdani}
              </button>
              <button
                onClick={() => onSelectCategory('dhakai-muslin')}
                className="hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navMuslin}
              </button>
              <button
                onClick={() => onSelectCategory('tangail-taat')}
                className="hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navTaat}
              </button>
              <button
                onClick={() => onSelectCategory('rajshahi-silk')}
                className="hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                {t.navSilk}
              </button>
              <button
                onClick={() => onSelectCategory('bridal-festive')}
                className="hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer text-amber-950 dark:text-amber-300 font-bold"
              >
                {language === 'bn' ? 'বিয়ে ও বধূ কাতান' : 'Bridal & Festive'}
              </button>
              <button
                onClick={onNavigateShop}
                className="hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer text-amber-900 dark:text-amber-400 font-bold"
              >
                {language === 'bn' ? 'সব শাড়ি' : 'All Sarees'}
              </button>
            </div>

            {/* Measurement Guide Link */}
            {onOpenSareeGuide && (
              <button
                onClick={onOpenSareeGuide}
                className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-amber-900 dark:hover:text-amber-300 font-medium transition-colors cursor-pointer shrink-0"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                <span>{language === 'bn' ? 'শাড়ির মাপ ও বহর গাইড' : 'Drape & Size Guide'}</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
