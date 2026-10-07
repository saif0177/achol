import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Tag,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Category, CategoryArticle, Language } from '../../types';
import { store } from '../../services/store';

interface CategoryArticlePageProps {
  category: Category;
  language: Language;
  onBack: () => void;
  onShopCategory: (categoryId: string) => void;
}

export const CategoryArticlePage: React.FC<CategoryArticlePageProps> = ({
  category,
  language,
  onBack,
  onShopCategory
}) => {
  const article: CategoryArticle = store.getCategoryArticle(category.id) || {
    id: `art-${category.id}`,
    categoryId: category.id,
    titleEn: `${category.nameEn}: The Living Handloom Heritage & Master Artisan Lore`,
    titleBn: `${category.nameBn}: ঐতিহ্যবাহী বুননশিল্প ও শতাব্দীপ্রাচীন কারিগর ইতিহাস`,
    slug: `${category.slug || category.id}-heritage-story`,
    summaryEn: category.descriptionEn,
    summaryBn: category.descriptionBn,
    contentEn: `${category.nameEn} represents one of Bengal’s timeless handloom expressions. Each weave embodies generational artistry preserved across decades.\n\nWoven with utmost devotion on traditional wooden pit looms, our registered master weavers bring forward authentic motifs, premium thread counts, and enduring grace suited for royal festivities and modern wardrobes alike.\n\nEvery inch of this saree reflects meticulous craftsmanship where threads are inlaid by hand. At Aanchol, we work directly with artisan families in Demra, Rupganj, and Tangail to ensure uncompromising purity and fair livelihoods.`,
    contentBn: `${category.nameBn} বাংলার ঐতিহ্যবাহী তাঁত সংস্কৃতির এক অনবদ্য গৌরবময় নিদর্শন। প্রতিটি সুতায় জড়িয়ে রয়েছে শতাব্দীপ্রাচীন তাঁতিদের ভালোবাসা, ত্যাগ ও অক্লান্ত পরিশ্রম।\n\nখাঁটি বাঁশের পিট লুমে অত্যন্ত সূক্ষ্ম নকশায় বোনা এই শাড়িগুলো যে কোনো উৎসব ও বিশেষ মুহূর্তকে করে তোলে রাজকীয়।\n\nআঁচল সরাসরি তাঁতপল্লী থেকে খাঁটি শাড়ি সংগ্রহ করে কোনো মধ্যস্বত্বভোগী ছাড়া আপনার দ্বারে পৌঁছে দেয়। প্রতিটি শাড়ির সাথে প্রদান করা হয় ১০০% আসল তাঁত নিশ্চয়তা।`,
    featuredImage: category.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    author: 'Aanchol Handloom Research Desk',
    publishedAt: 'October 2026',
    readTime: '4 min read',
    tags: [category.nameEn, 'Artisan Lore', 'Bangladeshi Handloom', 'Master Weavers', 'Heritage Post'],
    historicalEra: '16th Century Mughal & Generational Bengal',
    artisanHub: category.originHub || 'Dhaka Division'
  };

  const paragraphsEn = (article.contentEn || '').split('\n\n').filter(Boolean);
  const paragraphsBn = (article.contentBn || '').split('\n\n').filter(Boolean);
  const paragraphs = language === 'bn' ? (paragraphsBn.length > 0 ? paragraphsBn : paragraphsEn) : paragraphsEn;

  return (
    <article className="min-h-screen bg-[#FCFAF6] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-18 z-20 backdrop-blur-md bg-white/95 dark:bg-stone-900/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform text-amber-900 dark:text-amber-400" />
            <span>{language === 'bn' ? 'ফিরে যান' : 'Back to Saree'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline-block font-mono text-[11px] text-stone-400">
              Blogger Archive · Heritage Articles
            </span>
            <button
              onClick={() => onShopCategory(category.id)}
              className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'এই ক্যাটাগরির শাড়ি দেখুন' : 'Shop this Category'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Blogger Meta Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-lg uppercase tracking-wider border border-amber-300 dark:border-amber-700">
              {language === 'bn' ? category.nameBn : category.nameEn}
            </span>
            {article.historicalEra && (
              <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium rounded-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{article.historicalEra}</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.2]">
            {language === 'bn' ? article.titleBn : article.titleEn}
          </h1>

          {/* Author bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 pb-4 border-y border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-900 text-amber-100 font-serif font-bold text-sm flex items-center justify-center">
                আ
              </div>
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-200 block">
                  {article.author || 'Aanchol Heritage Desk'}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{article.publishedAt || 'Updated recently'}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime || '4 min read'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Handloom Lore</span>
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl bg-stone-100 dark:bg-stone-900">
            <img
              src={article.featuredImage}
              alt={article.titleEn}
              className="w-full max-h-[460px] object-cover object-center"
            />
            <div className="p-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Loom Origin: {article.artisanHub || category.originHub || 'Narayanganj & Tangail, Bangladesh'}</span>
              </span>
              <span className="font-mono text-[10px] text-amber-300 font-bold">100% Pitloom Authenticity</span>
            </div>
          </div>
        )}

        {/* Highlight Summary Box */}
        {(article.summaryEn || article.summaryBn) && (
          <div className="p-5 sm:p-6 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border-l-4 border-amber-900 dark:border-amber-500 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{language === 'bn' ? 'সংক্ষেপ ও ঐতিহ্যের সারমর্ম' : 'Heritage Abstract'}</span>
            </span>
            <p className="font-serif italic text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-relaxed">
              "{language === 'bn' ? (article.summaryBn || article.summaryEn) : article.summaryEn}"
            </p>
          </div>
        )}

        {/* Blogger Article Content Paragraphs */}
        <div className="space-y-5 text-base sm:text-lg leading-relaxed text-stone-700 dark:text-stone-300 font-serif">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Craftsmanship Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{language === 'bn' ? 'তাঁত বৈশিষ্ট্য' : 'Loom Characteristics'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              {language === 'bn'
                ? 'বাঁশের কাঠিতে হাতে বোনা নিখুঁত মোটিফ। প্রতিটি শাড়িতে ব্যবহৃত হয় শতভাগ প্রিমিয়াম কাউন্ট সুতা ও খাঁটি রেশম জরি।'
                : 'Intricate motifs hand-inlaid thread-by-thread on traditional pit looms without automated machine repetition.'}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>{language === 'bn' ? 'যত্ম ও সংরক্ষণ' : 'Care & Preservation'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              {language === 'bn'
                ? 'শুধুমাত্র ড্রাই ওয়াশ করুন। সূতির নরম কাপড়ে জড়িয়ে ছায়াযুক্ত স্থানে রোল করে ভাঁজ রাখুন।'
                : 'Dry clean recommended. Preserve rolled inside unbleached muslin cloth away from dampness.'}
            </p>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs font-bold text-stone-400 flex items-center gap-1 font-sans">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags:</span>
            </span>
            {article.tags.map((tg, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-sans font-medium"
              >
                #{tg}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Call to Action Card */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 rounded-3xl text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
              {language === 'bn' ? 'খাঁটি তাঁত কালেকশন' : 'Direct from the Artisans'}
            </span>
            <h3 className="font-serif text-2xl font-bold">
              {language === 'bn' ? `${category.nameBn} শাড়ির পুরো কালেকশন দেখুন` : `Explore All ${category.nameEn} Sarees`}
            </h3>
            <p className="text-xs text-stone-300 max-w-md">
              {language === 'bn'
                ? 'আঁচলের প্রতিটি শাড়ি শতভাগ যাচাইকৃত ও হস্তশিল্পীদের তৈরি।'
                : '100% genuine handcrafted sarees with Steadfast nationwide Cash on Delivery.'}
            </p>
          </div>

          <button
            onClick={() => onShopCategory(category.id)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <span>{language === 'bn' ? 'কালেকশন দেখুন' : 'Browse Collection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
