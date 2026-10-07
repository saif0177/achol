import React from 'react';
import { Home, Layers, Zap, Heart, Menu } from 'lucide-react';
import { Language } from '../../types';

interface MobileBottomNavProps {
  language: Language;
  activeView: string;
  cartCount: number;
  wishlistCount: number;
  onNavigateHome: () => void;
  onNavigateCategory: () => void;
  onOpenFlashSale: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenMenu?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  activeView,
  wishlistCount,
  onNavigateHome,
  onNavigateCategory,
  onOpenFlashSale,
  onOpenWishlist,
  onOpenAccount,
  onOpenMenu
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] transition-colors">
      <div className="grid grid-cols-5 items-center text-center text-[10px] font-medium text-stone-600 dark:text-stone-300">
        
        {/* 1. Home */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeView === 'home'
              ? 'text-amber-900 dark:text-amber-400 font-bold'
              : 'hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="truncate">{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        {/* 2. Category */}
        <button
          onClick={onNavigateCategory}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeView === 'shop'
              ? 'text-amber-900 dark:text-amber-400 font-bold'
              : 'hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="truncate">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</span>
        </button>

        {/* 3. Sale / Flash Deals */}
        <button
          onClick={onOpenFlashSale}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeView === 'flash-sale'
              ? 'text-rose-600 dark:text-rose-400 font-bold'
              : 'text-rose-700 dark:text-rose-400 hover:text-rose-600'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-rose-600 animate-pulse" />
          <span className="font-bold truncate">{language === 'bn' ? 'সেল / অফার' : 'Sale'}</span>
        </button>

        {/* 4. Wishlist (Loved Collection) */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors cursor-pointer hover:text-rose-600"
        >
          <div className="relative">
            <Heart
              className={`w-4 h-4 ${
                wishlistCount > 0
                  ? 'fill-rose-600 text-rose-600'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white rounded-full font-bold text-[9px] min-w-[15px] h-3.5 px-0.5 flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className={`truncate ${wishlistCount > 0 ? 'text-rose-700 dark:text-rose-400 font-bold' : ''}`}>
            {language === 'bn' ? 'পছন্দ' : 'Wishlist'}
          </span>
        </button>

        {/* 5. Menu (Requirement 6: Removed Profile icon on mobile, added Menu icon; profile/account lives inside menu) */}
        <button
          onClick={onOpenMenu || onOpenAccount}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors cursor-pointer hover:text-stone-900 dark:hover:text-white"
        >
          <Menu className="w-4 h-4 text-amber-900 dark:text-amber-400" />
          <span className="truncate font-semibold">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
        </button>

      </div>
    </div>
  );
};
