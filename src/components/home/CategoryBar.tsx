import React from 'react';
import { Category, Language } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  language: Language;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  language,
  onSelectCategory
}) => {
  return (
    <section className="py-12 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-900 block mb-1">
              {language === 'bn' ? 'ঐতিহ্যবাহী সম্ভার' : 'Artisanal Handlooms'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {language === 'bn' ? 'শাড়ির প্রধান ক্যাটাগরি' : 'Heritage Weaving Hubs'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-md">
            {language === 'bn'
              ? 'শতাব্দী প্রাচীন তাঁতীদের ঐতিহ্যবাহী নকশায় বোনা খাঁটি বাংলাদেশি শাড়ির সম্ভার।'
              : 'Directly sourced from legendary weaving clusters across Demra, Rupganj, Tangail, and Rajshahi.'}
          </p>
        </div>

        {/* 5-Column Responsive Visual Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-amber-800/40 transition-all duration-300 text-left cursor-pointer"
            >
              {/* Category thumbnail */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight leading-tight">
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </div>

              {/* Subcategories list indicator */}
              <div className="p-2.5 text-[11px] text-stone-500 line-clamp-1 border-t border-stone-100 bg-[#FCFBF9]">
                {language === 'bn'
                  ? cat.subcategories.map((s) => s.nameBn).join(' · ')
                  : cat.subcategories.map((s) => s.nameEn).join(' · ')}
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
