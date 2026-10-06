import React from 'react';
import { Home, Grid, Zap, ShoppingBag, User } from 'lucide-react';
import { Language } from '../../types';

interface MobileBottomNavProps {
  language: Language;
  activeView: string;
  cartCount: number;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onOpenFlashSale: () => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  activeView,
  cartCount,
  onNavigateHome,
  onNavigateShop,
  onOpenFlashSale,
  onOpenCart,
  onOpenAccount
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around text-[10px] font-medium text-stone-600">
        
        {/* Home */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeView === 'home' ? 'text-amber-900 font-bold' : 'hover:text-stone-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        {/* Categories / Shop */}
        <button
          onClick={onNavigateShop}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeView === 'shop' ? 'text-amber-900 font-bold' : 'hover:text-stone-900'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{language === 'bn' ? 'ক্যাটাগরি' : 'Catalog'}</span>
        </button>

        {/* Flash Sale / Offers */}
        <button
          onClick={onOpenFlashSale}
          className="flex flex-col items-center gap-0.5 py-1 px-2 text-rose-700 font-bold transition-colors"
        >
          <Zap className="w-4 h-4 fill-rose-600" />
          <span>{language === 'bn' ? 'অফার' : 'Offers'}</span>
        </button>

        {/* Cart / Bag with Badge */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors hover:text-stone-900"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-900 text-white rounded-full font-bold text-[9px] w-3.5 h-3.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>{language === 'bn' ? 'ব্যাগ' : 'Bag'}</span>
        </button>

        {/* Account */}
        <button
          onClick={onOpenAccount}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors hover:text-stone-900"
        >
          <User className="w-4 h-4" />
          <span>{language === 'bn' ? 'প্রোফাইল' : 'Account'}</span>
        </button>

      </div>
    </div>
  );
};
