import React from 'react';
import { Category, Language } from '../../types';

interface CategoryCirclesProps {
  categories: Category[];
  language: Language;
  onSelectCategory: (categoryId: string) => void;
  activeCategoryId?: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  categories,
  language,
  onSelectCategory,
  activeCategoryId
}) => {
  return (
    <section className="py-6 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontally scrollable on mobile, flex centered on desktop */}
        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          
          {/* All Sarees Bubble */}
          <button
            onClick={() => onSelectCategory('')}
            className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 transition-all duration-200 ${
                !activeCategoryId
                  ? 'border-amber-900 ring-2 ring-amber-900/30 shadow-md'
                  : 'border-stone-200 group-hover:border-amber-700'
              }`}
            >
              <div className="w-full h-full rounded-full bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
                {language === 'bn' ? 'সব শাড়ি' : 'ALL'}
              </div>
            </div>
            <span
              className={`text-xs font-semibold tracking-tight transition-colors ${
                !activeCategoryId ? 'text-amber-900 font-bold' : 'text-stone-700 group-hover:text-stone-950'
              }`}
            >
              {language === 'bn' ? 'সব কালেকশন' : 'All Sarees'}
            </span>
          </button>

          {/* Individual Category Bubbles with photos */}
          {categories.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-900 ring-2 ring-amber-900/30 shadow-md'
                      : 'border-stone-200 group-hover:border-amber-700'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.nameEn}
                    className="w-full h-full rounded-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span
                  className={`text-xs font-semibold tracking-tight transition-colors whitespace-nowrap ${
                    isSelected ? 'text-amber-900 font-bold' : 'text-stone-700 group-hover:text-stone-950'
                  }`}
                >
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </span>
              </button>
            );
          })}

        </div>

      </div>
    </section>
  );
};
