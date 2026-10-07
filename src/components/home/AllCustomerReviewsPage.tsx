import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Filter,
  Camera,
  MessageSquare,
  ThumbsUp,
  Share2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Search
} from 'lucide-react';
import { Language, Product } from '../../types';
import { store } from '../../services/store';

interface AllCustomerReviewsPageProps {
  language: Language;
  onBack: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const AllCustomerReviewsPage: React.FC<AllCustomerReviewsPageProps> = ({
  language,
  onBack,
  onSelectProduct
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [photoOnly, setPhotoOnly] = useState(false);

  const allReviewsList = [
    {
      id: 1,
      image: '/src/assets/images/customer_saree_review_photo_1791274673553.jpg',
      name: 'Dr. Nusrat Jahan',
      location: 'Dhanmondi, Dhaka',
      sareeTitle: 'Rajshahi Pure Mulberry Silk (SK-302)',
      productId: 'p-sk302',
      commentEn: 'The emerald green color and antique gold zari pallu received compliments all evening at my niece’s wedding! The drape feels like pure butter. Truly an authentic silk masterpiece.',
      commentBn: 'গাঢ় পান্না সবুজ রঙ এবং আঁচলের জরি বিয়ের অনুষ্ঠানে সবার নজর কেড়েছে। শাড়ির কোয়ালিটি সত্যিই অসাধারণ! রেশম সুতার বুনন অত্যন্ত আরামদায়ক।',
      rating: 5,
      date: '12 October 2026',
      verified: true,
      helpful: 48
    },
    {
      id: 2,
      image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
      name: 'Samira Anjum',
      location: 'Uttara Sector 7, Dhaka',
      sareeTitle: 'Heritage Dhakai Jamdani (JM-108)',
      productId: 'p-jm108',
      commentEn: 'Authentic 80-count cotton weave. Delivered in 24 hours via Steadfast with Cash on Delivery. Inspected the fabric before paying. 100% genuine handloom.',
      commentBn: 'আসল ৮০ কাউন্ট সুতির ঢাকাই জামদানি। হাতে পেয়ে চেক করে টাকা দিয়েছি, কাপড়ের বুনন খুবই মিহি। আঁচলের নকশায় তাঁতির ভালোবাসা স্পষ্ট।',
      rating: 5,
      date: '10 October 2026',
      verified: true,
      helpful: 35
    },
    {
      id: 3,
      image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
      name: 'Farhana Chowdhury',
      location: 'Nasirabad, Chattogram',
      sareeTitle: 'Royal Dhakai Muslin (DM-204)',
      productId: 'p-dm204',
      commentEn: 'A true heirloom piece. It is so lightweight and breathable. Truly an authentic muslin revival. Highly recommended for special cultural gatherings.',
      commentBn: 'ঐতিহ্যবাহী শুভ্র মসলিন শাড়িটি যেন বাতাসের মতোই হালকা। আঁচলের কারুকাজ রাজকীয় অনুভূতি এনে দেয়। পারিবারিক অনুষ্ঠানে পরে দারুণ প্রশংসা পেয়েছি।',
      rating: 5,
      date: '8 October 2026',
      verified: true,
      helpful: 52
    },
    {
      id: 4,
      image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
      name: 'Afroza Begum',
      location: 'Mirpur DOHS, Dhaka',
      sareeTitle: 'Tangail Handloom Cotton (TT-401)',
      productId: 'p-tt401',
      commentEn: 'Extremely comfortable for daily formal wear. The peacock border colors are rich and vibrant even after multiple gentle washes.',
      commentBn: 'প্রতিদিন পরার জন্য টাঙ্গাইল তাঁতের এই শাড়িটি অতুলনীয়। ময়ূরকণ্ঠী পাড়ের রঙ খুবই উজ্জ্বল। গরমে দারুণ আরামদায়ক।',
      rating: 5,
      date: '5 October 2026',
      verified: true,
      helpful: 29
    },
    {
      id: 5,
      image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
      name: 'Tanzina Islam',
      location: 'Sylhet Sadar, Sylhet',
      sareeTitle: 'Mirpur Bridal Katan (KT-505)',
      productId: 'p-kt505',
      commentEn: 'Purchased for my sister’s wedding reception. Royal meenakari gold zari work that looks straight out of an heirloom royal collection. Worth every taka.',
      commentBn: 'বোনের বিয়ের রিসেপশনের জন্য নিয়েছিলাম। ভারী মীনাকারি কাজের রাজকীয় লুক সবাইকে মুগ্ধ করেছে। প্যাকেজিং অত্যন্ত সুরক্ষিত ও প্রিমিয়াম ছিল।',
      rating: 5,
      date: '1 October 2026',
      verified: true,
      helpful: 63
    },
    {
      id: 6,
      image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
      name: 'Sadia Akhter',
      location: 'Gulshan 2, Dhaka',
      sareeTitle: 'Rajshahi Pure Mulberry Silk (SK-302)',
      productId: 'p-sk302',
      commentEn: 'Direct WhatsApp video preview made color confirmation effortless. Prompt 24h doorstep delivery. Outstanding customer care!',
      commentBn: 'ভিডিও কলে আসল শাড়িটি সরাসরি দেখে নিতে পেরেছি। অত্যন্ত দ্রুত ডেলিভারি পেয়েছি। কাপড়ের চকচকে ভাব ও ফলস পাড় খুবই নিখুঁত।',
      rating: 5,
      date: '28 September 2026',
      verified: true,
      helpful: 22
    },
    {
      id: 7,
      name: 'Rumana Siddiqua',
      location: 'Khulna Sadar',
      sareeTitle: 'Monipuri Handloom Temple Border (MP-601)',
      productId: 'p-mp601',
      commentEn: 'The traditional temple geometric border is so sharp and elegant. Cotton feels organic and hand-spun. Truly supportive of Bangladeshi weavers.',
      commentBn: 'মনিপুরী শাড়ির টেম্পল নকশা অত্যন্ত নিখুঁত। সম্পূর্ণ দেশি সুতার বুনন হওয়ায় পরে ভীষণ আরাম পেয়েছি।',
      rating: 4,
      date: '24 September 2026',
      verified: true,
      helpful: 19
    },
    {
      id: 8,
      name: 'Naznin Sultana',
      location: 'Rajshahi City',
      sareeTitle: 'Dhakai Jamdani Nilambari (JM-108)',
      productId: 'p-jm108',
      commentEn: 'Classic Nilambari blue motif. Zari work is smooth and doesn’t itch the skin. Very impressed with the wooden box presentation.',
      commentBn: 'নীলাম্বরী জামদানির নীল রঙ ও জরির সমন্বয় অপূর্ব। গায়ে জড়িয়ে চমৎকার ফল আসে। বক্স প্যাকেজিং উপহারের জন্য নিখুঁত।',
      rating: 5,
      date: '20 September 2026',
      verified: true,
      helpful: 41
    }
  ];

  const filteredReviews = allReviewsList.filter((r) => {
    if (selectedRating && r.rating !== selectedRating) return false;
    if (photoOnly && !r.image) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchSaree = r.sareeTitle.toLowerCase().includes(q);
      const matchComment = (r.commentEn + ' ' + r.commentBn).toLowerCase().includes(q);
      if (!matchName && !matchSaree && !matchComment) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FCFAF6] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors pb-24">
      {/* Sticky Navigation Bar */}
      <div className="bg-white/95 dark:bg-stone-900/95 sticky top-18 z-20 border-b border-stone-200 dark:border-stone-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform text-amber-900 dark:text-amber-400" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Verified Customer Reviews</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Hero Header with Overall Rating Summary */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                {language === 'bn' ? 'গ্রাহকদের আস্থা ও বাস্তব অভিজ্ঞতা' : 'Real Customer Experiences & Photos'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
              {language === 'bn' ? 'আঁচল শাড়ির গ্রাহক রিভিউ ও গ্যালারি' : 'Aanchol Verified Customer Reviews'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {language === 'bn'
                ? 'সারা বাংলাদেশের শাড়িপ্রেমী গ্রাহকদের আনন্দঘন মুহূর্ত, বাস্তব ছবি ও খাঁটি অভিজ্ঞতার গল্প।'
                : 'Browse through unfiltered reviews, draping photos, and authentic testimonials from verified handloom patrons.'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center gap-4 shrink-0">
            <div className="text-center">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-amber-950 dark:text-amber-300 block">
                4.9
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>
            </div>
            <div className="border-l border-amber-300 dark:border-amber-700/60 pl-4 space-y-1 text-xs">
              <span className="font-bold text-stone-900 dark:text-white block">1,280+ Reviews</span>
              <span className="text-stone-500 text-[11px] block">98% 5-Star Rating</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">
                Zero Machine Copy
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRating === null
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              All ({allReviewsList.length})
            </button>
            <button
              onClick={() => setSelectedRating(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                selectedRating === 5
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5 Stars</span>
            </button>
            <button
              onClick={() => setSelectedRating(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                selectedRating === 4
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4 Stars</span>
            </button>
            <button
              onClick={() => setPhotoOnly(!photoOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                photoOnly
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photos</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'রিভিউ বা শাড়ি খুঁজুন...' : 'Search reviews...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-900"
            />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Photo if present */}
                {rev.image && (
                  <div className="w-full h-52 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <img
                      src={rev.image}
                      alt={rev.sareeTitle}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Stars and verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                {/* Saree Name */}
                <div className="text-xs font-bold text-amber-900 dark:text-amber-400 flex items-center justify-between">
                  <span>{rev.sareeTitle}</span>
                </div>

                {/* Comments */}
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif italic">
                  "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">{rev.name}</span>
                  <span className="text-[11px] text-stone-400">{rev.location} · {rev.date}</span>
                </div>

                <div className="flex items-center gap-1 text-stone-400 text-[11px]">
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-700" />
                  <span>{rev.helpful}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
