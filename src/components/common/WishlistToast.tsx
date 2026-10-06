import React, { useEffect } from 'react';
import { Heart, X, ArrowRight, Check, Trash2 } from 'lucide-react';
import { Product, Language } from '../../types';

export interface WishlistToastData {
  product: Product;
  action: 'added' | 'removed';
}

interface WishlistToastProps {
  toast: WishlistToastData | null;
  onClose: () => void;
  language: Language;
  onOpenWishlist: () => void;
}

export const WishlistToast: React.FC<WishlistToastProps> = ({
  toast,
  onClose,
  language,
  onOpenWishlist
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { product, action } = toast;
  const isAdded = action === 'added';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/90 p-3.5 transition-all animate-in slide-in-from-top-4 fade-in duration-300"
    >
      <div className="flex items-center gap-3">
        {/* Saree Thumbnail */}
        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
          <img
            src={product.primaryImage}
            alt={product.nameEn}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute bottom-0 inset-x-0 h-4 flex items-center justify-center text-[9px] font-bold text-white ${
              isAdded ? 'bg-rose-600' : 'bg-stone-600'
            }`}
          >
            {isAdded ? (
              <Heart className="w-2.5 h-2.5 fill-white" />
            ) : (
              <Trash2 className="w-2.5 h-2.5" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${
                isAdded ? 'text-rose-600' : 'text-stone-500'
              }`}
            >
              {isAdded ? (
                <>
                  <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                  <span>
                    {language === 'bn' ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'Added to Wishlist'}
                  </span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 text-stone-500" />
                  <span>
                    {language === 'bn' ? 'তালিকা থেকে সরানো হয়েছে' : 'Removed from Wishlist'}
                  </span>
                </>
              )}
            </span>
          </div>

          <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
            {language === 'bn' ? product.nameBn : product.nameEn}
          </h4>

          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
            <span className="font-mono font-bold text-amber-950">
              ৳{product.price.toLocaleString()}
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="text-amber-900 font-bold hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
            >
              <span>{language === 'bn' ? 'তালিকা দেখুন' : 'View List'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer self-start"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress timer bar */}
      <div className="mt-2.5 h-0.5 w-full bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full animate-[progress_3.8s_linear_forwards] ${
            isAdded ? 'bg-rose-500' : 'bg-stone-400'
          }`}
          style={{
            animation: 'shrinkProgress 3.8s linear forwards'
          }}
        />
      </div>
    </div>
  );
};
