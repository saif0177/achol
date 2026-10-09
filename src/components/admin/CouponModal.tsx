import React, { useState } from 'react';
import { X, Tag, Plus, Check, Calendar, Users, DollarSign, Clock, Truck, Save, ShieldCheck } from 'lucide-react';
import { Coupon } from '../../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponToEdit?: Coupon | null;
  onSave: (coupon: Coupon) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  couponToEdit,
  onSave
}) => {
  const [code, setCode] = useState(couponToEdit?.code || '');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(couponToEdit?.discountType || 'percentage');
  const [discountValue, setDiscountValue] = useState<number>(couponToEdit?.discountValue ?? 15);
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(couponToEdit?.isFreeDelivery ?? false);
  const [descriptionEn, setDescriptionEn] = useState(couponToEdit?.descriptionEn || '');
  const [descriptionBn, setDescriptionBn] = useState(couponToEdit?.descriptionBn || '');
  const [isActive, setIsActive] = useState<boolean>(couponToEdit?.isActive ?? true);

  // Optional Conditions (Requirement 4)
  const [enableDuration, setEnableDuration] = useState<boolean>(!!couponToEdit?.startDate || !!couponToEdit?.endDate);
  const [startDate, setStartDate] = useState<string>(
    couponToEdit?.startDate ? couponToEdit.startDate.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    couponToEdit?.endDate
      ? couponToEdit.endDate.split('T')[0]
      : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );

  const [enableUsageLimit, setEnableUsageLimit] = useState<boolean>(!!couponToEdit?.maxUsageLimit);
  const [maxUsageLimit, setMaxUsageLimit] = useState<number>(couponToEdit?.maxUsageLimit ?? 200);

  const [enableMinAmount, setEnableMinAmount] = useState<boolean>(!!couponToEdit?.minOrderAmount);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(couponToEdit?.minOrderAmount ?? 2500);

  const [enableMaxDiscount, setEnableMaxDiscount] = useState<boolean>(!!couponToEdit?.maxDiscountAmount);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(couponToEdit?.maxDiscountAmount ?? 1000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Please enter a coupon code.');
      return;
    }

    const newCoupon: Coupon = {
      id: couponToEdit ? couponToEdit.id : `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue) || 0,
      isFreeDelivery,
      descriptionEn: descriptionEn.trim(),
      descriptionBn: descriptionBn.trim() || descriptionEn.trim(),
      isActive,
      startDate: enableDuration ? new Date(startDate).toISOString() : undefined,
      endDate: enableDuration ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
      maxUsageLimit: enableUsageLimit ? Number(maxUsageLimit) : undefined,
      usageCount: couponToEdit?.usageCount || 0,
      minOrderAmount: enableMinAmount ? Number(minOrderAmount) : undefined,
      maxDiscountAmount: enableMaxDiscount ? Number(maxDiscountAmount) : undefined
    };

    onSave(newCoupon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-900 dark:text-amber-200">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                {couponToEdit ? 'Edit Coupon & Conditions' : 'Create New Coupon Voucher'}
              </h2>
              <p className="text-[11px] text-stone-500">
                Configure discount rates and optional usage/amount conditions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs flex-1">
          {/* Coupon Code & Discount Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE20, WELCOME500"
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono font-bold text-amber-950 dark:text-amber-200 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Amount Discount (৳)</option>
              </select>
            </div>
          </div>

          {/* Discount Value & Free Delivery Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Discount Amount {discountType === 'percentage' ? '(%)' : '(৳)'} *
              </label>
              <input
                type="number"
                min="0"
                max={discountType === 'percentage' ? 100 : 50000}
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono font-bold text-sm"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFreeDelivery}
                  onChange={(e) => setIsFreeDelivery(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Includes Free Delivery
                </span>
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Description / Offer Note (English)
              </label>
              <input
                type="text"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="e.g. 15% discount on all Dhakai Jamdani sarees"
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                বিবরণ (বাংলা)
              </label>
              <input
                type="text"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="যেমন: সকল জামদানি শাড়িতে ১৫% ছাড়"
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>
          </div>

          {/* SECTION: OPTIONAL CONDITIONS (Requirement 4) */}
          <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                Optional Limits & Conditions (শর্তাবলী ও মেয়াদ)
              </span>
              <p className="text-[11px] text-stone-500">
                All conditions below are completely optional. Enable only the ones you need.
              </p>
            </div>

            {/* Condition 1: Duration */}
            <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  1. Set Validity Duration (Start Date & End Date)
                </span>
                <input
                  type="checkbox"
                  checked={enableDuration}
                  onChange={(e) => setEnableDuration(e.target.checked)}
                  className="rounded text-amber-700"
                />
              </label>
              {enableDuration && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-1.5 rounded border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-1.5 rounded border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Condition 2: Max Usage Limit */}
            <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  2. Maximum Usage / Quantity Limit (e.g. 200 or 4,000 people)
                </span>
                <input
                  type="checkbox"
                  checked={enableUsageLimit}
                  onChange={(e) => setEnableUsageLimit(e.target.checked)}
                  className="rounded text-amber-700"
                />
              </label>
              {enableUsageLimit && (
                <div className="pt-1">
                  <input
                    type="number"
                    min="1"
                    value={maxUsageLimit}
                    onChange={(e) => setMaxUsageLimit(Number(e.target.value))}
                    placeholder="e.g. 200 or 4000"
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Coupon expires once this number of customers have redeemed it.
                  </span>
                </div>
              )}
            </div>

            {/* Condition 3: Minimum Order Amount */}
            <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                  3. Minimum Order Amount (৳)
                </span>
                <input
                  type="checkbox"
                  checked={enableMinAmount}
                  onChange={(e) => setEnableMinAmount(e.target.checked)}
                  className="rounded text-amber-700"
                />
              </label>
              {enableMinAmount && (
                <div className="pt-1">
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    placeholder="e.g. 2500"
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Requires cart subtotal to reach this threshold to apply.
                  </span>
                </div>
              )}
            </div>

            {/* Condition 4: Maximum Discount Amount (Cap) */}
            <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                  4. Maximum Discount Cap (৳)
                </span>
                <input
                  type="checkbox"
                  checked={enableMaxDiscount}
                  onChange={(e) => setEnableMaxDiscount(e.target.checked)}
                  className="rounded text-amber-700"
                />
              </label>
              {enableMaxDiscount && (
                <div className="pt-1">
                  <input
                    type="number"
                    min="0"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                    placeholder="e.g. 1000"
                    className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Maximum savings a customer can receive from this percentage discount.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 dark:border-stone-700">
            <div>
              <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                Coupon Status
              </span>
              <span className="text-[11px] text-stone-400">
                {isActive ? 'Active for checkout & promotions' : 'Disabled (Paused)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
              }`}
            >
              {isActive ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{couponToEdit ? 'Save Changes' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
