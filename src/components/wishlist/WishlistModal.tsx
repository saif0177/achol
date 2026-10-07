import React from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Zap,
  Trash2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Product, ProductVariant, Language } from '../../types';
import { store } from '../../services/store';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product, variant?: ProductVariant) => void;
  onQuickAddToCart: (product: Product, variant: ProductVariant) => void;
  onDirectOrder: (product: Product, variant: ProductVariant) => void;
  onExploreShop: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  language,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder,
  onExploreShop
}) => {
  if (!isOpen) return null;

  // Retrieve products from store matching wishlist IDs
  const wishlistedProducts = wishlistIds
    .map((id) => store.getProductById(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xl flex flex-col h-full z-10 transition-colors animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/50 shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                {language === 'bn' ? 'আমার পছন্দের শাড়ি' : 'My Loved Collection'}
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {language === 'bn'
                  ? `${wishlistedProducts.length}টি শাড়ি পছন্দের তালিকায় সংরক্ষিত`
                  : `${wishlistedProducts.length} saree(s) saved in wishlist`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            /* Empty State */
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40 shadow-inner">
                <Heart className="w-10 h-10" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                  {language === 'bn'
                    ? 'আপনার পছন্দের তালিকায় কোনো শাড়ি নেই'
                    : 'Your Wishlist is Empty'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {language === 'bn'
                    ? 'আমাদের আসল ঢাকাই জামদানি, মসলিন ও ঐতিহ্যবাহী তাঁতের শাড়িগুলো দেখুন এবং লাভ (♥) আইকনে ক্লিক করে পছন্দের তালিকায় রাখুন।'
                    : 'Explore our authentic Dhakai Jamdani, Muslin, and Silk handlooms. Click the heart icon on any saree to save it for later.'}
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onExploreShop();
                }}
                className="mt-2 px-6 py-3 bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'bn' ? 'ঐতিহ্যবাহী শাড়ি ব্রাউজ করুন' : 'Explore Saree Collection'}</span>
              </button>
            </div>
          ) : (
            /* List of Loved Sarees */
            <div className="space-y-3">
              {wishlistedProducts.map((product) => {
                const variant = product.variants[0] || {
                  id: 'default',
                  colorNameEn: 'Original',
                  colorNameBn: 'আসল রঙ',
                  colorHex: '#991B1B',
                  colorFamily: 'red',
                  image: product.primaryImage,
                  stock: product.stock,
                  sku: product.code
                };

                const isOutOfStock = product.stock <= 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-stone-800/90 rounded-2xl border border-stone-200/90 dark:border-stone-700/80 p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-3.5 group"
                  >
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => {
                        onClose();
                        onSelectProduct(product, variant);
                      }}
                      className="relative w-full sm:w-28 sm:h-36 aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0 cursor-pointer border border-stone-200 dark:border-stone-700"
                    >
                      <img
                        src={product.primaryImage}
                        alt={product.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discountPercent && product.discountPercent > 0 ? (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-rose-600 text-white font-bold text-[9px] rounded shadow-xs">
                          -{product.discountPercent}% OFF
                        </span>
                      ) : null}
                    </div>

                    {/* Saree Info & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold text-amber-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                            Code: {product.code}
                          </span>
                          <button
                            onClick={() => onToggleWishlist(product.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                            title={language === 'bn' ? 'তালিকা থেকে সরান' : 'Remove from Wishlist'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProduct(product, variant);
                          }}
                          className="font-serif font-bold text-sm text-stone-900 dark:text-white line-clamp-1 cursor-pointer hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                        >
                          {language === 'bn' ? product.nameBn : product.nameEn}
                        </h4>

                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-bold text-base text-amber-950 dark:text-amber-300">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-stone-400 dark:text-stone-500 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          {isOutOfStock ? (
                            <span className="text-rose-600 font-bold">
                              {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              {language === 'bn' ? 'ইন স্টক · ক্যাশ অন ডেলিভারি' : 'In Stock · Cash on Delivery'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Buy & Cart Action Buttons */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center gap-2">
                        {/* 1-Click Buy Now */}
                        <button
                          onClick={() => {
                            onClose();
                            onDirectOrder(product, variant);
                          }}
                          disabled={isOutOfStock}
                          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{language === 'bn' ? 'সরাসরি অর্ডার' : 'Buy Now'}</span>
                        </button>

                        {/* Add to Cart */}
                        <button
                          onClick={() => onQuickAddToCart(product, variant)}
                          disabled={isOutOfStock}
                          className="py-2 px-3 bg-stone-900 dark:bg-stone-700 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title={language === 'bn' ? 'কার্টে নিন' : 'Add to Cart'}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                          <span className="hidden sm:inline">
                            {language === 'bn' ? 'কার্ট' : 'Cart'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 dark:text-stone-400">
              {language === 'bn' ? 'সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on Delivery Nationwide'}
            </span>
            <button
              onClick={() => {
                onClose();
                onExploreShop();
              }}
              className="font-bold text-amber-900 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'আরও শাড়ি দেখুন' : 'Explore More'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
