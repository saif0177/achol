import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Category, Language } from '../../types';
import { store } from '../../services/store';

interface CategoryHeritageHeaderProps {
  category: Category;
  language: Language;
  selectedSubcategoryId?: string;
  onSelectSubcategory: (subcategoryId: string) => void;
  onOpenDetails?: () => void;
}

export const CategoryHeritageHeader: React.FC<CategoryHeritageHeaderProps> = ({
  category,
  language,
  selectedSubcategoryId,
  onSelectSubcategory,
  onOpenDetails
}) => {
  // Retrieve live article if saved by admin to show matching summary
  const article = store.getCategoryArticle(category.id);

  const title = language === 'bn' ? category.nameBn : category.nameEn;
  const description = language === 'bn'
    ? (article?.summaryBn || category.descriptionBn)
    : (article?.summaryEn || category.descriptionEn);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-xs mb-6 transition-colors">
      {/* Compact Information Bar (Requirement 6: Small title, related text, More About on the right side) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-4">
            {description}
          </p>
        </div>

        {/* More About / Learn More Action on the Right Side */}
        {onOpenDetails && (
          <div className="shrink-0 self-start sm:self-center pl-4 sm:pl-0">
            <button
              onClick={onOpenDetails}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 rounded-xl text-xs font-bold transition-all shadow-2xs group cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>
                {language === 'bn'
                  ? `${category.nameBn} সম্পর্কে বিস্তারিত`
                  : `More About ${category.nameEn}`}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-amber-700 dark:text-amber-400" />
            </button>
          </div>
        )}
      </div>

      {/* Subcategories Chips (if available) */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 pr-1">
            {language === 'bn' ? 'ধরন:' : 'Type:'}
          </span>
          <button
            onClick={() => onSelectSubcategory('')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !selectedSubcategoryId
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
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
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {language === 'bn' ? sub.nameBn : sub.nameEn}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
