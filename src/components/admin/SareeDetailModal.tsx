import React, { useState } from 'react';
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
  Percent
} from 'lucide-react';
import { Product, Category, Language, HiddenPromotionalCategory } from '../../types';
import { store } from '../../services/store';

interface SareeDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
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
  language,
  categories,
  hiddenCategories = store.getHiddenPromotionalCategories()
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!isOpen || !product) return null;

  // Resolve Category & Subcategories
  const mainCategory = categories.find((c) => c.id === product.categoryId);
  const subcategoryList = mainCategory?.subcategories || [];
  const activeSubcategories = subcategoryList.filter(
    (s) =>
      product.subcategoryIds?.includes(s.id) ||
      product.subcategoryId === s.id
  );

  // Resolve Hidden/Offer Categories
  const assignedOfferCategories = hiddenCategories.filter(
    (h) =>
      product.promotionalCategoryIds?.includes(h.id) ||
      product.promotionalCategoryId === h.id
  );

  // All photos
  const allPhotos = [
    product.primaryImage,
    ...(product.images || []).filter((img) => img !== product.primaryImage),
    ...product.variants.map((v) => v.image).filter((img) => img && !product.images?.includes(img))
  ].filter(Boolean);

  const handleDeleteConfirm = () => {
    if (window.confirm(`Are you sure you want to delete saree "${product.code} - ${product.nameEn}"?`)) {
      onDelete(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
              {product.code}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {product.sareeType} · {mainCategory ? (language === 'bn' ? mainCategory.nameBn : mainCategory.nameEn) : 'Heritage Collection'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Saree</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-lg transition active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* SECTION 1: COMPLETE SAREE INFORMATION (As requested: First show complete saree information) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                1. Complete Saree Information
              </h3>
              <div className="flex items-center gap-2">
                {product.isFreeDelivery ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <Truck className="w-3 h-3" /> Free Delivery Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    Standard Delivery Fee (Inside ৳70 / Outside ৳130)
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300">
                    Stock: {product.stock}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Pricing & Key Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Current Selling Price
                </span>
                <span className="text-lg font-bold text-amber-900 dark:text-amber-300">
                  ৳{product.price.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Original Price
                </span>
                <span className="text-sm font-medium text-stone-500 line-through">
                  ৳{(product.originalPrice || product.price).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Pricing Method
                </span>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {product.pricingMethod === 'sale_price' ? 'Direct Sale Price' : 'Discount Based (% or Flat)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-400 block">
                  Sales / Views
                </span>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {product.salesCount || 0} sold · {product.viewsCount || 0} views
                </span>
              </div>
            </div>

            {/* Categorization & Offer Category Mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  Main Category & Subcategories
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

            {/* Specifications & Craft Lore Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Fabric & Yarn:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{product.fabric}</p>
                <p className="text-stone-500">{product.fabricBn}</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Dimensions & Blouse:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{product.length}</p>
                <p className="text-stone-500">
                  Blouse Piece: {product.hasBlousePiece ? 'Included (Matching Running)' : 'Not Included'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Artisan Weaving Hub:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{product.artisanVillage || 'Dhaka Handloom Belt'}</p>
                <p className="text-stone-500">Duration: {product.weavingDurationDays || 14} Days on Loom</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Occasion:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{product.occasion}</p>
                <p className="text-stone-500">{product.occasionBn}</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Age Suitability:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{product.suitableAgeRange}</p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg text-xs space-y-1">
                <span className="text-stone-400 font-medium text-[11px]">Care Instructions:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{product.careInstructionsEn}</p>
                <p className="text-stone-500">{product.careInstructionsBn}</p>
              </div>
            </div>

            {/* Saree Descriptions */}
            <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 text-[11px]">
                  Description (English)
                </span>
                <p className="text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                  {product.descriptionEn}
                </p>
              </div>
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 text-[11px]">
                  বিবরণ (বাংলা)
                </span>
                <p className="text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                  {product.descriptionBn}
                </p>
              </div>
            </div>

            {/* Color Variants Details */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Available Color Variants ({product.variants.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {product.variants.map((v) => (
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

          {/* SECTION 2: SAREE PHOTOS (As requested: THEN the saree photos) */}
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
                    alt={`${product.nameEn} photo ${selectedPhotoIndex + 1}`}
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
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                        selectedPhotoIndex === idx
                          ? 'border-amber-600 ring-2 ring-amber-500/30'
                          : 'border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                      {photoUrl === product.primaryImage && (
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

        {/* Modal Bottom Footer with Edit & Delete */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shrink-0">
          <span className="text-xs text-stone-500">
            ID: {product.id} · Created with authentic Bengali handloom specs
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition"
            >
              Delete Saree
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Saree Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
