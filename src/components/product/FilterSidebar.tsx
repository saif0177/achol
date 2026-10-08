import React, { useState, useEffect } from 'react';
import { FilterState, Category, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  RotateCcw,
  X,
  Sliders,
  Palette,
  Layers,
  Filter,
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

  const [selectedHue, setSelectedHue] = useState<number>(0);
  const [currentAge, setCurrentAge] = useState<number>(
    localFilters.ageRange === '18-25'
      ? 22
      : localFilters.ageRange === '25-35'
      ? 28
      : localFilters.ageRange === '35-50'
      ? 42
      : localFilters.ageRange === '50+'
      ? 55
      : 30
  );

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsAppliedFeedback(true);
    setTimeout(() => setIsAppliedFeedback(false), 2000);
    if (onCloseMobile) onCloseMobile();
  };

  const updateLocal = (patch: Partial<FilterState>) => {
    setLocalFilters((prev) => ({ ...prev, ...patch }));
  };

  const sareeTypes = [
    'Dhakai Jamdani',
    'Dhakai Muslin',
    'Tangail Taat',
    'Rajshahi Silk',
    'Mirpur Katan'
  ];

  const standardColorFamilies: {
    id: string;
    nameEn: string;
    nameBn: string;
    hex: string;
    r: number;
    g: number;
    b: number;
  }[] = [
    { id: 'red', nameEn: 'Red & Crimson', nameBn: 'লাল ও মেরুন', hex: '#DC2626', r: 220, g: 38, b: 38 },
    { id: 'blue', nameEn: 'Navy & Blue', nameBn: 'নীল ও আসমানী', hex: '#2563EB', r: 37, g: 99, b: 235 },
    { id: 'green', nameEn: 'Emerald Green', nameBn: 'সবুজ ও পান্না', hex: '#059669', r: 5, g: 150, b: 105 },
    { id: 'gold', nameEn: 'Antique Gold', nameBn: 'সোনালি জরি', hex: '#D97706', r: 217, g: 119, b: 6 },
    { id: 'teal', nameEn: 'Peacock Teal', nameBn: 'ময়ূরকণ্ঠী টিল', hex: '#0D9488', r: 13, g: 148, b: 136 },
    { id: 'white', nameEn: 'Ivory & White', nameBn: 'শুভ্র সাদা / আইভরি', hex: '#F5F5F4', r: 245, g: 245, b: 244 },
    { id: 'black', nameEn: 'Jet Black', nameBn: 'কুচকুচে কালো', hex: '#18181B', r: 24, g: 24, b: 27 },
    { id: 'pink', nameEn: 'Rani Pink', nameBn: 'গোলাপি ও রানি', hex: '#DB2777', r: 219, g: 39, b: 119 },
    { id: 'purple', nameEn: 'Deep Purple', nameBn: 'বেগুনী', hex: '#7C3AED', r: 124, g: 58, b: 237 }
  ];

  // Smart Nearest Color Algorithm: converts HSL to RGB, then calculates Euclidean distance to find closest family
  const findClosestColorFamily = (h: number): typeof standardColorFamilies[0] => {
    // Convert Hue (0-360) with S=85%, L=50% to RGB
    const s = 0.85;
    const l = 0.5;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rPrime = 0,
      gPrime = 0,
      bPrime = 0;

    if (h < 60) {
      rPrime = c;
      gPrime = x;
    } else if (h < 120) {
      rPrime = x;
      gPrime = c;
    } else if (h < 180) {
      gPrime = c;
      bPrime = x;
    } else if (h < 240) {
      gPrime = x;
      bPrime = c;
    } else if (h < 300) {
      rPrime = x;
      bPrime = c;
    } else {
      rPrime = c;
      bPrime = x;
    }

    const targetR = Math.round((rPrime + m) * 255);
    const targetG = Math.round((gPrime + m) * 255);
    const targetB = Math.round((bPrime + m) * 255);

    let closest = standardColorFamilies[0];
    let minDistance = Infinity;

    standardColorFamilies.forEach((f) => {
      // Euclidean distance in RGB color space
      const dist = Math.sqrt(
        Math.pow(targetR - f.r, 2) + Math.pow(targetG - f.g, 2) + Math.pow(targetB - f.b, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closest = f;
      }
    });

    return closest;
  };

  const handleHueSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSelectedHue(val);
    const matched = findClosestColorFamily(val);
    updateLocal({
      colorFamily: matched.id,
      targetColorHex: `hsl(${val}, 85%, 50%)`
    });
  };

  // Age slider handler
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = Number(e.target.value);
    setCurrentAge(age);

    let mappedRange = 'All Ages';
    if (age >= 18 && age < 25) {
      mappedRange = '18-25';
    } else if (age >= 25 && age < 35) {
      mappedRange = '25-35';
    } else if (age >= 35 && age < 50) {
      mappedRange = '35-50';
    } else if (age >= 50) {
      mappedRange = '50+';
    }

    updateLocal({
      ageRange: mappedRange,
      minAge: age
    });
  };

  // Get active category for subcategories
  const selectedCategory = categories.find((c) => c.id === localFilters.categoryId);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 space-y-6 shadow-xs">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-900" />
          <h3 className="font-serif text-lg font-bold text-stone-900">{t.filters}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onResetFilters();
              setLocalFilters(filters);
            }}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-900 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
          {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
        </label>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => updateLocal({ categoryId: '', subcategoryId: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
              !localFilters.categoryId
                ? 'bg-amber-900/10 text-amber-900 font-bold'
                : 'text-stone-600 hover:bg-stone-50'
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
                  ? 'bg-amber-900/10 text-amber-900 font-bold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Subcategory Filter (If category selected) */}
      {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সাব-ক্যাটাগরি' : 'Sub-Category'}</span>
          </div>
          <div className="space-y-1 text-xs pl-2">
            <button
              onClick={() => updateLocal({ subcategoryId: undefined })}
              className={`w-full text-left px-2 py-1 rounded-md transition-colors cursor-pointer ${
                !localFilters.subcategoryId ? 'font-bold text-amber-900' : 'text-stone-500 hover:text-stone-800'
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
                    ? 'font-bold text-amber-900 bg-amber-50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                • {language === 'bn' ? sub.nameBn : sub.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Color RAM Spectrum Slider */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-800" />
            <span>{language === 'bn' ? 'কালার স্পেকট্রাম নির্বাচন' : 'Color Spectrum'}</span>
          </label>
          {localFilters.colorFamily && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 text-xs capitalize flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-stone-300"
                  style={{
                    backgroundColor:
                      standardColorFamilies.find((c) => c.id === localFilters.colorFamily)?.hex || '#DC2626'
                  }}
                />
                <span>
                  {standardColorFamilies.find((c) => c.id === localFilters.colorFamily)?.[
                    language === 'bn' ? 'nameBn' : 'nameEn'
                  ] || localFilters.colorFamily}
                </span>
              </span>
              <button
                onClick={() => updateLocal({ colorFamily: '', targetColorHex: undefined })}
                className="text-[10px] text-stone-400 hover:text-amber-900 font-semibold cursor-pointer"
              >
                {language === 'bn' ? 'রিমুভ' : 'Clear'}
              </button>
            </div>
          )}
        </div>

        {/* Chromatic Spectrum Bar & Visual Color Swatches Palette (Requirement 5) */}
        <div className="space-y-2.5">
          <div
            className="relative h-3.5 w-full rounded-full overflow-hidden shadow-inner cursor-pointer"
            style={{
              background:
                'linear-gradient(to right, #ff0000 0%, #ff7f00 15%, #ffff00 30%, #00ff00 45%, #00ffff 60%, #0000ff 75%, #8b00ff 90%, #ff0000 100%)'
            }}
          >
            <input
              type="range"
              min="0"
              max="360"
              value={selectedHue}
              onChange={handleHueSliderChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          {/* Visual Color Swatches Ramp / Grid with Accessible Labels */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {standardColorFamilies.map((col) => {
              const isSelected = localFilters.colorFamily === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      updateLocal({ colorFamily: '', targetColorHex: undefined });
                    } else {
                      updateLocal({ colorFamily: col.id, targetColorHex: col.hex });
                    }
                  }}
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-800 text-amber-950 font-bold ring-1 ring-amber-800'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                  title={col.nameEn}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-stone-300 flex items-center justify-center shadow-2xs"
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white drop-shadow-sm" />}
                  </span>
                  <span className="truncate">{language === 'bn' ? col.nameBn.split(' ')[0] : col.nameEn.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Age Range Slider (Requirement 6: Slider Ram/Radium for Age) */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
            {language === 'bn' ? 'বয়স অনুযায়ী শাড়ি নির্বাচন' : 'Age Range Selector'}
          </label>
          <span className="text-xs font-bold text-amber-900 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            {currentAge} {language === 'bn' ? 'বছর' : 'Years'}
          </span>
        </div>

        <input
          type="range"
          min="18"
          max="70"
          value={currentAge}
          onChange={handleAgeChange}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
        />

        <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200/70 text-[11px] text-stone-600 leading-snug">
          <span className="font-bold text-stone-900 block mb-0.5">
            {currentAge < 25
              ? language === 'bn'
                ? '১৮-২৪ বছর: তরুণীদের হালকা ফিউশন ও আধুনিক বুনন'
                : '18-24: Youth fusion & lightweight modern elegance'
              : currentAge < 35
              ? language === 'bn'
                ? '২৫-৩৪ বছর: জমকালো বিয়ে, রিসেপশন ও ঐতিহ্যবাহী কনে শাড়ি'
                : '25-34: Bridal, festive receptions & opulent zari'
              : currentAge < 50
              ? language === 'bn'
                ? '৩৫-৪৯ বছর: আভিজাত্যপূর্ণ রেশম, ঢাকাই মসলিন ও ফর্মাল উৎসব'
                : '35-49: Regal mulberry silk & formal heritage drape'
              : language === 'bn'
              ? '৫০+ বছর: অত্যন্ত আরামদায়ক টাঙ্গাইল সুতি ও ক্লাসিক নকশা'
              : '50+: Soft combed cotton & pure handloom comfort'}
          </span>
        </div>
      </div>

      {/* 5. Saree Type Filter */}
      <div className="space-y-2 pt-3 border-t border-stone-100">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
          {t.sareeType}
        </label>
        <div className="space-y-1.5 text-xs">
          <button
            onClick={() => updateLocal({ sareeType: '' })}
            className={`w-full text-left px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              !localFilters.sareeType ? 'font-bold text-amber-900 bg-amber-50' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            {language === 'bn' ? 'সকল শাড়ি' : 'All Saree Types'}
          </button>
          {sareeTypes.map((type) => (
            <button
              key={type}
              onClick={() => updateLocal({ sareeType: type })}
              className={`w-full text-left px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                localFilters.sareeType === type
                  ? 'font-bold text-amber-900 bg-amber-50'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Price Range Dual Slider with Exact Min & Max (Requirement 5) */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            {t.priceRange}
          </label>
          <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            ৳{localFilters.minPrice.toLocaleString()} - ৳{localFilters.maxPrice.toLocaleString()}
          </span>
        </div>

        {/* Quick Price Preset Chips */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'All', min: 0, max: 60000 },
            { label: '< ৳5K', min: 0, max: 5000 },
            { label: '৳5K-15K', min: 5000, max: 15000 },
            { label: '৳15K-30K', min: 15000, max: 30000 },
            { label: '৳30K+', min: 30000, max: 60000 }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => updateLocal({ minPrice: preset.min, maxPrice: preset.max })}
              className={`px-2 py-1 rounded-md text-[10px] font-mono font-medium transition-colors cursor-pointer border ${
                localFilters.minPrice === preset.min && localFilters.maxPrice === preset.max
                  ? 'bg-amber-900 text-white border-amber-900'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Dual Range Controls */}
        <div className="space-y-2 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>Min: ৳{localFilters.minPrice.toLocaleString()}</span>
              <span>Max: ৳{localFilters.maxPrice.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">Min (৳)</span>
                <input
                  type="number"
                  min="0"
                  max={localFilters.maxPrice - 500}
                  step="500"
                  value={localFilters.minPrice}
                  onChange={(e) => updateLocal({ minPrice: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg bg-stone-50 font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">Max (৳)</span>
                <input
                  type="number"
                  min={localFilters.minPrice + 500}
                  max="100000"
                  step="500"
                  value={localFilters.maxPrice}
                  onChange={(e) => updateLocal({ maxPrice: Math.min(100000, Number(e.target.value)) })}
                  className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg bg-stone-50 font-mono"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="60000"
              step="1000"
              value={localFilters.maxPrice}
              onChange={(e) => updateLocal({ maxPrice: Number(e.target.value) })}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900 mt-2"
            />
          </div>
        </div>
      </div>

      {/* 7. Availability Options (Requirement 5: In Stock, Out of Stock, On Sale) */}
      <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
          {language === 'bn' ? 'স্টক ও অফার প্রাপ্যতা' : 'Availability & Offers'}
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
          <input
            type="checkbox"
            checked={localFilters.onlyInStock}
            onChange={(e) => updateLocal({ onlyInStock: e.target.checked })}
            className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 cursor-pointer"
          />
          <span className="font-medium">{language === 'bn' ? 'স্টকে আছে (In Stock)' : 'In Stock Only'}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
          <input
            type="checkbox"
            checked={localFilters.onlyOnSale}
            onChange={(e) => updateLocal({ onlyOnSale: e.target.checked })}
            className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 cursor-pointer"
          />
          <span className="text-rose-700 font-semibold">{language === 'bn' ? 'ছাড় ও বিশেষ অফারে আছে (On Sale)' : 'On Sale & Special Offers'}</span>
        </label>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 border-t border-stone-200/90 flex items-center gap-2">
        <button
          type="button"
          onClick={handleApplyFilters}
          className={`flex-1 py-2.5 px-4 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
            isAppliedFeedback
              ? 'bg-emerald-700 text-white'
              : 'bg-stone-900 hover:bg-amber-900 text-white'
          }`}
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{isAppliedFeedback ? (language === 'bn' ? 'প্রয়োগ হয়েছে!' : 'Applied!') : (language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters')}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onResetFilters();
            setLocalFilters(filters);
          }}
          className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
          title={language === 'bn' ? 'রিসেট' : 'Reset'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'মুছুন' : 'Reset'}</span>
        </button>
      </div>
    </div>
  );
};
