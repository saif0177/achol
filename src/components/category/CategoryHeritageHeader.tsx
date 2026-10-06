import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Feather,
  ShieldCheck,
  HeartHandshake,
  Layers,
  MapPin
} from 'lucide-react';
import { Category, Language } from '../../types';

interface CategoryHeritageHeaderProps {
  category: Category;
  language: Language;
  selectedSubcategoryId?: string;
  onSelectSubcategory: (subcategoryId: string) => void;
}

export const CategoryHeritageHeader: React.FC<CategoryHeritageHeaderProps> = ({
  category,
  language,
  selectedSubcategoryId,
  onSelectSubcategory
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'looms' | 'quality' | 'care'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  // Heritage information database per category
  const heritageInfo: Record<
    string,
    {
      origin: string;
      originBn: string;
      giTag: string;
      giTagBn: string;
      loomType: string;
      loomTypeBn: string;
      threadDesc: string;
      threadDescBn: string;
      storyEn: string;
      storyBn: string;
      careEn: string;
      careBn: string;
    }
  > = {
    'dhakai-jamdani': {
      origin: 'Demra, Rupganj & Shitalakshya Riverbanks',
      originBn: 'ডেমরা, রূপগঞ্জ ও শীতলক্ষ্যা নদী তীরবর্তী তাঁতপল্লী',
      giTag: 'UNESCO Intangible Cultural Heritage & Bangladesh GI #1',
      giTagBn: 'ইউনেস্কো ইনট্যানজিবল কালচারাল হেরিটেজ ও বাংলাদেশের ১ম জিআই পণ্য',
      loomType: 'Traditional Bamboo Pit Loom (পিট লুম)',
      loomTypeBn: 'বাঁশের খাঁটি পিট লুম ও কাঁঠি বুনন',
      threadDesc: '80 to 100 Count Egyptian Combed Cotton & Pure Resham Zari',
      threadDescBn: '৮০ থেকে ১০০ কাউন্ট মিহি সুতি এবং খাঁটি রেশম সোনালি জরি',
      storyEn:
        'Dhakai Jamdani is an extraordinary heritage art where motifs are inlaid directly into the weave by hand using fine bamboo needles. Each saree takes 2 weeks to 3 months of tireless devotion by master weavers.',
      storyBn:
        'ঢাকাই জামদানি হলো বাংলার অতুলনীয় নকশিকলা। তাঁতে বোনার সময় প্রতিটি ফুল ও জ্যামিতিক নকশা কাঁঠি দিয়ে সুতা গণনা করে ফুটিয়ে তোলা হয়। একটি খাঁটি জামদানি বুনতে ২ সপ্তাহ থেকে ৩ মাস পর্যন্ত সময় লাগে।',
      careEn: 'Dry clean only. Roll fold on a soft muslin fabric. Never hang on metal hangers.',
      careBn: 'শুধুমাত্র ড্রাই ওয়াশ করুন। ধাতব হ্যাঙ্গারে না ঝুলিয়ে নরম সুতি কাপড়ে মুড়িয়ে রোল করে রাখুন।'
    },
    'dhakai-muslin': {
      origin: 'Kapasikha & Narayanganj Textile Hub',
      originBn: 'ঐতিহাসিক কাপাসিয়া ও শীতলক্ষ্যা অববাহিকা',
      giTag: 'Legendary Royal Fabric of Mughal Courtiers',
      giTagBn: 'মুঘল রাজদরবারের ঐতিহ্যবাহী কিংবদন্তি বস্ত্র',
      loomType: 'Ultra-fine Hand Pit Loom with high humidity',
      loomTypeBn: 'আর্দ্র পরিবেশে অতিসূক্ষ্ম হস্তচালিত পিট লুম',
      threadDesc: '300 to 500 Count Hand-spun Phuti Karpas Cotton',
      threadDescBn: '৩০০ থেকে ৫০০ কাউন্ট হাতে কাটা বিরল ফুটি কার্পাস তুলা',
      storyEn:
        'Known historically as woven air, Dhakai Muslin is so light and transparent it could pass through a signet ring. Aanchol works with national revitalization artisans to bring this ethereal masterpiece back to life.',
      storyBn:
        'বাতাসের মতো মিহি ও অঙ্গুরীয়র মধ্য দিয়ে প্রবেশযোগ্য ঢাকাই মসলিন বাংলার শ্রেষ্ঠ গৌরব। আমাদের কারিগররা প্রাচীন ফুটি কার্পাস তুলার সুতা দিয়ে এই রাজকীয় ঐতিহ্যকে পুনরায় জীবন্ত করে তুলেছেন।',
      careEn: 'Specialist heritage dry clean. Store flat in acid-free tissue paper or unbleached muslin wrap.',
      careBn: 'বিশেষ ড্রাই ওয়াশ। ছায়ায় শুকান এবং কেমিক্যালমুক্ত সূতি কাপড়ে জড়িয়ে ফ্ল্যাট রাখুন।'
    },
    'tangail-taat': {
      origin: 'Tangail, Bajitpur & Pathrail Weavers Colony',
      originBn: 'টাঙ্গাইলের পাথরাইল ও বাজিতপুর তাঁতশিল্প অঞ্চল',
      giTag: 'Geographical Indication (GI) Certified Handloom',
      giTagBn: 'বাংলাদেশের স্বীকৃত জিআই সনদপ্রাপ্ত তাঁতপণ্য',
      loomType: 'Jacquard Handloom & Traditional Chittaranjan Looms',
      loomTypeBn: 'জ্যাকার্ড হ্যান্ডলুম ও দেশীয় ঐতিহ্যবাহী তাঁত',
      threadDesc: 'Combed Breathable Soft Cotton & Nakshi Par',
      threadDescBn: '১০০% খাঁটি আরামদায়ক সুতি ও রকমারি নকশী পাড়',
      storyEn:
        'Tangail sarees are renowned for their breathable softness, intricate borders (par), and delicate jacquard body. They represent the daily elegance and festive pride of Bengali households.',
      storyBn:
        'টাঙ্গাইল তাঁতের শাড়ির মূল বৈশিষ্ট্য এর আরামদায়ক কোমলতা ও নিখুঁত নকশী পাড়ের কারুকাজ। গ্রীষ্মপ্রধান দেশে প্রতিদিনের আভিজাত্য ও উৎসবের অন্যতম সেরা পছন্দ।',
      careEn: 'Gentle hand wash in cold water with mild shampoo or mild detergent. Dry in indirect shade.',
      careBn: 'ঠান্ডা পানিতে মৃদু শ্যাম্পু দিয়ে হালকা হাতে ধুয়ে ছায়ায় শুকান।'
    },
    'rajshahi-silk': {
      origin: 'Rajshahi Sericulture Hub & Padma Riverbank',
      originBn: 'পদ্মার তীরবর্তী রাজশাহী রেশম পল্লী',
      giTag: 'Rajshahi Silk GI Certified Heritage',
      giTagBn: 'রাজশাহী সিল্ক স্বীকৃত জিআই সনদপ্রাপ্ত ঐতিহ্য',
      loomType: 'Precision Silk Handloom & Semi-automatic Reeling',
      loomTypeBn: 'হস্তচালিত নিখুঁত রেশম তাঁত',
      threadDesc: '100% Pure Mulberry Silk (তুঁত রেশম)',
      threadDescBn: '১০০% খাঁটি প্রাকৃতিক তুঁত রেশম সুতা',
      storyEn:
        'Spun from the finest mulberry silkworms cultivated in northern Bangladesh, Rajshahi silk offers an unrivaled natural sheen, rich drape, and lifelong durability.',
      storyBn:
        'রাজশাহীর তুঁত বাগানে পালিত রেশমকীটের সুতায় তৈরি এই শাড়ি এর প্রাকৃতিকভাবে উজ্জ্বল দীপ্তি, আরাম ও স্থায়ী স্থায়িত্বের জন্য বিশ্বজুড়ে সমাদৃত।',
      careEn: 'Dry clean recommended. Iron on low silk setting on the reverse side.',
      careBn: 'ড্রাই ওয়াশ উত্তম। উল্টো পিঠে হালকা তাপে সিল্ক সেটিংয়ে ইস্ত্রি করুন।'
    },
    'bridal-festive': {
      origin: 'Mirpur Benarasi Palli, Dhaka',
      originBn: 'মিরপুর বেনারসি পল্লী, ঢাকা',
      giTag: 'Centuries of Master Benarasi Artistry',
      giTagBn: 'মিরপুরের শতাব্দীর সেরা বেনারসি কারুশিল্প',
      loomType: 'Heavy Jacquard Pit Loom with Pure Zari',
      loomTypeBn: 'ভারী জ্যাকার্ড পিট লুম ও সোনালি জরি বুনন',
      threadDesc: 'High-density Katan Silk with Antique Metallic Zari',
      threadDescBn: 'ঘন কাতান সিল্ক ও অ্যান্টিক ব্রোঞ্জ-সোনালি জরি',
      storyEn:
        'Crafted for weddings and once-in-a-lifetime celebrations, these regal Katans feature rich meenakari work, ornate kalga motifs, and opulent bridal red palettes.',
      storyBn:
        'বিয়ের লাল টুকটুকে কনে এবং রাজকীয় উৎসবের জন্য বিশেষভাবে তৈরি ভারী কাতান ও বেনারসি। এর চওড়া পাড় ও মীনাকারি কাজ আভিজাত্যের সর্বোচ্চ প্রকাশ।',
      careEn: 'Strictly dry clean. Air out periodically in shade. Store in breathable saree bag.',
      careBn: 'শুধুমাত্র ড্রাই ওয়াশ। নিয়মিত ছায়ায় বাতাস লাগান।'
    }
  };

  const currentInfo = heritageInfo[category.id] || {
    origin: 'Artisanal Weaving Districts, Bangladesh',
    originBn: 'বাংলাদেশের ঐতিহ্যবাহী তাঁত অঞ্চল',
    giTag: 'Authentic Handcrafted Textile',
    giTagBn: 'খাঁটি হাতে বোনা হস্তশিল্প',
    loomType: 'Artisan Handloom',
    loomTypeBn: 'কারিগরদের হস্তচালিত তাঁত',
    threadDesc: 'Premium Fine Yarn & Metallic Accents',
    threadDescBn: 'উচ্চমানের মিহি সুতা ও কারুকাজ',
    storyEn: category.descriptionEn,
    storyBn: category.descriptionBn,
    careEn: 'Dry clean recommended.',
    careBn: 'ড্রাই ওয়াশ করার পরামর্শ দেওয়া হচ্ছে।'
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs mb-8">
      {/* Top Banner with Background Texture */}
      <div className="relative bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8">
        <div className="max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? currentInfo.giTagBn : currentInfo.giTag}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-stone-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? currentInfo.originBn : currentInfo.origin}</span>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-stone-50">
            {language === 'bn' ? category.nameBn : category.nameEn}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            {language === 'bn' ? category.descriptionBn : category.descriptionEn}
          </p>
        </div>
      </div>

      {/* Interactive Tabs Bar */}
      <div className="bg-[#FAF8F5] border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-amber-900 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ঐতিহ্য ও ইতিহাস' : 'Heritage & History'}</span>
          </button>

          <button
            onClick={() => setActiveTab('looms')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'looms'
                ? 'border-amber-900 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-950'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'তাঁত ও কারিগরি' : 'Loom & Weave Art'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quality'
                ? 'border-amber-900 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-950'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সুতার মান ও কাউন্ট' : 'Thread Count'}</span>
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'care'
                ? 'border-amber-900 text-amber-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-950'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'যত্ন ও সংরক্ষণ' : 'Care & Storage'}</span>
          </button>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-amber-900 hover:text-amber-800 flex items-center gap-1 py-2 px-2 shrink-0 cursor-pointer"
        >
          <span>
            {isExpanded
              ? language === 'bn'
                ? 'সংক্ষেপ করুন'
                : 'Show Less'
              : language === 'bn'
              ? 'বিস্তারিত দেখুন'
              : 'Read More'}
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Tab Content (Always concise preview, expandable on click) */}
      <div className="p-4 sm:p-6 bg-white">
        {activeTab === 'overview' && (
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {language === 'bn' ? currentInfo.storyBn : currentInfo.storyEn}
            </p>
            {isExpanded && (
              <div className="pt-3 mt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="font-bold text-stone-900 block mb-1">
                    {language === 'bn' ? 'তাঁত অঞ্চলের ভৌগোলিক গুরুত্ব' : 'Geographical Significance'}
                  </span>
                  <p>
                    {language === 'bn'
                      ? `${currentInfo.originBn}-এর বিশেষ জলবায়ু ও নদীর পানির আর্দ্রতা এই শাড়ির সুতাকে অনন্য মসৃণতা দেয়।`
                      : `The unique microclimate and river humidity along ${currentInfo.origin} imparts the signature softness to the threads.`}
                  </p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="font-bold text-stone-900 block mb-1">
                    {language === 'bn' ? 'আঁচল প্রতিশ্রুতি' : 'Aanchol Authenticity Guarantee'}
                  </span>
                  <p>
                    {language === 'bn'
                      ? 'আমরা কোনো পাওয়ারলুম কপি বিক্রি করি না। প্রতিটি শাড়ি সরাসরি দক্ষ তাঁতীদের হস্তচালিত তাঁতের তৈরি।'
                      : 'Zero powerloom imitation policy. Each saree is certified hand-woven by vetted heritage master weavers.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'looms' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
              <span className="text-amber-800">●</span>
              <span>{language === 'bn' ? `তাঁত প্রযুক্তি: ${currentInfo.loomTypeBn}` : `Loom Type: ${currentInfo.loomType}`}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {language === 'bn'
                ? 'হাতে বোনা পিটলুম ও কাঁঠির নিখুঁত সমন্বয়ে এই শাড়ির বুনন সম্পন্ন হয়। কারিগরদের নিখুঁত হাতে সুতা টেনে নকশা বোনা হয়, যা কোনো আধুনিক মেশিনে সম্ভব নয়।'
                : 'Woven entirely by hand on traditional pitlooms with fine needle work. The intricate placement of each thread creates an inimitable tactile density.'}
            </p>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
              <span className="text-amber-800">●</span>
              <span>{language === 'bn' ? `সুতার পরিমাপ: ${currentInfo.threadDescBn}` : `Thread Composition: ${currentInfo.threadDesc}`}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {language === 'bn'
                ? 'কাউন্টের মান যত বেশি, সুতা তত মিহি ও আরামদায়ক হয়। আঁচল শুধুমাত্র সার্টিফাইড হাই-কাউন্ট প্রাকৃতিক সুতা ব্যবহার করে।'
                : 'Higher thread counts denote finer filament spinning. Aanchol guarantees certified combed yarns free of synthetic adulteration.'}
            </p>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
              <span className="text-amber-800">●</span>
              <span>{language === 'bn' ? currentInfo.careBn : currentInfo.careEn}</span>
            </div>
          </div>
        )}

        {/* Subcategories Chips Bar */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mt-5 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {language === 'bn' ? 'সাব-ক্যাটাগরি বাচাই করুন:' : 'Filter by Subcategory:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectSubcategory('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !selectedSubcategoryId
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {language === 'bn' ? 'সকল ধরন' : 'All Types'}
              </button>

              {category.subcategories.map((sub) => {
                const isSelected = selectedSubcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubcategory(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {language === 'bn' ? sub.nameBn : sub.nameEn}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
