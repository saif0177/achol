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
  X
} from 'lucide-react';
import { Product, Order, Banner, Category, Language, OrderStatus, FlashSaleCampaign, LandingPopupConfig, CategoryArticle, Promotion, HiddenPromotionalCategory, TopAnnouncement, TopAnnouncementBarConfig } from '../../types';
import { store } from '../../services/store';
import { ProductFormModal } from './ProductFormModal';
import { PrivateCodesModal } from './PrivateCodesModal';
import { SareeQRCodeModal } from './SareeQRCodeModal';
import { AdminFormBuilder, AdminFormSchema } from './AdminFormBuilder';

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
    'overview' | 'products' | 'categories' | 'category_details' | 'flash_sales' | 'popup_banner' | 'promotions' | 'announcements' | 'orders' | 'private_codes'
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
  const [showPrivateCodes, setShowPrivateCodes] = useState(false);
  const [selectedProductForQr, setSelectedProductForQr] = useState<Product | null>(null);

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

  // Hidden Promotional Categories & Promotion targeting states (Requirement 2 & 11)
  const [hiddenCategories, setHiddenCategories] = useState<HiddenPromotionalCategory[]>(store.getHiddenPromotionalCategories());
  const [showPromoCategoryForm, setShowPromoCategoryForm] = useState(false);
  const [newPromoCatNameEn, setNewPromoCatNameEn] = useState('');
  const [newPromoCatNameBn, setNewPromoCatNameBn] = useState('');
  const [newPromoCatDesc, setNewPromoCatDesc] = useState('');

  // Selected product IDs and free delivery for Promotion Form
  const [promoSelectedProductIds, setPromoSelectedProductIds] = useState<string[]>([]);
  const [promoHasFreeDelivery, setPromoHasFreeDelivery] = useState<boolean>(false);
  const [promoScope, setPromoScope] = useState<'all' | 'products' | 'category'>('all');
  const [promoSelectedCategoryId, setPromoSelectedCategoryId] = useState<string>('');

  useEffect(() => {
    if (editingPromo) {
      setPromoSelectedProductIds(editingPromo.productIds || []);
      setPromoHasFreeDelivery(editingPromo.hasFreeDelivery ?? (editingPromo.type === 'free_delivery'));
      setPromoSelectedCategoryId(editingPromo.promotionalCategoryId || '');
      setPromoScope(
        editingPromo.productIds && editingPromo.productIds.length > 0
          ? 'products'
          : editingPromo.promotionalCategoryId
          ? 'category'
          : 'all'
      );
    } else {
      setPromoSelectedProductIds([]);
      setPromoHasFreeDelivery(false);
      setPromoSelectedCategoryId('');
      setPromoScope('all');
    }
  }, [editingPromo]);

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
    setProducts(store.getAllProductsAdmin());
    setOrders(store.getOrders());
    setCategories(store.getAllCategoriesAdmin());
    setFlashSales(store.getAllFlashSalesAdmin());
    setLandingPopups(store.getAllLandingPopupsAdmin());
    setPromotions(store.getAllPromotionsAdmin());
    setHiddenCategories(store.getHiddenPromotionalCategories());
    setAnnouncementConfig(store.getTopAnnouncementConfig());
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
            labelEn: 'Target Category / Page on Click',
            labelBn: 'ক্লিক করলে কোথায় যাবে',
            type: 'select',
            options: [
              { value: 'flash-sale', labelEn: 'Flash Sale Deals Page' },
              { value: 'dhakai-jamdani', labelEn: 'Dhakai Jamdani Collection' },
              { value: 'dhakai-muslin', labelEn: 'Dhakai Muslin Collection' },
              { value: 'tangail-taat', labelEn: 'Tangail Taat Collection' },
              { value: 'rajshahi-silk', labelEn: 'Rajshahi Pure Silk Collection' },
              { value: 'bridal-festive', labelEn: 'Bridal Katan Collection' },
              { value: 'shop', labelEn: 'All Handloom Sarees' }
            ],
            defaultValue: 'flash-sale'
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
            labelEn: 'Target Category / Page on Click',
            type: 'select',
            options: [
              { value: 'shop', labelEn: 'All Handloom Sarees' },
              { value: 'dhakai-jamdani', labelEn: 'Dhakai Jamdani Collection' },
              { value: 'dhakai-muslin', labelEn: 'Dhakai Muslin Collection' },
              { value: 'tangail-taat', labelEn: 'Tangail Taat Collection' },
              { value: 'rajshahi-silk', labelEn: 'Rajshahi Pure Silk Collection' }
            ],
            defaultValue: 'shop'
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

    const hasFreeDelivery = promoHasFreeDelivery || (formData.get('type') as any) === 'free_delivery';
    const finalProductIds = promoScope === 'products' ? promoSelectedProductIds : undefined;
    const finalPromoCatId = promoScope === 'category' ? promoSelectedCategoryId : undefined;

    const promo: Promotion = {
      id: promoId,
      titleEn: String(formData.get('titleEn') || ''),
      titleBn: String(formData.get('titleBn') || ''),
      subtitleEn: String(formData.get('subtitleEn') || ''),
      subtitleBn: String(formData.get('subtitleBn') || ''),
      type: (formData.get('type') as any) || 'percentage',
      discountPercent: formData.get('discountPercent') ? Number(formData.get('discountPercent')) : undefined,
      discountAmount: formData.get('discountAmount') ? Number(formData.get('discountAmount')) : undefined,
      code: formData.get('code') ? String(formData.get('code')).trim().toUpperCase() : undefined,
      minOrderAmount: formData.get('minOrderAmount') ? Number(formData.get('minOrderAmount')) : undefined,
      startDate: String(formData.get('startDate') || ''),
      endDate: String(formData.get('endDate') || ''),
      isActive: formData.get('isActive') !== null,
      placements: placements.length > 0 ? placements : ['offers_page', 'banner'],
      image: String(formData.get('image') || '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg'),
      ctaTextEn: String(formData.get('ctaTextEn') || 'Shop Special Offer'),
      ctaTextBn: String(formData.get('ctaTextBn') || 'অফার উপভোগ করুন'),
      ctaLink: String(formData.get('ctaLink') || 'shop'),
      hasFreeDelivery,
      productIds: finalProductIds,
      promotionalCategoryId: finalPromoCatId
    };

    store.savePromotion(promo);
    refreshData();
    setShowPromoForm(false);
    setEditingPromo(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white px-4 sm:px-8 py-3.5 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
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
            onClick={() => setShowPrivateCodes(true)}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-700 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Private VIP Codes</span>
          </button>

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
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'category_details', label: 'Category Details & Blog (Blogger)', icon: BookOpen },
          { id: 'flash_sales', label: `Flash Deals & Timers (${flashSales.length})`, icon: Zap },
          { id: 'popup_banner', label: `Landing Popups (${landingPopups.length})`, icon: Tag },
          { id: 'promotions', label: `Promotions & Offers (${promotions.length})`, icon: Gift },
          { id: 'announcements', label: `Top Announcement Bar (${announcementConfig.announcements.length})`, icon: Megaphone },
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
          </div>
        )}

        {/* ========================================================
            TAB 2: SAREES TABLE & VARIANTS
            ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search code (JM-108), saree name, fabric..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 dark:text-white focus:outline-none focus:border-amber-700"
                />
              </div>

              <button
                onClick={() => {
                  setProductToEdit(null);
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Saree (Account-Style Form)</span>
              </button>
            </div>

            {/* Sarees Table */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Image & Code</th>
                      <th className="p-3.5">Saree Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Color Variants</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Delivery</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                              <img
                                src={prod.primaryImage}
                                alt={prod.nameEn}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-mono font-bold text-amber-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              {prod.code}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-serif font-bold text-stone-900 dark:text-white text-sm">
                            {prod.nameEn}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            {prod.nameBn}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                            {prod.sareeType}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
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
                                <span className="font-medium text-stone-800 dark:text-stone-300">{v.colorNameEn}</span>
                                <span className="font-mono text-[10px] text-amber-900 dark:text-amber-400 font-bold">
                                  x{v.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-serif font-bold text-stone-900 dark:text-white text-sm">
                            ৳{prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              ৳{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        {/* Free Delivery Control Column (Requirement 2) */}
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...prod, isFreeDelivery: !prod.isFreeDelivery };
                              store.saveProduct(updated);
                              refreshData();
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              prod.isFreeDelivery
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-stone-50 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400'
                            }`}
                            title="Click to toggle free delivery for this saree"
                          >
                            {prod.isFreeDelivery ? '✓ Free Delivery' : '✕ Standard Fee'}
                          </button>
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
                            {/* QR Code Tag Modal Button (Requirement 4) */}
                            <button
                              onClick={() => setSelectedProductForQr(prod)}
                              className="p-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-900 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950 cursor-pointer"
                              title="Artisan QR Tag & Link"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {/* Edit Saree */}
                            <button
                              onClick={() => {
                                setProductToEdit(prod);
                                setShowProductForm(true);
                              }}
                              className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-amber-900 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Edit Listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Saree */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete saree ${prod.code}?`)) {
                                  store.deleteProduct(prod.id);
                                  refreshData();
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
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
                  <span>Add Category (Form Builder)</span>
                </button>
                <button
                  onClick={() => setShowSubcategoryForm(true)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Add Subcategory</span>
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

            {/* Dynamic Form Builder for Subcategory */}
            {showSubcategoryForm && (
              <div className="bg-stone-100 dark:bg-stone-900/80 p-5 rounded-2xl border border-stone-300 dark:border-stone-700 animate-in fade-in duration-200">
                <AdminFormBuilder
                  schema={subcategorySchema}
                  onSubmit={handleSaveSubcategory}
                  onCancel={() => setShowSubcategoryForm(false)}
                  language={language}
                />
              </div>
            )}

            {/* Categories Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0">
                        <img
                          src={cat.image}
                          alt={cat.nameEn}
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

                  {/* Subcategories */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1.5">
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
                            className="text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!cat.subcategories || cat.subcategories.length === 0) && (
                        <span className="text-xs text-stone-400 italic">No subcategories yet</span>
                      )}
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
            TAB 5: LANDING POPUP BANNERS CONTROLLER (Requirement 3)
            ======================================================== */}
        {activeTab === 'popup_banner' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                  <span>Landing Pop-up Banners Engine</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Multiple popups rotate randomly on landing. Supports dedicated Photoshop graphic banners or luxury card promos.
                </p>
              </div>

              {!showPopupForm && (
                <button
                  onClick={() => {
                    setEditingPopup(null);
                    setShowPopupForm(true);
                  }}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Pop-up Banner</span>
                </button>
              )}
            </div>

            {/* Dynamic Form Builder for Landing Popups */}
            {showPopupForm && (
              <div className="bg-amber-50/50 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-700 animate-in fade-in duration-200">
                <AdminFormBuilder
                  schema={landingPopupSchema}
                  initialValues={editingPopup || undefined}
                  onSubmit={handleSaveLandingPopup}
                  onCancel={() => {
                    setShowPopupForm(false);
                    setEditingPopup(null);
                  }}
                  language={language}
                />
              </div>
            )}

            {/* Pop-up Banners List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {landingPopups.map((popup) => (
                <div
                  key={popup.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <img
                        src={popup.image}
                        alt={popup.titleEn}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          popup.isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-600 text-stone-200'
                        }`}
                      >
                        {popup.isActive ? 'Active (Rotating)' : 'Disabled'}
                      </span>

                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 text-amber-300 text-[10px] font-mono backdrop-blur-xs">
                        {popup.displayMode === 'image_only' ? 'Photoshop Image Only' : 'Standard Card'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                        {popup.titleEn || 'Graphic Promotional Banner'}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                        {popup.subtitleEn || 'Direct tap opens destination link.'}
                      </p>
                    </div>

                    {popup.discountCode && (
                      <div className="inline-block px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-[11px] font-mono font-bold text-amber-900 dark:text-amber-400 border border-stone-200 dark:border-stone-700">
                        Code: {popup.discountCode}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        store.toggleLandingPopup(popup.id);
                        refreshData();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        popup.isActive
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300'
                      }`}
                    >
                      {popup.isActive ? 'Disable' : 'Enable'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingPopup(popup);
                          setShowPopupForm(true);
                        }}
                        className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-amber-900 rounded-lg cursor-pointer"
                        title="Edit Pop-up"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this landing popup?')) {
                            store.deleteLandingPopup(popup.id);
                            refreshData();
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Delete Pop-up"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: UNIFIED PROMOTIONS & PRIVILEGES ENGINE (Requirements 4C, 4D, 22)
            ======================================================== */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                  <span>Multi-Placement Promotion System</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Configure once, syndicate across Homepage Popup, Top Banners, PDP Callouts, Product Badges, Cart & All Offers.
                </p>
              </div>

              {!showPromoForm && (
                <button
                  onClick={() => {
                    setEditingPromo(null);
                    setShowPromoForm(true);
                  }}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Promotion</span>
                </button>
              )}
            </div>

            {/* Form to create/edit Promotion */}
            {showPromoForm && (
              <form
                onSubmit={handleSavePromotion}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-amber-300 dark:border-stone-700 shadow-xl space-y-6 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white">
                      {editingPromo ? 'Edit Promotion Campaign' : 'Create New Multi-Placement Promotion'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromoForm(false);
                      setEditingPromo(null);
                    }}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Promotion Title (English) *
                    </label>
                    <input
                      type="text"
                      name="titleEn"
                      required
                      defaultValue={editingPromo?.titleEn || ''}
                      placeholder="e.g. Eid Handloom Special — Flat 15% OFF"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Promotion Title (বাংলা) *
                    </label>
                    <input
                      type="text"
                      name="titleBn"
                      required
                      defaultValue={editingPromo?.titleBn || ''}
                      placeholder="যেমন: ঈদ স্পেশাল উৎসব অফার — ১৫% মূল্যছাড়"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Subtitle / Highlight (English)
                    </label>
                    <input
                      type="text"
                      name="subtitleEn"
                      defaultValue={editingPromo?.subtitleEn || ''}
                      placeholder="e.g. Valid on all pure Dhakai Jamdani and Muslin sarees"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Subtitle / Highlight (বাংলা)
                    </label>
                    <input
                      type="text"
                      name="subtitleBn"
                      defaultValue={editingPromo?.subtitleBn || ''}
                      placeholder="যেমন: সকল জামদানি ও মসলিন শাড়িতে উপভোগ করুন"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Promotion Type
                    </label>
                    <select
                      name="type"
                      defaultValue={editingPromo?.type || 'percentage'}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-white"
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Taka Discount (৳)</option>
                      <option value="free_delivery">Free Delivery Nationwide</option>
                      <option value="coupon">Coupon Code Voucher</option>
                      <option value="flash_sale">Flash Sale Drop</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Discount % (if applicable)
                    </label>
                    <input
                      type="number"
                      name="discountPercent"
                      min="0"
                      max="100"
                      defaultValue={editingPromo?.discountPercent ?? ''}
                      placeholder="e.g. 15"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold font-mono text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Discount Taka (৳)
                    </label>
                    <input
                      type="number"
                      name="discountAmount"
                      min="0"
                      defaultValue={editingPromo?.discountAmount ?? ''}
                      placeholder="e.g. 500"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold font-mono text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Coupon Voucher Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      defaultValue={editingPromo?.code || ''}
                      placeholder="e.g. EID15"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono font-bold uppercase text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Placements Syndicate Checkboxes (Requirement 4C) */}
                <div className="p-4 bg-amber-50/60 dark:bg-stone-800/60 rounded-2xl border border-amber-200/80 dark:border-stone-700 space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white block">
                    Syndicated Placements (Where should this promotion show?):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        name="place_popup"
                        defaultChecked={editingPromo?.placements.includes('popup') ?? true}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                      />
                      <span>Homepage Pop-up</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        name="place_banner"
                        defaultChecked={editingPromo?.placements.includes('banner') ?? true}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                      />
                      <span>Top Strip / Notification Banner</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        name="place_card"
                        defaultChecked={editingPromo?.placements.includes('product_card') ?? true}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                      />
                      <span>Product Card Badge</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        name="place_pdp"
                        defaultChecked={editingPromo?.placements.includes('product_detail') ?? true}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                      />
                      <span>Product Detail Page Callout</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        name="place_checkout"
                        defaultChecked={editingPromo?.placements.includes('checkout') ?? true}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                      />
                      <span>Cart & Checkout Auto-discount</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        name="place_offers"
                        defaultChecked={editingPromo?.placements.includes('offers_page') ?? true}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                      />
                      <span>Dedicated &quot;All Offers&quot; Hub</span>
                    </label>
                  </div>
                </div>

              {/* Scope & Free Delivery Targeting (Requirements 2 & 11) */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-700">
                    <div>
                      <label className="text-xs font-bold text-stone-900 dark:text-white block">
                        Free Delivery Privilege in this Offer
                      </label>
                      <p className="text-[11px] text-stone-500">
                        When enabled, customers get ৳0 free delivery on eligible sarees at checkout.
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={promoHasFreeDelivery}
                        onChange={(e) => setPromoHasFreeDelivery(e.target.checked)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        Include Free Delivery
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-900 dark:text-white block mb-1">
                      Offer Scope &amp; Target Products:
                    </label>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPromoScope('all')}
                        className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                          promoScope === 'all'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                        }`}
                      >
                        All Catalog Products
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromoScope('products')}
                        className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                          promoScope === 'products'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                        }`}
                      >
                        Selected Sarees ({promoSelectedProductIds.length} selected)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromoScope('category')}
                        className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                          promoScope === 'category'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                        }`}
                      >
                        Specific Promotional Category
                      </button>
                    </div>

                    {/* Scope: Specific Products */}
                    {promoScope === 'products' && (
                      <div className="mt-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                        <span className="text-[11px] font-bold text-stone-500 block">
                          Select the specific sarees this promotion applies to (e.g. 3 sarees with free delivery):
                        </span>
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {products.map((p) => {
                            const isSelected = promoSelectedProductIds.includes(p.id);
                            return (
                              <label
                                key={p.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-100 dark:border-stone-800 cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      if (isSelected) {
                                        setPromoSelectedProductIds(promoSelectedProductIds.filter((id) => id !== p.id));
                                      } else {
                                        setPromoSelectedProductIds([...promoSelectedProductIds, p.id]);
                                      }
                                    }}
                                    className="rounded text-amber-900 w-3.5 h-3.5"
                                  />
                                  <span className="font-mono text-[10px] text-amber-800 dark:text-amber-400 font-bold">
                                    {p.code}
                                  </span>
                                  <span className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                                    {p.nameEn}
                                  </span>
                                </div>
                                <span className="font-mono text-xs font-bold text-stone-600 dark:text-stone-400">
                                  ৳{p.price.toLocaleString()}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Scope: Specific Promotional Category */}
                    {promoScope === 'category' && (
                      <div className="mt-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                        <span className="text-[11px] font-bold text-stone-500 block">
                          Choose promotional category group:
                        </span>
                        <select
                          value={promoSelectedCategoryId}
                          onChange={(e) => setPromoSelectedCategoryId(e.target.value)}
                          className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-white"
                        >
                          <option value="">-- Select Promotional Category --</option>
                          {hiddenCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nameEn} ({c.nameBn})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={editingPromo?.startDate?.slice(0, 10) || ''}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      End Date (Auto-Expires)
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={editingPromo?.endDate?.slice(0, 10) || ''}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Min Order Amount (৳)
                    </label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      defaultValue={editingPromo?.minOrderAmount ?? ''}
                      placeholder="e.g. 3000"
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Banner / Artwork Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      defaultValue={editingPromo?.image || '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg'}
                      className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="promo_active_check"
                      name="isActive"
                      defaultChecked={editingPromo?.isActive ?? true}
                      className="w-4 h-4 rounded border-stone-300 text-amber-900 focus:ring-amber-900"
                    />
                    <label htmlFor="promo_active_check" className="text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                      Campaign is Active across live store
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromoForm(false);
                      setEditingPromo(null);
                    }}
                    className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>{editingPromo ? 'Update Promotion' : 'Save & Publish Promotion'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Active & Scheduled Promotions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                          {promo.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white mt-1 line-clamp-1">
                          {promo.titleEn}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400 block line-clamp-1">
                          {promo.titleBn}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          promo.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                        }`}
                      >
                        {promo.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    {/* Voucher or discount highlight */}
                    <div className="flex items-center gap-2 text-xs">
                      {promo.discountPercent && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-lg font-bold">
                          {promo.discountPercent}% OFF
                        </span>
                      )}
                      {promo.code && (
                        <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg font-mono font-bold text-stone-800 dark:text-stone-200">
                          CODE: {promo.code}
                        </span>
                      )}
                    </div>

                    {/* Placements Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Active Placements ({promo.placements.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {promo.placements.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-medium text-stone-600 dark:text-stone-300"
                          >
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        store.togglePromotionActive(promo.id);
                        refreshData();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        promo.isActive
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300'
                      }`}
                    >
                      {promo.isActive ? 'Pause' : 'Activate'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingPromo(promo);
                          setShowPromoForm(true);
                        }}
                        className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-amber-900 rounded-lg cursor-pointer"
                        title="Edit Promotion"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete promotion "${promo.titleEn}"?`)) {
                            store.deletePromotion(promo.id);
                            refreshData();
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Delete Promotion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: TOP ANNOUNCEMENT BAR & HEADER TICKER
            ======================================================== */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            
            {/* Header & New Announcement Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Top Announcement Bar & Header Marquee Ticker
                  </h3>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-300/50">
                    হেডার নোটিশ বার
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Manage the top header announcement bar messages, ticker rotation speed, and hotline number in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingAnnouncement(null);
                  setShowAnnouncementForm(true);
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Announcement</span>
              </button>
            </div>

            {/* Success Toast */}
            {announcementSavedToast && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Announcement bar settings updated and published to the live store!</span>
              </div>
            )}

            {/* Live Store Preview Card */}
            <div className="bg-stone-950 rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Eye className="w-4 h-4" />
                  <span>LIVE STORE PREVIEW (স্টোরের সরাসরি দৃশ্য)</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  announcementConfig.isEnabled
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                    : 'bg-rose-950 text-rose-300 border border-rose-600/50'
                }`}>
                  {announcementConfig.isEnabled ? 'Bar is Visible' : 'Bar is Hidden'}
                </span>
              </div>

              {/* Exact Store Top Bar Replica */}
              <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 rounded-xl border border-stone-800 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-2.5 max-w-2xl truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
                  <span className="font-medium text-xs sm:text-sm truncate text-white">
                    {announcementConfig.announcements.filter((a) => a.isActive)[previewTickerIndex]
                      ? (language === 'bn'
                          ? announcementConfig.announcements.filter((a) => a.isActive)[previewTickerIndex].textBn
                          : announcementConfig.announcements.filter((a) => a.isActive)[previewTickerIndex].textEn)
                      : 'No active announcement messages currently configured.'}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-stone-400 text-xs shrink-0">
                  <span className="flex items-center gap-1 text-amber-300 font-mono">
                    Hotline: {announcementConfig.hotline || '09612-444888'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-stone-300">
                    <Truck className="w-3 h-3 text-amber-400" />
                    <span>Track Order</span>
                  </span>
                </div>
              </div>

              {/* Ticker Controls Preview */}
              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>
                  Rotation speed: <strong className="text-amber-300">{announcementConfig.rotationSpeedSeconds}s</strong> per message
                </span>
                {announcementConfig.announcements.filter((a) => a.isActive).length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const activeList = announcementConfig.announcements.filter((a) => a.isActive);
                        setPreviewTickerIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
                      }}
                      className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[10px] cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const activeList = announcementConfig.announcements.filter((a) => a.isActive);
                        setPreviewTickerIndex((prev) => (prev + 1) % activeList.length);
                      }}
                      className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[10px] cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Global Settings Card */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span>Announcement Bar Global Settings</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* 1. Master Toggle */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      Enable Top Bar
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Show announcement marquee across store
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={announcementConfig.isEnabled}
                    onChange={(e) => {
                      const updated: TopAnnouncementBarConfig = {
                        ...announcementConfig,
                        isEnabled: e.target.checked
                      };
                      setAnnouncementConfig(updated);
                      store.saveTopAnnouncementConfig(updated);
                      setAnnouncementSavedToast(true);
                      setTimeout(() => setAnnouncementSavedToast(false), 2500);
                    }}
                    className="w-5 h-5 rounded border-stone-300 text-amber-900 focus:ring-amber-900 cursor-pointer"
                  />
                </div>

                {/* 2. Rotation Interval */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Rotation Speed
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-900 dark:text-amber-400">
                      {announcementConfig.rotationSpeedSeconds}s
                    </span>
                  </div>
                  <select
                    value={announcementConfig.rotationSpeedSeconds}
                    onChange={(e) => {
                      const updated: TopAnnouncementBarConfig = {
                        ...announcementConfig,
                        rotationSpeedSeconds: Number(e.target.value)
                      };
                      setAnnouncementConfig(updated);
                      store.saveTopAnnouncementConfig(updated);
                      setAnnouncementSavedToast(true);
                      setTimeout(() => setAnnouncementSavedToast(false), 2500);
                    }}
                    className="w-full text-xs p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-white"
                  >
                    <option value={3}>3 Seconds (Fast)</option>
                    <option value={4}>4 Seconds (Standard)</option>
                    <option value={5}>5 Seconds (Relaxed)</option>
                    <option value={7}>7 Seconds (Slow)</option>
                    <option value={10}>10 Seconds (Very Slow)</option>
                  </select>
                </div>

                {/* 3. Hotline Number */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Support Hotline
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={announcementConfig.hotline}
                      onBlur={(e) => {
                        const updated: TopAnnouncementBarConfig = {
                          ...announcementConfig,
                          hotline: e.target.value.trim()
                        };
                        setAnnouncementConfig(updated);
                        store.saveTopAnnouncementConfig(updated);
                        setAnnouncementSavedToast(true);
                        setTimeout(() => setAnnouncementSavedToast(false), 2500);
                      }}
                      placeholder="09612-444888"
                      className="w-full text-xs p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg font-mono text-stone-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Announcement Form Modal */}
            {showAnnouncementForm && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-xl w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-white">
                      {editingAnnouncement ? 'Edit Announcement Message' : 'Create New Top Announcement'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAnnouncementForm(false)}
                      className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* One-Click Quick Templates */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block">
                      Quick Templates (এক ক্লিকে টেমপ্লেট নির্বাচন করুন):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          title: 'Eid Discount',
                          bn: '🔥 ঈদ ধামাকা: ৩টি শাড়ির অর্ডারে ফ্রি হোম ডেলিভারি + ৫% ছাড় | কোড: AANCHOL500',
                          en: '🔥 Special Offer: Free Delivery on 3 sarees + Extra 5% Off | Code: AANCHOL500'
                        },
                        {
                          title: 'Nationwide COD',
                          bn: '🚚 সারাদেশে ক্যাশ অন ডেলিভারি · পার্সেল খুলে দেখে মূল্য পরিশোধের সুবিধা',
                          en: '🚚 Cash on Delivery Nationwide · Inspect saree before payment'
                        },
                        {
                          title: 'Support Hotline',
                          bn: '📞 শাড়ির মাপ বা তথ্যের জন্য হটলাইনে যোগাযোগ করুন: 09612-444888 (সকাল ১০টা - রাত ১০টা)',
                          en: '📞 Saree Inquiries & Customer Care Hotline: 09612-444888 (10 AM - 10 PM)'
                        },
                        {
                          title: 'New Loom Drop',
                          bn: '✨ রূপগঞ্জের আসল তাঁতিদের বোনা নতুন জামদানি কালেকশন এখন লাইভ!',
                          en: '✨ New handloom master batch of Dhakai Jamdani is now live!'
                        }
                      ].map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            const bnInput = document.getElementById('ann_text_bn') as HTMLTextAreaElement;
                            const enInput = document.getElementById('ann_text_en') as HTMLTextAreaElement;
                            if (bnInput && enInput) {
                              bnInput.value = tpl.bn;
                              enInput.value = tpl.en;
                            }
                          }}
                          className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-800 dark:text-stone-200 hover:text-amber-950 dark:hover:text-amber-300 text-[10px] font-bold rounded-lg border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                        >
                          + {tpl.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const textBn = (fd.get('textBn') as string).trim();
                      const textEn = (fd.get('textEn') as string).trim();
                      const link = (fd.get('link') as string).trim() || undefined;
                      const isActive = fd.get('isActive') === 'on';

                      if (!textBn || !textEn) {
                        alert('Both Bengali and English message texts are required.');
                        return;
                      }

                      if (editingAnnouncement) {
                        store.updateAnnouncement({
                          id: editingAnnouncement.id,
                          textBn,
                          textEn,
                          link,
                          isActive
                        });
                      } else {
                        store.addAnnouncement({
                          textBn,
                          textEn,
                          link,
                          isActive
                        });
                      }

                      refreshData();
                      setShowAnnouncementForm(false);
                      setEditingAnnouncement(null);
                      setAnnouncementSavedToast(true);
                      setTimeout(() => setAnnouncementSavedToast(false), 2500);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        বাংলা বার্তা (Bengali Message) *
                      </label>
                      <textarea
                        id="ann_text_bn"
                        name="textBn"
                        required
                        rows={2}
                        defaultValue={editingAnnouncement?.textBn || ''}
                        placeholder="e.g. 🔥 ঈদ ধামাকা: ৩টি শাড়ির অর্ডারে ফ্রি হোম ডেলিভারি + ৫% ছাড় | কোড: AANCHOL500"
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        English Message *
                      </label>
                      <textarea
                        id="ann_text_en"
                        name="textEn"
                        required
                        rows={2}
                        defaultValue={editingAnnouncement?.textEn || ''}
                        placeholder="e.g. 🔥 Special Offer: Free Delivery on 3 sarees + Extra 5% Off | Code: AANCHOL500"
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        Click Action Link or Destination (ঐচ্ছিক লিঙ্ক)
                      </label>
                      <input
                        type="text"
                        name="link"
                        defaultValue={editingAnnouncement?.link || ''}
                        placeholder="e.g. offers or shop or https://..."
                        className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="ann_active_check"
                        name="isActive"
                        defaultChecked={editingAnnouncement ? editingAnnouncement.isActive : true}
                        className="w-4 h-4 rounded border-stone-300 text-amber-900 focus:ring-amber-900 cursor-pointer"
                      />
                      <label htmlFor="ann_active_check" className="text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                        Message is Active in the live ticker rotation
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={() => setShowAnnouncementForm(false)}
                        className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>{editingAnnouncement ? 'Save Changes' : 'Add to Ticker'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* List of Announcement Messages */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                  All Configured Announcement Messages ({announcementConfig.announcements.length})
                </h4>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Active: <strong className="text-emerald-600">{announcementConfig.announcements.filter((a) => a.isActive).length}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {announcementConfig.announcements.map((ann, idx) => (
                  <div
                    key={ann.id}
                    className={`bg-white dark:bg-stone-900 rounded-2xl border p-4 sm:p-5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      ann.isActive
                        ? 'border-stone-200 dark:border-stone-800'
                        : 'border-stone-200 dark:border-stone-800/60 opacity-60 bg-stone-50/50'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded font-bold">
                          #{idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ann.isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}>
                          {ann.isActive ? 'Active on Store' : 'Paused'}
                        </span>
                        {ann.link && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-mono">
                            Link: {ann.link}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {ann.textBn}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {ann.textEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800">
                      {/* Play / Pause Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          store.toggleAnnouncement(ann.id);
                          refreshData();
                          setAnnouncementSavedToast(true);
                          setTimeout(() => setAnnouncementSavedToast(false), 2000);
                        }}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                          ann.isActive
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100'
                        }`}
                        title={ann.isActive ? 'Pause message' : 'Activate message'}
                      >
                        {ann.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span className="text-[11px]">{ann.isActive ? 'Pause' : 'Activate'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAnnouncement(ann);
                          setShowAnnouncementForm(true);
                        }}
                        className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl cursor-pointer"
                        title="Edit Message"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Delete this announcement message from the ticker?')) {
                            store.deleteAnnouncement(ann.id);
                            refreshData();
                            setAnnouncementSavedToast(true);
                            setTimeout(() => setAnnouncementSavedToast(false), 2000);
                          }
                        }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
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

      {/* Private Price Codes Modal */}
      <PrivateCodesModal
        isOpen={showPrivateCodes}
        onClose={() => setShowPrivateCodes(false)}
        language={language}
        products={products}
      />

    </div>
  );
};
