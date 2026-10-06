import React, { useState } from 'react';
import { FilterState, Category, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  RotateCcw,
  X,
  Sliders,
  Palette,
  Layers
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

  const [selectedHue, setSelectedHue] = useState<number>(0);
  const [currentAge, setCurrentAge] = useState<number>(
    filters.ageRange === '18-25'
      ? 22
      : filters.ageRange === '25-35'
      ? 28
      : filters.ageRange === '35-50'
      ? 42
      : filters.ageRange === '50+'
      ? 55
      : 30
  );

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
    onFilterChange({
      ...filters,
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

    onFilterChange({
      ...filters,
      ageRange: mappedRange,
      minAge: age
    });
  };

  // Get active category for subcategories
  const selectedCategory = categories.find((c) => c.id === filters.categoryId);

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
            onClick={onResetFilters}
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
            onClick={() => onFilterChange({ ...filters, categoryId: '', subcategoryId: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
              !filters.categoryId
                ? 'bg-amber-900/10 text-amber-900 font-bold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span>{t.allCategories}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, categoryId: cat.id, subcategoryId: undefined })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                filters.categoryId === cat.id
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
              onClick={() => onFilterChange({ ...filters, subcategoryId: undefined })}
              className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                !filters.subcategoryId ? 'font-bold text-amber-900' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              • {language === 'bn' ? 'সব সাব-ক্যাটাগরি' : 'All Sub-categories'}
            </button>
            {selectedCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onFilterChange({ ...filters, subcategoryId: sub.id })}
                className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                  filters.subcategoryId === sub.id
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
          {filters.colorFamily && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 text-xs capitalize flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-stone-300"
                  style={{
                    backgroundColor:
                      standardColorFamilies.find((c) => c.id === filters.colorFamily)?.hex || '#DC2626'
                  }}
                />
                <span>
                  {standardColorFamilies.find((c) => c.id === filters.colorFamily)?.[
                    language === 'bn' ? 'nameBn' : 'nameEn'
                  ] || filters.colorFamily}
                </span>
              </span>
              <button
                onClick={() => onFilterChange({ ...filters, colorFamily: '', targetColorHex: undefined })}
                className="text-[10px] text-stone-400 hover:text-amber-900 font-semibold cursor-pointer"
              >
                {language === 'bn' ? 'রিমুভ' : 'Clear'}
              </button>
            </div>
          )}
        </div>

        {/* Chromatic Spectrum Bar */}
        <div className="space-y-1.5">
          <div className="relative h-4 w-full rounded-full overflow-hidden shadow-inner cursor-pointer"
               style={{
                 background:
                   'linear-gradient(to right, #ff0000 0%, #ff7f00 15%, #ffff00 30%, #00ff00 45%, #00ffff 60%, #0000ff 75%, #8b00ff 90%, #ff0000 100%)'
               }}>
            <input
              type="range"
              min="0"
              max="360"
              value={selectedHue}
              onChange={handleHueSliderChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-400">
            <span>Red</span>
            <span>Yellow</span>
            <span>Green</span>
            <span>Blue</span>
            <span>Violet</span>
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
            onClick={() => onFilterChange({ ...filters, sareeType: '' })}
            className={`w-full text-left px-2.5 py-1 rounded-lg transition-colors ${
              !filters.sareeType ? 'font-bold text-amber-900 bg-amber-50' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            {language === 'bn' ? 'সকল শাড়ি' : 'All Saree Types'}
          </button>
          {sareeTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange({ ...filters, sareeType: type })}
              className={`w-full text-left px-2.5 py-1 rounded-lg transition-colors ${
                filters.sareeType === type
                  ? 'font-bold text-amber-900 bg-amber-50'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Price Range Dual Slider */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            {t.priceRange}
          </label>
          <span className="font-mono text-xs font-bold text-amber-900">
            ৳{filters.minPrice.toLocaleString()} - ৳{filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="2000"
            max="50000"
            step="1000"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
          />
        </div>
      </div>

      {/* 7. Quick Checkboxes */}
      <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-stone-700">
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={(e) => onFilterChange({ ...filters, onlyInStock: e.target.checked })}
            className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 cursor-pointer"
          />
          <span>{t.inStockOnly}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-stone-700">
          <input
            type="checkbox"
            checked={filters.onlyOnSale}
            onChange={(e) => onFilterChange({ ...filters, onlyOnSale: e.target.checked })}
            className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 cursor-pointer"
          />
          <span className="text-rose-700 font-semibold">{t.onSaleOnly}</span>
        </label>
      </div>
    </div>
  );
};
