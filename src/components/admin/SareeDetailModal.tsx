import React, { useState, useEffect } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Truck,
  CheckCircle2,
  Tag,
  Sparkles,
  Layers,
  Ruler,
  Info,
  Calendar,
  Eye,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Percent,
  Lock,
  Unlock,
  Check,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Product, Category, Language, HiddenPromotionalCategory } from '../../types';
import { store } from '../../services/store';

interface SareeDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onSave?: (product: Product) => void;
  language: Language;
  categories: Category[];
  hiddenCategories?: HiddenPromotionalCategory[];
}

export const SareeDetailModal: React.FC<SareeDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSave,
  language,
  categories,
  hiddenCategories = store.getHiddenPromotionalCategories()
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync draft whenever product or open state changes
  useEffect(() => {
    if (product) {
      setDraftProduct({ ...product });
      setIsEditMode(false);
      setShowDeleteConfirm(false);
      setSaveSuccess(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product || !draftProduct) return null;

  const currentItem = isEditMode ? draftProduct : product;

  // Resolve Category & Subcategories
  const mainCategory = categories.find((c) => c.id === currentItem.categoryId);
  const subcategoryList = mainCategory?.subcategories || [];
  const activeSubcategories = subcategoryList.filter(
    (s) =>
      currentItem.subcategoryIds?.includes(s.id) ||
      currentItem.subcategoryId === s.id
  );

  // Resolve Hidden/Offer Categories
  const assignedOfferCategories = hiddenCategories.filter(
    (h) =>
      currentItem.promotionalCategoryIds?.includes(h.id) ||
      currentItem.promotionalCategoryId === h.id
  );

  // All photos
  const allPhotos = [
    currentItem.primaryImage,
    ...(currentItem.images || []).filter((img) => img !== currentItem.primaryImage),
    ...currentItem.variants.map((v) => v.image).filter((img) => img && !currentItem.images?.includes(img))
  ].filter(Boolean);

  const handleSaveQuickEdits = () => {
    if (!draftProduct) return;
    store.saveProduct(draftProduct);
    if (onSave) {
      onSave(draftProduct);
    }
    setSaveSuccess(true);
    setIsEditMode(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setDraftProduct({ ...product });
    setIsEditMode(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(product.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Security / Edit Status Banner */}
        {!isEditMode ? (
          <div className="bg-amber-50/90 dark:bg-stone-800/90 border-b border-amber-200/80 dark:border-stone-700 px-6 py-2.5 flex items-center justify-between text-xs text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Protected View Mode:</strong> Changes are locked against accidental clicks. Click <strong>Edit Saree</strong> to modify status, free delivery, stock, or pricing.
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold bg-amber-200/60 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
              <ShieldCheck className="w-3 h-3 text-amber-800 dark:text-amber-400" />
              Locked
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-300 dark:border-emerald-800 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Edit Mode Unlocked:</strong> You can now toggle Active/Inactive, Free Delivery, Stock, and Price. Click <strong>Save Changes</strong> when done.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveQuickEdits}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {saveSuccess && (
          <div className="bg-emerald-100 dark:bg-emerald-900/90 text-emerald-900 dark:text-emerald-100 px-6 py-2 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
            <span>Changes successfully saved and updated in the system!</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
              {currentItem.code}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {language === 'bn' ? currentItem.nameBn : currentItem.nameEn}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {currentItem.sareeType} · {mainCategory ? (language === 'bn' ? mainCategory.nameBn : mainCategory.nameEn) : 'Heritage Collection'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditMode ? (
              /* Unlock / Edit Saree Button */
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                title="Unlock editing mode"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Saree</span>
              </button>
            ) : (
              /* Save Changes and Wizard in Edit Mode */
              <>
                <button
                  type="button"
                  onClick={handleSaveQuickEdits}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(draftProduct);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 hover:bg-amber-200 rounded-lg border border-amber-300 dark:border-amber-800 transition cursor-pointer"
                  title="Open full wizard to edit lore, descriptions, and photos"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Wizard</span>
                </button>
              </>
            )}

            {/* Delete Button (Only accessible through View modal) */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-lg transition active:scale-95 cursor-pointer"
              title="Delete Saree"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Warning Overlay */}
        {showDeleteConfirm && (
          <div className="bg-rose-50 dark:bg-rose-950/90 border-b border-rose-300 dark:border-rose-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 text-xs font-medium">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong>Are you sure you want to delete saree &quot;{product.code}&quot;?</strong>
                <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                  This action cannot be undone and will permanently remove this listing from catalog and inventory.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Yes, Delete Saree
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* SECTION 1: COMPLETE SAREE INFORMATION */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                1. Saree Information &amp; Controls
              </h3>

              {/* Status & Free Delivery: Read-Only vs Editable */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Active / Inactive Status */}
                {!isEditMode ? (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      currentItem.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Status: {currentItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setDraftProduct({ ...draftProduct, isActive: !draftProduct.isActive })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer shadow-2xs ${
                      draftProduct.isActive
                        ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                        : 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700'
                    }`}
                    title="Click to toggle active status"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Status: {draftProduct.isActive ? '✓ Active (Click to Deactivate)' : '✕ Inactive (Click to Activate)'}
                  </button>
                )}

                {/* Free Delivery Control */}
                {!isEditMode ? (
                  currentItem.isFreeDelivery ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Truck className="w-3.5 h-3.5" /> Free Delivery
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                      <Truck className="w-3.5 h-3.5" /> Standard Delivery Fee
                    </span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setDraftProduct({ ...draftProduct, isFreeDelivery: !draftProduct.isFreeDelivery })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer shadow-2xs ${
                      draftProduct.isFreeDelivery
                        ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                        : 'bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-100 border-stone-300 dark:border-stone-600 hover:bg-stone-300'
                    }`}
                    title="Click to toggle free delivery"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Delivery: {draftProduct.isFreeDelivery ? '✓ Free Delivery (Click for Std)' : '✕ Standard (Click for Free)'}
                  </button>
                )}

                {/* Stock Badge / Editable Input */}
                {!isEditMode ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      currentItem.stock > 0
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    Stock: {currentItem.stock} pcs
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300">Stock:</span>
                    <input
                      type="number"
                      min="0"
                      value={draftProduct.stock}
                      onChange={(e) =>
                        setDraftProduct({
                          ...draftProduct,
                          stock: Math.max(0, parseInt(e.target.value) || 0)
                        })
                      }
                      className="w-16 text-center py-0.5 px-1 text-xs rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-mono font-bold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Key Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Current Selling Price
                </span>
                {!isEditMode ? (
                  <span className="text-lg font-bold text-amber-900 dark:text-amber-300">
                    ৳{currentItem.price.toLocaleString()}
                  </span>
                ) : (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-amber-800">৳</span>
                    <input
                      type="number"
                      min="0"
                      value={draftProduct.price}
                      onChange={(e) =>
                        setDraftProduct({
                          ...draftProduct,
                          price: Math.max(0, parseInt(e.target.value) || 0)
                        })
                      }
                      className="w-full text-sm font-bold p-1 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Original Price
                </span>
                {!isEditMode ? (
                  <span className="text-sm font-medium text-stone-500 line-through">
                    ৳{(currentItem.originalPrice || currentItem.price).toLocaleString()}
                  </span>
                ) : (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-stone-500">৳</span>
                    <input
                      type="number"
                      min="0"
                      value={draftProduct.originalPrice || draftProduct.price}
                      onChange={(e) =>
                        setDraftProduct({
                          ...draftProduct,
                          originalPrice: Math.max(0, parseInt(e.target.value) || 0)
                        })
                      }
                      className="w-full text-sm font-medium p-1 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 font-mono text-stone-600"
                    />
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Pricing Method
                </span>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {currentItem.pricingMethod === 'sale_price' ? 'Direct Sale Price' : 'Discount Based (% or Flat)'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Sales / Views
                </span>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {currentItem.salesCount || 0} sold · {currentItem.viewsCount || 0} views
                </span>
              </div>
            </div>

            {/* Categorization & Offer Category Mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  Main Category &amp; Subcategories
                </h4>
                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Main Category:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {mainCategory?.nameEn} ({mainCategory?.nameBn})
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-1">Subcategories:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeSubcategories.length > 0 ? (
                        activeSubcategories.map((sub) => (
                          <span
                            key={sub.id}
                            className="px-2 py-0.5 rounded text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium"
                          >
                            {sub.nameEn}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-400 text-xs italic">No subcategories assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  Hidden / Offer Categories
                </h4>
                <div className="space-y-1.5 text-xs">
                  <p className="text-stone-500 text-[11px]">
                    Offers are controlled via these Hidden/Offer Categories:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedOfferCategories.length > 0 ? (
                      assignedOfferCategories.map((cat) => (
                        <span
                          key={cat.id}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/80"
                        >
                          {cat.nameEn} ({cat.nameBn})
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400 text-xs italic">None (belongs only to main category)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Fabric &amp; Yarn:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{currentItem.fabric}</p>
                <p className="text-stone-500">{currentItem.fabricBn}</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Dimensions &amp; Blouse:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{currentItem.length}</p>
                <p className="text-stone-500">
                  Blouse Piece: {currentItem.hasBlousePiece ? 'Included (Matching Running)' : 'Not Included'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Artisan Weaving Hub:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{currentItem.artisanVillage || 'Dhaka Handloom Belt'}</p>
                <p className="text-stone-500">Duration: {currentItem.weavingDurationDays || 14} Days on Loom</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Occasion:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{currentItem.occasion}</p>
                <p className="text-stone-500">{currentItem.occasionBn}</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Age Suitability:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{currentItem.suitableAgeRange}</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Care Instructions:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{currentItem.careInstructionsEn}</p>
                <p className="text-stone-500">{currentItem.careInstructionsBn}</p>
              </div>
            </div>

            {/* Saree Descriptions */}
            <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 text-[11px]">
                  Description (English)
                </span>
                <p className="text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                  {currentItem.descriptionEn}
                </p>
              </div>
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 text-[11px]">
                  বিবরণ (বাংলা)
                </span>
                <p className="text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                  {currentItem.descriptionBn}
                </p>
              </div>
            </div>

            {/* Color Variants Details */}
            {currentItem.variants && currentItem.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Available Color Variants ({currentItem.variants.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {currentItem.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-stone-300 shadow-xs shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block">
                          {v.colorNameEn} ({v.colorNameBn})
                        </span>
                        <span className="text-[10px] text-stone-500">
                          SKU: {v.sku} · Stock: {v.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: SAREE PHOTOS */}
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-700" />
                2. Saree Photo Gallery ({allPhotos.length} Images)
              </h3>
              <span className="text-xs text-stone-500">
                Primary and High-Res Catalog Photography
              </span>
            </div>

            {/* Featured Photo Viewer */}
            {allPhotos.length > 0 && (
              <div className="space-y-3">
                <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[360px] w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                  <img
                    src={allPhotos[selectedPhotoIndex] || allPhotos[0]}
                    alt={`${currentItem.nameEn} photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/70 text-white text-xs font-mono">
                    Photo {selectedPhotoIndex + 1} of {allPhotos.length}
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {allPhotos.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        selectedPhotoIndex === idx
                          ? 'border-amber-600 ring-2 ring-amber-500/30'
                          : 'border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                      {photoUrl === currentItem.primaryImage && (
                        <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-bold bg-amber-600 text-white">
                          MAIN
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shrink-0">
          <span className="text-xs text-stone-500">
            ID: {currentItem.id} · Protected Bengali handloom inventory
          </span>
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition cursor-pointer"
                >
                  Delete Saree
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Saree Details</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuickEdits}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
