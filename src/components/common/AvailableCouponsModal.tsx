import React, { useState } from 'react';
import {
  X,
  Tag,
  Copy,
  Check,
  Sparkles,
  Truck,
  Percent,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Flame,
  Info
} from 'lucide-react';
import { Coupon, Language } from '../../types';
import { store } from '../../services/store';

interface AvailableCouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplyCoupon?: (code: string) => void;
}

export const AvailableCouponsModal: React.FC<AvailableCouponsModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplyCoupon
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const coupons: Coupon[] = store.getCoupons();

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  const handleApply = (code: string) => {
    handleCopy(code);
    setAppliedCode(code);
    if (onApplyCoupon) {
      onApplyCoupon(code);
    }
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const filteredCoupons = coupons.filter((c) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      c.code.toLowerCase().includes(query) ||
      (c.descriptionEn && c.descriptionEn.toLowerCase().includes(query)) ||
      (c.descriptionBn && c.descriptionBn.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-900/20 dark:border-stone-800 z-10 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#210904] via-[#3d1308] to-[#1c0804] text-white border-b border-amber-900/40 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{language === 'bn' ? 'চলমান বিশেষ কুপন' : 'LIVE COUPONS'}</span>
            </span>
            <span className="text-xs text-amber-300 font-medium">
              {language === 'bn'
                ? `মোট ${coupons.length}টি অফার উপলব্ধ`
                : `${coupons.length} Vouchers Available`}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
            {language === 'bn' ? 'সকল উপলব্ধ কুপন ও ভাউচার' : 'All Available Coupons & Vouchers'}
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-lg">
            {language === 'bn'
              ? 'যেকোনো কুপন কোড ১-ক্লিকে কপি করুন অথবা সরাসরি আপনার শপিং কার্টে প্রয়োগ করুন।'
              : 'Copy any coupon voucher with 1 click or apply directly to your cart at checkout.'}
          </p>

          {/* Quick Search */}
          {coupons.length > 3 && (
            <div className="mt-3">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={language === 'bn' ? 'কুপন কোড খুঁজুন...' : 'Search coupon code...'}
                className="w-full px-3.5 py-2 bg-stone-900/80 border border-white/20 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>

        {/* Coupons List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Tag className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                {language === 'bn'
                  ? 'এই মুহূর্তে কোনো সক্রিয় কুপন পাওয়া যায়নি।'
                  : 'No active coupons found at the moment.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold"
              >
                {language === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
              </button>
            </div>
          ) : (
            filteredCoupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              const isApplied = appliedCode === coupon.code;

              return (
                <div
                  key={coupon.id}
                  className="relative rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/60 via-stone-50 to-amber-50/40 dark:from-stone-850 dark:via-stone-900 dark:to-stone-850 p-4 sm:p-5 transition-all hover:shadow-md space-y-3"
                >
                  {/* Top Row: Code + Copy / Apply Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left: Code badge & value */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-200 flex flex-col items-center justify-center shrink-0 shadow-sm border border-amber-700/50">
                        {coupon.discountType === 'percentage' ? (
                          <>
                            <span className="font-black text-sm leading-none font-mono">{coupon.discountValue}%</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-300">OFF</span>
                          </>
                        ) : (
                          <>
                            <span className="font-black text-xs leading-none font-mono">৳{coupon.discountValue}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-300">OFF</span>
                          </>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base sm:text-lg font-black text-stone-950 dark:text-white tracking-wider bg-white dark:bg-stone-800 px-3 py-0.5 rounded-lg border border-amber-200 dark:border-stone-700 select-all">
                            {coupon.code}
                          </span>
                          {coupon.isFreeDelivery && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                              <Truck className="w-3 h-3" />
                              <span>{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Ship'}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">
                          {language === 'bn'
                            ? coupon.descriptionBn || coupon.descriptionEn || `${coupon.discountValue}% বিশেষ ছাড়`
                            : coupon.descriptionEn || coupon.descriptionBn || `${coupon.discountValue}% special discount`}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isCopied
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                        }`}
                        title="Copy Code"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>{language === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                            <span>{language === 'bn' ? 'কোড কপি' : 'Copy'}</span>
                          </>
                        )}
                      </button>

                      {onApplyCoupon && (
                        <button
                          onClick={() => handleApply(coupon.code)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                            isApplied
                              ? 'bg-emerald-700 text-white'
                              : 'bg-amber-900 hover:bg-amber-800 text-white'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'প্রয়োগ হয়েছে!' : 'Applied!'}</span>
                            </>
                          ) : (
                            <>
                              <span>{language === 'bn' ? 'কার্টে ব্যবহার করুন' : 'Apply Now'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conditions & Eligibility Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
                    {coupon.minOrderAmount ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-medium">
                        {language === 'bn'
                          ? `সর্বনিম্ন অর্ডার: ৳${coupon.minOrderAmount.toLocaleString()}`
                          : `Min Order: ৳${coupon.minOrderAmount.toLocaleString()}`}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-medium">
                        {language === 'bn' ? 'কোনো সর্বনিম্ন সীমা নেই' : 'No Minimum Order'}
                      </span>
                    )}

                    {coupon.maxDiscountAmount && (
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-medium">
                        {language === 'bn'
                          ? `সর্বোচ্চ ছাড়: ৳${coupon.maxDiscountAmount.toLocaleString()}`
                          : `Max Cap: ৳${coupon.maxDiscountAmount.toLocaleString()}`}
                      </span>
                    )}

                    {coupon.endDate && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-700" />
                        <span>
                          {language === 'bn'
                            ? `মেয়াদ: ${new Date(coupon.endDate).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })} পর্যন্ত`
                            : `Valid till: ${new Date(coupon.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`}
                        </span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 text-emerald-700 dark:text-emerald-400 font-bold ml-auto">
                      ✓ {language === 'bn' ? 'সরাসরি ক্যাশ অন ডেলিভারিতে কার্যকর' : 'COD Applicable'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600 dark:text-stone-300 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? 'চেকআউট পেজে কুপন কোড লিখে বা পেস্ট করে ছাড় উপভোগ করুন।'
                : 'Enter or paste coupon code during checkout for instant discount.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 dark:bg-stone-700 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer self-end sm:self-auto"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
