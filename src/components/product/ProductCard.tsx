import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check, Zap, Truck, Flame } from 'lucide-react';
import { Product, Language, ProductVariant } from '../../types';
import { translations } from '../../i18n/translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  isWishlisted: boolean;
  isListView?: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product, selectedVariant?: ProductVariant) => void;
  onQuickAddToCart: (product: Product, variant: ProductVariant) => void;
  onDirectOrder?: (product: Product, variant: ProductVariant) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  isWishlisted,
  isListView = false,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onDirectOrder
}) => {
  const t = translations[language];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      colorNameEn: 'Original',
      colorNameBn: 'আসল রঙ',
      colorHex: '#991B1B',
      colorFamily: 'red',
      image: product.primaryImage,
      stock: product.stock,
      sku: product.code
    }
  );
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const displayImage = selectedVariant.image || product.primaryImage;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOutOfStock) return;
    onQuickAddToCart(product, selectedVariant);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1500);
  };

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOutOfStock) return;
    if (onDirectOrder) {
      onDirectOrder(product, selectedVariant);
    } else {
      onSelectProduct(product, selectedVariant);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product.id);
  };

  // ==========================================
  // 1. AMAZON-STYLE LIST VIEW LAYOUT (ROW ON BOTH MOBILE & DESKTOP)
  // ==========================================
  if (isListView) {
    return (
      <div
        onClick={() => onSelectProduct(product, selectedVariant)}
        className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 hover:border-amber-900/40 dark:hover:border-amber-500/40 hover:shadow-md transition-all duration-200 p-2.5 sm:p-4 flex flex-row gap-3 sm:gap-4 md:gap-5 cursor-pointer relative items-stretch"
      >
        {/* Left: Thumbnail & Badges & Wishlist */}
        <div className="relative w-28 sm:w-36 md:w-52 lg:w-56 aspect-[3/4] md:aspect-square rounded-xl overflow-hidden bg-stone-100 shrink-0">
          <img
            src={displayImage}
            alt={product.nameEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top badges (constrained max-w so it NEVER collides with the favourite button) */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[calc(100%-42px)] pointer-events-none">
            {product.flashSaleTitle || product.flashSaleId ? (
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white rounded shadow-xs flex items-center gap-0.5 border border-rose-400/40 truncate">
                <Flame className="w-2.5 h-2.5 fill-amber-300 text-amber-300 shrink-0 animate-pulse" />
                <span className="truncate">{product.flashSaleTitle || 'Flash'}</span>
                {product.discountPercent ? <span className="shrink-0">-{product.discountPercent}%</span> : null}
              </span>
            ) : product.discountPercent && product.discountPercent > 0 ? (
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase bg-rose-700 text-white rounded shadow-xs">
                -{product.discountPercent}% OFF
              </span>
            ) : null}
            {product.isFeatured && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-500 text-stone-950 rounded shadow-xs">
                {language === 'bn' ? 'বেস্টসেলার' : 'Best Seller'}
              </span>
            )}
          </div>

          {/* Wishlist / Favourite Button: Always guaranteed top-right with high z-index and independent touch target */}
          <button
            type="button"
            onClick={handleWishlistClick}
            onTouchEnd={handleWishlistClick}
            className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200 transform cursor-pointer pointer-events-auto ${
              isWishlisted
                ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-400 opacity-100 scale-100 ring-2 ring-rose-500/40'
                : 'bg-white/95 dark:bg-stone-900/95 text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 scale-100 hover:scale-110 active:scale-95'
            }`}
            title={t.navWishlist}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isWishlisted ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Right: Rich Information Layout */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1.5 sm:space-y-2">
          <div className="space-y-1 sm:space-y-1.5">
            {/* Top row: Choice badge & Code */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="bg-stone-900 text-amber-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase inline-flex items-center gap-0.5">
                <span>Aanchol's</span>
                <span className="text-white">Choice</span>
              </span>
              <span className="text-[10px] sm:text-xs text-stone-400 font-mono">
                #{product.code}
              </span>
            </div>

            {/* Product Title */}
            <h3 className="font-serif text-xs sm:text-base md:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
              {language === 'bn' ? product.nameBn : product.nameEn}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-800 dark:text-stone-200">{product.rating}</span>
              <span className="text-stone-400">
                ({product.reviewCount})
              </span>
            </div>

            {/* Clean Price & Discount */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-serif text-sm sm:text-xl font-bold text-stone-900 dark:text-white">
                ৳{product.price.toLocaleString()}
              </span>
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="text-[9px] sm:text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Feature Bullets */}
            <ul className="text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5 sm:space-y-1 font-medium hidden sm:block">
              <li className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>
                  {language === 'bn'
                    ? `${product.length || '১২ হাত'} ব্লাউজ পিস সহ`
                    : `${product.length || '5.5m'} with running Blouse Piece`}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {language === 'bn'
                    ? 'সারাদেশে ফ্রি হোম ডেলিভারি · ক্যাশ অন ডেলিভারি'
                    : 'FREE Nationwide Delivery · Cash on Delivery'}
                </span>
              </li>
            </ul>

            {/* Color variants swatches */}
            {product.variants.length > 1 && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">
                  {language === 'bn' ? 'রঙ:' : 'Color:'}
                </span>
                <div className="flex items-center gap-1">
                  {product.variants.slice(0, 5).map((variant) => (
                    <button
                      key={variant.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(variant);
                      }}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-transform ${
                        selectedVariant.id === variant.id
                          ? 'border-stone-900 scale-110 ring-1 ring-amber-700'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: variant.colorHex }}
                      title={language === 'bn' ? variant.colorNameBn : variant.colorNameEn}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Mobile & Desktop consistent */}
          <div className="pt-1.5 sm:pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">
                  {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                </span>
              ) : isLowStock ? (
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  {language === 'bn' ? `মাত্র ${product.stock}টি বাকি` : `Only ${product.stock} left`}
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{language === 'bn' ? 'রেডি স্টক' : 'In Stock'}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDirectOrder}
                disabled={isOutOfStock}
                className="px-2.5 sm:px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] sm:text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{language === 'bn' ? 'অর্ডার' : 'Buy Now'}</span>
              </button>

              <button
                onClick={handleQuickAdd}
                disabled={isOutOfStock}
                className="px-2 sm:px-3 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold text-[11px] sm:text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title={t.addToCart}
              >
                {isAddedAnimation ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ShoppingBag className="w-3 h-3 text-amber-300" />
                )}
                <span className="hidden sm:inline">
                  {isAddedAnimation ? 'Added' : (language === 'bn' ? 'কার্ট' : 'Cart')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. STANDARD GRID VIEW LAYOUT (REFINED & PROPORTIONATE)
  // ==========================================
  return (
    <div
      onClick={() => onSelectProduct(product, selectedVariant)}
      className="group relative flex flex-col bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-amber-900/40 dark:hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Area: Refined 4:5 aspect ratio (never overly giant on mobile) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Floating Badges (Constrained max-width so they NEVER push or overlap the favourite button) */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 flex flex-col gap-1 items-start max-w-[calc(100%-36px)] pointer-events-none">
          {product.flashSaleTitle || product.flashSaleId ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 text-white rounded shadow-xs border border-rose-400/40 truncate max-w-full">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-300 text-amber-300 shrink-0 animate-pulse" />
              <span className="truncate">{product.flashSaleTitle || 'Flash'}</span>
              {product.discountPercent ? <span className="shrink-0">-{product.discountPercent}%</span> : null}
            </span>
          ) : product.discountPercent && product.discountPercent > 0 ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-800 to-amber-900 text-amber-50 rounded shadow-xs border border-amber-700/30">
              <span>-{product.discountPercent}%</span>
              <span className="text-[7.5px] sm:text-[8px] font-semibold opacity-90">OFF</span>
            </span>
          ) : product.isNewArrival ? (
            <span className="inline-block px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-white rounded shadow-xs">
              NEW
            </span>
          ) : null}
        </div>

        {/* Wishlist / Favourite Button: Completely independent absolute positioning on top-right, z-20 guaranteed above everything */}
        <button
          type="button"
          onClick={handleWishlistClick}
          onTouchEnd={handleWishlistClick}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200 transform cursor-pointer pointer-events-auto ${
            isWishlisted
              ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-400 opacity-100 scale-100 ring-2 ring-rose-500/40'
              : 'bg-white/95 dark:bg-stone-900/95 text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 scale-100 hover:scale-110 active:scale-95'
          }`}
          title={t.navWishlist}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : ''
            }`}
          />
        </button>

        {/* Floating Quick Action overlay on hover for desktop */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-1.5 pointer-events-auto z-10">
          <button
            onClick={handleDirectOrder}
            disabled={isOutOfStock}
            className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>{language === 'bn' ? 'সরাসরি অর্ডার' : 'Buy Now'}</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            title={t.addToCart}
          >
            {isAddedAnimation ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area: Compact on mobile, generous & elegant on PC */}
      <div className="p-2 sm:p-3 md:p-3.5 lg:p-4 flex-1 flex flex-col justify-between space-y-1 sm:space-y-1.5">
        <div className="space-y-0.5 sm:space-y-1">
          {/* Saree Code & Free Delivery */}
          <div className="flex items-center justify-between text-[9px] sm:text-xs text-stone-500">
            <span className="font-mono font-semibold text-amber-900 dark:text-amber-400 bg-amber-50 dark:bg-stone-800 px-1.5 py-0.5 rounded truncate max-w-[85px] sm:max-w-none">
              #{product.code}
            </span>
            <span className="text-[8.5px] sm:text-[11px] text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
              {language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-[11px] sm:text-sm md:text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
            {language === 'bn' ? product.nameBn : product.nameEn}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[9px] sm:text-xs text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Variant Bar */}
        <div className="pt-1 sm:pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span className="font-serif text-xs sm:text-base md:text-lg font-bold text-stone-900 dark:white leading-none truncate">
              ৳{product.price.toLocaleString()}
            </span>
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-[8px] sm:text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60 px-1 sm:px-1.5 py-0.5 rounded shrink-0">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Color variants preview dots */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              {product.variants.slice(0, 3).map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-transform ${
                    selectedVariant.id === variant.id
                      ? 'border-stone-900 scale-125 ring-1 ring-amber-700'
                      : 'border-stone-200'
                  }`}
                  style={{ backgroundColor: variant.colorHex }}
                  title={language === 'bn' ? variant.colorNameBn : variant.colorNameEn}
                />
              ))}
              {product.variants.length > 3 && (
                <span className="text-[8px] sm:text-[10px] text-stone-400 font-mono">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
