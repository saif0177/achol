import React, { useState, useEffect } from 'react';
import { FilterState, Category, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  RotateCcw,
  X,
  Sliders,
  Palette,
  Layers,
  Check
} from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  categories: Category[];
  language: Language;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  language,
  onFilterChange,
  onResetFilters,
  onCloseMobile
}) => {
  const t = translations[language];

  // Local staging filter state
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isAppliedFeedback, setIsAppliedFeedback] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateLocal = (patch: Partial<FilterState>) => {
    setLocalFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsAppliedFeedback(true);
    setTimeout(() => setIsAppliedFeedback(false), 2000);
    if (onCloseMobile) onCloseMobile();
  };

  const standardColorFamilies: {
    id: string;
    nameEn: string;
    nameBn: string;
    hex: string;
    hueCenter: number;
  }[] = [
    { id: 'red', nameEn: 'Red & Crimson', nameBn: 'লাল ও মেরুন', hex: '#DC2626', hueCenter: 0 },
    { id: 'gold', nameEn: 'Antique Gold', nameBn: 'সোনালি জরি', hex: '#D97706', hueCenter: 40 },
    { id: 'green', nameEn: 'Emerald Green', nameBn: 'সবুজ ও পান্না', hex: '#059669', hueCenter: 140 },
    { id: 'teal', nameEn: 'Peacock Teal', nameBn: 'ময়ূরকণ্ঠী টিল', hex: '#0D9488', hueCenter: 175 },
    { id: 'blue', nameEn: 'Navy & Blue', nameBn: 'নীল ও আসমানী', hex: '#2563EB', hueCenter: 220 },
    { id: 'purple', nameEn: 'Deep Purple', nameBn: 'বেগুনী', hex: '#7C3AED', hueCenter: 270 },
    { id: 'pink', nameEn: 'Rani Pink', nameBn: 'গোলাপি ও রানি', hex: '#DB2777', hueCenter: 330 },
    { id: 'white', nameEn: 'Ivory & White', nameBn: 'শুভ্র সাদা', hex: '#F5F5F4', hueCenter: 0 },
    { id: 'black', nameEn: 'Jet Black', nameBn: 'কুচকুচে কালো', hex: '#18181B', hueCenter: 0 }
  ];

  // Map 0-360 Hue back to closest authentic Bangladeshi Saree color family
  const findClosestColorFamily = (h: number) => {
    if (h < 25 || h >= 345) return standardColorFamilies.find((c) => c.id === 'red')!;
    if (h >= 25 && h < 65) return standardColorFamilies.find((c) => c.id === 'gold')!;
    if (h >= 65 && h < 165) return standardColorFamilies.find((c) => c.id === 'green')!;
    if (h >= 165 && h < 195) return standardColorFamilies.find((c) => c.id === 'teal')!;
    if (h >= 195 && h < 255) return standardColorFamilies.find((c) => c.id === 'blue')!;
    if (h >= 255 && h < 300) return standardColorFamilies.find((c) => c.id === 'purple')!;
    return standardColorFamilies.find((c) => c.id === 'pink')!;
  };

  const selectedCategory = categories.find((c) => c.id === localFilters.categoryId);
  const selectedColor = standardColorFamilies.find((c) => c.id === localFilters.colorFamily);

  const [selectedHue, setSelectedHue] = useState<number>(() => {
    if (localFilters.colorFamily) {
      const match = standardColorFamilies.find((c) => c.id === localFilters.colorFamily);
      return match ? match.hueCenter : 0;
    }
    return 0;
  });

  // Keep hue synchronized if external filter resets
  useEffect(() => {
    if (localFilters.colorFamily) {
      const match = standardColorFamilies.find((c) => c.id === localFilters.colorFamily);
      if (match && match.hueCenter !== undefined) {
        setSelectedHue(match.hueCenter);
      }
    }
  }, [localFilters.colorFamily]);

  const handleHueSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSelectedHue(val);
    const matched = findClosestColorFamily(val);
    updateLocal({
      colorFamily: matched.id,
      targetColorHex: `hsl(${val}, 85%, 50%)`
    });
  };

  const handleSelectSwatch = (col: typeof standardColorFamilies[0]) => {
    if (localFilters.colorFamily === col.id) {
      updateLocal({ colorFamily: '', targetColorHex: undefined });
    } else {
      setSelectedHue(col.hueCenter);
      updateLocal({ colorFamily: col.id, targetColorHex: col.hex });
    }
  };

  const handleClearColor = () => {
    updateLocal({ colorFamily: '', targetColorHex: undefined });
  };

  // Price Range slider boundaries
  const minLimit = 1000;
  const maxLimit = 60000;
  const minVal = Math.max(minLimit, Math.min(localFilters.minPrice, maxLimit - 500));
  const maxVal = Math.min(maxLimit, Math.max(localFilters.maxPrice, minLimit + 500));

  const minPercent = Math.max(0, Math.min(100, ((minVal - minLimit) / (maxLimit - minLimit)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxVal - minLimit) / (maxLimit - minLimit)) * 100));

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 space-y-6 shadow-xs">
      
      {/* Header with Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-900 dark:text-amber-400" />
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            {t.filters}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onResetFilters();
              setLocalFilters(filters);
            }}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-900 dark:hover:text-amber-300 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
          {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
        </label>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => updateLocal({ categoryId: '', subcategoryId: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
              !localFilters.categoryId
                ? 'bg-amber-900/10 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>{t.allCategories}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateLocal({ categoryId: cat.id, subcategoryId: undefined })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                localFilters.categoryId === cat.id
                  ? 'bg-amber-900/10 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter (If category selected) */}
      {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-400">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সাব-ক্যাটাগরি' : 'Sub-Category'}</span>
          </div>
          <div className="space-y-1 text-xs pl-2">
            <button
              onClick={() => updateLocal({ subcategoryId: undefined })}
              className={`w-full text-left px-2 py-1 rounded-md transition-colors cursor-pointer ${
                !localFilters.subcategoryId ? 'font-bold text-amber-900 dark:text-amber-300' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              • {language === 'bn' ? 'সব সাব-ক্যাটাগরি' : 'All Sub-categories'}
            </button>
            {selectedCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => updateLocal({ subcategoryId: sub.id })}
                className={`w-full text-left px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  localFilters.subcategoryId === sub.id
                    ? 'font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                • {language === 'bn' ? sub.nameBn : sub.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Price Range Slider (Matching user screenshot) */}
      <div className="space-y-4 pt-3 border-t border-stone-100 dark:border-stone-800">
        <label className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
          {language === 'bn' ? 'দামের সীমা (Price Range)' : 'Price Range'}
        </label>

        {/* Dual Thumb Slider Track */}
        <div className="relative w-full h-8 flex items-center px-1">
          {/* Base light grey track */}
          <div className="absolute left-1 right-1 h-2 bg-[#E5E7EB] dark:bg-stone-700 rounded-full" />

          {/* Active orange-red segment between the two thumbs */}
          <div
            className="absolute h-2 bg-[#e14c25] rounded-full pointer-events-none transition-all duration-75"
            style={{
              left: `calc(${minPercent}% + 4px)`,
              width: `calc(${Math.max(0, maxPercent - minPercent)}% - 8px)`
            }}
          />

          {/* Min Thumb Input Slider */}
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={500}
            value={minVal}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxVal - 500);
              updateLocal({ minPrice: val });
            }}
            className="price-range-thumb pointer-events-none absolute left-0 w-full h-2 bg-transparent appearance-none z-20 cursor-pointer"
          />

          {/* Max Thumb Input Slider */}
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={500}
            value={maxVal}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minVal + 500);
              updateLocal({ maxPrice: val });
            }}
            className="price-range-thumb pointer-events-none absolute left-0 w-full h-2 bg-transparent appearance-none z-30 cursor-pointer"
          />
        </div>

        {/* Two Rectangular Price Input/Display Boxes underneath */}
        <div className="flex items-center justify-between gap-5 pt-1">
          {/* Left / Min Box */}
          <div className="flex-1">
            <div className="border border-[#94a3b8]/70 dark:border-stone-600 rounded bg-white dark:bg-stone-900 px-3 py-1.5 shadow-2xs">
              <input
                type="text"
                inputMode="numeric"
                value={minVal.toLocaleString()}
                onChange={(e) => {
                  const raw = Number(e.target.value.replace(/[^0-9]/g, ''));
                  if (!isNaN(raw)) {
                    const clamped = Math.max(minLimit, Math.min(raw, maxVal - 500));
                    updateLocal({ minPrice: clamped });
                  }
                }}
                className="w-full text-center text-sm font-semibold text-stone-900 dark:text-stone-100 bg-transparent outline-none focus:ring-1 focus:ring-[#e14c25] rounded font-mono"
              />
            </div>
          </div>

          {/* Right / Max Box */}
          <div className="flex-1">
            <div className="border border-[#94a3b8]/70 dark:border-stone-600 rounded bg-white dark:bg-stone-900 px-3 py-1.5 shadow-2xs">
              <input
                type="text"
                inputMode="numeric"
                value={maxVal.toLocaleString()}
                onChange={(e) => {
                  const raw = Number(e.target.value.replace(/[^0-9]/g, ''));
                  if (!isNaN(raw)) {
                    const clamped = Math.min(maxLimit, Math.max(raw, minVal + 500));
                    updateLocal({ maxPrice: clamped });
                  }
                }}
                className="w-full text-center text-sm font-semibold text-stone-900 dark:text-stone-100 bg-transparent outline-none focus:ring-1 focus:ring-[#e14c25] rounded font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Color Ramp & Palette with Crystal-Clear Chosen Color Clarification */}
      <div className="space-y-3.5 pt-3 border-t border-stone-100 dark:border-stone-800">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>{language === 'bn' ? 'কালার র‍্যাম্প ও রং' : 'Color Ramp & Palette'}</span>
          </label>

          {selectedColor ? (
            <button
              type="button"
              onClick={handleClearColor}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <X className="w-3 h-3" />
              <span>{language === 'bn' ? 'রং মুছুন' : 'Clear Color'}</span>
            </button>
          ) : (
            <span className="text-[11px] text-stone-400">
              {language === 'bn' ? 'সব রং' : 'All Colors'}
            </span>
          )}
        </div>

        {/* Continuous Chromatic Color Ramp Bar with Live Marker */}
        <div className="space-y-1.5">
          <div className="relative pt-1 pb-1">
            {/* The Gradient Ramp Track */}
            <div
              className="relative h-4 w-full rounded-full shadow-inner border border-stone-300 dark:border-stone-700 overflow-hidden cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, #ff0000 0%, #ff7f00 15%, #ffff00 30%, #00ff00 45%, #00ffff 60%, #0000ff 75%, #8b00ff 90%, #ff0000 100%)'
              }}
            >
              {/* Native range input overlay for 100% accessible touch and mouse dragging */}
              <input
                type="range"
                min="0"
                max="360"
                value={selectedHue}
                onChange={handleHueSliderChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                aria-label="Color spectrum ramp"
              />
            </div>

            {/* Draggable Indicator Needle/Thumb Marker positioned on the ramp */}
            {localFilters.colorFamily && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75 z-20"
                style={{ left: `${(selectedHue / 360) * 100}%` }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-white dark:border-stone-900 shadow-md ring-2 ring-stone-900/60"
                  style={{
                    backgroundColor: localFilters.targetColorHex || `hsl(${selectedHue}, 85%, 50%)`
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono px-0.5">
            <span>Red</span>
            <span>Gold</span>
            <span>Green</span>
            <span>Teal</span>
            <span>Blue</span>
            <span>Purple</span>
            <span>Pink</span>
          </div>
        </div>

        {/* Clarification Box: Crystal-Clear display of what color is chosen */}
        {selectedColor ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/90 dark:bg-stone-800/90 border border-amber-300/80 dark:border-amber-800/60 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span
                className="w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 shadow-sm inline-block shrink-0 ring-1 ring-amber-400"
                style={{ backgroundColor: localFilters.targetColorHex || selectedColor.hex }}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-amber-900 dark:text-amber-400 tracking-wider">
                    {language === 'bn' ? 'নির্বাচিত রং:' : 'Chosen Color:'}
                  </span>
                  <span className="text-xs font-black text-stone-900 dark:text-stone-100">
                    {language === 'bn' ? selectedColor.nameBn : selectedColor.nameEn}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                  {language === 'bn'
                    ? 'এই রঙের খাঁটি ঢাকাই শাড়ি ফিল্টার করা হয়েছে'
                    : 'Filtering authentic sarees matching this shade'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearColor}
              className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-white dark:bg-stone-900 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 cursor-pointer transition-colors shrink-0"
            >
              {language === 'bn' ? 'মুছুন' : 'Clear'}
            </button>
          </div>
        ) : (
          <div className="p-2.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-dashed border-stone-200 dark:border-stone-700 text-center">
            {language === 'bn'
              ? 'কালার র‍্যাম্প স্লাইড করুন বা নিচের প্যালেটে ক্লিক করে নির্দিষ্ট রং বেছে নিন'
              : 'Slide the color ramp or tap a swatch to choose a specific shade'}
          </div>
        )}

        {/* Quick Color Swatches Palette */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block">
            {language === 'bn' ? 'জনপ্রিয় ঐতিহ্যবাহী রং সমূহ:' : 'Popular Traditional Shades:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {standardColorFamilies.map((col) => {
              const isSelected = localFilters.colorFamily === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleSelectSwatch(col)}
                  className={`relative w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-stone-900 dark:ring-amber-400 ring-offset-2 scale-110 border-white shadow-sm'
                      : 'border-stone-300 dark:border-stone-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={language === 'bn' ? col.nameBn : col.nameEn}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 drop-shadow-sm ${
                        col.id === 'white' ? 'text-stone-900' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 border-t border-stone-200/90 dark:border-stone-800 flex items-center gap-2">
        <button
          type="button"
          onClick={handleApplyFilters}
          className={`flex-1 py-2.5 px-4 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
            isAppliedFeedback
              ? 'bg-emerald-700 text-white'
              : 'bg-stone-900 hover:bg-amber-900 text-white dark:bg-amber-950 dark:hover:bg-amber-900'
          }`}
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>
            {isAppliedFeedback
              ? (language === 'bn' ? 'প্রয়োগ হয়েছে!' : 'Applied!')
              : (language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters')}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            onResetFilters();
            setLocalFilters(filters);
          }}
          className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
          title={language === 'bn' ? 'রিসেট' : 'Reset'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'মুছুন' : 'Reset'}</span>
        </button>
      </div>

    </div>
  );
};
