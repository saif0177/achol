import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  Sparkles,
  Info
} from 'lucide-react';
import { Product, ProductVariant, Language, Review } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface ProductDetailModalProps {
  product: Product;
  initialVariant?: ProductVariant;
  language: Language;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
  onClose: () => void;
  onSelectSimilarProduct: (p: Product) => void;
  onOpenSareeGuide?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialVariant,
  language,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onClose,
  onSelectSimilarProduct,
  onOpenSareeGuide
}) => {
  const t = translations[language];

  // Active color variant state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    initialVariant || product.variants[0] || {
      id: 'default',
      colorNameEn: 'Default',
      colorNameBn: 'ডিফল্ট',
      colorHex: '#991B1B',
      colorFamily: 'red',
      image: product.primaryImage,
      stock: product.stock,
      sku: product.code
    }
  );

  const [activeImage, setActiveImage] = useState<string>(
    selectedVariant.image || product.primaryImage
  );
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'reviews'>('specs');

  // Review submission state
  const [reviewsList, setReviewsList] = useState<Review[]>(
    store.getReviewsForProduct(product.id)
  );
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Recommendations
  const similarProducts = store.getRecommended(product.id, 3);

  // When variant changes, update image
  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image) {
      setActiveImage(v.image);
    }
  };

  // WhatsApp prefilled message
  const whatsappNumber = '8801700000000';
  const whatsappMsg = `Hello Aanchol! I am interested in ordering/inquiring about Saree Code: ${product.code} (${product.nameEn}) in color: ${selectedVariant.colorNameEn}.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  // Handle Review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: newReviewAuthor.trim(),
      customerPhoneMasked: '017***Verified',
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: new Date().toISOString().split('T')[0],
      isVerifiedPurchase: true
    };

    store.addReview(review);
    setReviewsList([review, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const isOutOfStock = (selectedVariant.stock ?? product.stock) <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Modal Box */}
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-none sm:rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-screen sm:max-h-[92vh] flex flex-col">
        
        {/* Sticky Top Header bar with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
              #{product.code}
            </span>
            <span className="text-xs text-stone-500 hidden sm:inline">
              {product.sareeType} · {language === 'bn' ? product.fabricBn : product.fabric}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-full border transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Top Section: Gallery (Left) + Purchase Module (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery Column */}
            <div className="space-y-4">
              {/* Main Photo with Lightbox Click */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 cursor-zoom-in group shadow-sm"
              >
                <img
                  src={activeImage}
                  alt={product.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3 p-2 bg-stone-900/60 backdrop-blur-md text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'বড় করে দেখুন' : 'Click to Zoom'}</span>
                </div>
              </div>

              {/* Thumbnails list */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-amber-900 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Contiguous Purchase Module */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.authenticHandloomGuarantee}</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  {language === 'bn' ? product.nameBn : product.nameEn}
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-semibold text-stone-900 font-mono">{product.rating}</span>
                  <span>·</span>
                  <span>{product.reviewCount} {language === 'bn' ? 'যাচাইকৃত রিভিউ' : 'verified client reviews'}</span>
                </div>
              </div>

              {/* Pricing Block */}
              <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-stone-900 font-mono">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through font-mono">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  {t.cashOnDeliveryAvailable}
                </p>
              </div>

              {/* Color Swatch Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900 uppercase tracking-wider">
                    {t.colorsAvailable}:
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-amber-900">
                      {language === 'bn' ? selectedVariant.colorNameBn : selectedVariant.colorNameEn}
                    </span>
                    {onOpenSareeGuide && (
                      <button
                        onClick={onOpenSareeGuide}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>📏 {language === 'bn' ? 'মাপ ও বহর গাইড' : 'Drape Guide'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(v)}
                        className={`group relative p-1 rounded-full transition-transform ${
                          isSelected ? 'ring-2 ring-amber-900 ring-offset-2 scale-105' : 'hover:scale-105'
                        }`}
                        title={v.colorNameEn}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-stone-300 shadow-inner"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-stone-500">
                  {selectedVariant.stock > 0 ? (
                    <span className="text-emerald-700 font-medium">
                      ✓ {t.inStock} ({selectedVariant.stock} available in this shade)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-medium">✕ {t.outOfStock}</span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  {language === 'bn' ? 'পরিমাণ' : 'Quantity'}:
                </span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white text-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-mono font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedVariant.stock || 5, q + 1))
                    }
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => onBuyNow(product, selectedVariant, quantity)}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-6 bg-amber-900 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.buyNow}</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onAddToCart(product, selectedVariant, quantity)}
                    disabled={isOutOfStock}
                    className="py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.addToCart}</span>
                  </button>

                  {/* Ask on WhatsApp with prefilled product code */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>{t.askOnWhatsApp}</span>
                  </a>
                </div>
              </div>

              {/* Delivery & Trust Highlights */}
              <div className="p-3.5 rounded-xl bg-stone-100/70 border border-stone-200/60 text-xs space-y-2 text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-900 shrink-0" />
                  <span>
                    {language === 'bn'
                      ? 'ঢাকায় ২৪-৪৮ ঘণ্টায় ও সারাদেশে ২-৪ দিনে হোম ডেলিভারি (স্টিডফাস্ট কুরিয়ার)'
                      : 'Home delivery: 24-48 hrs inside Dhaka, 2-4 days nationwide via Steadfast Courier.'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-900 shrink-0" />
                  <span>
                    {language === 'bn'
                      ? 'শাড়ি হাতে পেয়ে প্যাকেট খুলে কোয়ালিটি যাচাই করে টাকা পরিশোধের নিশ্চয়তা।'
                      : 'Open package and inspect saree quality at home before cash payment.'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Organized Information Tabs: Specs, Care Instructions, Reviews */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center gap-4 border-b border-stone-200 pb-2 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-amber-900 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {t.specifications}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'care'
                    ? 'border-amber-900 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {t.careInstructions}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-amber-900 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {t.customerReviews} ({reviewsList.length})
              </button>
            </div>

            {/* Tab 1: Specs */}
            {activeTab === 'specs' && (
              <div className="py-4 space-y-4 text-xs">
                <p className="text-stone-700 leading-relaxed text-sm">
                  {language === 'bn' ? product.descriptionBn : product.descriptionEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <span className="text-stone-400 uppercase tracking-wider block font-medium mb-0.5">
                      {t.fabric}
                    </span>
                    <span className="text-stone-900 font-semibold">
                      {language === 'bn' ? product.fabricBn : product.fabric}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <span className="text-stone-400 uppercase tracking-wider block font-medium mb-0.5">
                      {t.length}
                    </span>
                    <span className="text-stone-900 font-semibold">
                      {product.length}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <span className="text-stone-400 uppercase tracking-wider block font-medium mb-0.5">
                      {t.occasion}
                    </span>
                    <span className="text-stone-900 font-semibold">
                      {language === 'bn' ? product.occasionBn : product.occasion}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-stone-200/80">
                    <span className="text-stone-400 uppercase tracking-wider block font-medium mb-0.5">
                      {t.suitableAge}
                    </span>
                    <span className="text-stone-900 font-semibold">
                      {product.suitableAgeRange} Years
                    </span>
                  </div>

                  {product.specifications && product.specifications.length > 0 && product.specifications.map((spec, sIdx) => (
                    <div key={sIdx} className="p-3 bg-white rounded-lg border border-stone-200/80">
                      <span className="text-stone-400 uppercase tracking-wider block font-medium mb-0.5">
                        {spec.key}
                      </span>
                      <span className="text-stone-900 font-semibold">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Care Instructions */}
            {activeTab === 'care' && (
              <div className="py-4 space-y-3 text-xs text-stone-700 leading-relaxed">
                <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-2">
                  <h4 className="font-semibold text-stone-900 text-sm">
                    {language === 'bn' ? 'তাঁতীর পরামর্শ' : 'Master Weaver Preservation Guide'}
                  </h4>
                  <p>
                    {language === 'bn'
                      ? product.careInstructionsBn
                      : product.careInstructionsEn}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 pt-1">
                    <li>Never expose direct perfume sprays to zari / metallic threads.</li>
                    <li>Store in a breathable cotton or muslin slipcover.</li>
                    <li>Avoid metal hangers to prevent fabric creases and pulls.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="py-4 space-y-6">
                
                {/* Add Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-3"
                >
                  <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
                    {t.writeReview}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1">{t.fullName}</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Farhana Sultana"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">{t.yourRating}</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Good)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 text-xs">
                      {t.yourReviewText}
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your thoughts on the texture, drape and colors..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors"
                  >
                    {t.submitReview}
                  </button>

                  {reviewSubmitted && (
                    <span className="text-xs text-emerald-700 ml-2 font-medium">
                      ✓ Thank you! Your review has been published.
                    </span>
                  )}
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-white rounded-xl border border-stone-200/80 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900">
                            {rev.customerName}
                          </span>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{t.verifiedBuyer}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-stone-400 text-[11px] font-mono">
                          {rev.date}
                        </span>
                      </div>

                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <p className="text-stone-700 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* Recommendations: "Similar Sarees" */}
          {similarProducts.length > 0 && (
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {language === 'bn' ? 'একই ধরনের আরও শাড়ি' : 'You May Also Like'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectSimilarProduct(p)}
                    className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200/80 hover:border-amber-800 transition-colors cursor-pointer group"
                  >
                    <img
                      src={p.primaryImage}
                      alt={p.nameEn}
                      className="w-14 h-18 object-cover rounded-lg shrink-0"
                    />
                    <div className="overflow-hidden space-y-0.5 text-xs">
                      <span className="text-[10px] text-amber-900 font-mono">
                        #{p.code}
                      </span>
                      <h4 className="font-semibold text-stone-900 truncate group-hover:text-amber-900">
                        {language === 'bn' ? p.nameBn : p.nameEn}
                      </h4>
                      <div className="font-mono font-bold text-stone-900">
                        ৳{p.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt="Enlarged Saree"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};
