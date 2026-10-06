import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check, Zap, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
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
  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onQuickAddToCart(product, selectedVariant);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1500);
  };

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (onDirectOrder) {
      onDirectOrder(product, selectedVariant);
    } else {
      onSelectProduct(product, selectedVariant);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  // ==========================================
  // 1. AMAZON-STYLE LIST VIEW LAYOUT
  // ==========================================
  if (isListView) {
    return (
      <div
        onClick={() => onSelectProduct(product, selectedVariant)}
        className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-900/40 hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col md:flex-row gap-5 cursor-pointer relative"
      >
        {/* Left: Thumbnail & Badges */}
        <div className="relative w-full md:w-56 lg:w-64 aspect-[4/5] md:aspect-square rounded-xl overflow-hidden bg-stone-100 shrink-0">
          <img
            src={displayImage}
            alt={product.nameEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-700 text-white rounded shadow-xs">
                -{product.discountPercent}% OFF
              </span>
            ) : null}
            {product.isFeatured && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500 text-stone-950 rounded shadow-xs">
                {language === 'bn' ? 'বেস্টসেলার' : 'Best Seller'}
              </span>
            )}
          </div>

          {/* Wishlist Button: hidden by default, smoothly reveals when hovering over the card */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-500 shadow-md transition-all duration-200 transform cursor-pointer opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            title={t.navWishlist}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`}
            />
          </button>
        </div>

        {/* Middle: Rich Amazon-style Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            {/* Amazon Choice badge */}
            <div className="flex items-center gap-2">
              <span className="bg-stone-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase inline-flex items-center gap-1">
                <span>Aanchol's</span>
                <span className="text-white">Choice</span>
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Code: {product.code} | SKU: {selectedVariant.sku || product.code}
              </span>
            </div>

            {/* Product Title */}
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2">
              {language === 'bn' ? product.nameBn : product.nameEn}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-800">{product.rating}</span>
              <span className="text-stone-400">
                ({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})
              </span>
            </div>

            {/* Clean Price & Sleek Discount Percentage */}
            <div className="pt-1 flex items-center gap-2.5">
              <span className="font-serif text-2xl font-bold text-stone-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Feature Bullets (Amazon Style!) */}
            <ul className="text-xs text-stone-600 space-y-1 pt-1 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {language === 'bn'
                    ? `${product.length || '১২ হাত (৫.৫ মিটার)'} ব্লাউজ পিস সহ`
                    : `${product.length || '5.5m (12 Haat)'} with running Blouse Piece`}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {language === 'bn'
                    ? '১০০% খাঁটি দেশীয় তাঁতের হাতে বোনা গ্যারান্টি'
                    : '100% Certified Handloom Masterpiece (Zero Powerloom)'}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-bold text-emerald-700">
                  {language === 'bn'
                    ? 'সারাদেশে সম্পূর্ণ ফ্রি হোম ডেলিভারি · ক্যাশ অন ডেলিভারি'
                    : 'FREE Nationwide Delivery · Cash on Delivery available'}
                </span>
              </li>
            </ul>

            {/* Color variants swatches */}
            {product.variants.length > 1 && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">
                  {language === 'bn' ? 'কালার ভ্যারিয়েন্ট:' : 'Colors:'}
                </span>
                <div className="flex items-center gap-1.5">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(variant);
                      }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        selectedVariant.id === variant.id
                          ? 'border-stone-900 scale-110 shadow-xs ring-1 ring-amber-700'
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

          {/* Right Action Block (Desktop right / Mobile bottom) */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">
                  {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                </span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-bold">
                  {language === 'bn'
                    ? `মাত্র ${product.stock}টি শাড়ি স্টকে আছে!`
                    : `Only ${product.stock} left in stock - order soon`}
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  {language === 'bn' ? 'স্টকে প্রস্তুত (ইন স্টক)' : 'In Stock & Ready to Dispatch'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDirectOrder}
                disabled={isOutOfStock}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'bn' ? 'সরাসরি অর্ডার' : 'Buy Now'}</span>
              </button>

              <button
                onClick={handleQuickAdd}
                disabled={isOutOfStock}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAddedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                    <span>{language === 'bn' ? 'কার্টে নিন' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. STANDARD GRID VIEW LAYOUT (FABRILIFE STYLE)
  // ==========================================
  return (
    <div
      onClick={() => onSelectProduct(product, selectedVariant)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-amber-900/40 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Floating Badges & Wishlist */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Aesthetic Discount Tag (Requirement 5: clean percent discount badge) */}
          <div className="flex items-start">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-800 to-amber-900 text-amber-50 rounded-lg shadow-sm border border-amber-700/30">
                <span>-{product.discountPercent}%</span>
                <span className="text-[9px] font-semibold opacity-90">OFF</span>
              </span>
            ) : product.isNewArrival ? (
              <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-white rounded-lg shadow-sm">
                NEW
              </span>
            ) : null}
          </div>

          {/* Wishlist Button: hidden by default every time, smoothly appears when hovering over the card */}
          <button
            onClick={handleWishlistClick}
            className="pointer-events-auto p-2 rounded-full bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-500 shadow-md transition-all duration-200 transform cursor-pointer opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            title={t.navWishlist}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Floating Quick Action overlay on hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-1.5 pointer-events-auto">
          <button
            onClick={handleDirectOrder}
            disabled={isOutOfStock}
            className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'bn' ? 'সরাসরি অর্ডার' : 'Buy Now'}</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            title={t.addToCart}
          >
            {isAddedAnimation ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-amber-300" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Saree Code & Free Delivery */}
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="font-mono font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded">
              {product.code}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">
              {language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1 leading-snug">
            {language === 'bn' ? product.nameBn : product.nameEn}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-semibold text-stone-800">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Clean Price & Variant Bar (No clunky strikethrough price pattern) */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-none">
              ৳{product.price.toLocaleString()}
            </span>
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60 px-1.5 py-0.5 rounded">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Color variants preview dots */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1">
              {product.variants.slice(0, 4).map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    selectedVariant.id === variant.id
                      ? 'border-stone-900 scale-125 ring-1 ring-amber-700'
                      : 'border-stone-200'
                  }`}
                  style={{ backgroundColor: variant.colorHex }}
                  title={language === 'bn' ? variant.colorNameBn : variant.colorNameEn}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[9px] text-stone-400 font-mono">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
