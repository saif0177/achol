import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Flame
} from 'lucide-react';
import { CartItem, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  appliedDiscount: number;
  appliedCodeName: string;
  onApplyCode: (codeStr: string, discount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedDiscount,
  appliedCodeName,
  onApplyCode
}) => {
  const t = translations[language];
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeDelivery = store.isOrderFreeDelivery(items, appliedCodeName, subtotal);
  const deliveryCharge = items.length > 0 ? (isFreeDelivery ? 0 : 70) : 0;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) return;

    const res = store.validateCoupon(couponInput, subtotal, items);
    if (res.valid) {
      onApplyCode(couponInput.trim().toUpperCase(), res.discount);
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCode('', 0);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-900" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              {t.yourCart} ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                {t.emptyCart}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                {t.emptyCartDesc}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 p-3.5 bg-white rounded-xl border border-stone-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
              >
                <img
                  src={item.image}
                  alt={item.nameEn}
                  className="w-18 h-24 object-cover rounded-lg bg-stone-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-amber-900 font-bold">
                        #{item.code}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.productId, item.variantId)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </h4>

                    {item.flashSaleTitle && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
                        <span>{item.flashSaleTitle}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{language === 'bn' ? item.colorNameBn : item.colorNameEn}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 text-xs">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-mono font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <span className="font-serif text-sm font-bold text-stone-900 font-mono">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200 space-y-4">
            
            {/* Private Code / Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-900" />
                <span>{t.havePrivateCode}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. VIP75 or JM108SPECIAL"
                  className="flex-1 px-3 py-1.5 uppercase font-mono text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors"
                >
                  {t.applyCode}
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{couponSuccess}</span>
                </p>
              )}
            </form>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono font-medium text-stone-900">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <span>{language === 'bn' ? 'কুপন ছাড়' : 'Coupon Discount'} ({appliedCodeName})</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-rose-600 text-[10px] underline ml-1 cursor-pointer"
                    >
                      {language === 'bn' ? 'মুছুন' : 'Remove'}
                    </button>
                  </div>
                  <span className="font-mono font-bold">-৳{appliedDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.deliveryCharge}</span>
                <span className="font-mono font-medium text-stone-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">
                      FREE
                    </span>
                  ) : (
                    `৳${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-2 font-serif">
                <span>{t.totalPayable}</span>
                <span className="font-mono text-lg text-amber-950">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 bg-amber-900 hover:bg-amber-800 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-900" />
              <span>Cash on Delivery (Pay after receiving saree)</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
