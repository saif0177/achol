import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { Product, ProductVariant, Language, Review } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface SareeReviewsPageProps {
  product: Product;
  language: Language;
  onBack: () => void;
  onDirectOrder: (product: Product, variant?: ProductVariant) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
}

export const SareeReviewsPage: React.FC<SareeReviewsPageProps> = ({
  product,
  language,
  onBack,
  onDirectOrder,
  onAddToCart
}) => {
  const t = translations[language];
  const [reviews, setReviews] = useState<Review[]>(() =>
    store.getReviewsForProduct(product.id)
  );

  // Review Form
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedToast, setSubmittedToast] = useState(false);

  // Rating Distribution Calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : product.rating.toFixed(1);

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalReviews > 0
      ? Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100)
      : 0
  }));

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: authorName.trim(),
      customerPhoneMasked: '0171***99',
      rating,
      comment: comment.trim(),
      date: 'Just now',
      isVerifiedPurchase: true
    };

    store.addReview(newRev);
    setReviews([newRev, ...reviews]);
    setAuthorName('');
    setComment('');
    setShowForm(false);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-6 sm:py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {language === 'bn' ? 'শাড়ির মূল পাতায় ফিরুন' : 'Back to Saree Details'}
            </span>
          </button>

          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            Saree Code: {product.code}
          </span>
        </div>

        {/* Saree Profile Banner */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center gap-5">
          <img
            src={product.primaryImage}
            alt={product.nameEn}
            className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs shrink-0"
          />

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded font-mono text-[11px] font-bold">
              {product.code} · {product.sareeType}
            </div>

            <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug">
              {language === 'bn' ? product.nameBn : product.nameEn}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-600 dark:text-stone-300">
              <span className="font-bold text-stone-900 dark:text-white font-serif text-lg">
                ৳{product.price.toLocaleString()}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি প্রযোজ্য' : 'Cash on Delivery Available'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onDirectOrder(product)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'bn' ? 'অর্ডার করুন' : 'Buy Now'}</span>
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="px-4 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? 'কার্ট' : 'Add'}</span>
            </button>
          </div>
        </div>

        {/* Rating Summary Breakdown Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Average Rating Score */}
          <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800">
            <span className="font-serif text-5xl font-bold text-stone-900 dark:text-white">
              {averageRating}
            </span>
            <div className="flex items-center gap-1 text-amber-400 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {totalReviews} {language === 'bn' ? 'টি যাচাইকৃত কাস্টমার রিভিউ' : 'verified customer reviews'}
            </p>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="space-y-1.5 md:col-span-2">
            {starCounts.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-stone-600 dark:text-stone-400 font-medium">
                  {star} Star
                </span>
                <div className="flex-1 h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-stone-500 dark:text-stone-400 text-[11px]">
                  {count}
                </span>
              </div>
            ))}

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-stone-900 dark:bg-amber-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {showForm
                  ? language === 'bn' ? 'ফর্ম লুকান' : 'Hide Form'
                  : language === 'bn' ? 'নতুন রিভিউ লিখুন' : 'Write a Review for this Saree'}
              </button>
            </div>
          </div>

        </div>

        {/* Submit Notification Toast */}
        {submittedToast && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? 'আপনার মূল্যবান মতামত যুক্ত হয়েছে! ধন্যবাদ।'
                : 'Thank you! Your verified review has been published.'}
            </span>
          </div>
        )}

        {/* Write Review Form */}
        {showForm && (
          <form
            onSubmit={handleAddReview}
            className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/20 shadow-md space-y-4"
          >
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'bn' ? 'এই শাড়ি সম্পর্কে আপনার অভিজ্ঞতা লিখুন' : 'Share your Experience with this Saree'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'bn' ? 'আপনার নাম' : 'Your Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Farhana Ahmed"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {language === 'bn' ? 'রেটিং দিন' : 'Rating'} *
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          s <= rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-700 ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {language === 'bn' ? 'আপনার মতামত ও অনুভূতির বিবরণ' : 'Your Detailed Review'} *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="কাপড়ের মান, নকশার সূক্ষ্মতা, পরার অনুভূতি..."
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                {language === 'bn' ? 'রিভিউ পোস্ট করুন' : 'Post Review'}
              </button>
            </div>
          </form>
        )}

        {/* All Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              {language === 'bn'
                ? `এই শাড়ির সকল রিভিউ (${totalReviews})`
                : `All Reviews for this Saree (${totalReviews})`}
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {language === 'bn'
                  ? 'এই শাড়িতে এখনো কোনো রিভিউ জমা পড়েনি। প্রথম রিভিউটি আপনিই দিন!'
                  : 'No reviews yet for this saree. Be the first to share your thoughts!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        {rev.customerName}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-200 dark:text-stone-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {rev.date}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified Buyer'}</span>
                    </span>
                  </div>

                  <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400">
                    <span className="text-[10px] text-stone-500">
                      Handloom Authentic Batch Verified
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
