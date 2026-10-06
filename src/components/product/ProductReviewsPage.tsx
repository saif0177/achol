import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Filter,
  MessageSquare,
  ThumbsUp,
  Share2,
  Calendar,
  Sparkles,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { Product, Language, Review, ProductVariant } from '../../types';
import { store } from '../../services/store';

interface ProductReviewsPageProps {
  product: Product;
  selectedVariant?: ProductVariant;
  language: Language;
  onBackToProduct: () => void;
  onDirectOrder: (product: Product, variant: ProductVariant) => void;
}

export const ProductReviewsPage: React.FC<ProductReviewsPageProps> = ({
  product,
  selectedVariant,
  language,
  onBackToProduct,
  onDirectOrder
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittedToast, setIsSubmittedToast] = useState(false);

  useEffect(() => {
    setReviews(store.getReviewsForProduct(product.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const activeVariant = selectedVariant || product.variants[0] || {
    id: 'default',
    colorNameEn: 'Original',
    colorNameBn: 'আসল রঙ',
    colorHex: '#991B1B',
    colorFamily: 'red',
    image: product.primaryImage,
    stock: product.stock,
    sku: product.code
  };

  const filteredReviews = starFilter
    ? reviews.filter((r) => r.rating === starFilter)
    : reviews;

  // Star counts calculation
  const totalCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: newReviewAuthor.trim(),
      customerPhoneMasked: '0171***88',
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
    setIsSubmittedToast(true);
    setTimeout(() => setIsSubmittedToast(false), 3000);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-stone-950 min-h-screen pb-24 text-stone-900 dark:text-stone-100">
      {/* 1. Header Navigation Bar */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-18 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBackToProduct}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'bn' ? 'শাড়ির মূল পেজে ফিরে যান' : 'Back to Saree Details'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono text-stone-500">
              {product.code}
            </span>
            <button
              onClick={() => onDirectOrder(product, activeVariant)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'bn' ? 'সরাসরি অর্ডার' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Toast confirmation */}
        {isSubmittedToast && (
          <div className="bg-emerald-900 text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">
                {language === 'bn' ? 'আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Thank you for your review!'}
              </span>
              <p className="text-emerald-200 text-xs">
                {language === 'bn'
                  ? 'আপনার অভিজ্ঞতা অন্য শাড়িপ্রেমীদের সেরা শাড়ি নির্বাচনে সাহায্য করবে।'
                  : 'Your verified feedback is now visible to all shoppers.'}
              </p>
            </div>
          </div>
        )}

        {/* 2. Saree Overview Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200/90 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700 shadow-xs">
              <img
                src={activeVariant.image || product.primaryImage}
                alt={product.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-mono text-[11px] font-bold">
                  {product.code}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {product.sareeType}
                </span>
              </div>
              <h1 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h1>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-400">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Write Review Button */}
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full md:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-amber-950 dark:hover:bg-amber-900 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span>
              {showReviewForm
                ? language === 'bn' ? 'ফরম বন্ধ করুন' : 'Cancel'
                : language === 'bn' ? 'এই শাড়ির রিভিউ লিখুন' : 'Write a Review for this Saree'}
            </span>
          </button>
        </div>

        {/* 3. Review Submission Form Modal/Card */}
        {showReviewForm && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-800/40 dark:border-amber-700/40 shadow-xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  {language === 'bn' ? 'আপনার অভিজ্ঞতার রিভিউ দিন' : 'Share Your Review & Drape Experience'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'bn'
                    ? 'আঁচলের খাঁটি তাঁতের কাপড়, জরির কাজ ও ডেলিভারি অভিজ্ঞতা জানান।'
                    : 'Help other saree connoisseurs understand the fabric texture, shine, and drape.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    {language === 'bn' ? 'শাড়ির রেটিং দিন *' : 'Star Rating *'}
                  </label>
                  <div className="flex items-center gap-1.5 pt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReviewRating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-stone-300 dark:text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-400 ml-2">
                      {newReviewRating} / 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {language === 'bn' ? 'আপনার মন্তব্য ও বিবরণ *' : 'Your Honest Review *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell us about the texture, softness, color authenticity, and packaging..."
                  className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. Rating Statistics & Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating Score */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/90 dark:border-stone-800 flex flex-col items-center justify-center text-center space-y-2">
            <span className="font-serif text-5xl font-bold text-stone-900 dark:text-white">
              {product.rating.toFixed(1)}
            </span>
            <div className="flex items-center text-amber-500 gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i <= Math.round(product.rating) ? 'fill-current' : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {language === 'bn'
                ? `মোট ${reviews.length} জন সম্মানিত গ্রাহকের রিভিউ`
                : `Based on ${reviews.length} verified customer reviews`}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Authentic Handloom Buyers</span>
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-2 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/90 dark:border-stone-800 flex flex-col justify-center space-y-2.5">
            {ratingDistribution.map((dist) => (
              <div
                key={dist.stars}
                onClick={() => setStarFilter(starFilter === dist.stars ? null : dist.stars)}
                className={`flex items-center gap-3 text-xs cursor-pointer p-1 rounded-lg transition-colors ${
                  starFilter === dist.stars
                    ? 'bg-amber-50 dark:bg-stone-800 font-bold'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                }`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 text-stone-700 dark:text-stone-300 font-semibold">
                  <span>{dist.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                </div>
                <div className="flex-1 h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right font-mono text-stone-500 text-[11px] shrink-0">
                  {dist.count} ({dist.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Filters Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
            <Filter className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span>
              {language === 'bn'
                ? `প্রদর্শিত হচ্ছে ${filteredReviews.length}টি রিভিউ`
                : `Showing ${filteredReviews.length} Reviews`}
            </span>
            {starFilter && (
              <span className="px-2 py-0.5 rounded-full bg-amber-900 text-white text-[10px] font-bold">
                {starFilter} Stars Only
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setStarFilter(null)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                starFilter === null
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'সবগুলো' : 'All Stars'}
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setStarFilter(starFilter === star ? null : star)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  starFilter === star
                    ? 'bg-amber-900 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* 6. All Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 space-y-3">
              <MessageSquare className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
                {language === 'bn' ? 'এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি' : 'No Reviews Found'}
              </h4>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'অন্য ফিল্টার সিলেক্ট করুন অথবা আপনার নিজের রিভিউ শেয়ার করুন।'
                  : 'Clear the filter or be the first to leave a review with this rating.'}
              </p>
              <button
                onClick={() => setStarFilter(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {language === 'bn' ? 'ফিল্টার মুছুন' : 'Reset Filter'}
              </button>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-2xs space-y-3 transition-all hover:border-amber-900/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-900/10 dark:bg-amber-950 text-amber-900 dark:text-amber-400 font-serif font-bold text-base flex items-center justify-center shrink-0 border border-amber-900/20">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-white">
                          {rev.customerName}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        Phone: {rev.customerPhoneMasked}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-current' : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans pt-1">
                  "{rev.comment}"
                </p>

                {/* Footer metadata */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{rev.date}</span>
                  </div>

                  <span className="text-amber-900 dark:text-amber-400 font-semibold text-[10px]">
                    Authentic {product.sareeType}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to product button at the bottom */}
        <div className="pt-6 text-center">
          <button
            onClick={onBackToProduct}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'শাড়ির মূল পেজে ফিরে যান' : 'Back to Saree Details Page'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
