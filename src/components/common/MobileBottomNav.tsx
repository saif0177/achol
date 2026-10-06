import React from 'react';
import { Home, Grid, Heart, ShoppingBag, User, Sun, Moon } from 'lucide-react';
import { Language } from '../../types';

interface MobileBottomNavProps {
  language: Language;
  activeView: string;
  cartCount: number;
  wishlistCount: number;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onOpenFlashSale: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  activeView,
  cartCount,
  wishlistCount,
  onNavigateHome,
  onNavigateShop,
  onOpenFlashSale,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-3 py-1.5 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] transition-colors">
      <div className="flex items-center justify-around text-[10px] font-medium text-stone-600 dark:text-stone-300">
        
        {/* 1. Home */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            activeView === 'home'
              ? 'text-amber-900 dark:text-amber-400 font-bold'
              : 'hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        {/* 2. Shop / Catalog */}
        <button
          onClick={onNavigateShop}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            activeView === 'shop'
              ? 'text-amber-900 dark:text-amber-400 font-bold'
              : 'hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{language === 'bn' ? 'শাড়ি' : 'Catalog'}</span>
        </button>

        {/* 3. Wishlist / LOVE Button on Mobile Bottom Nav (Requirement 2) */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer hover:text-rose-600"
        >
          <div className="relative">
            <Heart
              className={`w-4 h-4 ${
                wishlistCount > 0 ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white rounded-full font-bold text-[9px] min-w-[15px] h-3.5 px-0.5 flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className={wishlistCount > 0 ? 'text-rose-700 dark:text-rose-400 font-bold' : ''}>
            {language === 'bn' ? 'পছন্দ' : 'Wishlist'}
          </span>
        </button>

        {/* 4. Cart / Bag with Live Count */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer hover:text-stone-900 dark:hover:text-white"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-900 dark:bg-amber-600 text-white rounded-full font-bold text-[9px] min-w-[15px] h-3.5 px-0.5 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span>{language === 'bn' ? 'ব্যাগ' : 'Bag'}</span>
        </button>

        {/* 5. Profile & Mode Toggle (Requirement 8: Profile back and light/dark mode) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAccount}
            className="flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-lg transition-colors cursor-pointer hover:text-stone-900 dark:hover:text-white"
          >
            <User className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রোফাইল' : 'Account'}</span>
          </button>

          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-1 rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-stone-600" />
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
