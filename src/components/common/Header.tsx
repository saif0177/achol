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
  Sparkles,
  ArrowRight,
  Tag
} from 'lucide-react';
import { Language, Product } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

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
  onOpenOffers?: () => void;
  onOpenCoupons?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSearchSubmit?: (query: string) => void;
  onSelectProduct?: (product: Product) => void;
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
  onOpenOffers,
  onOpenCoupons,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  isDarkMode = false,
  onToggleDarkMode,
  onSearchSubmit,
  onSelectProduct
}) => {
  // Desktop Menu Dropdown state
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Desktop Live Search state (Requirement 6: Navbar search, typing suggestions, recent searches, enter -> search results page)
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aanchol_recent_searches');
      return saved ? JSON.parse(saved) : ['Jamdani', 'Muslin', 'JM-108'];
    } catch {
      return ['Jamdani', 'Muslin', 'JM-108'];
    }
  });
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('aanchol_recent_searches', JSON.stringify(updated));
    } catch {}
    setIsSearchFocused(false);
    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    } else {
      onOpenSearch();
    }
  };

  const liveResults = searchQuery.trim() ? store.searchProducts(searchQuery).slice(0, 4) : [];

  const suggestedKeywords = [
    { en: 'Dhakai Jamdani', bn: 'ঢাকাই জামদানি' },
    { en: 'Pure Muslin', bn: 'ঢাকাই মসলিন' },
    { en: 'Tangail Taat', bn: 'টাঙ্গাইল তাঁত' },
    { en: 'Crimson Red', bn: 'লাল শাড়ি' },
    { en: 'Bridal Katan', bn: 'বিয়ের কাতান' }
  ];

  // Dynamic top announcement ticker messages from store
  const [announcementConfig, setAnnouncementConfig] = useState(() => store.getTopAnnouncementConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setAnnouncementConfig(store.getTopAnnouncementConfig());
    };
    window.addEventListener('aanchol_announcements_updated', handleUpdate);
    return () => window.removeEventListener('aanchol_announcements_updated', handleUpdate);
  }, []);

  const activeAnnouncements = announcementConfig.announcements.filter((a) => a.isActive);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const intervalMs = Math.max(2, announcementConfig.rotationSpeedSeconds || 4) * 1000;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [activeAnnouncements.length, announcementConfig.rotationSpeedSeconds]);

  const currentAnnouncement = activeAnnouncements[announcementIndex] || activeAnnouncements[0];

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
      <div className={`bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center border-b border-stone-800 tracking-wide flex items-center justify-between ${!announcementConfig.isEnabled ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium truncate transition-opacity duration-300">
              {currentAnnouncement
                ? (language === 'bn' ? currentAnnouncement.textBn : currentAnnouncement.textEn)
                : (language === 'bn' ? 'আঁচল হেরিটেজ শাড়ি - খাঁটি ঢাকাই জামদানি ও সিল্ক' : 'Aanchol Heritage Sarees Dhaka - Authentic Dhakai Jamdani & Pure Silk')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-stone-400 shrink-0">
            <a
              href={`tel:${(announcementConfig.hotline || '09612444888').replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Hotline: {announcementConfig.hotline || '09612-444888'}</span>
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

          {/* Central Search Bar (Desktop Prominent Search with Live Suggestions & Recent History - Requirement 6) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={searchContainerRef}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit(searchQuery);
              }}
              className="w-full relative"
            >
              <div className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-stone-50 dark:bg-stone-800/80 focus-within:bg-white dark:focus-within:bg-stone-800 border border-stone-300 dark:border-stone-700 focus-within:border-amber-700 dark:focus-within:border-amber-500 rounded-xl text-xs text-stone-900 dark:text-stone-100 transition-all shadow-inner">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={
                    language === 'bn'
                      ? 'শাড়ির নাম, কোড (JM-108) বা রঙ খুঁজুন...'
                      : 'Search by Saree name, code, fabric, or color...'
                  }
                  className="w-full bg-transparent border-none outline-none text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-[10px] text-stone-400 font-mono">
                  ↵
                </kbd>
              </div>
            </form>

            {/* Anchored Suggestions & Recent Searches Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Recent Searches */}
                {recentSearches.length > 0 && !searchQuery.trim() && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      <span>{language === 'bn' ? 'সাম্প্রতিক সার্চ' : 'Recent Searches'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRecentSearches([]);
                          try {
                            localStorage.removeItem('aanchol_recent_searches');
                          } catch {}
                        }}
                        className="text-[10px] text-stone-400 hover:text-rose-600 cursor-pointer font-normal normal-case"
                      >
                        {language === 'bn' ? 'মুছে ফেলুন' : 'Clear all'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearchSubmit(term);
                          }}
                          className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Keywords */}
                {!searchQuery.trim() && (
                  <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      {language === 'bn' ? 'জনপ্রিয় কি-ওয়ার্ড' : 'Popular Suggestions'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedKeywords.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const val = language === 'bn' ? item.bn : item.en;
                            setSearchQuery(val);
                            handleSearchSubmit(val);
                          }}
                          className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          {language === 'bn' ? item.bn : item.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instant Matching Products */}
                {searchQuery.trim() && liveResults.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      {language === 'bn' ? 'সরাসরি প্রাপ্ত শাড়ি' : 'Matching Sarees'}
                    </span>
                    <div className="space-y-1">
                      {liveResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(product);
                            }
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                        >
                          <img
                            src={product.primaryImage}
                            alt={product.nameEn}
                            className="w-9 h-11 object-cover rounded-md bg-stone-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] text-amber-800 dark:text-amber-400 font-semibold block">
                              #{product.code} · {product.sareeType}
                            </span>
                            <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                              {language === 'bn' ? product.nameBn : product.nameEn}
                            </h5>
                          </div>
                          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                            ৳{product.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit(searchQuery)}
                      className="w-full mt-2 py-2 px-3 bg-stone-900 hover:bg-amber-900 dark:bg-amber-950 dark:hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{language === 'bn' ? `"${searchQuery}" এর সব ফলাফল দেখুন` : `View all results for "${searchQuery}"`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* If searching but no results */}
                {searchQuery.trim() && liveResults.length === 0 && (
                  <div className="py-4 text-center space-y-1">
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                      {language === 'bn' ? `"${searchQuery}" দিয়ে কোনো শাড়ি পাওয়া যায়নি` : `No sarees found matching "${searchQuery}"`}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit(searchQuery)}
                      className="text-xs text-amber-900 dark:text-amber-400 font-bold hover:underline"
                    >
                      {language === 'bn' ? 'ক্যাটালগে বিস্তারিত সার্চ করুন →' : 'Search catalog anyway →'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Mobile Actions: Only Search and Cart on top navigation bar */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop Wishlist / Love Button */}
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

            {/* Notification Button (Moved from Menu to beside Cart) */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 sm:p-2.5 text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={language === 'bn' ? 'বিজ্ঞপ্তি ও আপডেট' : 'Notifications & Updates'}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button (Runs on mobile & desktop with live badge) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-3.5 bg-stone-900 dark:bg-amber-950 text-stone-50 hover:bg-amber-900 dark:hover:bg-amber-900 border border-stone-800 dark:border-amber-800 rounded-xl transition-all text-xs font-bold shadow-sm cursor-pointer"
              aria-label="Cart"
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

                  {/* Theme Mode Toggle (Requirement 4: ONLY ONE theme toggle button) */}
                  <div className="space-y-1.5 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">
                      <span>{language === 'bn' ? 'থিম / মোড' : 'Theme Mode'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleDarkMode && onToggleDarkMode()}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Moon className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-600" />
                        )}
                        <span>
                          {isDarkMode
                            ? language === 'bn'
                              ? 'ডার্ক মোড'
                              : 'Dark Mode'
                            : language === 'bn'
                            ? 'লাইট মোড'
                            : 'Light Mode'}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        {isDarkMode
                          ? language === 'bn'
                            ? 'লাইটে পরিবর্তন করুন'
                            : 'Switch to Light'
                          : language === 'bn'
                          ? 'ডার্কে পরিবর্তন করুন'
                          : 'Switch to Dark'}
                      </span>
                    </button>
                  </div>


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

                    {onOpenCoupons && (
                      <button
                        onClick={() => {
                          onOpenCoupons();
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer transition-colors"
                      >
                        <Tag className="w-4 h-4 text-amber-700" />
                        <span>{language === 'bn' ? 'চলমান সকল কুপন ও ভাউচার' : 'Available Coupons & Vouchers'}</span>
                        <span className="ml-auto bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                          {store.getCoupons().length}
                        </span>
                      </button>
                    )}

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
              {onOpenOffers && (
                <button
                  onClick={onOpenOffers}
                  className="flex items-center gap-1.5 text-amber-900 dark:text-amber-400 hover:text-amber-700 font-bold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{language === 'bn' ? 'সকল অফার' : 'All Offers'}</span>
                </button>
              )}

              {onOpenCoupons && (
                <button
                  onClick={onOpenCoupons}
                  className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 hover:text-amber-900 dark:hover:text-amber-400 font-bold transition-colors cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{language === 'bn' ? 'কুপন ভাউচার' : 'Coupons'}</span>
                  <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-amber-300/80">
                    {store.getCoupons().length}
                  </span>
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
