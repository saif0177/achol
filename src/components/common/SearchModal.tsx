import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Product, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectProduct: (product: Product) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectProduct,
  onViewAllResults
}) => {
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const suggestedQueries = [
    { en: 'Dhakai Jamdani', bn: 'ঢাকাই জামদানি' },
    { en: 'Dhakai Muslin', bn: 'ঢাকাই মসলিন' },
    { en: 'Tangail Taat', bn: 'টাঙ্গাইল তাঁত' },
    { en: 'JM-108', bn: 'JM-108' },
    { en: 'Crimson Red Saree', bn: 'লাল শাড়ি' },
    { en: 'Bridal Katan', bn: 'বিয়ের কাতান' }
  ];

  useEffect(() => {
    if (query.trim()) {
      const searchRes = store.searchProducts(query);
      setResults(searchRes);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden border border-stone-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder-stone-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              {t.clearSearch}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Searches & Results */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          
          {/* Quick suggestions when query is empty */}
          {!query.trim() && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                {t.searchSuggested}
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(language === 'bn' ? item.bn : item.en)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {language === 'bn' ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results list */}
          {query.trim() && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>
                  {t.showingProducts.replace('{count}', String(results.length))}
                </span>
                {results.length > 0 && (
                  <button
                    onClick={() => {
                      onViewAllResults(query);
                      onClose();
                    }}
                    className="font-semibold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    <span>View all in catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="font-serif text-sm font-bold text-stone-800">
                    {t.searchEmptyTitle}
                  </p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {t.searchEmptyDesc}
                  </p>
                </div>
              ) : (
                results.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border border-transparent hover:border-stone-200"
                  >
                    <img
                      src={product.primaryImage}
                      alt={product.nameEn}
                      className="w-12 h-16 object-cover rounded-lg bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 overflow-hidden">
                      <span className="font-mono text-[10px] text-amber-900 font-semibold block">
                        #{product.code} · {product.sareeType}
                      </span>
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {language === 'bn' ? product.nameBn : product.nameEn}
                      </h4>
                      <span className="text-[11px] text-stone-500 line-clamp-1">
                        {product.fabric}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-stone-900 text-xs font-mono shrink-0">
                      ৳{product.price.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
