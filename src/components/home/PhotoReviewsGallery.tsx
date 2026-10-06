import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { Language } from '../../types';

interface PhotoReviewsGalleryProps {
  language: Language;
}

export const PhotoReviewsGallery: React.FC<PhotoReviewsGalleryProps> = ({ language }) => {
  const reviews = [
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
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200/80 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                {language === 'bn' ? 'যাচাইকৃত গ্রাহক সন্তুষ্টি' : 'Verified Buyer Experiences'}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {language === 'bn' ? 'গ্রাহকদের পছন্দের আঁচল শাড়ি' : 'Cherished Moments in Aanchol'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className="font-bold text-stone-800">4.9 / 5.0</span>
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-stone-400">· 1,280+ {language === 'bn' ? 'রিভিউ' : 'reviews'}</span>
          </div>
        </div>

        {/* Compact 3-card horizontal grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-stone-200/90 p-4 shadow-xs hover:shadow-sm transition-shadow flex items-start gap-3.5"
            >
              {/* Small round photo thumbnail */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Review details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-snug line-clamp-2 italic">
                  "{language === 'bn' ? rev.commentBn : rev.commentEn}"
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-900 truncate">{rev.name}</span>
                  <span className="text-stone-400 text-[10px] truncate">{rev.location.split(',')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
