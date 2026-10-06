import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  KeyRound,
  Truck,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Tag,
  Clock,
  Sparkles,
  Sliders,
  ExternalLink,
  Save,
  Check
} from 'lucide-react';
import { Product, Order, Banner, Category, Language, OrderStatus, FlashSaleCampaign, LandingPopupConfig } from '../../types';
import { store } from '../../services/store';
import { ProductFormModal } from './ProductFormModal';
import { PrivateCodesModal } from './PrivateCodesModal';

interface AdminDashboardProps {
  onClose: () => void;
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  language
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'flash_sales' | 'popup_banner' | 'orders' | 'private_codes'
  >('overview');

  // Modals
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [showPrivateCodes, setShowPrivateCodes] = useState(false);

  // Live Data State
  const [products, setProducts] = useState<Product[]>(store.getAllProductsAdmin());
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [categories, setCategories] = useState<Category[]>(store.getAllCategoriesAdmin());
  const [flashSales, setFlashSales] = useState<FlashSaleCampaign[]>(store.getAllFlashSalesAdmin());
  const [popupConfig, setPopupConfig] = useState<LandingPopupConfig>(store.getLandingPopupConfig());
  const [popupSavedToast, setPopupSavedToast] = useState(false);

  // Search queries
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Category creation form
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameBn, setNewCatNameBn] = useState('');
  const [newCatImage, setNewCatImage] = useState('/src/assets/images/hero_jamdani_craft_1791268697306.jpg');
  const [newCatDescEn, setNewCatDescEn] = useState('');
  const [newCatDescBn, setNewCatDescBn] = useState('');
  const [selectedCatForSubcat, setSelectedCatForSubcat] = useState<string>('');
  const [newSubcatNameEn, setNewSubcatNameEn] = useState('');
  const [newSubcatNameBn, setNewSubcatNameBn] = useState('');

  // Flash sale campaign creation form
  const [newSaleTitleEn, setNewSaleTitleEn] = useState('');
  const [newSaleTitleBn, setNewSaleTitleBn] = useState('');
  const [newSaleDiscount, setNewSaleDiscount] = useState(15);
  const [newSaleHasTimer, setNewSaleHasTimer] = useState(true);

  const refreshData = () => {
    setProducts(store.getAllProductsAdmin());
    setOrders(store.getOrders());
    setCategories(store.getAllCategoriesAdmin());
    setFlashSales(store.getAllFlashSalesAdmin());
    setPopupConfig(store.getLandingPopupConfig());
  };

  // KPIs
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.finalTotal, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sareeType.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Category creation
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameEn.trim()) return;

    const newCat: Category = {
      id: newCatNameEn.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      nameEn: newCatNameEn.trim(),
      nameBn: newCatNameBn.trim() || newCatNameEn.trim(),
      slug: newCatNameEn.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      image: newCatImage,
      descriptionEn: newCatDescEn || 'Exquisite authentic handloom collection.',
      descriptionBn: newCatDescBn || 'ঐতিহ্যবাহী তাঁতের শাড়ির বিশেষ কালেকশন।',
      displayOrder: categories.length + 1,
      isActive: true,
      subcategories: []
    };

    store.saveCategory(newCat);
    setNewCatNameEn('');
    setNewCatNameBn('');
    setNewCatDescEn('');
    setNewCatDescBn('');
    refreshData();
  };

  // Subcategory creation
  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatForSubcat || !newSubcatNameEn.trim()) return;

    store.addSubcategory(selectedCatForSubcat, {
      id: `sub-${newSubcatNameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      nameEn: newSubcatNameEn.trim(),
      nameBn: newSubcatNameBn.trim() || newSubcatNameEn.trim()
    });

    setNewSubcatNameEn('');
    setNewSubcatNameBn('');
    refreshData();
  };

  // Flash sale campaign creation
  const handleCreateFlashSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaleTitleEn.trim()) return;

    const newSale: FlashSaleCampaign = {
      id: `fs-${Date.now()}`,
      titleEn: newSaleTitleEn.trim(),
      titleBn: newSaleTitleBn.trim() || newSaleTitleEn.trim(),
      discountPercent: Number(newSaleDiscount),
      hasTimer: newSaleHasTimer,
      endTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      isActive: true,
      bannerImage: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'
    };

    store.saveFlashSale(newSale);
    setNewSaleTitleEn('');
    setNewSaleTitleBn('');
    refreshData();
  };

  // Popup banner save
  const handleSavePopupConfig = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveLandingPopupConfig(popupConfig);
    setPopupSavedToast(true);
    setTimeout(() => setPopupSavedToast(false), 2000);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col font-sans">
      
      {/* 1. Full-Website Top Navigation Bar */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit to Live Store</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center font-serif font-bold text-base">
                আ
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wide block leading-none">
                  Aanchol Admin Central
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  Production Master Portal v3.2
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">saif360h@gmail.com</span>
              <span className="text-[10px] text-emerald-400 font-mono">Master Administrator</span>
            </div>

            <button
              onClick={() => {
                setProductToEdit(null);
                setShowProductForm(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Saree Listing</span>
              <span className="sm:hidden">Add Saree</span>
            </button>
          </div>

        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-stone-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Sarees & Variants ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories & Subcategories</span>
          </button>

          <button
            onClick={() => setActiveTab('flash_sales')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'flash_sales'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Flash Sales & Deals ({flashSales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('popup_banner')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'popup_banner'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Landing Pop-up Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Orders & Courier Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setShowPrivateCodes(true)}
            className="py-2.5 px-3.5 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ml-auto"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>VIP Negotiated Codes</span>
          </button>
        </div>
      </header>

      {/* 2. Main Work Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* ========================================================
            TAB 1: OVERVIEW & KPIS
            ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Total Confirmed Revenue
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 block">
                  ৳{totalSales.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  ↑ Across {totalOrdersCount} Total Customer Orders
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Active Saree Catalog
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 block">
                  {products.length} Sarees
                </span>
                <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
                  {categories.length} Heritage Handloom Categories
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Low Stock Alert
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 block">
                  {lowStockCount} Sarees
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Fewer than 5 items remaining
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Nationwide Dispatch
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800 block">
                  100% Free
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Steadfast Courier COD Active
                </span>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-serif text-xl font-bold">
                  Quick Facebook-Style Product Posting
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  Easily upload saree photos, define color variants with unique SKUs, set Haat lengths, and the total stock automatically sums up!
                </p>
              </div>
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setShowProductForm(true);
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
              >
                + Post New Saree Listing
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: SAREES & VARIANTS TABLE
            ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by code, saree name, or fabric..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setProductToEdit(null);
                    setShowProductForm(true);
                  }}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Saree</span>
                </button>
              </div>
            </div>

            {/* Sarees Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Image & Model Code</th>
                      <th className="p-3.5">Saree Name</th>
                      <th className="p-3.5">Category & Specs</th>
                      <th className="p-3.5">Color Variants & SKUs</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Total Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                              <img
                                src={prod.primaryImage}
                                alt={prod.nameEn}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {prod.code}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-serif font-bold text-stone-900 text-sm">
                            {prod.nameEn}
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            {prod.nameBn}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="block font-semibold text-stone-800">
                            {prod.sareeType}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {prod.length || '5.5m (12 Haat)'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-1">
                            {prod.variants.map((v) => (
                              <div key={v.id} className="flex items-center gap-1.5 text-[11px]">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-stone-300"
                                  style={{ backgroundColor: v.colorHex }}
                                />
                                <span className="font-medium text-stone-800">{v.colorNameEn}</span>
                                <span className="font-mono text-[10px] text-stone-400">
                                  ({v.sku})
                                </span>
                                <span className="font-bold text-amber-900 font-mono text-[10px]">
                                  x{v.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-serif font-bold text-stone-900 text-sm">
                            ৳{prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              ৳{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              prod.stock <= 0
                                ? 'bg-rose-100 text-rose-800'
                                : prod.stock <= 5
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prod.stock} left
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setProductToEdit(prod);
                                setShowProductForm(true);
                              }}
                              className="p-1.5 text-stone-600 hover:text-amber-900 rounded-lg hover:bg-stone-100"
                              title="Edit Listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete saree ${prod.code}?`)) {
                                  store.deleteProduct(prod.id);
                                  refreshData();
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: CATEGORIES & SUBCATEGORIES MANAGEMENT
            ======================================================== */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Create New Category Form */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Add New Heritage Saree Category
              </h3>

              <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newCatNameEn}
                    onChange={(e) => setNewCatNameEn(e.target.value)}
                    placeholder="e.g. Monipuri Handloom"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={newCatNameBn}
                    onChange={(e) => setNewCatNameBn(e.target.value)}
                    placeholder="যেমন: মণিপুরি তাঁতের শাড়ি"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={newCatDescEn}
                    onChange={(e) => setNewCatDescEn(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Description (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={newCatDescBn}
                    onChange={(e) => setNewCatDescBn(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Category
                </button>
              </form>

              {/* Add Subcategory Section */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  Add Subcategory to Existing Category
                </h4>

                <form onSubmit={handleAddSubcategory} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Select Parent Category</label>
                    <select
                      value={selectedCatForSubcat}
                      onChange={(e) => setSelectedCatForSubcat(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-lg"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameEn} ({c.nameBn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Subcategory (EN)</label>
                      <input
                        type="text"
                        value={newSubcatNameEn}
                        onChange={(e) => setNewSubcatNameEn(e.target.value)}
                        placeholder="e.g. Resham Silk"
                        className="w-full p-2 border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Subcategory (বাংলা)</label>
                      <input
                        type="text"
                        value={newSubcatNameBn}
                        onChange={(e) => setNewSubcatNameBn(e.target.value)}
                        placeholder="যেমন: রেশম সিল্ক"
                        className="w-full p-2 border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl cursor-pointer"
                  >
                    + Add Subcategory
                  </button>
                </form>
              </div>
            </div>

            {/* Existing Categories & Subcategories List */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Active Categories & Subcategories Hierarchy
              </h3>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cat.image}
                          alt={cat.nameEn}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-300"
                        />
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">{cat.nameEn}</h4>
                          <span className="text-xs text-stone-500 font-medium">{cat.nameBn}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete category ${cat.nameEn}?`)) {
                            store.deleteCategory(cat.id);
                            refreshData();
                          }
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subcategories list */}
                    <div className="pt-2 border-t border-stone-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                        Subcategories:
                      </span>
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.map((sub) => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs"
                            >
                              <span>{sub.nameEn} ({sub.nameBn})</span>
                              <button
                                onClick={() => {
                                  store.deleteSubcategory(cat.id, sub.id);
                                  refreshData();
                                }}
                                className="text-stone-400 hover:text-rose-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 italic">No subcategories defined yet.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 4: FLASH SALES & DEALS MANAGEMENT
            ======================================================== */}
        {activeTab === 'flash_sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Create Flash Sale Form */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Create Flash Sale Campaign
                </h3>
              </div>

              <form onSubmit={handleCreateFlashSale} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Campaign Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={newSaleTitleEn}
                    onChange={(e) => setNewSaleTitleEn(e.target.value)}
                    placeholder="e.g. Boishakh Heritage Flash Sale — 20% OFF"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Campaign Title (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={newSaleTitleBn}
                    onChange={(e) => setNewSaleTitleBn(e.target.value)}
                    placeholder="যেমন: বৈশাখী বিশেষ ফ্ল্যাশ সেল — ২০% ছাড়"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={newSaleDiscount}
                    onChange={(e) => setNewSaleDiscount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="timer_toggle"
                    checked={newSaleHasTimer}
                    onChange={(e) => setNewSaleHasTimer(e.target.checked)}
                    className="rounded border-stone-300 text-rose-600 focus:ring-rose-600 cursor-pointer"
                  />
                  <label htmlFor="timer_toggle" className="font-semibold text-stone-800 cursor-pointer">
                    Enable Real-time Countdown Timer on Website
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Activate Flash Sale Campaign
                </button>
              </form>
            </div>

            {/* Active Flash Sales List */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Active & Scheduled Flash Sale Events
              </h3>

              <div className="space-y-3">
                {flashSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                          {sale.discountPercent}% OFF
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{sale.titleEn}</h4>
                      </div>
                      <p className="text-xs text-stone-600">{sale.titleBn}</p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                        <Clock className="w-3 h-3 text-rose-500" />
                        <span>Timer: {sale.hasTimer ? 'Running' : 'Disabled'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Remove flash sale ${sale.titleEn}?`)) {
                          store.deleteFlashSale(sale.id);
                          refreshData();
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 5: LANDING POPUP BANNER CONTROLLER (Requirement 1)
            ======================================================== */}
        {activeTab === 'popup_banner' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs max-w-2xl mx-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-800" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Landing Pop-up Banner Controller
                </h3>
              </div>
              <span className="text-xs text-stone-500">Appears after visiting homepage</span>
            </div>

            <form onSubmit={handleSavePopupConfig} className="space-y-4 text-xs">
              <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  id="popup_active"
                  checked={popupConfig.isActive}
                  onChange={(e) => setPopupConfig({ ...popupConfig, isActive: e.target.checked })}
                  className="rounded border-stone-300 text-amber-900 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="popup_active" className="font-bold text-stone-900 text-sm cursor-pointer">
                  Enable Landing Pop-up Banner
                </label>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Banner Title (English)</label>
                <input
                  type="text"
                  value={popupConfig.titleEn}
                  onChange={(e) => setPopupConfig({ ...popupConfig, titleEn: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Banner Title (বাংলা)</label>
                <input
                  type="text"
                  value={popupConfig.titleBn}
                  onChange={(e) => setPopupConfig({ ...popupConfig, titleBn: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Subtitle / Privilege Offer (English)</label>
                <textarea
                  rows={2}
                  value={popupConfig.subtitleEn}
                  onChange={(e) => setPopupConfig({ ...popupConfig, subtitleEn: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Subtitle / Privilege Offer (বাংলা)</label>
                <textarea
                  rows={2}
                  value={popupConfig.subtitleBn}
                  onChange={(e) => setPopupConfig({ ...popupConfig, subtitleBn: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Promo / Coupon Code</label>
                  <input
                    type="text"
                    value={popupConfig.discountCode || ''}
                    onChange={(e) => setPopupConfig({ ...popupConfig, discountCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. WELCOME500"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={popupConfig.ctaTextEn}
                    onChange={(e) => setPopupConfig({ ...popupConfig, ctaTextEn: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {popupSavedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Configuration Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Deploy Pop-up Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 6: ORDERS & STEADFAST COURIER
            ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order ID, phone number, customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700"
                />
              </div>

              <span className="text-xs font-semibold text-stone-500">
                Showing {filteredOrders.length} Orders
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Order ID & Date</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Ordered Sarees</th>
                      <th className="p-3.5">Amount & COD</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5">Courier Consignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-stone-900 block">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 block">
                            {order.customerName}
                          </span>
                          <span className="font-mono text-stone-500 text-[11px]">
                            {order.customerPhone}
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate max-w-[180px]">
                            {order.shippingAddress.fullAddress}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                <span className="font-mono font-bold text-amber-900">
                                  {item.code}
                                </span>
                                <span className="text-stone-700 truncate max-w-[150px]">
                                  {item.name}
                                </span>
                                <span className="font-mono text-stone-400">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-serif font-bold text-stone-900 text-sm block">
                            ৳{order.finalTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {order.paymentMethod.toUpperCase()} (COD)
                          </span>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => {
                              store.updateOrderStatus(order.id, e.target.value as OrderStatus);
                              refreshData();
                            }}
                            className="p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="courier_shipped">Shipped via Steadfast</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-3.5 font-mono text-[11px]">
                          <span className="font-bold text-stone-700 block">
                            {order.courier?.name || 'Steadfast'}
                          </span>
                          <span className="text-amber-800 font-semibold block">
                            {order.courier?.trackingCode || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Product Edit / Create Modal */}
      {showProductForm && (
        <ProductFormModal
          isOpen={showProductForm}
          onClose={() => setShowProductForm(false)}
          productToEdit={productToEdit}
          categories={categories}
          language={language}
          onSaved={refreshData}
        />
      )}

      {/* Private Codes Manager */}
      {showPrivateCodes && (
        <PrivateCodesModal
          isOpen={showPrivateCodes}
          onClose={() => setShowPrivateCodes(false)}
          products={products}
          language={language}
        />
      )}

    </div>
  );
};
