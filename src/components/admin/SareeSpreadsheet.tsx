import React, { useState, useRef, useEffect } from 'react';
import {
  Table,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
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
  X,
  Lock,
  ArrowLeftRight
} from 'lucide-react';
import { Product, Category, Language, HiddenPromotionalCategory, ProductVariant } from '../../types';
import { store } from '../../services/store';
import { ImageUploadBrowser } from '../common/ImageUploadBrowser';
import { handleImageError } from '../../utils/imageHelper';

interface SareeSpreadsheetProps {
  products: Product[];
  categories: Category[];
  hiddenCategories: HiddenPromotionalCategory[];
  language: Language;
  onRefresh: () => void;
  onAddNewProduct?: () => void;
  onEditInFullModal?: (product: Product) => void;
  onViewMore?: (product: Product) => void;
}

export const SareeSpreadsheet: React.FC<SareeSpreadsheetProps> = ({
  products,
  categories,
  hiddenCategories,
  language,
  onRefresh,
  onAddNewProduct,
  onEditInFullModal,
  onViewMore
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState<'all' | 'free' | 'standard'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedFabricFilter, setSelectedFabricFilter] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Dynamically extract unique fabric/silk types from products
  const availableFabricTypes = Array.from(
    new Set(
      products.map((p) => p.sareeType || p.fabric).filter(Boolean)
    )
  );

  // Synchronized Top Horizontal Scrollbar Refs
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const tableInnerRef = useRef<HTMLTableElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(0);
  const [currentScrollLeft, setCurrentScrollLeft] = useState<number>(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState<number>(0);
  const [expandedEditingId, setExpandedEditingId] = useState<string | null>(null);

  const isSyncingTop = useRef(false);
  const isSyncingTable = useRef(false);

  const scrollToX = (x: number) => {
    const target = Math.max(0, Math.min(x, maxScrollLeft || 2500));
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = target;
    }
    if (topScrollRef.current) {
      topScrollRef.current.scrollLeft = target;
    }
    setCurrentScrollLeft(target);
  };

  const handleTopScroll = () => {
    if (isSyncingTop.current) return;
    isSyncingTable.current = true;
    if (tableScrollRef.current && topScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      setCurrentScrollLeft(topScrollRef.current.scrollLeft);
    }
    setTimeout(() => {
      isSyncingTable.current = false;
    }, 50);
  };

  const handleTableScroll = () => {
    if (isSyncingTop.current) return;
    isSyncingTop.current = true;
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
      setCurrentScrollLeft(tableScrollRef.current.scrollLeft);
    }
    setTimeout(() => {
      isSyncingTop.current = false;
    }, 50);
  };

  // Measure table width for synced top scrollbar
  useEffect(() => {
    const measure = () => {
      const scrollW = tableInnerRef.current?.scrollWidth || tableScrollRef.current?.scrollWidth || 0;
      const clientW = tableScrollRef.current?.clientWidth || 0;
      setTableScrollWidth(scrollW);
      setMaxScrollLeft(Math.max(0, scrollW - clientW));
      if (tableScrollRef.current) {
        setCurrentScrollLeft(tableScrollRef.current.scrollLeft);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (tableInnerRef.current) ro.observe(tableInnerRef.current);
    if (tableScrollRef.current) ro.observe(tableScrollRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [products, expandedRowId]);

  // Draft state for expanded row being edited
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Multi-Slot Filtered Rows
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.code.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.nameBn.includes(q) ||
      (p.fabric && p.fabric.toLowerCase().includes(q)) ||
      (p.sareeType && p.sareeType.toLowerCase().includes(q));

    const matchesCategory =
      !selectedCategoryFilter || p.categoryId === selectedCategoryFilter;

    const matchesDelivery =
      selectedDeliveryFilter === 'all'
        ? true
        : selectedDeliveryFilter === 'free'
        ? !!p.isFreeDelivery
        : !p.isFreeDelivery;

    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'active'
        ? !!p.isActive
        : !p.isActive;

    const matchesFabric =
      selectedFabricFilter === 'all'
        ? true
        : (p.sareeType && p.sareeType.toLowerCase().includes(selectedFabricFilter.toLowerCase())) ||
          (p.fabric && p.fabric.toLowerCase().includes(selectedFabricFilter.toLowerCase()));

    const matchesStock =
      selectedStockFilter === 'all'
        ? true
        : selectedStockFilter === 'in_stock'
        ? p.stock > 0
        : selectedStockFilter === 'low_stock'
        ? p.stock > 0 && p.stock <= 5
        : p.stock === 0;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDelivery &&
      matchesStatus &&
      matchesFabric &&
      matchesStock
    );
  });

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategoryFilter) ||
    selectedDeliveryFilter !== 'all' ||
    selectedStatusFilter !== 'all' ||
    selectedFabricFilter !== 'all' ||
    selectedStockFilter !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryFilter('');
    setSelectedDeliveryFilter('all');
    setSelectedStatusFilter('all');
    setSelectedFabricFilter('all');
    setSelectedStockFilter('all');
  };

  const toggleExpandRow = (product: Product) => {
    if (expandedRowId === product.id) {
      setExpandedRowId(null);
      setDraftProduct(null);
      setExpandedEditingId(null);
    } else {
      setExpandedRowId(product.id);
      setExpandedEditingId(null); // Locked / Read-Only by default
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

  const handleSaveDraft = () => {
    if (!draftProduct) return;
    store.saveProduct(draftProduct);
    onRefresh();
    setSavedNotification(`Changes saved for ${draftProduct.code}!`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
      {/* Saree Master Inventory Header & Filter Bar */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-850 space-y-3">
        {/* Top Header Row with Single Add Saree Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
              <Table className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Saree Master Inventory
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-stone-700">
                  Showing {filteredProducts.length} of {products.length} Sarees
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Full-detail heritage catalog: protected against accidental edits. Click <strong>View</strong> to review photos &amp; unlock editing.
              </p>
            </div>
          </div>

          {/* Single Add Saree Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onAddNewProduct ? onAddNewProduct() : onEditInFullModal?.(null as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-900 hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-xl shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
              title="Add a new saree to inventory catalog"
            >
              <Plus className="w-4 h-4" />
              <span>Add Saree</span>
            </button>
          </div>
        </div>

        {/* Filter Slots Bar (Requirement: Silk slot, only free delivery, only active/inactive, etc.) */}
        <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center gap-2 text-xs">
          {/* 1. Search Box */}
          <div className="relative flex-1 min-w-[180px] sm:min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code (ANC-101), name, fabric..."
              className="w-full text-xs pl-7 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-stone-400" />
          </div>

          {/* 2. Silk / Fabric Slot */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 shrink-0">Silk/Fabric:</span>
            <select
              value={selectedFabricFilter}
              onChange={(e) => setSelectedFabricFilter(e.target.value)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Fabrics &amp; Silks</option>
              <option value="jamdani">Dhakai Jamdani</option>
              <option value="silk">Rajshahi Silk</option>
              <option value="muslin">Dhakai Muslin</option>
              <option value="cotton">Tangail Taat Cotton</option>
              <option value="katan">Mirpur Katan</option>
              {availableFabricTypes
                .filter((f) => !['jamdani', 'silk', 'muslin', 'cotton', 'katan'].some((k) => f.toLowerCase().includes(k)))
                .map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
            </select>
          </div>

          {/* 3. Delivery Slot Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 shrink-0">Delivery:</span>
            <select
              value={selectedDeliveryFilter}
              onChange={(e) => setSelectedDeliveryFilter(e.target.value as any)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Deliveries</option>
              <option value="free">✓ Free Delivery Only</option>
              <option value="standard">Standard Fee Only</option>
            </select>
          </div>

          {/* 4. Status Slot Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 shrink-0">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Status</option>
              <option value="active">✓ Active Only</option>
              <option value="inactive">✕ Inactive Only</option>
            </select>
          </div>

          {/* 5. Main Category Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <Tag className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 shrink-0">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Stock Level Slot */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 shrink-0">Stock:</span>
            <select
              value={selectedStockFilter}
              onChange={(e) => setSelectedStockFilter(e.target.value as any)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock (&gt;0)</option>
              <option value="low_stock">Low Stock (≤5)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg border border-rose-200 dark:border-rose-900 transition cursor-pointer"
              title="Clear all active filters"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {savedNotification && (
        <div className="mx-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {savedNotification}
        </div>
      )}

      {/* Top Horizontal Scrollbar Control (Requirement: sticky horizontal scrolling bar to scroll in the mid of inventory) */}
      <div className="sticky top-[60px] z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-y border-stone-200 dark:border-stone-700 px-4 py-2.5 shadow-md space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-400">
            <ArrowLeftRight className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Top Horizontal Scroll Bar</span>
            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
              (Use bar, slider, or buttons to easily pan all 14 columns)
            </span>
          </div>

          {/* Quick jump & scroll buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => scrollToX(0)}
              className="px-2 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 font-semibold text-[11px] cursor-pointer transition shadow-2xs active:scale-95"
              title="Scroll to beginning"
            >
              ⇤ Start
            </button>
            <button
              type="button"
              onClick={() => {
                const nextX = Math.max(0, currentScrollLeft - 300);
                scrollToX(nextX);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 font-semibold text-[11px] cursor-pointer transition shadow-2xs active:scale-95"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Left</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const nextX = Math.min(maxScrollLeft || 2500, currentScrollLeft + 300);
                scrollToX(nextX);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 font-semibold text-[11px] cursor-pointer transition shadow-2xs active:scale-95"
              title="Scroll Right"
            >
              <span>Right</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToX(maxScrollLeft || 2500)}
              className="px-2 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 font-semibold text-[11px] cursor-pointer transition shadow-2xs active:scale-95"
              title="Scroll to end"
            >
              End ⇥
            </button>
          </div>
        </div>

        {/* Dedicated Native Scrollbar Container with custom styled track & thumb */}
        <div
          ref={topScrollRef}
          onScroll={handleTopScroll}
          className="overflow-x-auto overflow-y-hidden w-full h-5 admin-horizontal-scrollbar rounded-md bg-stone-200/80 dark:bg-stone-800 cursor-ew-resize border border-stone-300 dark:border-stone-700"
          title="Drag this horizontal scrollbar to pan the table"
        >
          <div style={{ width: `${Math.max(tableScrollWidth, 1400)}px`, height: '4px' }} />
        </div>

        {/* Range Slider Scrubber for immediate 1-click horizontal navigation */}
        {maxScrollLeft > 0 && (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[10px] text-stone-400 font-mono">0%</span>
            <input
              type="range"
              min={0}
              max={maxScrollLeft}
              value={currentScrollLeft}
              onChange={(e) => scrollToX(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              title="Pan table horizontally"
            />
            <span className="text-[10px] text-stone-400 font-mono">100%</span>
          </div>
        )}
      </div>


      {/* Spreadsheet Table */}
      <div ref={tableScrollRef} onScroll={handleTableScroll} className="overflow-x-auto">
        <table ref={tableInnerRef} className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800 border-y border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 text-center whitespace-nowrap">View More</th>
              <th className="py-2.5 px-2 w-14">Image</th>
              <th className="py-2.5 px-3">Code / SKU</th>
              <th className="py-2.5 px-4">Saree Name</th>
              <th className="py-2.5 px-3">Main Category</th>
              <th className="py-2.5 px-3">Subcategories</th>
              <th className="py-2.5 px-3">Offer Categories</th>
              <th className="py-2.5 px-3">Silk / Fabric</th>
              <th className="py-2.5 px-3">Pricing Mode</th>
              <th className="py-2.5 px-3">Orig Price</th>
              <th className="py-2.5 px-3">Final Price</th>
              <th className="py-2.5 px-3 text-center">Stock</th>
              <th className="py-2.5 px-3 text-center">Free Delivery</th>
              <th className="py-2.5 px-3 text-center">Status</th>
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
                    {/* View More Button (Requirement: remove +/- and put view more in this place) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewMore ? onViewMore(p) : onEditInFullModal?.(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700/80 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                        title={`View full details & protected editing for ${p.code}`}
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                        <span>View More</span>
                      </button>
                    </td>

                    {/* Image */}
                    <td className="py-2 px-2">
                      <div className="w-9 h-9 rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <img src={p.primaryImage} alt="" onError={handleImageError} className="w-full h-full object-cover" />
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

                    {/* Silk / Fabric */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                        {p.sareeType || 'Heritage Saree'}
                      </span>
                      <span className="text-[10px] text-stone-500 block truncate max-w-[130px]">
                        {p.fabric || p.fabricBn}
                      </span>
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

                    {/* Stock (Read-only protected view) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : p.stock <= 5
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                        title="Stock quantity (click View to edit)"
                      >
                        {p.stock} pcs
                      </span>
                    </td>

                    {/* Free Delivery (Read-only protected view) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isFreeDelivery
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                        }`}
                        title="Free delivery setting (click View to edit)"
                      >
                        <Truck className="w-3 h-3" />
                        {p.isFreeDelivery ? 'Free' : 'Std'}
                      </span>
                    </td>

                    {/* Status (Read-only protected view) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border border-green-300 dark:border-green-800'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                        }`}
                        title="Listing status (click View to edit)"
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>

                  {/* EXPANDED ACCORDION ROW (Requirement 10: rows should be expandable to view/edit all detail) */}
                  {isExpanded && draftProduct && (
                    <tr className="bg-amber-50/20 dark:bg-stone-850/90 border-b-2 border-amber-600/30">
                      <td colSpan={14} className="p-4 sm:p-6">
                        <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-md space-y-6 animate-fadeIn">
                          {/* Expanded Header with Security Controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-900 dark:text-amber-200 text-sm">
                                {draftProduct.code}
                              </span>
                              {expandedEditingId !== draftProduct.id ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  <Lock className="w-3 h-3 text-amber-700" />
                                  Protected View
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  Editing Unlocked
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {onViewMore && (
                                <button
                                  type="button"
                                  onClick={() => onViewMore(draftProduct)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg transition"
                                  title="Open Protected Full Modal"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View in Modal</span>
                                </button>
                              )}
                              {expandedEditingId !== draftProduct.id ? (
                                <button
                                  type="button"
                                  onClick={() => setExpandedEditingId(draftProduct.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                                  title="Unlock editing"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Unlock to Edit</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedEditingId(null)}
                                    className="px-2.5 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition active:scale-95"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Changes</span>
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setExpandedEditingId(null);
                                }}
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
