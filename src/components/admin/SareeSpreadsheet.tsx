import React, { useState } from 'react';
import {
  Table,
  Plus,
  ChevronDown,
  ChevronRight,
  Save,
  Trash2,
  Edit2,
  Check,
  Search,
  Filter,
  Sparkles,
  Truck,
  Eye,
  Layers,
  Tag,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';
import { Product, Category, Language, HiddenPromotionalCategory, ProductVariant } from '../../types';
import { store } from '../../services/store';
import { ImageUploadBrowser } from '../common/ImageUploadBrowser';

interface SareeSpreadsheetProps {
  products: Product[];
  categories: Category[];
  hiddenCategories: HiddenPromotionalCategory[];
  language: Language;
  onRefresh: () => void;
  onEditInFullModal?: (product: Product) => void;
  onViewMore?: (product: Product) => void;
}

export const SareeSpreadsheet: React.FC<SareeSpreadsheetProps> = ({
  products,
  categories,
  hiddenCategories,
  language,
  onRefresh,
  onEditInFullModal,
  onViewMore
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Draft state for expanded row being edited
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Filtered rows
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameBn.includes(searchQuery);

    const matchesCategory =
      !selectedCategoryFilter || p.categoryId === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const toggleExpandRow = (product: Product) => {
    if (expandedRowId === product.id) {
      setExpandedRowId(null);
      setDraftProduct(null);
    } else {
      setExpandedRowId(product.id);
      // Clone into draft
      setDraftProduct({
        ...product,
        pricingMethod: product.pricingMethod || 'discount',
        subcategoryIds: product.subcategoryIds || (product.subcategoryId ? [product.subcategoryId] : []),
        promotionalCategoryIds: product.promotionalCategoryIds || (product.promotionalCategoryId ? [product.promotionalCategoryId] : []),
        images: product.images && product.images.length > 0 ? [...product.images] : [product.primaryImage]
      });
    }
  };

  const handleAddNewRow = () => {
    const newCode = `ANC-${Math.floor(100 + Math.random() * 900)}`;
    const newId = `p-${Date.now()}`;
    const defaultCat = categories[0]?.id || 'dhakai-jamdani';
    const sampleImg = '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg';

    const newSaree: Product = {
      id: newId,
      code: newCode,
      nameEn: 'New Handloom Saree Entry',
      nameBn: 'নতুন তাঁতের শাড়ি',
      price: 12000,
      originalPrice: 14000,
      discountPercent: 14,
      pricingMethod: 'discount',
      categoryId: defaultCat,
      subcategoryId: '',
      subcategoryIds: [],
      promotionalCategoryIds: [],
      sareeType: 'Dhakai Jamdani',
      fabric: 'Fine Cotton & Resham',
      fabricBn: 'সুতি ও রেশম সুতা',
      occasion: 'Festivals & Weddings',
      occasionBn: 'উৎসব ও অনুষ্ঠান',
      suitableAgeRange: 'All Ages',
      descriptionEn: 'Pure handloom saree woven with authentic heritage technique.',
      descriptionBn: 'ঐতিহ্যবাহী তাঁতশিল্পীদের নিপুণ হাতে বোনা খাঁটি বাংলাদেশি শাড়ি।',
      careInstructionsEn: 'Dry clean only.',
      careInstructionsBn: 'ড্রাই ক্লিন করুন।',
      length: '5.5 meters with Blouse Piece',
      hasBlousePiece: true,
      stock: 10,
      isFeatured: false,
      isNewArrival: true,
      isSale: true,
      isActive: true,
      rating: 5.0,
      reviewCount: 0,
      keywords: ['handloom', 'saree'],
      primaryImage: sampleImg,
      images: [sampleImg],
      variants: [
        {
          id: `v-${Date.now()}`,
          colorNameEn: 'Vermilion Red',
          colorNameBn: 'রক্তিম লাল',
          colorHex: '#991B1B',
          colorFamily: 'red',
          image: sampleImg,
          stock: 10,
          sku: `${newCode}-RED`
        }
      ],
      salesCount: 0,
      viewsCount: 0,
      isFreeDelivery: false
    };

    store.saveProduct(newSaree);
    onRefresh();
    // Open the new row expanded
    setExpandedRowId(newId);
    setDraftProduct(newSaree);
    setSavedNotification(`New row ${newCode} added!`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleSaveDraft = () => {
    if (!draftProduct) return;
    store.saveProduct(draftProduct);
    onRefresh();
    setSavedNotification(`Changes saved for ${draftProduct.code}!`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  // Quick inline update for cells in table
  const handleQuickUpdate = (product: Product, updates: Partial<Product>) => {
    const updated = { ...product, ...updates };
    store.saveProduct(updated);
    onRefresh();
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden space-y-3">
      {/* Spreadsheet Header Toolbar */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-850">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              Saree Data Spreadsheet
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                Excel View · {filteredProducts.length} Rows
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Interactive inventory table: click row expander (<span className="font-bold">+</span>) to view or edit full details.
            </p>
          </div>
        </div>

        {/* Filter & Add Row Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, name..."
              className="text-xs pl-7 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 w-36 sm:w-44 focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-stone-400" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
          </select>

          {/* Add Row Button */}
          <button
            type="button"
            onClick={handleAddNewRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row (New Saree)</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="mx-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {savedNotification}
        </div>
      )}

      {/* Spreadsheet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800 border-y border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 w-10 text-center">+/-</th>
              <th className="py-2.5 px-2 w-14">Image</th>
              <th className="py-2.5 px-3">Code / SKU</th>
              <th className="py-2.5 px-4">Saree Name</th>
              <th className="py-2.5 px-3">Main Category</th>
              <th className="py-2.5 px-3">Subcategories</th>
              <th className="py-2.5 px-3">Offer Categories</th>
              <th className="py-2.5 px-3">Pricing Mode</th>
              <th className="py-2.5 px-3">Orig Price</th>
              <th className="py-2.5 px-3">Final Price</th>
              <th className="py-2.5 px-3 text-center">Stock</th>
              <th className="py-2.5 px-3 text-center">Free Delivery</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredProducts.map((p) => {
              const isExpanded = expandedRowId === p.id;
              const mainCat = categories.find((c) => c.id === p.categoryId);
              const subcats = (mainCat?.subcategories || []).filter(
                (s) => p.subcategoryIds?.includes(s.id) || p.subcategoryId === s.id
              );
              const offerCats = hiddenCategories.filter(
                (h) => p.promotionalCategoryIds?.includes(h.id) || p.promotionalCategoryId === h.id
              );

              return (
                <React.Fragment key={p.id}>
                  {/* Compact Row */}
                  <tr
                    className={`hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition ${
                      isExpanded ? 'bg-amber-50/60 dark:bg-stone-850 font-medium' : ''
                    }`}
                  >
                    {/* Expand/Collapse Button */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleExpandRow(p)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition border ${
                          isExpanded
                            ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-amber-500'
                        }`}
                        title={isExpanded ? 'Collapse row' : 'Expand full details to view or edit'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>

                    {/* Image */}
                    <td className="py-2 px-2">
                      <div className="w-9 h-9 rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <img src={p.primaryImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-2 px-3 font-mono font-bold text-amber-950 dark:text-amber-300 whitespace-nowrap">
                      {p.code}
                    </td>

                    {/* Name */}
                    <td className="py-2 px-4 max-w-[200px] truncate">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 block truncate">
                        {p.nameEn}
                      </span>
                      <span className="text-[11px] text-stone-400 block truncate">
                        {p.nameBn}
                      </span>
                    </td>

                    {/* Main Category */}
                    <td className="py-2 px-3 whitespace-nowrap text-stone-700 dark:text-stone-300 font-medium">
                      {mainCat?.nameEn || p.categoryId}
                    </td>

                    {/* Subcategories */}
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {subcats.length > 0 ? (
                          subcats.map((s) => (
                            <span
                              key={s.id}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                            >
                              {s.nameEn}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 text-[10px] italic">—</span>
                        )}
                      </div>
                    </td>

                    {/* Offer Categories */}
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {offerCats.length > 0 ? (
                          offerCats.map((h) => (
                            <span
                              key={h.id}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 font-medium"
                            >
                              {h.nameEn}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 text-[10px] italic">None</span>
                        )}
                      </div>
                    </td>

                    {/* Pricing Mode */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                        {p.pricingMethod === 'sale_price' ? 'Sale Price' : 'Discount'}
                      </span>
                    </td>

                    {/* Original Price */}
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-stone-500">
                      ৳{(p.originalPrice || p.price).toLocaleString()}
                    </td>

                    {/* Final Price */}
                    <td className="py-2 px-3 whitespace-nowrap font-mono font-bold text-amber-900 dark:text-amber-300">
                      ৳{p.price.toLocaleString()}
                    </td>

                    {/* Stock (Quick Inline Input) */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) =>
                          handleQuickUpdate(p, { stock: Math.max(0, parseInt(e.target.value) || 0) })
                        }
                        className="w-14 text-center py-1 px-1 text-xs rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono font-bold"
                      />
                    </td>

                    {/* Free Delivery Toggle */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleQuickUpdate(p, { isFreeDelivery: !p.isFreeDelivery })}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition ${
                          p.isFreeDelivery
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500'
                        }`}
                        title="Toggle Free Delivery for this saree"
                      >
                        <Truck className="w-3 h-3" />
                        {p.isFreeDelivery ? 'Free' : 'Std'}
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleQuickUpdate(p, { isActive: !p.isActive })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {onViewMore && (
                          <button
                            type="button"
                            onClick={() => onViewMore(p)}
                            className="p-1 rounded text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="View More (All Details & Photos)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onEditInFullModal && (
                          <button
                            type="button"
                            onClick={() => onEditInFullModal(p)}
                            className="p-1 rounded text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/60"
                            title="Open full wizard modal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${p.code}?`)) {
                              store.deleteProduct(p.id);
                              onRefresh();
                            }
                          }}
                          className="p-1 rounded text-rose-600 hover:text-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/60"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED ACCORDION ROW (Requirement 10: rows should be expandable to view/edit all detail) */}
                  {isExpanded && draftProduct && (
                    <tr className="bg-amber-50/20 dark:bg-stone-850/90 border-b-2 border-amber-600/30">
                      <td colSpan={14} className="p-4 sm:p-6">
                        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-md space-y-6 animate-fadeIn">
                          {/* Expanded Header */}
                          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-900 dark:text-amber-200 text-sm">
                                {draftProduct.code}
                              </span>
                              <span className="text-xs text-stone-500">· Full In-Sheet Editor</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition active:scale-95"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Changes</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setExpandedRowId(null)}
                                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Top Row: Basic Info & Names */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                                Saree Code / SKU
                              </label>
                              <input
                                type="text"
                                value={draftProduct.code}
                                onChange={(e) => setDraftProduct({ ...draftProduct, code: e.target.value })}
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                                Name (English)
                              </label>
                              <input
                                type="text"
                                value={draftProduct.nameEn}
                                onChange={(e) => setDraftProduct({ ...draftProduct, nameEn: e.target.value })}
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                                নাম (বাংলা)
                              </label>
                              <input
                                type="text"
                                value={draftProduct.nameBn}
                                onChange={(e) => setDraftProduct({ ...draftProduct, nameBn: e.target.value })}
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                          </div>

                          {/* PRICING METHOD SECTION (Requirement 7) */}
                          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                                Pricing Method (Choose Option A or Option B)
                              </span>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`pricingMethod-${draftProduct.id}`}
                                    checked={draftProduct.pricingMethod !== 'sale_price'}
                                    onChange={() =>
                                      setDraftProduct({
                                        ...draftProduct,
                                        pricingMethod: 'discount',
                                        isSale: true
                                      })
                                    }
                                  />
                                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                                    Option A — Discount
                                  </span>
                                </label>
                                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`pricingMethod-${draftProduct.id}`}
                                    checked={draftProduct.pricingMethod === 'sale_price'}
                                    onChange={() =>
                                      setDraftProduct({
                                        ...draftProduct,
                                        pricingMethod: 'sale_price',
                                        isSale: true
                                      })
                                    }
                                  />
                                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                                    Option B — Sale Price
                                  </span>
                                </label>
                              </div>
                            </div>

                            {draftProduct.pricingMethod === 'sale_price' ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                                    Original Price (৳)
                                  </label>
                                  <input
                                    type="number"
                                    value={draftProduct.originalPrice || draftProduct.price}
                                    onChange={(e) => {
                                      const orig = parseInt(e.target.value) || 0;
                                      setDraftProduct({ ...draftProduct, originalPrice: orig });
                                    }}
                                    className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-amber-900 dark:text-amber-300 mb-1">
                                    Direct Sale Price (৳) — No calculation required
                                  </label>
                                  <input
                                    type="number"
                                    value={draftProduct.price}
                                    onChange={(e) => {
                                      const sl = parseInt(e.target.value) || 0;
                                      setDraftProduct({ ...draftProduct, price: sl });
                                    }}
                                    className="w-full text-xs p-2 rounded-lg border-2 border-amber-500 bg-white dark:bg-stone-800 font-mono font-bold text-amber-950 dark:text-amber-200"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                                    Original Price (৳)
                                  </label>
                                  <input
                                    type="number"
                                    value={draftProduct.originalPrice || draftProduct.price}
                                    onChange={(e) => {
                                      const orig = parseInt(e.target.value) || 0;
                                      const disc = draftProduct.discountPercent || 0;
                                      const calc = Math.round(orig * (1 - disc / 100));
                                      setDraftProduct({
                                        ...draftProduct,
                                        originalPrice: orig,
                                        price: calc
                                      });
                                    }}
                                    className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                                    Discount Percentage (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={draftProduct.discountPercent || 0}
                                    onChange={(e) => {
                                      const disc = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                      const orig = draftProduct.originalPrice || draftProduct.price;
                                      const calc = Math.round(orig * (1 - disc / 100));
                                      setDraftProduct({
                                        ...draftProduct,
                                        discountPercent: disc,
                                        price: calc
                                      });
                                    }}
                                    className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-emerald-800 dark:text-emerald-300 mb-1">
                                    Calculated Price (৳)
                                  </label>
                                  <div className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 font-mono font-bold text-amber-900 dark:text-amber-200">
                                    ৳{draftProduct.price.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* CATEGORY & SUBCATEGORY (Requirement 9: 1 actual category, multiple subcategories) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                                Actual / Main Category (Select 1)
                              </label>
                              <select
                                value={draftProduct.categoryId}
                                onChange={(e) => {
                                  setDraftProduct({
                                    ...draftProduct,
                                    categoryId: e.target.value,
                                    subcategoryIds: []
                                  });
                                }}
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.nameEn} ({c.nameBn})
                                  </option>
                                ))}
                              </select>

                              {/* Multiple Subcategories for this Category */}
                              <div className="pt-2">
                                <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                                  Subcategories (Can select multiple under {categories.find((c) => c.id === draftProduct.categoryId)?.nameEn}):
                                </label>
                                <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850">
                                  {categories.find((c) => c.id === draftProduct.categoryId)?.subcategories?.map((sub) => {
                                    const isChecked = draftProduct.subcategoryIds?.includes(sub.id);
                                    return (
                                      <label
                                        key={sub.id}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs cursor-pointer border transition ${
                                          isChecked
                                            ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold'
                                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            const current = draftProduct.subcategoryIds || [];
                                            const next = e.target.checked
                                              ? [...current, sub.id]
                                              : current.filter((id) => id !== sub.id);
                                            setDraftProduct({ ...draftProduct, subcategoryIds: next });
                                          }}
                                          className="rounded text-amber-600"
                                        />
                                        <span>{sub.nameEn}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* HIDDEN / OFFER CATEGORIES (Requirement 8) */}
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5 text-rose-600" />
                                Hidden / Offer Categories (Multi-Select)
                              </label>
                              <p className="text-[11px] text-stone-500">
                                Offers are applied to Hidden/Offer Categories. Check all offer categories this saree belongs to:
                              </p>
                              <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 max-h-36 overflow-y-auto">
                                {hiddenCategories.map((hc) => {
                                  const isChecked = draftProduct.promotionalCategoryIds?.includes(hc.id);
                                  return (
                                    <label
                                      key={hc.id}
                                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs cursor-pointer border transition ${
                                        isChecked
                                          ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-400 text-rose-900 dark:text-rose-200 font-semibold'
                                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const current = draftProduct.promotionalCategoryIds || [];
                                          const next = e.target.checked
                                            ? [...current, hc.id]
                                            : current.filter((id) => id !== hc.id);
                                          setDraftProduct({ ...draftProduct, promotionalCategoryIds: next });
                                        }}
                                        className="rounded text-rose-600"
                                      />
                                      <span>{hc.nameEn}</span>
                                    </label>
                                  );
                                })}
                              </div>

                              {/* Free Delivery Switch */}
                              <div className="pt-2">
                                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!draftProduct.isFreeDelivery}
                                    onChange={(e) =>
                                      setDraftProduct({ ...draftProduct, isFreeDelivery: e.target.checked })
                                    }
                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                    Enable Free Delivery for this saree
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* IMAGES LIST (Requirement 5 & 6: Browse Image & Add More) */}
                          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                                Saree Images ({draftProduct.images?.length || 1})
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentImgs = draftProduct.images || [draftProduct.primaryImage];
                                  setDraftProduct({
                                    ...draftProduct,
                                    images: [...currentImgs, '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg']
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 dark:bg-amber-950 dark:text-amber-200 rounded-lg hover:bg-amber-200"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add More Image</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(draftProduct.images || [draftProduct.primaryImage]).map((imgUrl, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                                      Image #{idx + 1} {imgUrl === draftProduct.primaryImage && '(Primary)'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {imgUrl !== draftProduct.primaryImage && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setDraftProduct({ ...draftProduct, primaryImage: imgUrl })
                                          }
                                          className="text-[10px] text-amber-700 hover:underline"
                                        >
                                          Set as Primary
                                        </button>
                                      )}
                                      {(draftProduct.images?.length || 1) > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const filtered = (draftProduct.images || []).filter((_, i) => i !== idx);
                                            setDraftProduct({
                                              ...draftProduct,
                                              images: filtered,
                                              primaryImage: filtered[0] || draftProduct.primaryImage
                                            });
                                          }}
                                          className="text-stone-400 hover:text-rose-500"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <ImageUploadBrowser
                                    value={imgUrl}
                                    onChange={(newUrl) => {
                                      const next = [...(draftProduct.images || [draftProduct.primaryImage])];
                                      next[idx] = newUrl;
                                      setDraftProduct({
                                        ...draftProduct,
                                        images: next,
                                        primaryImage: idx === 0 ? newUrl : draftProduct.primaryImage
                                      });
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Specifications (Fabric, Length, Blouse, Care) */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                                Fabric Details
                              </label>
                              <input
                                type="text"
                                value={draftProduct.fabric}
                                onChange={(e) => setDraftProduct({ ...draftProduct, fabric: e.target.value })}
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                                Dimensions / Length
                              </label>
                              <input
                                type="text"
                                value={draftProduct.length}
                                onChange={(e) => setDraftProduct({ ...draftProduct, length: e.target.value })}
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                                Blouse Piece
                              </label>
                              <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={draftProduct.hasBlousePiece}
                                  onChange={(e) =>
                                    setDraftProduct({ ...draftProduct, hasBlousePiece: e.target.checked })
                                  }
                                  className="rounded text-amber-600"
                                />
                                <span className="text-xs">Includes Blouse Piece</span>
                              </label>
                            </div>
                          </div>

                          {/* Descriptions */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                                Description (English)
                              </label>
                              <textarea
                                rows={2}
                                value={draftProduct.descriptionEn}
                                onChange={(e) =>
                                  setDraftProduct({ ...draftProduct, descriptionEn: e.target.value })
                                }
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                                বিবরণ (বাংলা)
                              </label>
                              <textarea
                                rows={2}
                                value={draftProduct.descriptionBn}
                                onChange={(e) =>
                                  setDraftProduct({ ...draftProduct, descriptionBn: e.target.value })
                                }
                                className="w-full text-xs p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                              />
                            </div>
                          </div>

                          {/* Save Changes Button at Bottom */}
                          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                            <button
                              type="button"
                              onClick={() => setExpandedRowId(null)}
                              className="px-3.5 py-1.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                            >
                              Close Row
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveDraft}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Row Changes</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
