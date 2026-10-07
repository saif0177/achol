import React from 'react';
import { Star, CheckCircle2, MessageSquareQuote, ArrowRight } from 'lucide-react';
import { Language } from '../../types';

interface PhotoReviewsGalleryProps {
  language: Language;
  onOpenAllReviews?: () => void;
}

export const PhotoReviewsGallery: React.FC<PhotoReviewsGalleryProps> = ({
  language,
  onOpenAllReviews
}) => {
  const initialReviews = [
    {
      id: 1,
      image: '/src/assets/images/customer_saree_review_photo_1791274673553.jpg',
      name: 'Dr. Nusrat Jahan',
      location: 'Dhanmondi, Dhaka',
      saree: 'Rajshahi Pure Mulberry Silk (SK-302)',
      commentEn: 'The emerald green color and antique gold zari pallu received compliments all evening! The drape feels like pure butter.',
      commentBn: 'গাঢ় পান্না সবুজ রঙ এবং আঁচলের জরি বিয়ের অনুষ্ঠানে সবার নজর কেড়েছে। শাড়ির কোয়ালিটি সত্যিই অসাধারণ!',
      rating: 5,
      date: 'Verified Wedding Buyer'
    },
    {
      id: 2,
      image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
      name: 'Samira Anjum',
      location: 'Uttara, Dhaka',
      saree: 'Heritage Dhakai Jamdani (JM-108)',
      commentEn: 'Authentic 80-count cotton weave. Delivered in 24 hours via Steadfast with Cash on Delivery.',
      commentBn: 'আসল ৮০ কাউন্ট সুতির ঢাকাই জামদানি। হাতে পেয়ে চেক করে টাকা দিয়েছি, কাপড়ের বুনন খুবই মিহি।',
      rating: 5,
      date: 'Verified Buyer'
    },
    {
      id: 3,
      image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
      name: 'Farhana Chowdhury',
      location: 'Nasirabad, Chattogram',
      saree: 'Royal Dhakai Muslin (DM-204)',
      commentEn: 'A true heirloom piece. It is so lightweight and breathable. Truly an authentic muslin revival.',
      commentBn: 'ঐতিহ্যবাহী শুভ্র মসলিন শাড়িটি যেন বাতাসের মতোই হালকা। আঁচলের কারুকাজ রাজকীয় অনুভূতি এনে দেয়।',
      rating: 5,
      date: 'Verified Buyer'
    },
    {
      id: 4,
      image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
      name: 'Afroza Begum',
      location: 'Mirpur, Dhaka',
      saree: 'Tangail Handloom Cotton (TT-401)',
      commentEn: 'Extremely comfortable for daily formal wear. The peacock border colors are rich and vibrant even after multiple washes.',
      commentBn: 'প্রতিদিন পরার জন্য টাঙ্গাইল তাঁতের এই শাড়িটি অতুলনীয়। ময়ূরকণ্ঠী পাড়ের রঙ খুবই উজ্জ্বল।',
      rating: 5,
      date: 'Verified Buyer'
    },
    {
      id: 5,
      image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
      name: 'Tanzina Islam',
      location: 'Sylhet Sadar',
      saree: 'Mirpur Bridal Katan (KT-505)',
      commentEn: 'Purchased for my sister’s wedding reception. Royal meenakari gold zari work that looks straight out of an heirloom collection.',
      commentBn: 'বোনের বিয়ের রিসেপশনের জন্য নিয়েছিলাম। ভারী মীনাকারি কাজের রাজকীয় লুক সবাইকে মুগ্ধ করেছে।',
      rating: 5,
      date: 'Verified Wedding Buyer'
    },
    {
      id: 6,
      image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
      name: 'Sadia Akhter',
      location: 'Gulshan 2, Dhaka',
      saree: 'Rajshahi Pure Mulberry Silk (SK-302)',
      commentEn: 'Direct WhatsApp video preview made color confirmation so easy. Prompt home delivery with Cash on Delivery.',
      commentBn: 'ভিডিও কলে আসল শাড়িটি সরাসরি দেখে নিতে পেরেছি। অত্যন্ত দ্রুত ডেলিভারি পেয়েছি।',
      rating: 5,
      date: 'Verified Buyer'
    }
  ];

  // Requirement 7: Exactly 3 reviews appear on homepage, and clicking More Reviews redirects to new page with lots of reviews
  const displayedReviews = initialReviews.slice(0, 3);

  return (
    <section className="py-10 sm:py-12 bg-[#FAF8F5] dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                {language === 'bn' ? 'যাচাইকৃত গ্রাহক সন্তুষ্টি' : 'Verified Buyer Experiences'}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-white">
              {language === 'bn' ? 'গ্রাহকদের পছন্দের আঁচল শাড়ি ও বাস্তব রিভিউ' : 'Cherished Moments in Aanchol'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-bold text-stone-800 dark:text-stone-200">4.9 / 5.0</span>
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>· 1,280+ {language === 'bn' ? 'রিভিউ' : 'reviews'}</span>
          </div>
        </div>

        {/* Reviews Grid: Exactly 3 on Homepage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-stone-800/90 rounded-2xl border border-stone-200/90 dark:border-stone-700/80 p-4 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              {/* Photo Thumbnail */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Review Info */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-snug line-clamp-3 italic">
                  "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] border-t border-stone-100 dark:border-stone-700/50">
                  <span className="font-bold text-stone-900 dark:text-white truncate">{rev.name}</span>
                  <span className="text-stone-400 text-[10px] truncate">{rev.location.split(',')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Reviews Button (Requirement 7: redirects to separate all reviews page) */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => onOpenAllReviews && onOpenAllReviews()}
            className="px-6 py-3 bg-stone-900 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 group"
          >
            <MessageSquareQuote className="w-4 h-4 text-amber-300" />
            <span>
              {language === 'bn'
                ? 'আরও সব কাস্টমার রিভিউ দেখুন (More Reviews)'
                : 'See All Customer Reviews (More Reviews)'}
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-300" />
          </button>
        </div>

      </div>
    </section>
  );
};
