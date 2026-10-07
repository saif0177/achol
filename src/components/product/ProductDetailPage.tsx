import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  Sparkles,
  Info,
  Check,
  RefreshCw,
  Award,
  ArrowRight
} from 'lucide-react';
import { Product, ProductVariant, Language, Review } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface ProductDetailPageProps {
  product: Product;
  initialVariant?: ProductVariant;
  language: Language;
  onBack: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onDirectOrder: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct: (product: Product, selectedVariant?: ProductVariant) => void;
  onOpenAllReviews?: (product: Product) => void;
  onExploreCategory?: (categoryId: string) => void;
  onNavigateToCategoryBlog?: (categoryId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  initialVariant,
  language,
  onBack,
  onAddToCart,
  onDirectOrder,
  onSelectProduct,
  onOpenAllReviews,
  onExploreCategory,
  onNavigateToCategoryBlog
}) => {
  const t = translations[language];

  // Active Variant State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    initialVariant || product.variants[0] || {
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

  // Active Image Preview
  const [activeImage, setActiveImage] = useState<string>(
    initialVariant?.image || product.primaryImage
  );

  // Sync active image when variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 50 });
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reviews for this saree
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    setReviews(store.getReviewsForProduct(product.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const isOutOfStock = selectedVariant.stock <= 0;
  const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 5;
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  // Zoom handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedVariant, quantity);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onDirectOrder(product, selectedVariant, quantity);
  };

  // WhatsApp Inquiry link
  const whatsappText = encodeURIComponent(
    `Assalamu Alaikum, I would like to inquire about the ${product.nameEn} (Code: ${product.code}, Variant: ${selectedVariant.colorNameEn} [SKU: ${selectedVariant.sku}]), Price: ৳${product.price.toLocaleString()}. Is this currently ready for dispatch?`
  );
  const whatsappUrl = `https://wa.me/8801700000000?text=${whatsappText}`;

  // Related Sarees (Requirement 6: more sarees in category)
  const relatedSarees = store.getRecommended(product.id, 8);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // New review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: newReviewAuthor.trim(),
      customerPhoneMasked: '0171***99',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      isVerifiedPurchase: true
    };

    store.addReview(newRev);
    setReviews(store.getReviewsForProduct(product.id));
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  // Gallery of thumbnails combining primary, product images and variant images
  const allImages = Array.from(
    new Set([product.primaryImage, ...product.images, ...product.variants.map((v) => v.image)])
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20">
      {/* 1. Top Breadcrumbs Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-amber-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'bn' ? 'সকল শাড়িতে ফিরে যান' : 'Back to Collection'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{product.sareeType}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-900 font-semibold truncate max-w-[200px]">
              {language === 'bn' ? product.nameBn : product.nameEn}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================
              LEFT COLUMN: Interactive High-Res Zoom Gallery (5 cols)
              ======================================================== */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {/* Main Interactive Zoom Box */}
            <div
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-stone-200/90 shadow-sm cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={activeImage}
                alt={product.nameEn}
                className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                  isZoomed ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Magnified Zoom Lens */}
              {isZoomed && (
                <div
                  className="absolute inset-0 pointer-events-none bg-no-repeat"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: '240%'
                  }}
                />
              )}

              {/* Badges Overlay */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1 pointer-events-none">
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-700 text-white rounded-md shadow-sm">
                    -{product.discountPercent}% OFF
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500 text-stone-950 rounded-md shadow-sm">
                    {language === 'bn' ? 'মাস্টারপিস' : 'Masterpiece'}
                  </span>
                )}
              </div>

              {/* Hint badge */}
              <div className="absolute bottom-3 right-3 bg-stone-900/70 text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-xs pointer-events-none">
                <ZoomIn className="w-3 h-3" />
                <span>{language === 'bn' ? 'জুম করতে মাউস ঘুরান' : 'Hover to Zoom 2.5x'}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-white ${
                    activeImage === img
                      ? 'border-amber-900 ring-2 ring-amber-900/30 scale-105 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900">
                  {language === 'bn'
                    ? 'আঁচল ১০০% আসল তাঁত সনদপ্রাপ্তি'
                    : 'Aanchol 100% Handloom Certification'}
                </h4>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  {language === 'bn'
                    ? 'রূপগঞ্জ, ডেমরা ও টাঙ্গাইলের সনদপ্রাপ্ত তাঁতীদের হাতে বোনা। কোনো পাওয়ারলুম কপি নেই।'
                    : 'Hand-woven by registered master pitloom weavers. Zero machine duplicate guarantee.'}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Product Details, SKU, Purchase (7 cols)
              ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Codes Header */}
            <div className="space-y-2 pb-5 border-b border-stone-200">
              {/* Product Model & Selected Variant Unique Code */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-md">
                  Model: {product.code}
                </span>
                <span className="font-mono font-bold text-stone-700 bg-stone-200/80 px-2.5 py-0.5 rounded-md">
                  Variant SKU: {selectedVariant.sku || `${product.code}-${selectedVariant.colorFamily.toUpperCase()}`}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {product.sareeType}
                </span>
              </div>

              {/* Product Titles */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 leading-snug">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-sm text-stone-800">{product.rating}</span>
                <span className="text-stone-400">·</span>
                <span className="text-xs text-stone-600 font-medium">
                  {product.reviewCount} {language === 'bn' ? 'যাচাইকৃত গ্রাহক রিভিউ' : 'Verified Reviews'}
                </span>
              </div>
            </div>

            {/* Requirement 2: Colored background card with saree name, very short details, and More button redirecting to blog */}
            <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/10 dark:from-amber-950/40 dark:to-stone-900/40 rounded-2xl p-4 border border-amber-300/80 dark:border-amber-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 block">
                  {language === 'bn' ? 'শাড়ি পরিচিতি ও বুনন শিল্প' : 'Saree Heritage Details'}
                </span>
                <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white truncate">
                  {language === 'bn' ? product.nameBn : product.nameEn}
                </h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-1 font-medium">
                  {product.shortHeritageHighlightEn || `${product.sareeType} · ${product.fabric} · Traditional Handloom`}
                </p>
              </div>

              {onNavigateToCategoryBlog && (
                <button
                  type="button"
                  onClick={() => onNavigateToCategoryBlog(product.categoryId)}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center group"
                >
                  <span>{language === 'bn' ? 'বিস্তারিত ব্লগ পড়ুন (More)' : 'Read Blog Story (More)'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform text-amber-300" />
                </button>
              )}
            </div>

            {/* Price & Savings Display */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-stone-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {savings > 0 && (
                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                    {language === 'bn'
                      ? `সাশ্রয় ৳${savings.toLocaleString()}`
                      : `Save ৳${savings.toLocaleString()}`}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 pt-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn'
                    ? '🎉 সারাদেশে সম্পূর্ণ ফ্রি হোম ডেলিভারি · ক্যাশ অন ডেলিভারি সুবিধা'
                    : '🎉 100% FREE Home Delivery Across Bangladesh · Cash on Delivery'}
                </span>
              </div>
            </div>

            {/* Variant Selector (Colors & Unique Codes) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {language === 'bn' ? 'কালার ভ্যারিয়েন্ট নির্বাচন করুন:' : 'Select Color Variant:'}
                </label>
                <span className="text-xs font-bold text-amber-900 font-mono">
                  {language === 'bn' ? selectedVariant.colorNameBn : selectedVariant.colorNameEn}
                  {' '}(SKU: {selectedVariant.sku})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        if (v.image) setActiveImage(v.image);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-900 bg-amber-50/70 ring-1 ring-amber-900 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-xs"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-stone-900 truncate">
                          {language === 'bn' ? v.colorNameBn : v.colorNameEn}
                        </span>
                        <span className="block text-[10px] text-stone-500 font-mono truncate">
                          SKU: {v.sku}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stock Status for selected variant */}
              <div className="text-xs pt-1">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold">
                    {language === 'bn' ? 'এই কালারের স্টক শেষ।' : 'Out of stock in this color.'}
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-800 font-bold">
                    {language === 'bn'
                      ? `⚠️ স্টকে মাত্র ${selectedVariant.stock}টি শাড়ি অবশিষ্ট আছে!`
                      : `⚠️ Only ${selectedVariant.stock} sarees remaining in this variant!`}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {language === 'bn' ? 'স্টকে প্রস্তুত (ইন স্টক)' : 'In Stock & Ready for Steadfast Dispatch'}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
              </label>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-xs overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold font-mono text-sm text-stone-900 border-x border-stone-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant.stock || 5, q + 1))}
                  className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: 1-Click Order, Add to Cart, WhatsApp */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1-Click Buy Now (Express COD Checkout) */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{language === 'bn' ? 'সরাসরি অর্ডার করুন (ক্যাশ অন ডেলিভারি)' : 'Order Now (Cash on Delivery)'}</span>
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>
                    {isAddedToast
                      ? language === 'bn'
                        ? 'কার্টে যোগ হয়েছে!'
                        : 'Added to Cart!'
                      : language === 'bn'
                      ? 'কার্টে রাখুন'
                      : 'Add to Cart'}
                  </span>
                </button>
              </div>

              {/* WhatsApp Direct Assistance Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                title={language === 'bn' ? 'সরাসরি প্রশ্ন বা তথ্য জানুন' : 'Direct Assistance'}
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.507 14.307l-.009.075c-.244-.122-1.45-.716-1.676-.798-.225-.082-.389-.122-.553.123-.164.244-.637.798-.78 1.002-.144.205-.287.225-.531.102-.244-.122-1.031-.38-1.964-1.212-.725-.647-1.216-1.446-1.359-1.691-.143-.245-.015-.378.107-.5.11-.11.244-.287.367-.43.122-.144.164-.245.245-.409.082-.164.041-.307-.02-.43-.062-.123-.553-1.332-.757-1.823-.2-.48-.403-.415-.553-.423l-.471-.01c-.164 0-.43.061-.655.307-.225.245-.86.84-.86 2.05 0 1.208.88 2.373 1.003 2.536.123.164 1.733 2.646 4.2 3.71 1.64.708 2.285.772 3.103.65.91-.136 1.794-.733 2.049-1.442.256-.708.256-1.316.179-1.442-.077-.126-.282-.205-.526-.327zM12 21.804c-1.8 0-3.567-.482-5.116-1.393l-.367-.218-3.805 1 1.016-3.708-.239-.38A9.774 9.774 0 0 1 2.2 12c0-5.404 4.396-9.8 9.8-9.8 2.617 0 5.078 1.02 6.929 2.871A9.739 9.739 0 0 1 21.8 12c0 5.404-4.396 9.804-9.8 9.804zm0-17.804c-4.411 0-8 3.589-8 8 0 1.411.368 2.784 1.066 3.992l.256.444-.672 2.454 2.513-.659.43.256c1.16.689 2.493 1.053 3.864 1.053 4.411 0 8-3.589 8-8s-3.589-8-8-8z" />
                </svg>
                <span>
                  {language === 'bn'
                    ? 'শাড়ির বিস্তারিত তথ্য ও সহায়তা'
                    : 'Artisan & Order Assistance'}
                </span>
              </a>
            </div>

            {/* Nationwide Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-200 text-center">
              <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                <Truck className="w-4 h-4 text-amber-800 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-stone-900 block">
                  {language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {language === 'bn' ? 'সারাদেশে ৳০' : '৳0 Nationwide'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-stone-900 block">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {language === 'bn' ? 'দেখে টাকা পরিশোধ' : 'Inspect before pay'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                <Award className="w-4 h-4 text-amber-800 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-stone-900 block">
                  {language === 'bn' ? '১০০% খাঁটি তাঁত' : '100% Handloom'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {language === 'bn' ? 'হাতে বোনা সুতা' : 'Artisan Masterpiece'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200/80">
                <RefreshCw className="w-4 h-4 text-blue-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-stone-900 block">
                  {language === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট' : '7-Day Return'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {language === 'bn' ? 'সহজ পরিবর্তন' : 'Easy Exchange'}
                </span>
              </div>
            </div>

            {/* Technical Specifications Table (Requirement 14) */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 font-serif font-bold text-stone-900 text-sm">
                {language === 'bn' ? 'শাড়ির বিস্তারিত স্পেসিফিকেশন' : 'Technical Specifications & Craft Details'}
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                <div className="grid grid-cols-3 p-3">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'শাড়ির দৈর্ঘ্য (Length)' : 'Length'}
                  </span>
                  <span className="col-span-2 font-semibold text-stone-900">
                    {product.length || '5.5 meters (12 Haat)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'ব্লাউজ পিস (Blouse Piece)' : 'Blouse Piece'}
                  </span>
                  <span className="col-span-2 font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {product.hasBlousePiece
                      ? language === 'bn'
                        ? 'সংযুক্ত (০.৮ মিটার রানিং ব্লাউজ পিস সহ)'
                        : 'Included (0.8m unstitched matching blouse piece)'
                      : language === 'bn'
                      ? 'ব্লাউজ পিস ছাড়া'
                      : 'Without Blouse Piece'}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'কাপড়ের সুতা (Fabric & Count)' : 'Fabric Composition'}
                  </span>
                  <span className="col-span-2 font-semibold text-stone-900">
                    {language === 'bn' ? product.fabricBn : product.fabric}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'উৎপাদন অঞ্চল (Origin)' : 'Origin Hub'}
                  </span>
                  <span className="col-span-2 font-semibold text-stone-900">
                    {language === 'bn' ? 'রূপগঞ্জ, ডেমরা ও টাঙ্গাইল, বাংলাদেশ' : 'Demra, Rupganj & Tangail, Bangladesh'}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'উপযুক্ত অনুষ্ঠান (Occasion)' : 'Recommended Occasion'}
                  </span>
                  <span className="col-span-2 font-semibold text-stone-900">
                    {language === 'bn' ? product.occasionBn : product.occasion}
                  </span>
                </div>

                <div className="grid grid-cols-3 p-3">
                  <span className="text-stone-500 font-medium">
                    {language === 'bn' ? 'ধোয়া ও যত্ন (Care)' : 'Wash & Care Instructions'}
                  </span>
                  <span className="col-span-2 font-semibold text-stone-900">
                    {language === 'bn' ? product.careInstructionsBn : product.careInstructionsEn}
                  </span>
                </div>

                {product.specifications && product.specifications.length > 0 && product.specifications.map((spec, sIdx) => (
                  <div key={sIdx} className="grid grid-cols-3 p-3">
                    <span className="text-stone-500 font-medium">{spec.key}</span>
                    <span className="col-span-2 font-semibold text-stone-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bengali Heritage Story Description */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-stone-900">
                {language === 'bn' ? 'কারিগর ও ঐতিহ্যের বিবরণ' : 'Heritage & Weaver Notes'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {language === 'bn' ? product.descriptionBn : product.descriptionEn}
              </p>
            </div>

            {/* Verified Reviews Section */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {language === 'bn' ? 'গ্রাহকদের মতামত ও রিভিউ' : 'Customer Reviews'}
                  </h3>
                  <span className="text-xs text-stone-500">
                    {reviews.length} {language === 'bn' ? 'টি যাচাইকৃত মন্তব্য' : 'verified testimonials'}
                  </span>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {showReviewForm
                    ? language === 'bn'
                      ? 'বাতিল'
                      : 'Cancel'
                    : language === 'bn'
                    ? 'রিভিউ লিখুন'
                    : 'Write a Review'}
                </button>
              </div>

              {/* Review Write Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-stone-50 p-4 rounded-xl space-y-3 border border-stone-200/80"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      {language === 'bn' ? 'আপনার নাম:' : 'Your Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Samira Rahman"
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      {language === 'bn' ? 'রেটিং:' : 'Rating:'}
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newReviewRating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      {language === 'bn' ? 'মতামত:' : 'Comment:'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your experience wearing this saree..."
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 text-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-900 text-white rounded-lg text-xs font-bold hover:bg-amber-800 cursor-pointer"
                  >
                    {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List (Requirement 7: show just 1 review preview on details page, more redirects to specific saree reviews) */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 py-3 italic">
                    {language === 'bn' ? 'এখনো কোনো রিভিউ দেওয়া হয়নি।' : 'No reviews yet for this product.'}
                  </p>
                ) : (
                  reviews.slice(0, 1).map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-white">{rev.customerName}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic">"{rev.comment}"</p>
                      <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified Buyer
                        </span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))
                )}

                {/* Requirement 7: Dedicated button to see all reviews for this saree on a separate page */}
                {reviews.length > 0 && onOpenAllReviews && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => onOpenAllReviews(product)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-900/10 hover:bg-amber-900 text-amber-950 dark:text-amber-300 hover:text-white border border-amber-900/30 rounded-xl text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                    >
                      <span>
                        {language === 'bn'
                          ? `এই শাড়ির সবগুলো (${reviews.length}টি) রিভিউ ও রেটিং দেখুন`
                          : `See All (${reviews.length}) Customer Reviews for this Saree`}
                      </span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 3. Related Collection Sarees (Requirement 6: horizontal scrollable + explore more button) */}
        {relatedSarees.length > 0 && (
          <div className="mt-16 pt-10 border-t border-stone-200 dark:border-stone-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 block">
                  {language === 'bn' ? 'সংশ্লিষ্ট কালেকশন' : 'Related Collection'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                  {language === 'bn' ? `${product.sareeType} কালেকশনের অন্যান্য শাড়ি` : `More in ${product.sareeType}`}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* Horizontal carousel arrow controls */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs cursor-pointer"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs cursor-pointer"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {onExploreCategory && (
                  <button
                    type="button"
                    onClick={() => onExploreCategory(product.categoryId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-900/10 hover:bg-amber-900 text-amber-950 dark:text-amber-300 hover:text-white border border-amber-900/30 rounded-xl text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                  >
                    <span>
                      {language === 'bn' ? 'আরও শাড়ি এক্সপ্লোর করুন' : `Explore More ${product.sareeType}`}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Horizontal Scrollable Carousel Container */}
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
              >
                {relatedSarees.map((saree) => (
                  <div
                    key={saree.id}
                    onClick={() => onSelectProduct(saree)}
                    className="w-48 sm:w-56 shrink-0 snap-start bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                      <img
                        src={saree.primaryImage}
                        alt={saree.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5 space-y-1">
                      <span className="text-[10px] font-mono text-amber-900 dark:text-amber-400 font-semibold">
                        {saree.code}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-stone-900 dark:text-white truncate">
                        {language === 'bn' ? saree.nameBn : saree.nameEn}
                      </h4>
                      <span className="font-bold text-stone-900 dark:text-amber-400 text-xs block">
                        ৳{saree.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Final Explore All Category Tile */}
                {onExploreCategory && (
                  <div
                    onClick={() => onExploreCategory(product.categoryId)}
                    className="w-44 sm:w-52 shrink-0 snap-start bg-amber-50 dark:bg-stone-900 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-900/60 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                      {language === 'bn' ? 'সবগুলো দেখুন' : 'Explore All'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                      {product.sareeType}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
