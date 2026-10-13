import React, { useState, useMemo } from 'react';
import {
  X,
  Tag,
  Check,
  Calendar,
  DollarSign,
  Clock,
  Truck,
  Save,
  Trash2,
  Layers,
  Gift,
  FolderPlus,
  Package,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { Coupon, CouponApplicableType, Category, Promotion, HiddenPromotionalCategory, Product, Subcategory } from '../../types';
import { store } from '../../services/store';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponToEdit?: Coupon | null;
  categories?: Category[];
  promotions?: Promotion[];
  hiddenCategories?: HiddenPromotionalCategory[];
  products?: Product[];
  onSave: (coupon: Coupon) => void;
  onDelete?: (id: string) => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  couponToEdit,
  categories: propCategories,
  promotions: propPromos,
  hiddenCategories: propHidden,
  products: propProducts,
  onSave,
  onDelete
}) => {
  // Dynamic data from admin database with real-time updates
  const categories = useMemo(() => propCategories || store.getAllCategoriesAdmin(), [propCategories, isOpen]);
  const promotions = useMemo(() => propPromos || store.getAllPromotionsAdmin(), [propPromos, isOpen]);
  const hiddenCategories = useMemo(() => propHidden || store.getHiddenPromotionalCategories(), [propHidden, isOpen]);
  const products = useMemo(() => propProducts || store.getAllProductsAdmin(), [propProducts, isOpen]);

  // Basic coupon fields
  const [code, setCode] = useState(couponToEdit?.code || '');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(couponToEdit?.discountType || 'percentage');
  const [discountValue, setDiscountValue] = useState<number>(couponToEdit?.discountValue ?? 15);
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(couponToEdit?.isFreeDelivery ?? false);
  const [descriptionEn, setDescriptionEn] = useState(couponToEdit?.descriptionEn || '');
  const [descriptionBn, setDescriptionBn] = useState(couponToEdit?.descriptionBn || '');
  const [isActive, setIsActive] = useState<boolean>(couponToEdit?.isActive ?? true);

  // Requirement 3: Applicable To options
  const [applicableTo, setApplicableTo] = useState<CouponApplicableType>(couponToEdit?.applicableTo || 'all');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(couponToEdit?.applicableCategoryIds || []);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>(couponToEdit?.applicableSubcategoryIds || []);
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>(couponToEdit?.applicableOfferIds || []);
  const [selectedHiddenCategoryIds, setSelectedHiddenCategoryIds] = useState<string[]>(couponToEdit?.applicableHiddenCategoryIds || []);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(couponToEdit?.applicableProductIds || []);
  const [productSearch, setProductSearch] = useState('');

  // Collect all available subcategories across categories
  const allSubcategories = useMemo(() => {
    return categories.flatMap((cat) =>
      (cat.subcategories || []).map((sub: Subcategory) => ({
        ...sub,
        parentCategoryName: cat.nameEn,
        parentCategoryId: cat.id
      }))
    );
  }, [categories]);

  // Optional Conditions (Duration, Usage Limits, Thresholds)
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

  // Requirement 1: Deletion confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Helper calculation: live eligible products count matching the selected criteria
  const eligibleProductsCount = useMemo(() => {
    if (applicableTo === 'all') {
      return products.length;
    }
    const tempCoupon: Coupon = {
      id: 'temp',
      code: 'TEMP',
      discountType,
      discountValue,
      isActive: true,
      applicableTo,
      applicableCategoryIds: selectedCategoryIds,
      applicableSubcategoryIds: selectedSubcategoryIds,
      applicableOfferIds: selectedOfferIds,
      applicableHiddenCategoryIds: selectedHiddenCategoryIds,
      applicableProductIds: selectedProductIds
    };
    return products.filter((p) => store.isProductEligibleForCoupon(p.id, tempCoupon)).length;
  }, [applicableTo, selectedCategoryIds, selectedSubcategoryIds, selectedOfferIds, selectedHiddenCategoryIds, selectedProductIds, discountType, discountValue, products]);

  if (!isOpen) return null;

  // Toggle selection helpers
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSubcategory = (id: string) => {
    setSelectedSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleOffer = (id: string) => {
    setSelectedOfferIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleHiddenCategory = (id: string) => {
    setSelectedHiddenCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Please enter a coupon code.');
      return;
    }

    // Validation for applicable scope
    if (applicableTo === 'specific_categories' && selectedCategoryIds.length === 0) {
      alert('Please select at least one category.');
      return;
    }
    if (applicableTo === 'specific_subcategories' && selectedSubcategoryIds.length === 0) {
      alert('Please select at least one subcategory.');
      return;
    }
    if (applicableTo === 'specific_offers' && selectedOfferIds.length === 0) {
      alert('Please select at least one promotional offer.');
      return;
    }
    if (applicableTo === 'specific_hidden_categories' && selectedHiddenCategoryIds.length === 0) {
      alert('Please select at least one hidden promotional category.');
      return;
    }
    if (applicableTo === 'specific_products' && selectedProductIds.length === 0) {
      alert('Please select at least one saree product.');
      return;
    }
    if (
      applicableTo === 'multiple_custom' &&
      selectedCategoryIds.length === 0 &&
      selectedSubcategoryIds.length === 0 &&
      selectedOfferIds.length === 0 &&
      selectedHiddenCategoryIds.length === 0 &&
      selectedProductIds.length === 0
    ) {
      alert('Please select at least one eligible category, subcategory, offer, hidden category, or product.');
      return;
    }

    const newCoupon: Coupon = {
      id: couponToEdit ? couponToEdit.id : `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue) || 0,
      isFreeDelivery,
      descriptionEn: descriptionEn.trim() || `${code.toUpperCase()} discount coupon`,
      descriptionBn: descriptionBn.trim() || descriptionEn.trim() || `${code.toUpperCase()} কুপন ভাউচার`,
      isActive,
      startDate: enableDuration ? new Date(startDate).toISOString() : undefined,
      endDate: enableDuration ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
      maxUsageLimit: enableUsageLimit ? Number(maxUsageLimit) : undefined,
      usageCount: couponToEdit?.usageCount || 0,
      minOrderAmount: enableMinAmount ? Number(minOrderAmount) : undefined,
      maxDiscountAmount: enableMaxDiscount ? Number(maxDiscountAmount) : undefined,

      // Applicable To
      applicableTo,
      applicableCategoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      applicableSubcategoryIds: selectedSubcategoryIds.length > 0 ? selectedSubcategoryIds : undefined,
      applicableOfferIds: selectedOfferIds.length > 0 ? selectedOfferIds : undefined,
      applicableHiddenCategoryIds: selectedHiddenCategoryIds.length > 0 ? selectedHiddenCategoryIds : undefined,
      applicableProductIds: selectedProductIds.length > 0 ? selectedProductIds : undefined
    };

    onSave(newCoupon);
    onClose();
  };

  const handleConfirmDelete = () => {
    if (couponToEdit && onDelete) {
      onDelete(couponToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                {couponToEdit ? 'Edit Coupon & Conditions' : 'Create New Coupon Voucher'}
              </h2>
              <p className="text-[11px] text-stone-500">
                Configure discount rates, eligible products, and redemption conditions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Confirmation Banner (Requirement 1 & 4) */}
        {showDeleteConfirm && couponToEdit && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/70 border-b border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Permanently delete coupon <strong>{couponToEdit.code}</strong>? This cannot be undone.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs flex-1">

          {/* Section: Active Status & Controls (Requirement 4: inside Edit, activate/pause or save) */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Coupon Status
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isActive ? '● Active' : '○ Paused / Disabled'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {isActive
                  ? 'Coupon is currently active and can be redeemed during checkout.'
                  : 'Coupon is paused. Customers cannot use this code until reactivated.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                isActive
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isActive ? 'Pause Coupon' : 'Activate Coupon'}
            </button>
          </div>

          {/* Section: Basic Code & Discount Value */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-800" />
              <span>1. Coupon Code & Discount Value</span>
            </h3>

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
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono font-bold text-amber-950 dark:text-amber-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Discount Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percentage')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      discountType === 'percentage'
                        ? 'border-amber-900 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      discountType === 'fixed'
                        ? 'border-amber-900 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800'
                    }`}
                  >
                    Fixed Amount (৳)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  {discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Flat Discount Amount (৳) *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={discountType === 'percentage' ? 100 : 100000}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono font-bold text-stone-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                    {discountType === 'percentage' ? '%' : '৳'}
                  </span>
                </div>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={isFreeDelivery}
                    onChange={(e) => setIsFreeDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      Free Delivery Included
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">
                      Waives shipping charge when this coupon is applied
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description (English)
                </label>
                <input
                  type="text"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="e.g. 15% OFF on Eid Festive Handlooms"
                  className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description (বাংলা)
                </label>
                <input
                  type="text"
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="যেমন: ঈদ উৎসবে বিশেষ ১৫% ছাড়"
                  className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* ========================================================
              Requirement 5: APPLICABLE TO (Scope & Item Eligibility)
              ======================================================== */}
          <div className="space-y-3.5 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/15">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-800" />
                <span>2. Applicable To (Eligible Scope)</span>
              </h3>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px] font-bold">
                {eligibleProductsCount} / {products.length} Sarees Eligible
              </span>
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Select which items in the store this coupon applies to. Loaded live from admin catalog.
            </p>

            {/* Scope Selection Radios */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All Products', icon: Package, desc: 'Storewide' },
                { id: 'specific_categories', label: 'Categories', icon: Layers, desc: `${categories.length} available` },
                { id: 'specific_subcategories', label: 'Subcategories', icon: Layers, desc: `${allSubcategories.length} available` },
                { id: 'specific_offers', label: 'Specific Offers', icon: Gift, desc: `${promotions.length} available` },
                { id: 'specific_hidden_categories', label: 'Hidden Categories', icon: FolderPlus, desc: `${hiddenCategories.length} campaigns` },
                { id: 'specific_products', label: 'Specific Sarees', icon: Tag, desc: 'Direct pick' },
                { id: 'multiple_custom', label: 'Multiple Selections', icon: Sparkles, desc: 'Combined custom rule' }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = applicableTo === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setApplicableTo(opt.id as CouponApplicableType)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-900 bg-amber-100/70 text-amber-950 dark:bg-amber-900/50 dark:text-white dark:border-amber-600 font-bold shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                      <span className="text-xs truncate">{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block font-normal">{opt.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Options View based on Selected Applicable Scope */}

            {/* 1. Specific Categories Multi-select */}
            {(applicableTo === 'specific_categories' || applicableTo === 'multiple_custom') && (
              <div className="pt-2 border-t border-amber-200/70 dark:border-stone-700 space-y-2">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-800" />
                  Select Categories ({selectedCategoryIds.length} chosen):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.categoryId === cat.id).length;
                    const isChecked = selectedCategoryIds.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                          isChecked
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white font-semibold'
                            : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.id)}
                            className="rounded text-amber-800 focus:ring-amber-500"
                          />
                          <span>{cat.nameEn} ({cat.nameBn})</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">{count} sarees</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1b. Specific Subcategories Multi-select */}
            {(applicableTo === 'specific_subcategories' || applicableTo === 'multiple_custom') && (
              <div className="pt-2 border-t border-amber-200/70 dark:border-stone-700 space-y-2">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-800" />
                  Select Subcategories ({selectedSubcategoryIds.length} chosen):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  {allSubcategories.map((sub) => {
                    const count = products.filter(
                      (p) => p.subcategoryId === sub.id || (p.subcategoryIds && p.subcategoryIds.includes(sub.id))
                    ).length;
                    const isChecked = selectedSubcategoryIds.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                          isChecked
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white font-semibold'
                            : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSubcategory(sub.id)}
                            className="rounded text-amber-800 focus:ring-amber-500"
                          />
                          <div className="flex flex-col">
                            <span>{sub.nameEn} ({sub.nameBn})</span>
                            <span className="text-[10px] text-stone-400">Category: {sub.parentCategoryName}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">{count} sarees</span>
                      </label>
                    );
                  })}
                  {allSubcategories.length === 0 && (
                    <p className="text-stone-400 text-xs italic p-2 col-span-2">No subcategories created yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 2. Specific Offers Multi-select */}
            {(applicableTo === 'specific_offers' || applicableTo === 'multiple_custom') && (
              <div className="pt-2 border-t border-amber-200/70 dark:border-stone-700 space-y-2">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-800" />
                  Select Promotional Offers ({selectedOfferIds.length} chosen):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  {promotions.map((pr) => {
                    const isChecked = selectedOfferIds.includes(pr.id);
                    return (
                      <label
                        key={pr.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                          isChecked
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white font-semibold'
                            : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOffer(pr.id)}
                            className="rounded text-amber-800 focus:ring-amber-500"
                          />
                          <span className="truncate">{pr.titleEn}</span>
                        </div>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold shrink-0">
                          {pr.type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Hidden Promotional Categories Multi-select */}
            {(applicableTo === 'specific_hidden_categories' || applicableTo === 'multiple_custom') && (
              <div className="pt-2 border-t border-amber-200/70 dark:border-stone-700 space-y-2">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <FolderPlus className="w-3.5 h-3.5 text-amber-800" />
                  Select Hidden Categories ({selectedHiddenCategoryIds.length} chosen):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  {hiddenCategories.map((hc) => {
                    const isChecked = selectedHiddenCategoryIds.includes(hc.id);
                    const count = store.getProductsByPromotionalCategory(hc.id).length;
                    return (
                      <label
                        key={hc.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                          isChecked
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white font-semibold'
                            : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleHiddenCategory(hc.id)}
                            className="rounded text-amber-800 focus:ring-amber-500"
                          />
                          <span>{hc.nameEn} ({hc.nameBn})</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">{count} sarees</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Specific Products Picker */}
            {(applicableTo === 'specific_products' || applicableTo === 'multiple_custom') && (
              <div className="pt-2 border-t border-amber-200/70 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-800" />
                    Select Specific Sarees ({selectedProductIds.length} chosen):
                  </span>
                  <input
                    type="text"
                    placeholder="Search sarees..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="p-1 px-2 text-[11px] bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  {products
                    .filter((p) =>
                      !productSearch ||
                      p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.code.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((prod) => {
                      const isChecked = selectedProductIds.includes(prod.id);
                      return (
                        <label
                          key={prod.id}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                            isChecked
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-stone-900 dark:text-white font-semibold'
                              : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProduct(prod.id)}
                              className="rounded text-amber-800 focus:ring-amber-500 shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-mono font-bold text-amber-900 dark:text-amber-400 mr-1.5">{prod.code}</span>
                              <span className="truncate">{prod.nameEn}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-stone-500 shrink-0 ml-1">৳{prod.price.toLocaleString()}</span>
                        </label>
                      );
                    })}
                </div>
              </div>
            )}
          </div>


          {/* Section: Optional Conditions (Duration, Usage Limits, Thresholds) */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>3. Optional Conditions &amp; Limits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Duration */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-800" />
                    Campaign Duration Dates
                  </span>
                  <input
                    type="checkbox"
                    checked={enableDuration}
                    onChange={(e) => setEnableDuration(e.target.checked)}
                    className="rounded text-amber-800"
                  />
                </label>
                {enableDuration && (
                  <div className="pt-1 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">Start Date</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">End Date</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Usage Limit */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    Usage Limit (Max Uses)
                  </span>
                  <input
                    type="checkbox"
                    checked={enableUsageLimit}
                    onChange={(e) => setEnableUsageLimit(e.target.checked)}
                    className="rounded text-amber-800"
                  />
                </label>
                {enableUsageLimit && (
                  <div className="pt-1">
                    <input
                      type="number"
                      min="1"
                      value={maxUsageLimit}
                      onChange={(e) => setMaxUsageLimit(Number(e.target.value))}
                      placeholder="e.g. 500"
                      className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-mono"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Currently redeemed: {couponToEdit?.usageCount || 0} times
                    </span>
                  </div>
                )}
              </div>

              {/* Min Order Amount */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-800" />
                    Minimum Order Subtotal (৳)
                  </span>
                  <input
                    type="checkbox"
                    checked={enableMinAmount}
                    onChange={(e) => setEnableMinAmount(e.target.checked)}
                    className="rounded text-amber-800"
                  />
                </label>
                {enableMinAmount && (
                  <div className="pt-1">
                    <input
                      type="number"
                      min="0"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                      placeholder="e.g. 3000"
                      className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Max Discount Amount Cap */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-800" />
                    Max Discount Cap (৳)
                  </span>
                  <input
                    type="checkbox"
                    checked={enableMaxDiscount}
                    onChange={(e) => setEnableMaxDiscount(e.target.checked)}
                    className="rounded text-amber-800"
                  />
                </label>
                {enableMaxDiscount && (
                  <div className="pt-1">
                    <input
                      type="number"
                      min="0"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                      placeholder="e.g. 2000"
                      className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions (Requirement 1 & 4) */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            {/* Delete button (only when editing) */}
            {couponToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-400 hover:text-white hover:bg-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Coupon</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-amber-900 hover:bg-amber-800 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{couponToEdit ? 'Save Changes' : 'Create Coupon'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
