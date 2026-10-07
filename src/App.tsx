import React, { useState, useEffect } from 'react';
import { Language, Product, ProductVariant, CartItem, FilterState, Order } from './types';
import { translations } from './i18n/translations';
import { store } from './services/store';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { SearchModal } from './components/common/SearchModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { NotificationModal } from './components/common/NotificationModal';
import { WishlistToast, WishlistToastData } from './components/common/WishlistToast';

// Home Components
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryCircles } from './components/home/CategoryCircles';
import { FlashSaleSection } from './components/home/FlashSaleSection';
import { TrustHighlights } from './components/home/TrustHighlights';
import { PhotoReviewsGallery } from './components/home/PhotoReviewsGallery';
import { LandingPopup } from './components/home/LandingPopup';

// Product Components
import { ProductCard } from './components/product/ProductCard';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { ProductReviewsPage } from './components/product/ProductReviewsPage';
import { FilterSidebar } from './components/product/FilterSidebar';
import { SareeGuideModal } from './components/product/SareeGuideModal';

// Category & Flash Sale Pages
import { CategoryHeritageHeader } from './components/category/CategoryHeritageHeader';
import { FlashSalePage } from './components/flash-sale/FlashSalePage';

// Cart & Checkout Components
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { DirectOrderModal } from './components/checkout/DirectOrderModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { CustomerAccountModal } from './components/account/CustomerAccountModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WishlistModal } from './components/wishlist/WishlistModal';

import {
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  Heart,
  Zap,
  Ruler
} from 'lucide-react';

export default function App() {
  // Global Settings
  const [language, setLanguage] = useState<Language>('bn');
  const t = translations[language];

  // Google Maps Platform Quota Defense
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Active view: 'home' | 'shop' | 'product-detail' | 'product-reviews' | 'flash-sale' | 'admin'
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product-detail' | 'product-reviews' | 'flash-sale' | 'admin'>('home');

  // Cart State (saved to localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aanchol_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Applied Private / Negotiated Discount
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCodeName, setAppliedCodeName] = useState<string>('');

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aanchol_wishlist');
      return saved ? JSON.parse(saved) : ['p-jm108'];
    } catch {
      return ['p-jm108'];
    }
  });

  // Filter State
  const defaultFilters: FilterState = {
    searchQuery: '',
    categoryId: '',
    subcategoryId: undefined,
    sareeType: '',
    colorFamily: '',
    minPrice: 2000,
    maxPrice: 50000,
    ageRange: '',
    minRating: 0,
    onlyInStock: false,
    onlyOnSale: false,
    sortBy: 'relevance'
  };
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSareeGuideOpen, setIsSareeGuideOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Fabrilife-style Express 1-Click Order Modal
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [directOrderProduct, setDirectOrderProduct] = useState<Product | null>(null);
  const [directOrderVariant, setDirectOrderVariant] = useState<ProductVariant | undefined>(undefined);

  // Selected Product for Dedicated PDP Page View (Requirement 9: Separate Page, NOT popup!)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  // Toast / Order Placed Notification
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [showOrderSuccessToast, setShowOrderSuccessToast] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [wishlistToast, setWishlistToast] = useState<WishlistToastData | null>(null);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aanchol_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aanchol_dark_mode', String(next));
      } catch {}
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('aanchol_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('aanchol_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Handlers
  const handleToggleWishlist = (productId: string) => {
    const product = store.getProductById(productId);
    const isAdding = !wishlist.includes(productId);

    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    if (product) {
      setWishlistToast({
        product,
        action: isAdding ? 'added' : 'removed'
      });
    }
  };

  const handleAddToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.variantId === variant.id
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          quantity,
          colorNameEn: variant.colorNameEn,
          colorNameBn: variant.colorNameBn,
          colorHex: variant.colorHex,
          price: product.price,
          code: product.code,
          nameEn: product.nameEn,
          nameBn: product.nameBn,
          image: variant.image || product.primaryImage,
          flashSaleTitle: product.flashSaleTitle,
          originalPrice: product.originalPrice
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  // Navigating to Saree Detail Page (Separate Page View, Requirement 9)
  const handleSelectProduct = (product: Product, variant?: ProductVariant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant || product.variants[0]);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: string) => {
    setFilters({ ...defaultFilters, categoryId });
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDirectOrder = (product: Product, variant?: ProductVariant) => {
    setDirectOrderProduct(product);
    setDirectOrderVariant(variant || product.variants[0]);
    setIsDirectOrderOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setLastPlacedOrder(order);
    setShowOrderSuccessToast(true);
    setIsCheckoutOpen(false);
    setIsDirectOrderOpen(false);
    setCartItems([]);
    setAppliedDiscount(0);
    setAppliedCodeName('');
  };

  // Data fetching
  const categories = store.getCategories();
  const heroBanners = store.getBanners('hero');
  const topSelling = store.getTopSelling(4);
  const topRated = store.getTopRated(4);
  const specialOffers = store.getSpecialOffers(4);

  // Shop filtered products
  const shopProducts = store.searchProducts(filters.searchQuery, filters);

  // Active category for category specialized header (Requirement 5)
  const activeCategory = categories.find((c) => c.id === filters.categoryId);

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ========================================================
  // SPECIAL FULL-PAGE VIEW: ADMIN MASTER DASHBOARD
  // (Requirement 8: NOT a popup, a different website interface!)
  // ========================================================
  if (activeView === 'admin') {
    return (
      <AdminDashboard
        language={language}
        onClose={() => setActiveView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-900 selection:text-white font-sans transition-colors duration-200">
      
      {/* Google Maps Platform Quota Defense Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Landing Popup Banner (Requirement 1: popup after landing, controlled via admin) */}
      {activeView === 'home' && (
        <LandingPopup
          language={language}
          onNavigateShop={() => setActiveView('shop')}
        />
      )}

      {/* Primary Global Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        cartSubtotal={cartSubtotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={handleSelectCategory}
        activeView={activeView}
        onNavigateHome={() => setActiveView('home')}
        onNavigateShop={() => setActiveView('shop')}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSareeGuide={() => setIsSareeGuideOpen(true)}
        onOpenFlashSale={() => setActiveView('flash-sale')}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={store.getUnreadNotificationCount()}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        
        {/* ========================================================
            VIEW: DEDICATED SEPARATE PRODUCT DETAIL PAGE (Requirement 6 & 7)
            ======================================================== */}
        {activeView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            initialVariant={selectedVariant}
            language={language}
            onBack={() => setActiveView('shop')}
            onAddToCart={handleAddToCart}
            onDirectOrder={handleOpenDirectOrder}
            onSelectProduct={handleSelectProduct}
            onOpenAllReviews={(prod) => {
              setSelectedProduct(prod);
              setActiveView('product-reviews');
            }}
            onExploreCategory={(catId) => {
              handleSelectCategory(catId);
            }}
          />
        )}

        {/* ========================================================
            VIEW: SEPARATE DEDICATED REVIEWS PAGE (Requirement 7)
            ======================================================== */}
        {activeView === 'product-reviews' && selectedProduct && (
          <ProductReviewsPage
            product={selectedProduct}
            selectedVariant={selectedVariant}
            language={language}
            onBackToProduct={() => setActiveView('product-detail')}
            onDirectOrder={handleOpenDirectOrder}
          />
        )}

        {/* ========================================================
            VIEW: DEDICATED FLASH SALE DEALS PAGE (Requirement 1 & 12)
            ======================================================== */}
        {activeView === 'flash-sale' && (
          <FlashSalePage
            language={language}
            onBack={() => setActiveView('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAddToCart={handleAddToCart}
            onDirectOrder={handleOpenDirectOrder}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* ========================================================
            VIEW: HOMEPAGE (FABRILIFE-INSPIRED CLEAN FLOW)
            ======================================================== */}
        {activeView === 'home' && (
          <div className="space-y-0">
            {/* 1. Hero Carousel */}
            <HeroBanner
              banners={heroBanners}
              language={language}
              onCtaClick={() => setActiveView('shop')}
            />

            {/* 2. Category Circles (Fabrilife circular navigation) */}
            <CategoryCircles
              categories={categories}
              language={language}
              onSelectCategory={handleSelectCategory}
              activeCategoryId={filters.categoryId}
            />

            {/* 3. Flash Sale Section with High Aesthetic & Urgency (Requirement 1) */}
            <FlashSaleSection
              products={specialOffers}
              language={language}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={handleSelectProduct}
              onQuickAddToCart={handleAddToCart}
              onDirectOrder={handleOpenDirectOrder}
              onViewAllFlash={() => setActiveView('flash-sale')}
            />

            {/* 4. Top Selling Handloom Sarees with Noticeable Explore Button (Requirement 4) */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 my-6 shadow-xl border border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-1">
                    {language === 'bn' ? 'সর্বোচ্চ বিক্রিত' : 'Customer Favorites'}
                  </span>
                  <h2
                    className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#fff6f6]"
                    style={{ color: '#fff6f6' }}
                  >
                    {language === 'bn' ? 'জনপ্রিয় ঐতিহ্যবাহী শাড়িসমূহ' : 'Most Cherished Sarees'}
                  </h2>
                </div>
                {/* Highly Noticeable Explore More Button */}
                <button
                  onClick={() => {
                    setFilters({ ...defaultFilters, sortBy: 'top_selling' });
                    setActiveView('shop');
                  }}
                  className="px-5 py-2.5 bg-stone-900 dark:bg-amber-950 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 group self-start sm:self-auto cursor-pointer border border-stone-800 hover:border-amber-700"
                >
                  <span>{language === 'bn' ? 'সব জনপ্রিয় শাড়ি এক্সপ্লোর করুন' : 'Explore All Bestsellers'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-300" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {topSelling.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    language={language}
                    isWishlisted={wishlist.includes(p.id)}
                    isListView={false}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={handleSelectProduct}
                    onQuickAddToCart={handleAddToCart}
                    onDirectOrder={handleOpenDirectOrder}
                  />
                ))}
              </div>

              {/* Noticeable Mid-page Collection Banner */}
              <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-center justify-center">
                <button
                  onClick={() => {
                    setFilters({ ...defaultFilters, sortBy: 'top_selling' });
                    setActiveView('shop');
                  }}
                  className="px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-2xl border border-amber-300 transition-all flex items-center gap-2 shadow-2xs group cursor-pointer"
                >
                  <span>{language === 'bn' ? 'হাতে বোনা সব জনপ্রিয় শাড়ি ব্রাউজ করুন (১০০+ কালেকশন)' : 'Browse Full 100+ Authentic Handloom Collection'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-800 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* 5. Top Rated Masterpieces with Noticeable Explore Button (Requirement 4) */}
            <section className="py-12 bg-stone-100/70 border-y border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-900 block mb-1">
                      {language === 'bn' ? 'ক্রেতাদের প্রশংসা' : 'Artisan Excellence'}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                      {language === 'bn' ? 'সেরা রেটিং প্রাপ্ত ঢাকাই সম্ভার' : 'Top Rated Weaves'}
                    </h2>
                  </div>
                  {/* Highly Noticeable Explore More Button */}
                  <button
                    onClick={() => {
                      setFilters({ ...defaultFilters, sortBy: 'top_rated' });
                      setActiveView('shop');
                    }}
                    className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 group self-start sm:self-auto cursor-pointer border border-amber-800 hover:border-amber-600"
                  >
                    <span>{language === 'bn' ? 'সব সেরা রেটিং শাড়ি দেখুন' : 'Explore All Top Rated'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-300" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {topRated.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      language={language}
                      isWishlisted={wishlist.includes(p.id)}
                      isListView={false}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectProduct={handleSelectProduct}
                      onQuickAddToCart={handleAddToCart}
                      onDirectOrder={handleOpenDirectOrder}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Smaller, Refined Customer Photo Reviews Gallery (Requirement 4) */}
            <PhotoReviewsGallery language={language} />

            {/* 7. Trust Highlights */}
            <TrustHighlights language={language} />

          </div>
        )}

        {/* ========================================================
            VIEW: SHOP / CATALOG BROWSING
            ======================================================== */}
        {activeView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            
            {/* Breadcrumb Bar */}
            <div className="mb-4 flex items-center gap-2 text-xs text-stone-500">
              <button
                onClick={() => setActiveView('home')}
                className="hover:text-stone-900 cursor-pointer"
              >
                {t.navHome}
              </button>
              <span>/</span>
              <span className="text-stone-800 font-semibold">{t.navShop}</span>
              {activeCategory && (
                <>
                  <span>/</span>
                  <span className="text-amber-900 font-bold">
                    {language === 'bn' ? activeCategory.nameBn : activeCategory.nameEn}
                  </span>
                </>
              )}
            </div>

            {/* Category Specialized Heritage Section with Tabs & Subcategories (Requirement 5 & 7) */}
            {activeCategory && (
              <CategoryHeritageHeader
                category={activeCategory}
                language={language}
                selectedSubcategoryId={filters.subcategoryId}
                onSelectSubcategory={(subcatId) =>
                  setFilters({ ...filters, subcategoryId: subcatId || undefined })
                }
              />
            )}

            {/* Catalog Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200/80 mb-6 shadow-2xs">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-800 flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t.filters}</span>
              </button>

              {/* Active Filter Indicators */}
              <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500">
                {filters.categoryId && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-medium">
                    Category: {categories.find((c) => c.id === filters.categoryId)?.nameEn}
                  </span>
                )}
                {filters.colorFamily && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-medium capitalize">
                    Tone: {filters.colorFamily}
                  </span>
                )}
                {filters.ageRange && filters.ageRange !== 'All Ages' && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-medium">
                    Age: {filters.ageRange}
                  </span>
                )}
              </div>

              {/* Sorting and Amazon-Style Grid / List Toggle (Requirement 10) */}
              <div className="flex items-center gap-3 ml-auto text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 hidden sm:inline">{t.sortBy}:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as any })
                    }
                    className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800"
                  >
                    <option value="relevance">{t.sortRelevance}</option>
                    <option value="newest">{t.sortNewest}</option>
                    <option value="price_asc">{t.sortPriceLowHigh}</option>
                    <option value="price_desc">{t.sortPriceHighLow}</option>
                    <option value="top_rated">{t.sortTopRated}</option>
                    <option value="top_selling">{t.sortTopSelling}</option>
                    <option value="biggest_discount">{t.sortDiscount}</option>
                  </select>
                </div>

                {/* Amazon-Inspired Grid vs List View Toggle */}
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setIsListView(false)}
                    className={`p-2 cursor-pointer transition-colors ${
                      !isListView ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsListView(true)}
                    className={`p-2 cursor-pointer transition-colors ${
                      isListView ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
                    }`}
                    title="Amazon-style List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Layout: Filters Sidebar (Desktop) + Products Listing */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              
              {/* Desktop Filters Sidebar (With Color RAM Spectrum + Age Slider) */}
              <div className="hidden lg:block lg:col-span-1 sticky top-24">
                <FilterSidebar
                  filters={filters}
                  categories={categories}
                  language={language}
                  onFilterChange={setFilters}
                  onResetFilters={() => setFilters(defaultFilters)}
                />
              </div>

              {/* Products Catalog Grid or Amazon-Style List */}
              <div className="lg:col-span-3">
                {shopProducts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 space-y-3">
                    <p className="font-serif text-base font-bold text-stone-800">
                      {t.searchEmptyTitle}
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      {t.searchEmptyDesc}
                    </p>
                    <button
                      onClick={() => setFilters(defaultFilters)}
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 cursor-pointer"
                    >
                      {t.resetFilters}
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      isListView
                        ? 'flex flex-col gap-4'
                        : 'grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6'
                    }
                  >
                    {shopProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        language={language}
                        isWishlisted={wishlist.includes(p.id)}
                        isListView={isListView}
                        onToggleWishlist={handleToggleWishlist}
                        onSelectProduct={handleSelectProduct}
                        onQuickAddToCart={handleAddToCart}
                        onDirectOrder={handleOpenDirectOrder}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        language={language}
        onSelectCategory={handleSelectCategory}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
      />

      {/* Floating WhatsApp Contact */}
      <WhatsAppButton language={language} />

      {/* Mobile Sticky Bottom Navigation (5 tabs: Home, Category, Sale, Wishlist, Account) */}
      <MobileBottomNav
        language={language}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenFlashSale={() => setActiveView('flash-sale')}
        onNavigateHome={() => setActiveView('home')}
        onNavigateCategory={() => setActiveView('shop')}
        activeView={activeView}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* ========================================================
          GLOBAL MODALS
          ======================================================== */}
      
      {/* 1. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        language={language}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedDiscount={appliedDiscount}
        appliedCodeName={appliedCodeName}
        onApplyCode={(codeName, discount) => {
          setAppliedDiscount(discount);
          setAppliedCodeName(codeName);
        }}
      />

      {/* 1.1 Dedicated Wishlist Modal (Requirement 1: View Loved Sarees Collection & Direct Buy) */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        language={language}
        wishlistIds={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        onQuickAddToCart={handleAddToCart}
        onDirectOrder={handleOpenDirectOrder}
        onExploreShop={() => {
          setIsWishlistOpen(false);
          setActiveView('shop');
        }}
      />

      {/* 2. Checkout Modal (100% Free Nationwide Delivery, COD Default, Loyalty Points) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        language={language}
        appliedDiscount={appliedDiscount}
        appliedCodeName={appliedCodeName}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 3. 1-Click Express Direct Order Modal */}
      {isDirectOrderOpen && directOrderProduct && (
        <DirectOrderModal
          isOpen={isDirectOrderOpen}
          onClose={() => {
            setIsDirectOrderOpen(false);
            setDirectOrderProduct(null);
          }}
          product={directOrderProduct}
          initialVariant={directOrderVariant}
          language={language}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* 4. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        language={language}
        initialOrderId={trackingOrderId}
      />

      {/* 5. Customer Account Modal with Loyalty Points, Language, Dark/Light Mode & About */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenOrderTracking={(ordId) => {
          setTrackingOrderId(ordId);
          setIsTrackingOpen(true);
        }}
        onSelectProduct={handleSelectProduct}
        onOpenAdmin={() => {
          setIsAccountOpen(false);
          setActiveView('admin');
        }}
      />

      {/* 5.1 Real-Time Interactive Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        language={language}
        onOpenOrderTracking={(ordId) => {
          if (ordId) setTrackingOrderId(ordId);
          setIsTrackingOpen(true);
        }}
        onOpenFlashSale={() => setActiveView('flash-sale')}
        onOpenAccount={() => setIsAccountOpen(true)}
        onNavigateShop={() => setActiveView('shop')}
      />

      {/* 6. Intelligent Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        onSelectProduct={handleSelectProduct}
        onViewAllResults={(q) => {
          setFilters({ ...defaultFilters, searchQuery: q });
          setActiveView('shop');
        }}
      />

      {/* 7. Drape & Saree Measurement Guide */}
      <SareeGuideModal
        isOpen={isSareeGuideOpen}
        onClose={() => setIsSareeGuideOpen(false)}
        language={language}
      />

      {/* 8. Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto z-10">
            <FilterSidebar
              filters={filters}
              categories={categories}
              language={language}
              onFilterChange={(newF) => {
                setFilters(newF);
                setIsMobileFiltersOpen(false);
              }}
              onResetFilters={() => {
                setFilters(defaultFilters);
                setIsMobileFiltersOpen(false);
              }}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 9. Order Placed Success Toast */}
      {showOrderSuccessToast && lastPlacedOrder && (
        <div className="fixed bottom-16 lg:bottom-6 left-4 sm:left-6 z-50 max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.orderConfirmed}</span>
            </div>
            <button
              onClick={() => setShowOrderSuccessToast(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Order <span className="font-mono font-bold text-amber-950">#{lastPlacedOrder.id}</span> placed successfully with Cash on Delivery & Free Shipping.
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setShowOrderSuccessToast(false);
                setTrackingOrderId(lastPlacedOrder.id);
                setIsTrackingOpen(true);
              }}
              className="px-3.5 py-1.5 bg-amber-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 cursor-pointer"
            >
              {t.trackYourOrder} →
            </button>
          </div>
        </div>
      )}

      {/* 10. Interactive Wishlist Toast with Quick View Button */}
      {wishlistToast && (
        <WishlistToast
          toast={wishlistToast}
          onClose={() => setWishlistToast(null)}
          language={language}
          onOpenWishlist={() => {
            setWishlistToast(null);
            setIsWishlistOpen(true);
          }}
        />
      )}

    </div>
  );
}
