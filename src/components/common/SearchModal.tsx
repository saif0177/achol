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
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aanchol_recent_searches');
      return saved ? JSON.parse(saved) : ['Jamdani', 'Muslin', 'JM-108'];
    } catch {
      return ['Jamdani', 'Muslin', 'JM-108'];
    }
  });

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

  const handleSubmit = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('aanchol_recent_searches', JSON.stringify(updated));
    } catch {}
    onViewAllResults(trimmed);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-2 sm:pt-20 p-2 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl z-10 overflow-hidden border border-stone-200 dark:border-stone-800">
        
        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(query);
          }}
          className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-stone-200 dark:border-stone-800"
        >
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              {t.clearSearch}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Suggested Searches & Results */}
        <div className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Quick suggestions & Recent Searches when query is empty */}
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400">
                    <span>{language === 'bn' ? 'সাম্প্রতিক সার্চ' : 'Recent Searches'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSearches([]);
                        try {
                          localStorage.removeItem('aanchol_recent_searches');
                        } catch {}
                      }}
                      className="text-[10px] text-stone-400 hover:text-rose-600 cursor-pointer font-normal normal-case"
                    >
                      {language === 'bn' ? 'মুছে ফেলুন' : 'Clear all'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuery(item);
                          handleSubmit(item);
                        }}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                  {t.searchSuggested}
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const val = language === 'bn' ? item.bn : item.en;
                        setQuery(val);
                        handleSubmit(val);
                      }}
                      className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      {language === 'bn' ? item.bn : item.en}
                    </button>
                  ))}
                </div>
              </div>
            </>
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
                    type="button"
                    onClick={() => handleSubmit(query)}
                    className="font-semibold text-amber-900 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'bn' ? 'সব ফলাফল দেখুন' : 'View all in catalog'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="font-serif text-sm font-bold text-stone-800 dark:text-stone-200">
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
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
                  >
                    <img
                      src={product.primaryImage}
                      alt={product.nameEn}
                      className="w-12 h-16 object-cover rounded-lg bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 overflow-hidden">
                      <span className="font-mono text-[10px] text-amber-900 dark:text-amber-400 font-semibold block">
                        #{product.code} · {product.sareeType}
                      </span>
                      <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {language === 'bn' ? product.nameBn : product.nameEn}
                      </h4>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {product.fabric}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs font-mono shrink-0">
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
