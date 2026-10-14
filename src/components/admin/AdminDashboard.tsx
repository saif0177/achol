import React, { useState, useEffect } from 'react';
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
  Check,
  QrCode,
  Eye,
  Play,
  Pause,
  FolderPlus,
  BookOpen,
  Gift,
  Copy,
  Megaphone,
  X,
  Table,
  Percent,
  Flame
} from 'lucide-react';
import { Product, Order, Banner, Category, Language, OrderStatus, FlashSaleCampaign, LandingPopupConfig, CategoryArticle, Promotion, PromotionType, HiddenPromotionalCategory, TopAnnouncement, TopAnnouncementBarConfig, Coupon } from '../../types';
import { store } from '../../services/store';
import { ProductFormModal } from './ProductFormModal';
import { SareeQRCodeModal } from './SareeQRCodeModal';
import { SareeDetailModal } from './SareeDetailModal';
import { SareeSpreadsheet } from './SareeSpreadsheet';
import { BusinessHealthAnalytics } from './BusinessHealthAnalytics';
import { CouponModal } from './CouponModal';
import { ImageUploadBrowser } from '../common/ImageUploadBrowser';
import { AdminFormBuilder, AdminFormSchema } from './AdminFormBuilder';
import { handleImageError } from '../../utils/imageHelper';
import { UniversalPromotionBuilder } from './UniversalPromotionBuilder';

interface AdminDashboardProps {
  onClose: () => void;
  language: Language;
}

// Helper: Live Countdown Timer component inside Admin Panel
const AdminLiveCountdown: React.FC<{ endTime?: string; hasTimer: boolean }> = ({ endTime, hasTimer }) => {
  const [remaining, setRemaining] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    if (!hasTimer || !endTime) return;

    const update = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ hours, minutes, seconds, isExpired: false });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime, hasTimer]);

  if (!hasTimer) {
    return <span className="text-stone-400 font-mono text-[10px]">No Timer</span>;
  }
  if (remaining.isExpired) {
    return <span className="text-rose-600 font-mono text-[10px] font-bold">Offer Expired</span>;
  }
  return (
    <span className="text-amber-800 dark:text-amber-400 font-mono text-[11px] font-bold flex items-center gap-1">
      <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
      <span>
        {String(remaining.hours).padStart(2, '0')}h {String(remaining.minutes).padStart(2, '0')}m {String(remaining.seconds).padStart(2, '0')}s
      </span>
    </span>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  language
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'category_details' | 'flash_sales' | 'popup_banner' | 'promotions' | 'announcements' | 'orders' | 'coupons' | 'offers'
  >('overview');

  // Top Announcement Bar states
  const [announcementConfig, setAnnouncementConfig] = useState<TopAnnouncementBarConfig>(() => store.getTopAnnouncementConfig());
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<TopAnnouncement | null>(null);
  const [announcementSavedToast, setAnnouncementSavedToast] = useState(false);
  const [previewTickerIndex, setPreviewTickerIndex] = useState(0);

  // Modals & Sub-forms
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [viewingSaree, setViewingSaree] = useState<Product | null>(null);
  const [selectedProductForQr, setSelectedProductForQr] = useState<Product | null>(null);

  // Coupons Engine (Requirements 1, 2, 3, 4, 5)
  const [coupons, setCoupons] = useState<Coupon[]>(() => store.getAllCouponsAdmin());
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponSearch, setCouponSearch] = useState('');
  const [couponScopeFilter, setCouponScopeFilter] = useState<'all' | 'active' | 'paused'>('all');

  // Inline Subcategories State (Requirement 2)
  const [inlineSubcatInputs, setInlineSubcatInputs] = useState<Record<string, { nameEn: string; nameBn: string }>>({});

  // Requirement 2: Category Details Blogger-Style Editor State
  const [selectedArticleCategoryId, setSelectedArticleCategoryId] = useState<string>('dhakai-jamdani');
  const [articleSavedToast, setArticleSavedToast] = useState(false);

  // Dynamic Form Builder states
  const [showFlashSaleForm, setShowFlashSaleForm] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSaleCampaign | null>(null);

  const [showPopupForm, setShowPopupForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState<LandingPopupConfig | null>(null);

  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);

  // Hidden Promotional Categories & Promotion targeting states (Requirement 2, 4, 5, 6)
  const [hiddenCategories, setHiddenCategories] = useState<HiddenPromotionalCategory[]>(() => store.getHiddenPromotionalCategories());
  const [showPromoCategoryForm, setShowPromoCategoryForm] = useState(false);
  const [newPromoCatNameEn, setNewPromoCatNameEn] = useState('');
  const [newPromoCatNameBn, setNewPromoCatNameBn] = useState('');
  const [newPromoCatDesc, setNewPromoCatDesc] = useState('');

  // Selected product IDs, exclusions, coupon, and delivery for Promotion Form
  const [promoSelectedProductIds, setPromoSelectedProductIds] = useState<string[]>([]);
  const [promoExcludedProductIds, setPromoExcludedProductIds] = useState<string[]>([]);
  const [promoHasFreeDelivery, setPromoHasFreeDelivery] = useState<boolean>(false);
  const [promoScope, setPromoScope] = useState<'all' | 'products' | 'category'>('category');
  const [promoSelectedCategoryId, setPromoSelectedCategoryId] = useState<string>('');
  const [promoType, setPromoType] = useState<PromotionType>('percentage');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(15);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(500);
  const [promoSalePrice, setPromoSalePrice] = useState<number>(2950);
  const [promoSelectedCouponCode, setPromoSelectedCouponCode] = useState<string>('');
  const [promoDestinationType, setPromoDestinationType] = useState<string>('offer_page');
  const [promoDestinationLink, setPromoDestinationLink] = useState<string>('');
  const [showAddSareesModal, setShowAddSareesModal] = useState<boolean>(false);
  const [sareeSearchInModal, setSareeSearchInModal] = useState<string>('');

  useEffect(() => {
    if (editingPromo) {
      setPromoSelectedProductIds(editingPromo.productIds || []);
      setPromoExcludedProductIds(editingPromo.excludedProductIds || []);
      setPromoHasFreeDelivery(editingPromo.hasFreeDelivery ?? (editingPromo.type === 'free_delivery'));
      setPromoSelectedCategoryId(editingPromo.promotionalCategoryId || hiddenCategories[0]?.id || '');
      setPromoType(editingPromo.type || 'percentage');
      setPromoDiscountPercent(editingPromo.discountPercent ?? 15);
      setPromoDiscountAmount(editingPromo.discountAmount ?? 500);
      setPromoSalePrice(editingPromo.salePrice ?? 2950);
      setPromoSelectedCouponCode(editingPromo.selectedCouponCode || editingPromo.code || '');
      setPromoDestinationType(editingPromo.destinationType || 'offer_page');
      setPromoDestinationLink(editingPromo.destinationLink || '');
      setPromoScope(
        editingPromo.productIds && editingPromo.productIds.length > 0
          ? 'products'
          : editingPromo.promotionalCategoryId
          ? 'category'
          : 'category'
      );
    } else {
      setPromoSelectedProductIds([]);
      setPromoExcludedProductIds([]);
      setPromoHasFreeDelivery(false);
      setPromoSelectedCategoryId(hiddenCategories[0]?.id || '');
      setPromoType('percentage');
      setPromoDiscountPercent(15);
      setPromoDiscountAmount(500);
      setPromoSalePrice(2950);
      setPromoSelectedCouponCode('');
      setPromoDestinationType('offer_page');
      setPromoDestinationLink('');
      setPromoScope('category');
    }
  }, [editingPromo, hiddenCategories]);

  // Live Data State
  const [products, setProducts] = useState<Product[]>(store.getAllProductsAdmin());
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [categories, setCategories] = useState<Category[]>(store.getAllCategoriesAdmin());
  const [flashSales, setFlashSales] = useState<FlashSaleCampaign[]>(store.getAllFlashSalesAdmin());
  const [landingPopups, setLandingPopups] = useState<LandingPopupConfig[]>(store.getAllLandingPopupsAdmin());
  const [promotions, setPromotions] = useState<Promotion[]>(store.getAllPromotionsAdmin());

  // Search queries
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const refreshData = () => {
    setProducts([...store.getAllProductsAdmin()]);
    setOrders([...store.getOrders()]);
    setCategories([...store.getAllCategoriesAdmin()]);
    setFlashSales([...store.getAllFlashSalesAdmin()]);
    setLandingPopups([...store.getAllLandingPopupsAdmin()]);
    setPromotions([...store.getAllPromotionsAdmin()]);
    setHiddenCategories([...store.getHiddenPromotionalCategories()]);
    setAnnouncementConfig({ ...store.getTopAnnouncementConfig() });
    setCoupons([...store.getAllCouponsAdmin()]);
  };

  // Requirement 3: Real-time updates across the admin panel on any store change
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, []);

  const handleSaveCoupon = (savedCoupon: Coupon) => {
    store.saveCoupon(savedCoupon);
    refreshData();
    setShowCouponModal(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id: string) => {
    store.deleteCoupon(id);
    refreshData();
    setShowCouponModal(false);
    setEditingCoupon(null);
  };

  const handleAddInlineSubcategory = (catId: string) => {
    const input = inlineSubcatInputs[catId];
    if (!input || !input.nameEn.trim()) {
      alert('Please enter a subcategory name in English.');
      return;
    }
    const slug = input.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    store.addSubcategory(catId, {
      id: slug,
      nameEn: input.nameEn.trim(),
      nameBn: input.nameBn.trim() || input.nameEn.trim(),
      slug
    });
    setInlineSubcatInputs((prev) => ({
      ...prev,
      [catId]: { nameEn: '', nameBn: '' }
    }));
    refreshData();
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

  // ==========================================
  // SCHEMAS FOR ADMIN FORM BUILDER
  // ==========================================
  
  // 1. Flash Sale Campaign Schema
  const flashSaleSchema: AdminFormSchema = {
    id: 'flash-sale-form',
    titleEn: editingFlashSale ? 'Edit Flash Sale Deal' : 'Create Flash Sale Deal',
    titleBn: editingFlashSale ? 'ফ্ল্যাশ সেল অফার সম্পাদনা' : 'নতুন ফ্ল্যাশ সেল অফার তৈরি',
    submitButtonText: editingFlashSale ? 'Update Flash Sale' : 'Activate Flash Sale',
    sections: [
      {
        id: 'campaign-basics',
        titleEn: '1. Campaign Offer Details',
        titleBn: '১. অফার ও ক্যাম্পেইনের বিবরণ',
        icon: Zap,
        fields: [
          {
            name: 'titleEn',
            labelEn: 'Offer Title (English)',
            labelBn: 'অফারের নাম (ইংরেজি)',
            type: 'text',
            required: true,
            placeholder: 'e.g. Royal Jamdani Flash Drop — Flat 20% OFF'
          },
          {
            name: 'titleBn',
            labelEn: 'Offer Title (বাংলা)',
            labelBn: 'অফারের নাম (বাংলা)',
            type: 'text',
            required: true,
            placeholder: 'যেমন: রাজকীয় জামদানি ধামাকা অফার — ফ্ল্যাট ২০% ছাড়'
          },
          {
            name: 'discountPercent',
            labelEn: 'Discount Percentage (%)',
            labelBn: 'ছাড়ের পরিমাণ (%)',
            type: 'number',
            required: true,
            min: 5,
            max: 75,
            defaultValue: 15
          },
          {
            name: 'displayMode',
            labelEn: 'Banner Display Format',
            labelBn: 'ব্যানার ডিসপ্লে ফরম্যাট',
            type: 'select',
            options: [
              { value: 'banner_with_text', labelEn: 'Rich Banner with Text, Badge & Countdown' },
              { value: 'image_only', labelEn: 'Dedicated Graphic Banner Only (Upload from Photoshop, no overlay text)' }
            ],
            defaultValue: 'banner_with_text'
          },
          {
            name: 'bannerImage',
            labelEn: 'Banner Image (Upload or URL)',
            labelBn: 'ব্যানার ছবি (আপলোড বা লিংক)',
            type: 'image',
            gridCols: 2,
            required: true,
            defaultValue: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg',
            sampleImages: [
              { label: 'Fabrilife Promo Banner', url: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg' },
              { label: 'Crimson Jamdani Saree', url: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg' },
              { label: 'Tangail Taat Handloom', url: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg' },
              { label: 'Rajshahi Pure Silk', url: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg' }
            ]
          }
        ]
      },
      {
        id: 'campaign-timer',
        titleEn: '2. Live Countdown Timer Settings',
        titleBn: '২. লাইভ কাউন্টডাউন টাইমার নিয়ন্ত্রণ',
        icon: Clock,
        fields: [
          {
            name: 'hasTimer',
            labelEn: 'Enable Individual Countdown Timer',
            labelBn: 'লাইভ টাইমার চালু করুন',
            type: 'switch',
            defaultValue: true,
            placeholder: 'Displays ticking countdown clock on customer site and admin panel'
          },
          {
            name: 'endTime',
            labelEn: 'Offer Expiration Date & Time',
            labelBn: 'অফার সমাপ্তির সময় ও তারিখ',
            type: 'countdown_timer',
            gridCols: 2,
            dependsOn: { field: 'hasTimer', value: true },
            defaultValue: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'campaign-actions',
        titleEn: '3. Action Button & Navigation Link',
        titleBn: '৩. অ্যাকশন বাটন ও লিংক',
        icon: Tag,
        fields: [
          {
            name: 'showButton',
            labelEn: 'Show Action Button on Banner',
            labelBn: 'ব্যানারে বাটন প্রদর্শন করুন',
            type: 'switch',
            defaultValue: true
          },
          {
            name: 'buttonTextEn',
            labelEn: 'Button Text (English)',
            type: 'text',
            defaultValue: 'Shop Flash Deals',
            dependsOn: { field: 'showButton', value: true }
          },
          {
            name: 'buttonTextBn',
            labelEn: 'Button Text (বাংলা)',
            type: 'text',
            defaultValue: 'অফার কিনুন',
            dependsOn: { field: 'showButton', value: true }
          },
          {
            name: 'targetLink',
            labelEn: 'Direct Redirect URL (Click Anywhere on Banner to Open)',
            labelBn: 'রিডাইরেক্ট ইউআরএল / লিংক (ব্যানারের যেকোনো জায়গায় ক্লিক করলে যাবে)',
            type: 'text',
            placeholder: 'e.g. /flash-sale, /offers, /shop, /category/dhakai-jamdani, or https://...',
            defaultValue: 'flash-sale',
            helperText: 'Clicking anywhere on this flash sale banner will redirect visitor to this URL'
          },
          {
            name: 'badgeTextEn',
            labelEn: 'Badge Ribbon (e.g. LIMITED FLASH DROP)',
            type: 'text',
            defaultValue: 'LIMITED FLASH DROP'
          },
          {
            name: 'isActive',
            labelEn: 'Campaign Active Status',
            type: 'switch',
            defaultValue: true,
            placeholder: 'Active on website'
          }
        ]
      }
    ]
  };

  // 2. Landing Popup Banner Schema (Requirement 3: multiple random popups, image-only Photoshop support)
  const landingPopupSchema: AdminFormSchema = {
    id: 'popup-banner-form',
    titleEn: editingPopup ? 'Edit Landing Pop-up Banner' : 'Add New Landing Pop-up Banner',
    titleBn: editingPopup ? 'পপ-আপ ব্যানার সম্পাদনা' : 'নতুন ল্যান্ডিং পপ-আপ ব্যানার তৈরি',
    submitButtonText: editingPopup ? 'Update Pop-up' : 'Save Pop-up Banner',
    sections: [
      {
        id: 'popup-basics',
        titleEn: '1. Pop-up Format & Visual Image',
        titleBn: '১. পপ-আপ ব্যানার ও ছবি',
        icon: Tag,
        fields: [
          {
            name: 'isActive',
            labelEn: 'Enable this Pop-up Banner',
            labelBn: 'পপ-আপ সক্রিয় রাখুন',
            type: 'switch',
            defaultValue: true,
            placeholder: 'When enabled, shows randomly on visitor landing'
          },
          {
            name: 'displayMode',
            labelEn: 'Display Format',
            labelBn: 'ফরম্যাট নির্বাচন',
            type: 'select',
            options: [
              { value: 'standard', labelEn: 'Luxury Modal Card with Offer & Copyable Code' },
              { value: 'image_only', labelEn: 'Pure Graphic Image Banner Only (From Photoshop/Designer, tap to view)' }
            ],
            defaultValue: 'standard'
          },
          {
            name: 'image',
            labelEn: 'Banner Graphic Image (Upload or URL)',
            labelBn: 'ব্যানার ইমেজ (আপলোড বা লিংক)',
            type: 'image',
            gridCols: 2,
            required: true,
            defaultValue: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
            sampleImages: [
              { label: 'Artisan Jamdani Loom', url: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg' },
              { label: 'Royal Crimson Jamdani', url: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg' },
              { label: 'Emerald Rajshahi Silk', url: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg' }
            ]
          }
        ]
      },
      {
        id: 'popup-copy',
        titleEn: '2. Offer Details & Coupon',
        titleBn: '২. অফার বার্তা ও কুপন কোড',
        icon: Sparkles,
        fields: [
          {
            name: 'titleEn',
            labelEn: 'Heading (English)',
            type: 'text',
            placeholder: 'e.g. Heritage Festival Privilege'
          },
          {
            name: 'titleBn',
            labelEn: 'Heading (বাংলা)',
            type: 'text',
            placeholder: 'যেমন: ঐতিহ্য উৎসবের বিশেষ ছাড়'
          },
          {
            name: 'subtitleEn',
            labelEn: 'Offer Subtitle (English)',
            type: 'textarea',
            placeholder: 'e.g. Enjoy ৳500 OFF on your first handloom saree with Free Nationwide Delivery!'
          },
          {
            name: 'subtitleBn',
            labelEn: 'Offer Subtitle (বাংলা)',
            type: 'textarea',
            placeholder: 'যেমন: প্রথম অর্ডারে নগদ ৫০০ টাকা ছাড় ও সারাদেশে ফ্রি ডেলিভারি!'
          },
          {
            name: 'discountCode',
            labelEn: 'Coupon / Voucher Code',
            type: 'text',
            placeholder: 'e.g. WELCOME500'
          }
        ]
      },
      {
        id: 'popup-timer',
        titleEn: '3. Countdown Timer & Action Link',
        titleBn: '৩. কাউন্টডাউন টাইমার ও লিংক',
        icon: Clock,
        fields: [
          {
            name: 'hasTimer',
            labelEn: 'Display Live Countdown Timer on Pop-up',
            type: 'switch',
            defaultValue: false
          },
          {
            name: 'endTime',
            labelEn: 'Pop-up Countdown Expiration Time',
            type: 'countdown_timer',
            gridCols: 2,
            dependsOn: { field: 'hasTimer', value: true },
            defaultValue: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
          },
          {
            name: 'ctaTextEn',
            labelEn: 'Button Text (English)',
            type: 'text',
            defaultValue: 'Claim Offer & Shop'
          },
          {
            name: 'ctaLink',
            labelEn: 'Direct Redirect URL (Click Anywhere on Pop-up to Open)',
            labelBn: 'রিডাইরেক্ট ইউআরএল / লিংক (পপ-আপে যেকোনো জায়গায় ক্লিক করলে যাবে)',
            type: 'text',
            placeholder: 'e.g. /shop, /flash-sale, /offers, /category/dhakai-jamdani, or https://...',
            defaultValue: 'shop',
            helperText: 'Clicking anywhere on this pop-up banner or graphic will redirect the customer to this URL'
          }
        ]
      }
    ]
  };

  // 3. Category Schema (Requirement 4)
  const categorySchema: AdminFormSchema = {
    id: 'category-form',
    titleEn: 'Add New Saree Category',
    titleBn: 'নতুন শাড়ি ক্যাটাগরি তৈরি',
    submitButtonText: 'Save Category',
    sections: [
      {
        id: 'cat-info',
        titleEn: 'Category Information',
        icon: Layers,
        fields: [
          {
            name: 'nameEn',
            labelEn: 'Category Name (English)',
            type: 'text',
            required: true,
            placeholder: 'e.g. Monipuri Handloom'
          },
          {
            name: 'nameBn',
            labelEn: 'Category Name (বাংলা)',
            type: 'text',
            required: true,
            placeholder: 'যেমন: মণিপুরি তাঁতের শাড়ি'
          },
          {
            name: 'image',
            labelEn: 'Representative Image',
            type: 'image',
            gridCols: 2,
            defaultValue: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'
          },
          {
            name: 'descriptionEn',
            labelEn: 'Description (English)',
            type: 'textarea',
            placeholder: 'Authentic hand-woven sarees with regional signature motifs.'
          },
          {
            name: 'descriptionBn',
            labelEn: 'Description (বাংলা)',
            type: 'textarea',
            placeholder: 'ঐতিহ্যবাহী বুননে তৈরি খাঁটি শাড়ি।'
          }
        ]
      }
    ]
  };

  // 4. Subcategory Schema (Requirement 4)
  const subcategorySchema: AdminFormSchema = {
    id: 'subcategory-form',
    titleEn: 'Add Subcategory',
    titleBn: 'সাব-ক্যাটাগরি তৈরি',
    submitButtonText: 'Add Subcategory',
    sections: [
      {
        id: 'subcat-info',
        titleEn: 'Subcategory Assignment',
        icon: Layers,
        fields: [
          {
            name: 'categoryId',
            labelEn: 'Select Parent Category',
            type: 'select',
            required: true,
            options: categories.map((c) => ({
              value: c.id,
              labelEn: `${c.nameEn} (${c.nameBn})`
            }))
          },
          {
            name: 'nameEn',
            labelEn: 'Subcategory Name (English)',
            type: 'text',
            required: true,
            placeholder: 'e.g. 100-Count Pure Cotton'
          },
          {
            name: 'nameBn',
            labelEn: 'Subcategory Name (বাংলা)',
            type: 'text',
            required: true,
            placeholder: 'যেমন: ১০০ কাউন্ট মিহি সুতি'
          }
        ]
      }
    ]
  };

  // Handlers for Form Builder submissions
  const handleSaveFlashSale = (values: Record<string, any>) => {
    const saleId = editingFlashSale ? editingFlashSale.id : `fs-${Date.now()}`;
    const newCampaign: FlashSaleCampaign = {
      id: saleId,
      titleEn: values.titleEn,
      titleBn: values.titleBn,
      discountPercent: Number(values.discountPercent) || 15,
      hasTimer: Boolean(values.hasTimer),
      endTime: values.endTime || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      isActive: values.isActive !== undefined ? Boolean(values.isActive) : true,
      bannerImage: values.bannerImage || '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg',
      displayMode: values.displayMode || 'banner_with_text',
      showButton: values.showButton !== undefined ? Boolean(values.showButton) : true,
      buttonTextEn: values.buttonTextEn || 'Shop Flash Deals',
      buttonTextBn: values.buttonTextBn || 'অফার কিনুন',
      targetLink: values.targetLink || 'flash-sale',
      badgeTextEn: values.badgeTextEn || 'LIMITED FLASH DROP',
      badgeTextBn: 'সীমিত সময়ের ধামাকা'
    };

    store.saveFlashSale(newCampaign);
    refreshData();
    setShowFlashSaleForm(false);
    setEditingFlashSale(null);
  };

  const handleSaveLandingPopup = (values: Record<string, any>) => {
    const popupId = editingPopup ? editingPopup.id : `popup-${Date.now()}`;
    const newPopup: LandingPopupConfig = {
      id: popupId,
      isActive: values.isActive !== undefined ? Boolean(values.isActive) : true,
      titleEn: values.titleEn || '',
      titleBn: values.titleBn || '',
      subtitleEn: values.subtitleEn || '',
      subtitleBn: values.subtitleBn || '',
      image: values.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
      discountCode: values.discountCode || '',
      ctaTextEn: values.ctaTextEn || 'Shop Collection',
      ctaTextBn: values.ctaTextBn || 'কালেকশন দেখুন',
      ctaLink: values.ctaLink || 'shop',
      displayMode: values.displayMode || 'standard',
      hasTimer: Boolean(values.hasTimer),
      endTime: values.endTime || new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    };

    store.saveLandingPopup(newPopup);
    refreshData();
    setShowPopupForm(false);
    setEditingPopup(null);
  };

  const handleSaveCategory = (values: Record<string, any>) => {
    const slug = values.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = {
      id: slug,
      nameEn: values.nameEn,
      nameBn: values.nameBn || values.nameEn,
      slug,
      image: values.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
      descriptionEn: values.descriptionEn || 'Exquisite authentic handloom collection.',
      descriptionBn: values.descriptionBn || 'ঐতিহ্যবাহী তাঁতের শাড়ির বিশেষ কালেকশন।',
      displayOrder: categories.length + 1,
      isActive: true,
      subcategories: []
    };

    store.saveCategory(newCat);
    refreshData();
    setShowCategoryForm(false);
  };

  const handleSaveSubcategory = (values: Record<string, any>) => {
    const subcatId = values.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
    store.addSubcategory(values.categoryId, {
      id: subcatId,
      nameEn: values.nameEn,
      nameBn: values.nameBn || values.nameEn,
      slug: subcatId
    });
    refreshData();
    setShowSubcategoryForm(false);
  };

  const handleSavePromotion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const promoId = editingPromo ? editingPromo.id : `promo-${Date.now()}`;

    const placements: ('popup' | 'banner' | 'product_card' | 'product_detail' | 'checkout' | 'offers_page')[] = [];
    if (formData.get('place_popup')) placements.push('popup');
    if (formData.get('place_banner')) placements.push('banner');
    if (formData.get('place_card')) placements.push('product_card');
    if (formData.get('place_pdp')) placements.push('product_detail');
    if (formData.get('place_checkout')) placements.push('checkout');
    if (formData.get('place_offers')) placements.push('offers_page');

    const hasFreeDelivery = promoHasFreeDelivery || promoType === 'free_delivery';
    const finalProductIds = promoScope === 'products' ? promoSelectedProductIds : undefined;
    const finalPromoCatId = promoScope === 'category' ? promoSelectedCategoryId : undefined;

    let computedCtaLink = 'shop';
    if (promoDestinationType === 'custom' && promoDestinationLink) {
      computedCtaLink = promoDestinationLink;
    } else if (promoDestinationType === 'offer_page') {
      computedCtaLink = `offer-${promoId}`;
    } else if (promoDestinationType === 'flash_sale') {
      computedCtaLink = 'flash-sale';
    } else if (promoDestinationType === 'actual_category') {
      computedCtaLink = `category/${formData.get('destinationCategoryId') || categories[0]?.id}`;
    }

    const promo: Promotion = {
      id: promoId,
      titleEn: String(formData.get('titleEn') || ''),
      titleBn: String(formData.get('titleBn') || ''),
      subtitleEn: String(formData.get('subtitleEn') || ''),
      subtitleBn: String(formData.get('subtitleBn') || ''),
      type: promoType,
      pricingMethod: promoType === 'percentage' ? 'percentage' : promoType === 'fixed' ? 'fixed' : promoType === 'direct_sale_price' ? 'sale_price' : 'none',
      discountPercent: (promoType === 'percentage' || promoType === 'flash_sale') ? Number(promoDiscountPercent) : undefined,
      discountAmount: promoType === 'fixed' ? Number(promoDiscountAmount) : undefined,
      fixedDiscount: promoType === 'fixed' ? Number(promoDiscountAmount) : undefined,
      salePrice: promoType === 'direct_sale_price' ? Number(promoSalePrice) : undefined,
      code: promoSelectedCouponCode || (formData.get('code') ? String(formData.get('code')).trim().toUpperCase() : undefined),
      selectedCouponCode: promoSelectedCouponCode || undefined,
      minOrderAmount: formData.get('minOrderAmount') ? Number(formData.get('minOrderAmount')) : undefined,
      maxDiscountAmount: formData.get('maxDiscountAmount') ? Number(formData.get('maxDiscountAmount')) : undefined,
      maxUsageLimit: formData.get('maxUsageLimit') ? Number(formData.get('maxUsageLimit')) : undefined,
      startDate: String(formData.get('startDate') || ''),
      endDate: String(formData.get('endDate') || ''),
      isActive: formData.get('isActive') !== null,
      placements: placements.length > 0 ? placements : ['offers_page', 'banner'],
      image: String(formData.get('image') || '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg'),
      ctaTextEn: String(formData.get('ctaTextEn') || 'Shop Special Offer'),
      ctaTextBn: String(formData.get('ctaTextBn') || 'অফার উপভোগ করুন'),
      ctaLink: computedCtaLink,
      destinationType: promoDestinationType as any,
      destinationLink: promoDestinationType === 'offer_page' ? `offer-${promoId}` : (promoDestinationLink || undefined),
      destinationCategoryId: formData.get('destinationCategoryId') ? String(formData.get('destinationCategoryId')) : undefined,
      hasFreeDelivery,
      productIds: finalProductIds,
      promotionalCategoryId: finalPromoCatId,
      excludedProductIds: promoExcludedProductIds.length > 0 ? promoExcludedProductIds : undefined
    };

    store.savePromotion(promo);
    refreshData();
    setShowPromoForm(false);
    setEditingPromo(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white px-4 sm:px-8 h-[60px] border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Customer Store"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-amber-300">
                AANCHOL DHAKA
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Admin Center
              </span>
            </div>
            <span className="text-[11px] text-stone-400 hidden sm:block">
              Dhaka Handloom Inventory & Real-Time Campaign Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            View Live Store
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold shadow-2xs">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'products', label: `Sarees & Inventory (${products.length})`, icon: Package },
          { id: 'coupons', label: `Coupons & Vouchers (${coupons.length})`, icon: Percent },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'category_details', label: 'Category Details & Blog (Blogger)', icon: BookOpen },
          { id: 'flash_sales', label: `Flash Deals & Timers (${flashSales.length})`, icon: Zap },
          { id: 'promotions', label: 'Promotions: Announcements & Marketing', icon: Sparkles },
          { id: 'offers', label: `Unified Offers: Flash Deals & Discounts (${promotions.length})`, icon: Gift },
          { id: 'orders', label: `Orders & Courier (${orders.length})`, icon: Truck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-amber-900 dark:border-amber-400 text-amber-900 dark:text-amber-400 font-bold'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* ========================================================
            TAB 1: OVERVIEW & KPIS
            ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                  Total Order Sales
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
                  ৳{totalSales.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  {totalOrdersCount} orders placed across BD
                </span>
              </div>

              <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                  Active Sarees
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
                  {products.length} Models
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                  {categories.length} Handloom categories
                </span>
              </div>

              <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                  Active Flash Deals
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-rose-600 dark:text-rose-400">
                  {flashSales.filter((s) => s.isActive).length} Live
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                  With live countdown timers
                </span>
              </div>

              <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                  Inventory Alerts
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 dark:text-amber-400">
                  {lowStockCount + outOfStockCount}
                </span>
                <span className="text-[11px] text-rose-600 font-semibold block">
                  {outOfStockCount} out of stock
                </span>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-stone-900 text-white p-6 rounded-2xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="font-serif text-lg font-bold text-amber-300">
                  Manage Campaign Timers & Saree Catalog
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  Add new handloom sarees with multi-color variants studio, configure live flash sale countdown clocks, or upload dedicated Photoshop promo banners.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setProductToEdit(null);
                    setShowProductForm(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Saree</span>
                </button>

                <button
                  onClick={() => {
                    setEditingFlashSale(null);
                    setShowFlashSaleForm(true);
                    setActiveTab('flash_sales');
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>New Flash Sale</span>
                </button>
              </div>
            </div>

            {/* Executive Business Analytics, Graph Charts & Health Monitoring System */}
            <div className="pt-2">
              <BusinessHealthAnalytics
                products={products}
                orders={orders}
                categories={categories}
                flashSales={flashSales}
                language={language}
                onOpenInventorySpreadsheet={() => {
                  setActiveTab('products');
                }}
                onEditProduct={(p) => {
                  setProductToEdit(p);
                  setShowProductForm(true);
                }}
                onViewSaree={(p) => setViewingSaree(p)}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: SAREE MASTER INVENTORY & VARIANTS
            ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <SareeSpreadsheet
              products={products}
              categories={categories}
              hiddenCategories={hiddenCategories}
              language={language}
              onRefresh={refreshData}
              onAddNewProduct={() => {
                setProductToEdit(null);
                setShowProductForm(true);
              }}
              onEditInFullModal={(p) => {
                setProductToEdit(p);
                setShowProductForm(true);
              }}
              onViewMore={(p) => setViewingSaree(p)}
            />
          </div>
        )}

        {/* ========================================================
            TAB 3: CATEGORIES & SUBCATEGORIES MANAGEMENT (Requirement 4)
            ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                  Heritage Saree Categories & Subcategories
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Dynamic categories feed into homepage circles, filter sidebar, and saree catalog.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Category</span>
                </button>
                <button
                  onClick={() => setShowPromoCategoryForm(true)}
                  className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-rose-300" />
                  <span>+ Create Offer / Hidden Category</span>
                </button>
              </div>
            </div>

            {/* Dynamic Form Builder for Category */}
            {showCategoryForm && (
              <div className="bg-amber-50/50 dark:bg-stone-900/80 p-5 rounded-2xl border border-amber-200 dark:border-stone-700 animate-in fade-in duration-200">
                <AdminFormBuilder
                  schema={categorySchema}
                  onSubmit={handleSaveCategory}
                  onCancel={() => setShowCategoryForm(false)}
                  language={language}
                />
              </div>
            )}

            {/* Categories Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0">
                          <img
                            src={cat.image}
                            alt={cat.nameEn}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                            {cat.nameEn}
                          </h4>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {cat.nameBn}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete category ${cat.nameEn}?`)) {
                            store.deleteCategory(cat.id);
                            refreshData();
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                      {cat.descriptionEn}
                    </p>

                    {/* Subcategories (Requirement 2: inside each category, add multiple subcategories without separate top button) */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-stone-400 block">
                        Subcategories ({cat.subcategories?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories?.map((sub) => (
                          <span
                            key={sub.id}
                            className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5"
                          >
                            <span>{sub.nameEn} ({sub.nameBn})</span>
                            <button
                              onClick={() => {
                                store.deleteSubcategory(cat.id, sub.id);
                                refreshData();
                              }}
                              className="text-stone-400 hover:text-rose-600 cursor-pointer font-bold"
                              title="Delete subcategory"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {(!cat.subcategories || cat.subcategories.length === 0) && (
                          <span className="text-xs text-stone-400 italic">No subcategories yet</span>
                        )}
                      </div>

                      {/* Direct Inline Subcategory Form inside category */}
                      <div className="flex items-center gap-1.5 pt-2">
                        <input
                          type="text"
                          placeholder="Subcategory (EN)..."
                          value={inlineSubcatInputs[cat.id]?.nameEn || ''}
                          onChange={(e) =>
                            setInlineSubcatInputs({
                              ...inlineSubcatInputs,
                              [cat.id]: {
                                ...(inlineSubcatInputs[cat.id] || { nameEn: '', nameBn: '' }),
                                nameEn: e.target.value
                              }
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 text-xs border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="বাংলা নাম..."
                          value={inlineSubcatInputs[cat.id]?.nameBn || ''}
                          onChange={(e) =>
                            setInlineSubcatInputs({
                              ...inlineSubcatInputs,
                              [cat.id]: {
                                ...(inlineSubcatInputs[cat.id] || { nameEn: '', nameBn: '' }),
                                nameBn: e.target.value
                              }
                            })
                          }
                          className="w-24 px-2.5 py-1.5 text-xs border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddInlineSubcategory(cat.id)}
                          className="px-2.5 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Promotional Categories Engine (Requirement 2 & 11) */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Hidden Promotional Categories (Campaign Keywords)</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Internal campaign grouping for offers, flash drops &amp; free delivery. Sarees can belong to multiple promotional categories without catalog duplication.
                  </p>
                </div>

                {!showPromoCategoryForm && (
                  <button
                    onClick={() => setShowPromoCategoryForm(true)}
                    className="px-3.5 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Promotional Category</span>
                  </button>
                )}
              </div>

              {/* Add Promo Category Form */}
              {showPromoCategoryForm && (
                <div className="p-4 bg-amber-50/70 dark:bg-stone-900 rounded-2xl border border-amber-300 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      Create New Hidden Promotional Category
                    </span>
                    <button
                      onClick={() => setShowPromoCategoryForm(false)}
                      className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Category Name (English, e.g. Free Delivery Jamdani)"
                      value={newPromoCatNameEn}
                      onChange={(e) => setNewPromoCatNameEn(e.target.value)}
                      className="p-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Category Name (বাংলা, e.g. ফ্রি ডেলিভারি অফার)"
                      value={newPromoCatNameBn}
                      onChange={(e) => setNewPromoCatNameBn(e.target.value)}
                      className="p-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Short Description or campaign target note"
                    value={newPromoCatDesc}
                    onChange={(e) => setNewPromoCatDesc(e.target.value)}
                    className="w-full p-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPromoCatNameEn.trim()) return;
                        const slug = newPromoCatNameEn.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        store.saveHiddenPromotionalCategory({
                          id: `promo-cat-${Date.now()}`,
                          nameEn: newPromoCatNameEn.trim(),
                          nameBn: newPromoCatNameBn.trim() || newPromoCatNameEn.trim(),
                          slug,
                          descriptionEn: newPromoCatDesc.trim() || 'Internal promotional collection',
                          descriptionBn: 'অভ্যন্তরীণ ক্যাম্পেইন কালেকশন',
                          isActive: true,
                          productIds: []
                        });
                        setNewPromoCatNameEn('');
                        setNewPromoCatNameBn('');
                        setNewPromoCatDesc('');
                        setShowPromoCategoryForm(false);
                        refreshData();
                      }}
                      className="px-4 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Save Category
                    </button>
                  </div>
                </div>
              )}

              {/* Promotional Categories Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hiddenCategories.map((promoCat) => {
                  const assignedCount = store.getProductsByPromotionalCategory(promoCat.id).length;
                  return (
                    <div
                      key={promoCat.id}
                      className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-stone-900 dark:text-white">
                            {promoCat.nameEn}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${promoCat.isActive ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        </div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                          {promoCat.nameBn} · {assignedCount} sarees attached
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            store.toggleHiddenPromotionalCategoryActive(promoCat.id);
                            refreshData();
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            promoCat.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-stone-100 text-stone-500 dark:bg-stone-800'
                          }`}
                        >
                          {promoCat.isActive ? 'Active' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete promotional category ${promoCat.nameEn}?`)) {
                              store.deleteHiddenPromotionalCategory(promoCat.id);
                              refreshData();
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: COUPONS & DISCOUNT CONDITIONS (Requirements 3 & 4)
            ======================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-5 h-5 text-amber-900 dark:text-amber-400" />
                  <span>Coupons &amp; Promotional Vouchers</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Manage store coupons, discount rates, eligible sarees &amp; categories, and redemption rules.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search coupon code..."
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingCoupon(null);
                    setShowCouponModal(true);
                  }}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Coupon</span>
                </button>
              </div>
            </div>

            {/* Scope Sub-Filter Tabs (Requirement 1: Remove separate VIP section, filter by status) */}
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100 dark:border-stone-800">
              {[
                { id: 'all', label: `All Coupons (${coupons.length})` },
                { id: 'active', label: `Active (${coupons.filter((c) => c.isActive).length})` },
                { id: 'paused', label: `Paused (${coupons.filter((c) => !c.isActive).length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCouponScopeFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    couponScopeFilter === tab.id
                      ? 'bg-amber-900 text-white dark:bg-amber-400 dark:text-stone-950 shadow-xs'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons
                .filter((c) => {
                  if (couponScopeFilter === 'active' && !c.isActive) return false;
                  if (couponScopeFilter === 'paused' && c.isActive) return false;
                  if (!couponSearch) return true;
                  const q = couponSearch.toLowerCase();
                  return (
                    c.code.toLowerCase().includes(q) ||
                    (c.descriptionEn || '').toLowerCase().includes(q) ||
                    (c.note || '').toLowerCase().includes(q)
                  );
                })
                .map((c) => {
                  const isExpired = c.endDate ? new Date(c.endDate).getTime() < Date.now() : false;
                  const isUsageExceeded = c.maxUsageLimit !== undefined && (c.usageCount || 0) >= c.maxUsageLimit;
                  const usagePercent = c.maxUsageLimit ? Math.min(100, Math.round(((c.usageCount || 0) / c.maxUsageLimit) * 100)) : null;

                  return (
                    <div
                      key={c.id}
                      className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs space-y-3.5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-base text-amber-900 dark:text-amber-400 tracking-wider">
                                {c.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(c.code);
                                  alert(`Copied ${c.code} to clipboard!`);
                                }}
                                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                                title="Copy code"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
                              {c.descriptionEn}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                !c.isActive
                                  ? 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                                  : isExpired || isUsageExceeded
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {!c.isActive ? 'Paused' : isExpired ? 'Expired' : isUsageExceeded ? 'Limit Reached' : 'Active'}
                            </span>
                            </div>
                        </div>

                        {/* Value & Discount Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 rounded-lg text-xs font-bold font-mono">
                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue.toLocaleString()} FLAT OFF`}
                          </span>
                          {c.isFreeDelivery && (
                            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 rounded-lg text-xs font-bold">
                              ✓ Free Delivery
                            </span>
                          )}
                        </div>

                        {/* Applicable To Scope Badge */}
                        <div className="p-2.5 bg-amber-50/60 dark:bg-stone-800/60 rounded-xl border border-amber-200/50 dark:border-stone-700/60 text-[11px] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                            <Layers className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                            <span>
                              {c.applicableTo === 'all' || !c.applicableTo ? (
                                'Applicable: All Sarees (Storewide)'
                              ) : c.applicableTo === 'specific_categories' ? (
                                `Applicable: ${c.applicableCategoryIds?.length || 0} Categories`
                              ) : c.applicableTo === 'specific_subcategories' ? (
                                `Applicable: ${c.applicableSubcategoryIds?.length || 0} Subcategories`
                              ) : c.applicableTo === 'specific_offers' ? (
                                `Applicable: ${c.applicableOfferIds?.length || 0} Promotional Offers`
                              ) : c.applicableTo === 'specific_hidden_categories' ? (
                                `Applicable: ${c.applicableHiddenCategoryIds?.length || 0} Campaign Collections`
                              ) : c.applicableTo === 'specific_products' ? (
                                `Applicable: ${c.applicableProductIds?.length || 0} Specific Sarees`
                              ) : (
                                'Applicable: Multiple Custom Rules'
                              )}
                            </span>
                          </div>

                          {/* Detail summary text */}
                          {c.applicableCategoryIds && c.applicableCategoryIds.length > 0 && (
                            <div className="text-[10px] text-stone-500 truncate">
                              Categories: {c.applicableCategoryIds.join(', ')}
                            </div>
                          )}
                          {c.applicableSubcategoryIds && c.applicableSubcategoryIds.length > 0 && (
                            <div className="text-[10px] text-stone-500 truncate">
                              Subcategories: {c.applicableSubcategoryIds.join(', ')}
                            </div>
                          )}
                          {c.note && (
                            <div className="text-[10px] text-stone-500 italic truncate">
                              Note: {c.note}
                            </div>
                          )}
                        </div>

                        {/* Optional Conditions Details */}
                        <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-2 text-[11px]">
                          {/* Duration */}
                          <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                            <span className="text-stone-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Duration:</span>
                            </span>
                            <span className="font-semibold">
                              {c.startDate && c.endDate
                                ? `${c.startDate.split('T')[0]} → ${c.endDate.split('T')[0]}`
                                : c.endDate
                                ? `Until ${c.endDate.split('T')[0]}`
                                : 'No Expiry'}
                            </span>
                          </div>

                          {/* Usage Limit */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                              <span className="text-stone-400 font-medium">Usage Limit:</span>
                              <span className="font-mono font-semibold">
                                {c.maxUsageLimit ? `${c.usageCount || 0} / ${c.maxUsageLimit} redeemed` : `${c.usageCount || 0} used (Unlimited)`}
                              </span>
                            </div>
                            {usagePercent !== null && (
                              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    usagePercent >= 100 ? 'bg-rose-500' : usagePercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${usagePercent}%` }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Min Order & Max Discount */}
                          {(c.minOrderAmount || c.maxDiscountAmount) && (
                            <div className="pt-1 border-t border-stone-200 dark:border-stone-700/60 flex items-center justify-between text-stone-600 dark:text-stone-300">
                              {c.minOrderAmount ? (
                                <span>Min: <strong className="font-mono">৳{c.minOrderAmount.toLocaleString()}</strong></span>
                              ) : <span />}
                              {c.maxDiscountAmount ? (
                                <span>Max cap: <strong className="font-mono">৳{c.maxDiscountAmount.toLocaleString()}</strong></span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Actions (Requirement 4: Show ONLY an Edit button in the coupon list) */}
                      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400 font-mono">
                          ID: {c.id}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCoupon(c);
                            setShowCouponModal(true);
                          }}
                          className="px-4 py-1.5 bg-amber-900/10 dark:bg-amber-400/10 hover:bg-amber-900 hover:text-white dark:hover:bg-amber-400 dark:hover:text-stone-900 text-amber-900 dark:text-amber-300 border border-amber-900/20 dark:border-amber-400/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          title="Edit Coupon"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: CATEGORY DETAILS & BLOGGER POST EDITOR (Requirement 2)
            ======================================================== */}
        {activeTab === 'category_details' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-900 dark:text-amber-400" />
                  <span>Category Details & Heritage Lore (Blogger-Style Editor)</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Like Blogger.com: Edit and publish rich heritage stories, weaver lore, and short highlights for every category.
                </p>
              </div>

              {articleSavedToast && (
                <div className="px-3.5 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Article Saved & Updated on Store!</span>
                </div>
              )}
            </div>

            {/* Category Select Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                Select Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedArticleCategoryId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    selectedArticleCategoryId === cat.id
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.nameEn}</span>
                  <span className="opacity-70 text-[10px]">({cat.nameBn})</span>
                </button>
              ))}
            </div>

            {/* Blogger-Style Article Form for the Selected Category */}
            {(() => {
              const currentCat = categories.find((c) => c.id === selectedArticleCategoryId) || categories[0];
              if (!currentCat) return null;
              const existingArticle = store.getCategoryArticle(currentCat.id);

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const updatedArticle: CategoryArticle = {
                      id: existingArticle?.id || `art-${currentCat.id}-${Date.now()}`,
                      categoryId: currentCat.id,
                      titleEn: (formData.get('titleEn') as string) || `${currentCat.nameEn} Heritage Lore`,
                      titleBn: (formData.get('titleBn') as string) || `${currentCat.nameBn} কারিগর ইতিহাস`,
                      slug: `${currentCat.slug || currentCat.id}-heritage-story`,
                      summaryEn: (formData.get('summaryEn') as string) || currentCat.descriptionEn,
                      summaryBn: (formData.get('summaryBn') as string) || currentCat.descriptionBn,
                      contentEn: (formData.get('contentEn') as string) || '',
                      contentBn: (formData.get('contentBn') as string) || '',
                      featuredImage: (formData.get('featuredImage') as string) || currentCat.image,
                      author: (formData.get('author') as string) || 'Aanchol Handloom Research Desk',
                      publishedAt: (formData.get('publishedAt') as string) || 'October 2026',
                      readTime: (formData.get('readTime') as string) || '4 min read',
                      tags: ((formData.get('tags') as string) || '')
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                      historicalEra: (formData.get('historicalEra') as string) || '16th Century Generational',
                      artisanHub: (formData.get('artisanHub') as string) || currentCat.originHub || 'Dhaka Division'
                    };

                    store.saveCategoryArticle(updatedArticle);
                    setArticleSavedToast(true);
                    setTimeout(() => setArticleSavedToast(false), 2500);
                  }}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
                        B
                      </div>
                      <div>
                        <span className="font-bold text-sm text-stone-900 dark:text-white block">
                          Blogger Article Editor · {currentCat.nameEn} ({currentCat.nameBn})
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Short summary appears on the saree details colored card; full story appears on blog page.
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Publish & Save to Category</span>
                    </button>
                  </div>

                  {/* Titles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Article / Post Title (English) *
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={existingArticle?.titleEn || `${currentCat.nameEn}: The Living Handloom Heritage & Master Artisan Lore`}
                        required
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Article / Post Title (বাংলা) *
                      </label>
                      <input
                        type="text"
                        name="titleBn"
                        defaultValue={existingArticle?.titleBn || `${currentCat.nameBn}: ঐতিহ্যবাহী বুননশিল্প ও শতাব্দীপ্রাচীন কারিগর ইতিহাস`}
                        required
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Very Short Summary (Displayed on colored saree details card) */}
                  <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-300/70 dark:border-amber-800/60 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>Short Summary (Shown on Saree Details Colored Background Card)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
                          Short Summary (English)
                        </label>
                        <textarea
                          name="summaryEn"
                          rows={2}
                          defaultValue={existingArticle?.summaryEn || currentCat.descriptionEn}
                          className="w-full p-2.5 bg-white dark:bg-stone-800 border border-amber-300/80 rounded-xl text-xs text-stone-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block">
                          Short Summary (বাংলা)
                        </label>
                        <textarea
                          name="summaryBn"
                          rows={2}
                          defaultValue={existingArticle?.summaryBn || currentCat.descriptionBn}
                          className="w-full p-2.5 bg-white dark:bg-stone-800 border border-amber-300/80 rounded-xl text-xs text-stone-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row: Author, Read Time, Image, Loom Hub */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Author Name
                      </label>
                      <input
                        type="text"
                        name="author"
                        defaultValue={existingArticle?.author || 'Aanchol Handloom Research Desk'}
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        name="readTime"
                        defaultValue={existingArticle?.readTime || '4 min read'}
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Artisan Loom Hub
                      </label>
                      <input
                        type="text"
                        name="artisanHub"
                        defaultValue={existingArticle?.artisanHub || currentCat.originHub || 'Demra & Rupganj'}
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Historical Era
                      </label>
                      <input
                        type="text"
                        name="historicalEra"
                        defaultValue={existingArticle?.historicalEra || 'Generational Bengal Heritage'}
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Featured Cover Image URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                      Featured Cover Image URL
                    </label>
                    <input
                      type="text"
                      name="featuredImage"
                      defaultValue={existingArticle?.featuredImage || currentCat.image}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-mono"
                    />
                  </div>

                  {/* Multi-paragraph Full Blog Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Full Blogger Story & Craftsmanship Body (English)
                      </label>
                      <textarea
                        name="contentEn"
                        rows={7}
                        defaultValue={
                          existingArticle?.contentEn ||
                          `${currentCat.nameEn} represents one of Bengal’s timeless handloom expressions. Each weave embodies generational artistry preserved across decades.\n\nWoven with utmost devotion, our master weavers bring forward authentic motifs, premium thread counts, and enduring grace suited for royal festivities and modern wardrobes alike.`
                        }
                        className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-mono leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                        Full Blogger Story & Craftsmanship Body (বাংলা)
                      </label>
                      <textarea
                        name="contentBn"
                        rows={7}
                        defaultValue={
                          existingArticle?.contentBn ||
                          `${currentCat.nameBn} বাংলার ঐতিহ্যবাহী তাঁত সংস্কৃতির এক অনবদ্য নিদর্শন। প্রতিটি সুতায় জড়িয়ে রয়েছে শতাব্দীপ্রাচীন কারিগরদের ভালোবাসা ও অক্লান্ত পরিশ্রম।\n\nআঁচল সরাসরি তাঁতিদের সাথে যুক্ত হয়ে খাঁটি মান ও শ্রেষ্ঠত্বের নিশ্চয়তা প্রদান করে।`
                        }
                        className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-mono leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                      Article Tags (comma-separated, e.g. Dhakai Jamdani, Pitloom, Heritage, Wedding)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={existingArticle?.tags?.join(', ') || `${currentCat.nameEn}, Artisan Weaves, Bangladeshi Handloom, Heritage Collection`}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Category Article (Blogger.com Style)</span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        )}

        {/* ========================================================
            TAB 4: FLASH SALES & LIVE COUNTDOWN TIMERS (Requirements 1 & 2)
            ======================================================== */}
        {activeTab === 'flash_sales' && (
          <div className="space-y-6">
            {/* Offer, Sale & Flash Deal Hub Toolbar */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-4 sm:p-5 rounded-2xl border border-rose-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-300 flex items-center justify-center border border-rose-500/40 shrink-0">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200">
                      Offer, Sale &amp; Flash Deal Control Hub
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                      Live Engine
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Flash Deals are an essential part of Sales &amp; Offers. Easily toggle between Flash Deals, Sales, and Offers:
                  </p>
                </div>
              </div>

              {/* Standout Buttons: Flash Deal, Sale, Offer */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('flash_sales')}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ring-2 ring-amber-300 transform scale-102 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-200 text-amber-200 animate-bounce" />
                  <span>⚡ Flash Deal ({flashSales.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('promotions')}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 hover:border-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>🏷️ Sale</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('promotions')}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-purple-300 border border-stone-700 hover:border-purple-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-purple-400" />
                  <span>🎁 Offer ({promotions.length})</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-rose-600" />
                  <span>Flash Sale Campaigns & Live Timers Engine</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Every offer features its own live countdown timer, discount rate, Photoshop graphic mode, and direct link.
                </p>
              </div>

              {!showFlashSaleForm && (
                <button
                  onClick={() => {
                    setEditingFlashSale(null);
                    setShowFlashSaleForm(true);
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Flash Deal Offer</span>
                </button>
              )}
            </div>

            {/* Dynamic Form Builder for Flash Sales */}
            {showFlashSaleForm && (
              <div className="bg-rose-50/40 dark:bg-stone-900 p-5 rounded-2xl border border-rose-200 dark:border-stone-700 animate-in fade-in duration-200">
                <AdminFormBuilder
                  schema={flashSaleSchema}
                  initialValues={editingFlashSale || undefined}
                  onSubmit={handleSaveFlashSale}
                  onCancel={() => {
                    setShowFlashSaleForm(false);
                    setEditingFlashSale(null);
                  }}
                  language={language}
                />
              </div>
            )}

            {/* Flash Sales List with Live Countdown Timers and Controls */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Active & Scheduled Flash Sale Deals ({flashSales.length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      {/* Banner Image Preview */}
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <img
                          src={sale.bannerImage}
                          alt={sale.titleEn}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] uppercase shadow-xs">
                            {sale.discountPercent}% OFF
                          </span>
                          <span className="px-2 py-0.5 rounded bg-stone-900/80 text-amber-300 font-bold text-[10px] backdrop-blur-xs">
                            {sale.displayMode === 'image_only' ? 'Image Only (Graphic)' : 'Text & Banner'}
                          </span>
                        </div>

                        <span
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                            sale.isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-600 text-stone-200'
                          }`}
                        >
                          {sale.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      {/* Titles */}
                      <div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                          {sale.titleEn}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400 block line-clamp-1">
                          {sale.titleBn}
                        </span>
                      </div>

                      {/* Live Timer Row directly in Admin Panel (Requirement 1) */}
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                        <span className="text-stone-500 dark:text-stone-400 font-medium text-[11px]">
                          Live Timer Status:
                        </span>
                        <AdminLiveCountdown
                          endTime={sale.endTime}
                          hasTimer={sale.hasTimer}
                        />
                      </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          store.toggleFlashSaleActive(sale.id);
                          refreshData();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          sale.isActive
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 hover:bg-amber-200'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-200'
                        }`}
                      >
                        {sale.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{sale.isActive ? 'Pause Sale' : 'Resume Sale'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingFlashSale(sale);
                            setShowFlashSaleForm(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-amber-900 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                          title="Edit Sale & Timer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete flash sale ${sale.titleEn}?`)) {
                              store.deleteFlashSale(sale.id);
                              refreshData();
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete Sale"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: UNIFIED PROMOTIONS, BANNERS & ANNOUNCEMENTS BUILDER
            ======================================================== */}
        {(activeTab === 'promotions' || activeTab === 'popup_banner' || (activeTab as string) === 'announcements') && (
          <UniversalPromotionBuilder language={language} onRefreshData={refreshData} sectionMode="promotions" />
        )}

        {/* ========================================================
            TAB: CAMPAIGN OFFERS & DISCOUNTS (Feeds /offers page)
            ======================================================== */}
        {activeTab === 'offers' && (
          <UniversalPromotionBuilder language={language} onRefreshData={refreshData} sectionMode="offers" />
        )}

        {/* ========================================================
            TAB 6: ORDERS & STEADFAST COURIER
            ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order ID, phone number, customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 dark:text-white focus:outline-none focus:border-amber-700"
                />
              </div>

              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Showing {filteredOrders.length} Orders
              </span>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Order ID & Date</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Ordered Sarees</th>
                      <th className="p-3.5">Amount & COD</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5">Courier Consignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-stone-900 dark:text-white block">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 dark:text-white block">
                            {order.customerName}
                          </span>
                          <span className="font-mono text-stone-500 dark:text-stone-400 text-[11px]">
                            {order.customerPhone}
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate max-w-[180px]">
                            {order.shippingAddress.fullAddress}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-amber-900 dark:text-amber-400 text-[10px]">
                                  {item.code}
                                </span>
                                <span className="truncate max-w-[140px] text-stone-700 dark:text-stone-300">{item.name}</span>
                                <span className="text-stone-400 font-mono text-[10px]">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5 space-y-1">
                          <span className="font-serif font-bold text-stone-900 dark:text-white text-sm block">
                            ৳{order.finalTotal.toLocaleString()}
                          </span>

                          {order.paymentMethod === 'bkash' ? (
                            <div className="space-y-0.5">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-300 text-[10px] font-bold">
                                bKash Payment
                              </span>
                              {order.paymentDetails?.transactionId && (
                                <div className="text-[10px] font-mono text-stone-600 dark:text-stone-300 block">
                                  TrxID: <span className="font-bold text-pink-700 dark:text-pink-400">{order.paymentDetails.transactionId}</span>
                                </div>
                              )}
                              <div className="pt-0.5 flex items-center gap-1.5">
                                {order.paymentStatus === 'paid' ? (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Verified Paid</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      store.updatePaymentStatus(order.id, 'paid');
                                      refreshData();
                                    }}
                                    className="px-2 py-0.5 bg-pink-600 hover:bg-pink-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Verify Payment
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : order.paymentMethod === 'nagad' ? (
                            <div className="space-y-0.5">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 text-[10px] font-bold">
                                Nagad Payment
                              </span>
                              {order.paymentDetails?.transactionId && (
                                <div className="text-[10px] font-mono text-stone-600 dark:text-stone-300 block">
                                  TrxID: <span className="font-bold text-orange-700 dark:text-orange-400">{order.paymentDetails.transactionId}</span>
                                </div>
                              )}
                              <div className="pt-0.5 flex items-center gap-1.5">
                                {order.paymentStatus === 'paid' ? (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Verified Paid</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      store.updatePaymentStatus(order.id, 'paid');
                                      refreshData();
                                    }}
                                    className="px-2 py-0.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Verify Payment
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase block">
                              Cash on Delivery
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 space-y-1">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => {
                              store.updateOrderStatus(order.id, e.target.value as OrderStatus);
                              refreshData();
                            }}
                            className={`px-2 py-1 rounded-lg font-bold text-[10px] border cursor-pointer focus:outline-none ${
                              order.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                                : order.orderStatus === 'cancelled'
                                ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200'
                                : order.orderStatus === 'courier_shipped' || order.orderStatus === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200'
                                : 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                            }`}
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Quality Inspection</option>
                            <option value="packed">Packed</option>
                            <option value="courier_shipped">Steadfast Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {order.courier?.name || 'Steadfast Courier'}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">
                            {order.courier?.consignmentId || 'Pending'}
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

      {/* Saree Form Multi-Step Modal */}
      {showProductForm && (
        <ProductFormModal
          key={productToEdit?.id || 'new-saree'}
          isOpen={showProductForm}
          onClose={() => {
            setShowProductForm(false);
            setProductToEdit(null);
          }}
          productToEdit={productToEdit}
          categories={categories}
          language={language}
          onSaved={refreshData}
        />
      )}

      {/* Saree QR Code Tag Modal (Requirement 4) */}
      <SareeQRCodeModal
        product={selectedProductForQr}
        isOpen={Boolean(selectedProductForQr)}
        onClose={() => setSelectedProductForQr(null)}
        language={language}
      />

      {/* Saree Detail Modal (Requirement 1: View More on Saree shows full details + photos + edit + delete) */}
      {viewingSaree && (
        <SareeDetailModal
          isOpen={Boolean(viewingSaree)}
          onClose={() => setViewingSaree(null)}
          product={viewingSaree}
          categories={categories}
          hiddenCategories={hiddenCategories}
          language={language}
          onEdit={(saree) => {
            setViewingSaree(null);
            setProductToEdit(saree);
            setShowProductForm(true);
          }}
          onDelete={(sareeId) => {
            store.deleteProduct(sareeId);
            refreshData();
            setViewingSaree(null);
          }}
        />
      )}

      {/* Coupon Modal (Requirements 1, 2, 4, 5: Create / Edit Coupon, Applicable To, VIP, Delete) */}
      {showCouponModal && (
        <CouponModal
          isOpen={showCouponModal}
          onClose={() => {
            setShowCouponModal(false);
            setEditingCoupon(null);
          }}
          couponToEdit={editingCoupon}
          onSave={handleSaveCoupon}
          onDelete={handleDeleteCoupon}
        />
      )}

      {/* Add Sarees to Promotional Category Modal (Requirement 6) */}
      {showAddSareesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-900 dark:text-amber-400" />
                  <span>Add Sarees to Promotional Category</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Category:{' '}
                  <strong className="text-amber-950 dark:text-amber-300">
                    {hiddenCategories.find((c) => c.id === promoSelectedCategoryId)?.nameEn || promoSelectedCategoryId}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddSareesModal(false);
                  setSareeSearchInModal('');
                }}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sarees by code or name..."
                  value={sareeSearchInModal}
                  onChange={(e) => setSareeSearchInModal(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Sarees List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {products
                .filter((p) => {
                  if (!sareeSearchInModal) return true;
                  const q = sareeSearchInModal.toLowerCase();
                  return (
                    p.code.toLowerCase().includes(q) ||
                    p.nameEn.toLowerCase().includes(q) ||
                    (p.nameBn && p.nameBn.toLowerCase().includes(q))
                  );
                })
                .map((p) => {
                  const isInCat =
                    Boolean(p.promotionalCategoryIds?.includes(promoSelectedCategoryId)) ||
                    p.promotionalCategoryId === promoSelectedCategoryId;

                  return (
                    <div
                      key={p.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        isInCat
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-300 dark:border-stone-700">
                          <img
                            src={p.primaryImage}
                            alt={p.nameEn}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-amber-900 dark:text-amber-400">
                              {p.code}
                            </span>
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                              {p.nameEn}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                            <span>৳{(p.originalPrice || p.price).toLocaleString()}</span>
                            <span>·</span>
                            <span className="capitalize">{p.categoryId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isInCat ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-[10px] font-bold">
                              ✓ In Category
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                store.removeProductFromHiddenCategory(promoSelectedCategoryId, p.id);
                                refreshData();
                              }}
                              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              store.addProductToHiddenCategory(promoSelectedCategoryId, p.id);
                              refreshData();
                            }}
                            className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddSareesModal(false);
                  setSareeSearchInModal('');
                }}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
