import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Promotion,
  PromotionKind,
  Banner,
  LandingPopupConfig,
  TopAnnouncement,
  TopAnnouncementBarConfig,
  Category,
  HiddenPromotionalCategory,
  Coupon,
  Language
} from '../../types';
import { store } from '../../services/store';
import { handleImageError, FALLBACK_BANNER_IMAGE } from '../../utils/imageHelper';
import {
  Gift,
  Clock,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Megaphone,
  Monitor,
  Smartphone,
  Image as ImageIcon,
  Type,
  Ticket,
  ExternalLink,
  Save,
  X,
  Globe,
  Upload,
  Zap,
  Tag,
  Percent,
  Calendar,
  Layers,
  Filter,
  MousePointer,
  HelpCircle
} from 'lucide-react';

interface UniversalPromotionBuilderProps {
  language: Language;
  onRefreshData?: () => void;
  sectionMode?: 'promotions' | 'offers' | 'all';
}

type DisplayLocation = 'banner' | 'popup' | 'both';

const PRESET_IMAGES = [
  {
    name: 'Fabrilife Promo Banner',
    url: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg'
  },
  {
    name: 'Hero Jamdani Craft',
    url: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'
  },
  {
    name: 'Muslin Royal Ivory',
    url: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg'
  },
  {
    name: 'Crimson Red Jamdani',
    url: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg'
  },
  {
    name: 'Rajshahi Silk Emerald',
    url: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg'
  }
];

export const UniversalPromotionBuilder: React.FC<UniversalPromotionBuilderProps> = ({
  language,
  onRefreshData,
  sectionMode = 'all'
}) => {
  // Store state
  const [promotions, setPromotions] = useState<Promotion[]>(() => store.getAllPromotionsAdmin());
  const [categories, setCategories] = useState<Category[]>(() => store.getCategories());
  const [hiddenCategories, setHiddenCategories] = useState<HiddenPromotionalCategory[]>(() =>
    store.getHiddenPromotionalCategories()
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() => store.getAllCouponsAdmin());
  const [announcementConfig, setAnnouncementConfig] = useState<TopAnnouncementBarConfig>(() =>
    store.getTopAnnouncementConfig()
  );

  const reloadData = () => {
    setPromotions(store.getAllPromotionsAdmin());
    setCategories(store.getCategories());
    setHiddenCategories(store.getHiddenPromotionalCategories());
    setCoupons(store.getAllCouponsAdmin());
    setAnnouncementConfig(store.getTopAnnouncementConfig());
    if (onRefreshData) onRefreshData();
  };

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setPromotions(store.getAllPromotionsAdmin());
      setAnnouncementConfig(store.getTopAnnouncementConfig());
      setHiddenCategories(store.getHiddenPromotionalCategories());
      setCoupons(store.getAllCouponsAdmin());
    });
    return unsub;
  }, []);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // 1. TOP ANNOUNCEMENT BAR STATE (English & Bangla only, no link)
  // ---------------------------------------------------------------------------
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    announcementConfig.isEnabled
  );

  const [showAddAnnouncementForm, setShowAddAnnouncementForm] = useState(false);
  const [newAnnTextEn, setNewAnnTextEn] = useState('');
  const [newAnnTextBn, setNewAnnTextBn] = useState('');

  const [editingAnnouncement, setEditingAnnouncement] = useState<TopAnnouncement | null>(null);
  const [editAnnTextEn, setEditAnnTextEn] = useState('');
  const [editAnnTextBn, setEditAnnTextBn] = useState('');
  const [editAnnIsActive, setEditAnnIsActive] = useState(true);

  const handleToggleMasterAnnouncement = (newVal: boolean) => {
    setAnnouncementEnabled(newVal);
    const updated: TopAnnouncementBarConfig = {
      ...announcementConfig,
      isEnabled: newVal
    };
    store.saveTopAnnouncementConfig(updated);
    setAnnouncementConfig(updated);
    showToast(newVal ? 'Announcement Bar enabled on store header' : 'Announcement Bar disabled');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTextEn.trim() && !newAnnTextBn.trim()) {
      alert('Please enter at least English or Bangla announcement text.');
      return;
    }
    const newAnn: TopAnnouncement = {
      id: `ann-${Date.now()}`,
      textEn: newAnnTextEn.trim() || newAnnTextBn.trim(),
      textBn: newAnnTextBn.trim() || newAnnTextEn.trim(),
      isActive: true
    };
    const updated: TopAnnouncementBarConfig = {
      ...announcementConfig,
      isEnabled: true,
      announcements: [newAnn, ...announcementConfig.announcements]
    };
    store.saveTopAnnouncementConfig(updated);
    setAnnouncementConfig(updated);
    setAnnouncementEnabled(true);
    setNewAnnTextEn('');
    setNewAnnTextBn('');
    setShowAddAnnouncementForm(false);
    showToast('New announcement saved successfully!');
  };

  const handleStartEditAnnouncement = (ann: TopAnnouncement) => {
    setEditingAnnouncement(ann);
    setEditAnnTextEn(ann.textEn);
    setEditAnnTextBn(ann.textBn);
    setEditAnnIsActive(ann.isActive);
  };

  const handleSaveEditAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;
    const updatedAnnouncements = announcementConfig.announcements.map((a) => {
      if (a.id === editingAnnouncement.id) {
        return {
          ...a,
          textEn: editAnnTextEn.trim() || editAnnTextBn.trim(),
          textBn: editAnnTextBn.trim() || editAnnTextEn.trim(),
          isActive: editAnnIsActive
        };
      }
      return a;
    });
    const updated: TopAnnouncementBarConfig = {
      ...announcementConfig,
      announcements: updatedAnnouncements
    };
    store.saveTopAnnouncementConfig(updated);
    setAnnouncementConfig(updated);
    setEditingAnnouncement(null);
    showToast('Announcement updated successfully!');
  };

  const handleDeleteAnnouncement = () => {
    if (!editingAnnouncement) return;
    if (confirm('Are you sure you want to delete this announcement?')) {
      const updatedAnnouncements = announcementConfig.announcements.filter(
        (a) => a.id !== editingAnnouncement.id
      );
      const updated: TopAnnouncementBarConfig = {
        ...announcementConfig,
        announcements: updatedAnnouncements
      };
      store.saveTopAnnouncementConfig(updated);
      setAnnouncementConfig(updated);
      setEditingAnnouncement(null);
      showToast('Announcement deleted.');
    }
  };

  // ---------------------------------------------------------------------------
  // 2. UPGRADED PROMOTION BUILDER STATE
  // ---------------------------------------------------------------------------
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Type Selector: Flash Deal, Sale/Offer, General Promotion
  const [promotionKind, setPromotionKind] = useState<PromotionKind>(
    sectionMode === 'offers' ? 'flash_deal' : 'general_promotion'
  );

  // Format: Banner Only, Pop-up Only, Both
  const [location, setLocation] = useState<DisplayLocation>('banner');

  // Display slot: Homepage Hero or Mid-Page
  const [sectionSlot, setSectionSlot] = useState<'hero' | 'promo_mid'>('hero');

  // Priority: 1-10 (1 is highest priority)
  const [priority, setPriority] = useState<number>(1);

  // Pop-up Timing: Delay in seconds before pop-up appears
  const [delaySeconds, setDelaySeconds] = useState<number>(1);

  // Banner image
  const [hasImage, setHasImage] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0].url);

  // Title & Promotional text (subtitle)
  const [hasText, setHasText] = useState<boolean>(true);
  const [titleEn, setTitleEn] = useState<string>('Royal Eid Handloom Celebration — 15% OFF');
  const [titleBn, setTitleBn] = useState<string>('পবিত্র ঈদ স্পেশাল উৎসব অফার — ১৫% ছাড়');
  const [subtitleEn, setSubtitleEn] = useState<string>('Authentic Dhakai Jamdani & Muslin sarees with nationwide delivery.');
  const [subtitleBn, setSubtitleBn] = useState<string>('শতভাগ খাঁটি ঢাকাই জামদানি ও মসলিন শাড়িতে উপভোগ করুন আকর্ষণীয় ছাড়।');

  // Optional discount text
  const [discountText, setDiscountText] = useState<string>('FLAT 25% OFF');

  // Optional Countdown Timer with customizable label
  const [hasTimer, setHasTimer] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('Ends In');
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  });

  // Scheduling: Optional Start Date & Time
  const [hasStartDate, setHasStartDate] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 16);
  });

  // Clickable action: CTA button vs Entire Banner Clickable
  const [clickableMode, setClickableMode] = useState<'button' | 'entire_banner'>('button');
  const [ctaTextEn, setCtaTextEn] = useState<string>('Shop Collection');
  const [ctaTextBn, setCtaTextBn] = useState<string>('কালেকশন দেখুন');

  // Destination & Category Targeting
  const [destinationType, setDestinationType] = useState<
    'shop' | 'offers' | 'category' | 'hidden_category' | 'custom'
  >('shop');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [hiddenCategoryId, setHiddenCategoryId] = useState<string>('');
  const [customDestinationUrl, setCustomDestinationUrl] = useState<string>('/shop');

  // Optional Coupon
  const [hasCoupon, setHasCoupon] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('EID15');

  // Status
  const [promoIsActive, setPromoIsActive] = useState<boolean>(true);

  // Image file upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image is larger than 5MB. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Live preview surface
  const [previewSurface, setPreviewSurface] = useState<'banner' | 'popup'>('banner');
  const [previewCopied, setPreviewCopied] = useState(false);

  // List filter state
  const [filterType, setFilterType] = useState<'all' | 'flash_deal' | 'sale_offer' | 'general_promotion'>(
    sectionMode === 'offers'
      ? 'flash_deal'
      : sectionMode === 'promotions'
      ? 'general_promotion'
      : 'all'
  );
  const [filterLocation, setFilterLocation] = useState<'all' | 'banner' | 'popup' | 'both'>('all');

  // Helper to compute resolved destination URL
  const getResolvedDestination = (): string => {
    if (destinationType === 'shop') return '/shop';
    if (destinationType === 'offers') return '/offers';
    if (destinationType === 'category') return `/category/${selectedCategoryId || categories[0]?.id || 'dhakai-jamdani'}`;
    if (destinationType === 'hidden_category') {
      return `/category/${hiddenCategoryId || hiddenCategories[0]?.id || 'promo-eid'}`;
    }
    return customDestinationUrl.trim() || '/shop';
  };

  // Open Edit Mode
  const handleOpenEditPromo = (promo: Promotion) => {
    setEditingPromo(promo);

    // Kind
    setPromotionKind(promo.promotionKind || (promo.type === 'flash_sale' ? 'flash_deal' : 'sale_offer'));

    // Location / Format
    const hasBanner = promo.placements.includes('homepage_banner') || promo.placements.includes('banner');
    const hasPopup = promo.placements.includes('homepage_popup') || promo.placements.includes('popup');

    if (hasBanner && hasPopup) {
      setLocation('both');
      setPreviewSurface('banner');
    } else if (hasPopup) {
      setLocation('popup');
      setPreviewSurface('popup');
    } else {
      setLocation('banner');
      setPreviewSurface('banner');
    }

    setSectionSlot((promo as any).sectionSlot || 'hero');
    setPriority(promo.priority ?? 1);
    setDelaySeconds(promo.delaySeconds ?? 1);

    // Image
    setHasImage(Boolean(promo.image && promo.image.trim() !== ''));
    setImageUrl(promo.image || PRESET_IMAGES[0].url);

    // Text
    setHasText(Boolean(promo.titleEn?.trim() || promo.titleBn?.trim()));
    setTitleEn(promo.titleEn || '');
    setTitleBn(promo.titleBn || '');
    setSubtitleEn(promo.subtitleEn || '');
    setSubtitleBn(promo.subtitleBn || '');

    // Discount text
    setDiscountText(promo.discountText || (promo.discountPercent ? `${promo.discountPercent}% OFF` : ''));

    // Scheduling & Timer
    setHasStartDate(Boolean(promo.startDate && new Date(promo.startDate).getTime() > Date.now() - 86400000));
    if (promo.startDate) {
      try {
        setStartDate(new Date(promo.startDate).toISOString().slice(0, 16));
      } catch {
        setStartDate(new Date().toISOString().slice(0, 16));
      }
    }

    setHasTimer(Boolean(promo.endDate || promo.hasCountdown));
    setTimerLabel(promo.timerLabel || 'Ends In');
    if (promo.endDate) {
      try {
        setEndDate(new Date(promo.endDate).toISOString().slice(0, 16));
      } catch {
        setEndDate(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16));
      }
    }

    // Clickable mode
    setClickableMode(promo.isEntireBannerClickable ? 'entire_banner' : 'button');
    setCtaTextEn(promo.ctaTextEn || 'Shop Collection');
    setCtaTextBn(promo.ctaTextBn || 'কালেকশন দেখুন');

    // Destination & Hidden Category
    if (promo.hiddenCategoryId) {
      setDestinationType('hidden_category');
      setHiddenCategoryId(promo.hiddenCategoryId);
    } else if (promo.destinationLink?.includes('/category/') || promo.ctaLink?.includes('category/')) {
      const catId = (promo.destinationLink || promo.ctaLink || '').replace(/^\/?category\//, '');
      setDestinationType('category');
      setSelectedCategoryId(catId);
    } else if (promo.destinationLink === 'offers' || promo.ctaLink === 'offers' || promo.destinationLink === '/offers') {
      setDestinationType('offers');
    } else if (promo.destinationLink === 'shop' || promo.ctaLink === 'shop' || promo.destinationLink === '/shop') {
      setDestinationType('shop');
    } else {
      setDestinationType('custom');
      setCustomDestinationUrl(promo.destinationLink || promo.ctaLink || '/shop');
    }

    // Coupon
    setHasCoupon(Boolean(promo.code));
    setCouponCode(promo.code || '');

    // Status
    setPromoIsActive(promo.isActive);

    setIsBuilderOpen(true);
  };

  // Open Create Mode
  const handleOpenCreatePromo = (preferredKind?: PromotionKind) => {
    setEditingPromo(null);
    const kind = preferredKind || (sectionMode === 'offers' ? 'flash_deal' : 'general_promotion');
    setPromotionKind(kind);

    setLocation('banner');
    setPreviewSurface('banner');
    setSectionSlot('hero');
    setPriority(1);
    setDelaySeconds(1);

    setHasImage(true);
    setImageUrl(PRESET_IMAGES[0].url);

    setHasText(true);
    if (kind === 'flash_deal') {
      setTitleEn('Midnight Flash Deal — Flat 25% OFF Heritage Weaves');
      setTitleBn('মধ্যরাতের ফ্ল্যাশ ডিল — ঐতিহ্যবাহী শাড়িতে ফ্ল্যাট ২৫% ছাড়');
      setSubtitleEn('Exclusive handloom sarees available for the next 24 hours only. Nationwide free delivery.');
      setSubtitleBn('সীমিত সময়ের জন্য বিশেষ ঢাকাই জামদানি ও সিল্ক শাড়িতে অবিশ্বাস্য মূল্যছাড়।');
      setDiscountText('FLAT 25% OFF');
      setHasTimer(true);
      setTimerLabel('Flash Deal Ends In');
      setEndDate(new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16));
      setClickableMode('button');
      setCtaTextEn('Grab Flash Deal');
      setCtaTextBn('ফ্ল্যাশ ডিল অর্ডার করুন');
    } else if (kind === 'general_promotion') {
      setTitleEn('Unveiling Royal Jamdani 2026 Collection');
      setTitleBn('রাজকীয় জামদানি ২০২৬ কালেকশন উন্মোচন');
      setSubtitleEn('Handcrafted by master Bangladeshi artisans in Rupganj. Experience pure heritage.');
      setSubtitleBn('রূপগঞ্জের শ্রেষ্ঠ তাঁতিদের হাতে তৈরি অনুপম কারুকার্য ও আভিজাত্যের ছোঁয়া।');
      setDiscountText('');
      setHasTimer(false);
      setTimerLabel('Coming Soon');
      setClickableMode('button');
      setCtaTextEn('Explore Collection');
      setCtaTextBn('কালেকশন দেখুন');
    } else {
      setTitleEn('Royal Handloom Celebration — Special Savings');
      setTitleBn('উৎসব স্পেশাল তাঁত উৎসব — আকর্ষণীয় ছাড়');
      setSubtitleEn('Authentic Dhakai Jamdani & Muslin sarees with code EID15.');
      setSubtitleBn('খাঁটি ঢাকাই জামদানি ও মসলিন শাড়িতে উপভোগ করুন আকর্ষণীয় ছাড়।');
      setDiscountText('UP TO 20% OFF');
      setHasTimer(true);
      setTimerLabel('Ends In');
      setClickableMode('button');
      setCtaTextEn('Shop Offer');
      setCtaTextBn('অফার দেখুন');
    }

    setHasStartDate(false);
    setStartDate(new Date().toISOString().slice(0, 16));

    setHasCoupon(kind !== 'general_promotion');
    setCouponCode(kind === 'flash_deal' ? 'FLASH25' : 'EID15');

    setDestinationType('shop');
    setSelectedCategoryId(categories[0]?.id || '');
    setHiddenCategoryId(hiddenCategories[0]?.id || '');
    setCustomDestinationUrl('/shop');

    setPromoIsActive(true);
    setIsBuilderOpen(true);
  };

  // Save Promo (creates or updates canonical Promotion, Banner, and Landing Popup)
  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasImage && !hasText) {
      alert('A promotion must have at least an Image or Text.');
      return;
    }

    const promoId = editingPromo ? editingPromo.id : `promo-${Date.now()}`;
    const resolvedLink = getResolvedDestination();

    // Placements mapping
    const placements: ('homepage_banner' | 'homepage_popup' | 'banner' | 'popup' | 'offer_page')[] = [
      'offer_page'
    ];
    if (location === 'banner' || location === 'both') {
      placements.push('homepage_banner');
      placements.push('banner');
    }
    if (location === 'popup' || location === 'both') {
      placements.push('homepage_popup');
      placements.push('popup');
    }

    const displayMode = hasImage && !hasText ? 'image_only' : !hasImage ? 'text_only' : 'standard';
    const targetStartDate = hasStartDate && startDate ? new Date(startDate).toISOString() : new Date().toISOString();
    const targetEndDate = hasTimer && endDate ? new Date(endDate).toISOString() : undefined;

    // 1. Build canonical Promotion entity
    const updatedPromo: Promotion = {
      id: promoId,
      promotionKind: promotionKind,
      titleEn: hasText ? titleEn.trim() : (hasImage ? 'Promotional Visual Banner' : 'Exclusive Offer'),
      titleBn: hasText ? (titleBn.trim() || titleEn.trim()) : (hasImage ? 'প্রমোশনাল ব্যানার' : 'বিশেষ অফার'),
      subtitleEn: hasText ? subtitleEn.trim() : '',
      subtitleBn: hasText ? subtitleBn.trim() : '',
      discountText: discountText.trim() || undefined,
      type: promotionKind === 'flash_deal' ? 'flash_sale' : hasCoupon ? 'percentage' : 'seasonal',
      discountPercent: discountText.includes('%') ? parseInt(discountText.replace(/[^0-9]/g, '')) || 20 : undefined,
      code: hasCoupon && couponCode.trim() !== '' ? couponCode.trim().toUpperCase() : undefined,
      selectedCouponCode: hasCoupon && couponCode.trim() !== '' ? couponCode.trim().toUpperCase() : undefined,
      image: hasImage ? imageUrl.trim() : '',
      hasCountdown: hasTimer,
      timerLabel: hasTimer ? (timerLabel.trim() || 'Ends In') : undefined,
      isEntireBannerClickable: clickableMode === 'entire_banner',
      ctaTextEn: clickableMode === 'button' ? (ctaTextEn.trim() || 'Shop Collection') : 'Shop Collection',
      ctaTextBn: clickableMode === 'button' ? (ctaTextBn.trim() || ctaTextEn.trim() || 'কালেকশন দেখুন') : 'কালেকশন দেখুন',
      ctaLink: resolvedLink,
      destinationType: destinationType,
      destinationLink: resolvedLink,
      hiddenCategoryId: destinationType === 'hidden_category' ? hiddenCategoryId : undefined,
      placements: placements as any,
      startDate: targetStartDate,
      endDate: targetEndDate,
      priority: priority,
      delaySeconds: delaySeconds,
      isActive: promoIsActive,
      badgeEn: promotionKind === 'flash_deal' ? 'FLASH DEAL' : promotionKind === 'general_promotion' ? 'ANNOUNCEMENT' : 'SPECIAL OFFER',
      badgeBn: promotionKind === 'flash_deal' ? 'ফ্ল্যাশ ডিল' : promotionKind === 'general_promotion' ? 'ঘোষণা' : 'বিশেষ অফার'
    };

    // Save in store
    store.savePromotion(updatedPromo);

    // 2. Synchronize Homepage Banner Carousel
    const bannerId = `banner-${promoId}`;
    if (location === 'banner' || location === 'both') {
      const bannerItem: Banner = {
        id: bannerId,
        titleEn: hasText ? titleEn.trim() : '',
        titleBn: hasText ? (titleBn.trim() || titleEn.trim()) : '',
        subtitleEn: hasText ? subtitleEn.trim() : '',
        subtitleBn: hasText ? subtitleBn.trim() : '',
        image: hasImage ? imageUrl.trim() : '',
        ctaTextEn: clickableMode === 'button' ? (ctaTextEn.trim() || 'Explore Sarees') : 'Explore Sarees',
        ctaTextBn: clickableMode === 'button' ? (ctaTextBn.trim() || ctaTextEn.trim() || 'কালেকশন দেখুন') : 'কালেকশন দেখুন',
        ctaLink: resolvedLink,
        hasCountdown: hasTimer && Boolean(targetEndDate),
        countdownTarget: targetEndDate,
        timerLabel: hasTimer ? (timerLabel.trim() || 'Ends In') : undefined,
        bannerType: promotionKind,
        discountText: discountText.trim() || undefined,
        isEntireBannerClickable: clickableMode === 'entire_banner',
        priority: priority,
        startDate: targetStartDate,
        endDate: targetEndDate,
        delaySeconds: delaySeconds,
        isActive: promoIsActive,
        displayOrder: priority,
        sectionSlot: sectionSlot,
        displayMode: displayMode as any,
        couponCode: hasCoupon ? couponCode.trim() : undefined
      };
      store.saveBanner(bannerItem);
    } else {
      store.deleteBanner(bannerId);
    }

    // 3. Synchronize Landing Popup Dialog
    const popupId = `popup-${promoId}`;
    if (location === 'popup' || location === 'both') {
      const popupItem: LandingPopupConfig = {
        id: popupId,
        titleEn: hasText ? titleEn.trim() : '',
        titleBn: hasText ? (titleBn.trim() || titleEn.trim()) : '',
        subtitleEn: hasText ? subtitleEn.trim() : '',
        subtitleBn: hasText ? subtitleBn.trim() : '',
        image: hasImage ? imageUrl.trim() : '',
        discountCode: hasCoupon ? couponCode.trim() : undefined,
        ctaTextEn: clickableMode === 'button' ? (ctaTextEn.trim() || 'View Offer') : 'View Offer',
        ctaTextBn: clickableMode === 'button' ? (ctaTextBn.trim() || ctaTextEn.trim() || 'অফার দেখুন') : 'অফার দেখুন',
        ctaLink: resolvedLink,
        displayMode: displayMode === 'image_only' ? 'image_only' : 'standard',
        hasTimer: hasTimer && Boolean(targetEndDate),
        endTime: targetEndDate,
        timerLabel: hasTimer ? (timerLabel.trim() || 'Ends In') : undefined,
        popupType: promotionKind,
        discountText: discountText.trim() || undefined,
        isEntireBannerClickable: clickableMode === 'entire_banner',
        delaySeconds: delaySeconds,
        priority: priority,
        startDate: targetStartDate,
        isActive: promoIsActive
      };
      store.saveLandingPopup(popupItem);
    } else {
      store.deleteLandingPopup(popupId);
    }

    reloadData();
    setIsBuilderOpen(false);
    setEditingPromo(null);
    showToast(
      editingPromo
        ? `${promotionKind === 'flash_deal' ? 'Flash Deal' : promotionKind === 'general_promotion' ? 'General Promotion' : 'Offer'} updated successfully!`
        : `New ${promotionKind === 'flash_deal' ? 'Flash Deal' : promotionKind === 'general_promotion' ? 'General Promotion' : 'Offer'} published successfully!`
    );
  };

  // Delete Promo
  const handleDeletePromo = () => {
    if (!editingPromo) return;
    if (confirm('Are you sure you want to delete this promotion? This will remove its banners and pop-ups.')) {
      store.deletePromotion(editingPromo.id);
      store.deleteBanner(`banner-${editingPromo.id}`);
      store.deleteLandingPopup(`popup-${editingPromo.id}`);
      reloadData();
      setIsBuilderOpen(false);
      setEditingPromo(null);
      showToast('Promotion deleted successfully.');
    }
  };

  // Filter promotions list
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      // Kind filtering
      if (filterType !== 'all') {
        const pKind = p.promotionKind || (p.type === 'flash_sale' ? 'flash_deal' : 'sale_offer');
        if (pKind !== filterType) return false;
      }

      // Location filtering
      if (filterLocation === 'banner') {
        const hasB = p.placements.includes('homepage_banner') || p.placements.includes('banner');
        if (!hasB) return false;
      } else if (filterLocation === 'popup') {
        const hasP = p.placements.includes('homepage_popup') || p.placements.includes('popup');
        if (!hasP) return false;
      } else if (filterLocation === 'both') {
        const hasB = p.placements.includes('homepage_banner') || p.placements.includes('banner');
        const hasP = p.placements.includes('homepage_popup') || p.placements.includes('popup');
        if (!hasB || !hasP) return false;
      }
      return true;
    });
  }, [promotions, filterType, filterLocation]);

  // Preview countdown timer
  const previewRemaining = useMemo(() => {
    if (!hasTimer || !endDate) return null;
    const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }, [hasTimer, endDate]);

  const resolvedPreviewDestination = getResolvedDestination();
  const isExternalUrl = resolvedPreviewDestination.startsWith('http');

  const flashDealsCount = promotions.filter(
    (p) => p.promotionKind === 'flash_deal' || p.type === 'flash_sale'
  ).length;
  const regularOffersCount = promotions.filter(
    (p) => p.promotionKind === 'sale_offer' || (!p.promotionKind && p.type !== 'flash_sale')
  ).length;
  const generalPromosCount = promotions.filter(
    (p) => p.promotionKind === 'general_promotion'
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-500/30 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          1. TOP ANNOUNCEMENT BAR (Promotions mode or all mode)
          ===================================================================== */}
      {(sectionMode === 'promotions' || sectionMode === 'all') && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                  Top Header Announcement Bar
                </h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Manage marquee messages pinned at the very top of the storefront. Displays clean English & Bengali announcements.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => handleToggleMasterAnnouncement(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-900 focus:ring-amber-900 cursor-pointer"
                />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {announcementEnabled ? 'Enabled on Store' : 'Disabled'}
                </span>
              </label>

              {!showAddAnnouncementForm && !editingAnnouncement && (
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementForm(true)}
                  className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Add Announcement</span>
                </button>
              )}
            </div>
          </div>

          {/* Add Announcement Form */}
          {showAddAnnouncementForm && (
            <form onSubmit={handleCreateAnnouncement} className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>New Store Announcement (English & Bangla only, no link)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementForm(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Announcement Text (English) *
                  </label>
                  <input
                    type="text"
                    value={newAnnTextEn}
                    onChange={(e) => setNewAnnTextEn(e.target.value)}
                    placeholder="e.g. Free delivery nationwide on orders above ৳3,000"
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Announcement Text (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={newAnnTextBn}
                    onChange={(e) => setNewAnnTextBn(e.target.value)}
                    placeholder="যেমন: ৩০০০ টাকার বেশি অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি"
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementForm(false)}
                  className="px-3.5 py-1.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold cursor-pointer hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>Publish Announcement</span>
                </button>
              </div>
            </form>
          )}

          {/* Edit Existing Announcement Form */}
          {editingAnnouncement && (
            <form onSubmit={handleSaveEditAnnouncement} className="p-4 bg-amber-50/70 dark:bg-stone-850 rounded-2xl border border-amber-400 dark:border-stone-700 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-stone-700">
                <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Edit Existing Announcement</span>
                </span>

                <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-stone-800 px-3 py-1 rounded-xl border border-amber-200 dark:border-stone-700">
                  <input
                    type="checkbox"
                    checked={editAnnIsActive}
                    onChange={(e) => setEditAnnIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-900 focus:ring-amber-900 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${editAnnIsActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                    {editAnnIsActive ? 'Active' : 'Disabled (Paused)'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Announcement Text (English) *
                  </label>
                  <input
                    type="text"
                    value={editAnnTextEn}
                    onChange={(e) => setEditAnnTextEn(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Announcement Text (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={editAnnTextBn}
                    onChange={(e) => setEditAnnTextBn(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-200/60 dark:border-stone-700">
                <button
                  type="button"
                  onClick={handleDeleteAnnouncement}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Announcement</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAnnouncement(null)}
                    className="px-3.5 py-1.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold cursor-pointer hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Announcements List */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Active Announcement Bar Messages ({announcementConfig.announcements.length})
            </span>

            {announcementConfig.announcements.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-stone-50/50 dark:bg-stone-900">
                {announcementConfig.announcements.map((ann, idx) => (
                  <div
                    key={ann.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white dark:hover:bg-stone-850 transition-colors"
                  >
                    <div className="space-y-1 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ann.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                          }`}
                        >
                          {ann.isActive ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-xs font-semibold text-stone-900 dark:text-white">
                          {ann.textEn}
                        </span>
                      </div>

                      {ann.textBn && ann.textBn !== ann.textEn && (
                        <p className="text-xs text-stone-600 dark:text-stone-300 pl-8">
                          বাংলা: {ann.textBn}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditAnnouncement(ann)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-amber-900 hover:text-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-1">
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  No announcement items created yet. Click <strong>+ Add Announcement</strong> to write English and Bangla announcement text.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          2. SECTION TITLE & ACTIONS
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2.5">
            {sectionMode === 'offers' ? (
              <>
                <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>Unified Offers Section: Flash Deals, Sales & Discounts</span>
              </>
            ) : sectionMode === 'promotions' ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <span>Promotions: Announcements, Marketing & Upcoming Collections</span>
              </>
            ) : (
              <>
                <Layers className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <span>Promotions, Offers & Banner/Pop-up Manager</span>
              </>
            )}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-3xl">
            {sectionMode === 'offers'
              ? 'Manage all commercial campaigns in one unified section: time-sensitive Flash Deals, percentage & flat discounts, coupon vouchers, and countdown timers.'
              : 'Manage marketing campaigns, brand announcements, and upcoming saree collection showcases across homepage banners, mid banners, and landing pop-ups.'}
          </p>
        </div>

        {!isBuilderOpen && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {sectionMode !== 'promotions' && (
              <button
                type="button"
                onClick={() => handleOpenCreatePromo('flash_deal')}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md cursor-pointer transition-all transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>+ Create Flash Deal</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenCreatePromo(sectionMode === 'promotions' ? 'general_promotion' : 'sale_offer')}
              className="px-4 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{sectionMode === 'promotions' ? '+ Add Promotion' : '+ Add Offer / Promotion'}</span>
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          3. UPGRADED ADD / EDIT PROMOTION FORM (FULL MODAL BUILDER)
          ===================================================================== */}
      {isBuilderOpen && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-amber-300 dark:border-stone-800 p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{editingPromo ? 'Edit Promotion / Offer' : 'Create New Promotion / Offer'}</span>
              </h4>
              <p className="text-[11px] text-stone-500">
                Configure type, imagery, countdown timer, discount text, destination, hidden category, and display channels.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsBuilderOpen(false);
                setEditingPromo(null);
              }}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT / FORM COLUMN (7 of 12 cols) */}
            <form onSubmit={handleSavePromo} className="lg:col-span-7 space-y-5">
              
              {/* REQUIREMENT: PROMOTION TYPE SELECTOR (RADIO BUTTONS) */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <label className="text-xs font-bold text-stone-900 dark:text-white block">
                  1. Select Promotion Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Radio 1: Flash Deal */}
                  <label
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      promotionKind === 'flash_deal'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="promotionKindRadio"
                      value="flash_deal"
                      checked={promotionKind === 'flash_deal'}
                      onChange={() => {
                        setPromotionKind('flash_deal');
                        if (!hasTimer) setHasTimer(true);
                        if (!timerLabel || timerLabel === 'Ends In') setTimerLabel('Flash Deal Ends In');
                        if (!discountText) setDiscountText('FLAT 25% OFF');
                      }}
                      className="mt-0.5 w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-400">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Flash Deal</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        High urgency deal with timer & prominent discount
                      </p>
                    </div>
                  </label>

                  {/* Radio 2: Sale/Offer */}
                  <label
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      promotionKind === 'sale_offer'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="promotionKindRadio"
                      value="sale_offer"
                      checked={promotionKind === 'sale_offer'}
                      onChange={() => {
                        setPromotionKind('sale_offer');
                        if (!discountText) setDiscountText('UP TO 20% OFF');
                      }}
                      className="mt-0.5 w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Sale / Offer</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Commercial discounts, sales & coupon deals
                      </p>
                    </div>
                  </label>

                  {/* Radio 3: General Promotion */}
                  <label
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      promotionKind === 'general_promotion'
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="promotionKindRadio"
                      value="general_promotion"
                      checked={promotionKind === 'general_promotion'}
                      onChange={() => setPromotionKind('general_promotion')}
                      className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>General Promotion</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Brand announcements, marketing & collections
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* REQUIREMENT: CHOOSE BANNER ONLY, POP-UP ONLY, OR BOTH */}
              <div className="p-4 bg-amber-50/60 dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-2.5">
                <label className="text-xs font-bold text-stone-900 dark:text-white block">
                  2. Choose Display Channel: Banner Only, Pop-up Only, or Both *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLocation('banner');
                      setPreviewSurface('banner');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      location === 'banner'
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-bold block">Banner Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLocation('popup');
                      setPreviewSurface('popup');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      location === 'popup'
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-xs font-bold block">Pop-up Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLocation('both');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      location === 'both'
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs ring-2 ring-amber-500/20'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold block">Both</span>
                  </button>
                </div>

                {/* Display Location Slot & Pop-up Timing Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60 dark:border-stone-700">
                  {(location === 'banner' || location === 'both') && (
                    <div>
                      <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                        Display Location (Banner Slot):
                      </label>
                      <select
                        value={sectionSlot}
                        onChange={(e) => setSectionSlot(e.target.value as any)}
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold"
                      >
                        <option value="hero">Homepage Hero Banner (Top Carousel)</option>
                        <option value="promo_mid">Promo Mid Banner (Mid-Page Showcase)</option>
                      </select>
                    </div>
                  )}

                  {(location === 'popup' || location === 'both') && (
                    <div>
                      <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                        Pop-up Timing (Appearance Delay):
                      </label>
                      <select
                        value={delaySeconds}
                        onChange={(e) => setDelaySeconds(Number(e.target.value))}
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold"
                      >
                        <option value={0}>Instant (0s after landing)</option>
                        <option value={1}>1 Second Delay (Recommended)</option>
                        <option value={2}>2 Seconds Delay</option>
                        <option value={3}>3 Seconds Delay</option>
                        <option value={5}>5 Seconds Delay</option>
                        <option value={10}>10 Seconds Delay</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      Display Priority (1 = Top priority):
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                      className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-bold font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* REQUIREMENT: BANNER IMAGE */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      3. Banner Image
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={hasImage}
                      onChange={(e) => setHasImage(e.target.checked)}
                      className="rounded text-amber-900 cursor-pointer"
                    />
                    <span>Include Image</span>
                  </label>
                </div>

                {hasImage ? (
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL (e.g. /src/assets/images/... or https://...)"
                        className="flex-1 p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-900 dark:text-white"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 text-stone-800 dark:text-stone-200 transition-colors shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-stone-400 block mb-1">
                        Preset authentic saree visuals:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImageUrl(img.url)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                              imageUrl === img.url
                                ? 'bg-amber-900 text-white border-amber-900'
                                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {img.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200">
                    Image disabled. Promotion will render as a rich typography card with artisan background gradient.
                  </div>
                )}
              </div>

              {/* REQUIREMENT: TITLE & PROMOTIONAL TEXT */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      4. Title & Promotional Text
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasText}
                    onChange={(e) => setHasText(e.target.checked)}
                    className="rounded text-amber-900 cursor-pointer"
                  />
                </div>

                {hasText && (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Title (English) *
                        </label>
                        <input
                          type="text"
                          value={titleEn}
                          onChange={(e) => setTitleEn(e.target.value)}
                          placeholder="e.g. Royal Eid Handloom Celebration"
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Title (বাংলা)
                        </label>
                        <input
                          type="text"
                          value={titleBn}
                          onChange={(e) => setTitleBn(e.target.value)}
                          placeholder="যেমন: পবিত্র ঈদ স্পেশাল উৎসব অফার"
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Promotional Text / Subtitle (English)
                        </label>
                        <input
                          type="text"
                          value={subtitleEn}
                          onChange={(e) => setSubtitleEn(e.target.value)}
                          placeholder="e.g. Authentic Dhakai Jamdani & Muslin sarees"
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Promotional Text / Subtitle (বাংলা)
                        </label>
                        <input
                          type="text"
                          value={subtitleBn}
                          onChange={(e) => setSubtitleBn(e.target.value)}
                          placeholder="যেমন: শতভাগ খাঁটি ঢাকাই জামদানি ও মসলিন শাড়ি"
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* REQUIREMENT: OPTIONAL DISCOUNT TEXT */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      5. Optional Discount Text (Badge / Callout)
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">Optional</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={discountText}
                    onChange={(e) => setDiscountText(e.target.value)}
                    placeholder="e.g. FLAT 20% OFF, UP TO 50% OFF, SAVE ৳1,000, BUY 1 GET 1"
                    className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-bold font-mono"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {['FLAT 20% OFF', 'FLAT 25% OFF', 'UP TO 50% OFF', 'SAVE ৳1,000', 'SPECIAL EID OFFER'].map(
                      (preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setDiscountText(preset)}
                          className="px-2 py-0.5 rounded text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 cursor-pointer border border-stone-200 dark:border-stone-700"
                        >
                          {preset}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* REQUIREMENT: OPTIONAL COUNTDOWN TIMER WITH CUSTOMIZABLE LABEL */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      6. Optional Countdown Timer with Customizable Label
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasTimer}
                    onChange={(e) => setHasTimer(e.target.checked)}
                    className="rounded text-amber-900 cursor-pointer"
                  />
                </div>

                {hasTimer && (
                  <div className="space-y-3 pt-1">
                    {/* Customizable Label */}
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">
                        Timer Label (e.g. “Coming Soon”, “Ends In”, “Flash Deal Ends”):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={timerLabel}
                          onChange={(e) => setTimerLabel(e.target.value)}
                          placeholder="e.g. Ends In or Coming Soon"
                          className="flex-1 p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold"
                        />
                        <div className="flex items-center gap-1">
                          {['Ends In', 'Coming Soon', 'Flash Deal Ends In'].map((lbl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setTimerLabel(lbl)}
                              className="px-2 py-1 text-[10px] rounded bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 cursor-pointer hover:bg-amber-100 text-stone-700 dark:text-stone-300"
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Target End Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Target End Date & Time (Expiration):
                        </label>
                        <input
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Quick Presets:
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '+24h', h: 24 },
                            { label: '+48h', h: 48 },
                            { label: '+7d', h: 168 },
                            { label: '+14d', h: 336 }
                          ].map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                const target = new Date(Date.now() + p.h * 3600 * 1000);
                                setEndDate(target.toISOString().slice(0, 16));
                              }}
                              className="px-2 py-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded text-[10px] font-bold cursor-pointer"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {previewRemaining && (
                      <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {timerLabel}: {previewRemaining.days}d : {previewRemaining.hours}h : {previewRemaining.minutes}m : {previewRemaining.seconds}s
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* REQUIREMENT: CONFIGURE SCHEDULING (START & END DATES) */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      7. Schedule Auto-Activation
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={hasStartDate}
                      onChange={(e) => setHasStartDate(e.target.checked)}
                      className="rounded text-amber-900 cursor-pointer"
                    />
                    <span>Schedule Future Start</span>
                  </label>
                </div>

                {hasStartDate && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">
                      Start Date & Time (Promotion activates automatically at this time):
                    </label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              {/* REQUIREMENT: CLICKABLE CTA BUTTON OR MAKE ENTIRE BANNER CLICKABLE */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-stone-900 dark:text-white">
                    8. Clickable Action & CTA Button
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      clickableMode === 'button'
                        ? 'bg-amber-50 dark:bg-stone-800 border-amber-900 text-amber-950 dark:text-amber-200 shadow-2xs font-bold'
                        : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="clickableMode"
                      value="button"
                      checked={clickableMode === 'button'}
                      onChange={() => setClickableMode('button')}
                      className="w-4 h-4 text-amber-900 cursor-pointer"
                    />
                    <span className="text-xs">Clickable CTA Button</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      clickableMode === 'entire_banner'
                        ? 'bg-amber-50 dark:bg-stone-800 border-amber-900 text-amber-950 dark:text-amber-200 shadow-2xs font-bold'
                        : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="clickableMode"
                      value="entire_banner"
                      checked={clickableMode === 'entire_banner'}
                      onChange={() => setClickableMode('entire_banner')}
                      className="w-4 h-4 text-amber-900 cursor-pointer"
                    />
                    <span className="text-xs">Make Entire Banner Clickable</span>
                  </label>
                </div>

                {clickableMode === 'button' && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">
                        Button Label (English):
                      </label>
                      <input
                        type="text"
                        value={ctaTextEn}
                        onChange={(e) => setCtaTextEn(e.target.value)}
                        placeholder="e.g. Shop Collection"
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">
                        Button Label (বাংলা):
                      </label>
                      <input
                        type="text"
                        value={ctaTextBn}
                        onChange={(e) => setCtaTextBn(e.target.value)}
                        placeholder="যেমন: কালেকশন দেখুন"
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* REQUIREMENT: SELECT DESTINATION & ASSIGN TO SPECIFIC HIDDEN CATEGORY */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-stone-900 dark:text-white">
                    9. Select Destination & Hidden Category Assignment *
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 block mb-1">
                      Choose Destination Target:
                    </label>
                    <select
                      value={destinationType}
                      onChange={(e) => setDestinationType(e.target.value as any)}
                      className="w-full p-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold"
                    >
                      <option value="shop">🛍️ All Sarees / Shop Page (/shop)</option>
                      <option value="offers">🎁 Customer Offers Page (/offers)</option>
                      <option value="category">📂 Standard Saree Category</option>
                      <option value="hidden_category">🔒 Specific Hidden Category (Promotional Campaign)</option>
                      <option value="custom">🌐 Custom Internal Link or External URL</option>
                    </select>
                  </div>

                  {destinationType === 'category' && (
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">
                        Select Standard Category:
                      </label>
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameEn} ({c.nameBn})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* SPECIFIC HIDDEN CATEGORY ASSIGNMENT */}
                  {destinationType === 'hidden_category' && (
                    <div className="p-3 bg-amber-50 dark:bg-stone-800 rounded-xl border border-amber-300 dark:border-stone-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Assign to Hidden Promotional Category:</span>
                      </div>
                      <select
                        value={hiddenCategoryId}
                        onChange={(e) => setHiddenCategoryId(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-stone-900 border border-amber-400 dark:border-stone-600 rounded-lg text-xs font-bold"
                      >
                        {hiddenCategories.map((hc) => (
                          <option key={hc.id} value={hc.id}>
                            🔒 {hc.nameEn} — {hc.nameBn} ({hc.productIds?.length || 0} sarees assigned)
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-stone-500 block">
                        ✓ Clicking this promotion will take customers directly to this secret curated category!
                      </span>
                    </div>
                  )}

                  {destinationType === 'custom' && (
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">
                        Enter Custom URL:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customDestinationUrl}
                          onChange={(e) => setCustomDestinationUrl(e.target.value)}
                          placeholder="e.g. /shop, /offers, or https://example.com"
                          className="w-full p-2.5 pl-8 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono"
                        />
                        {isExternalUrl ? (
                          <Globe className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-[10px] font-mono text-stone-600 dark:text-stone-300 truncate">
                    Resolved Destination: <strong>{resolvedPreviewDestination}</strong>
                  </div>
                </div>
              </div>

              {/* OPTIONAL COUPON CODE */}
              <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      10. Associated Coupon Voucher
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasCoupon}
                    onChange={(e) => setHasCoupon(e.target.checked)}
                    className="rounded text-amber-900 cursor-pointer"
                  />
                </div>

                {hasCoupon && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Coupon Code:
                        </label>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. EID15"
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono font-bold uppercase"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1">
                          Or pick existing coupon:
                        </label>
                        <select
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono font-bold"
                        >
                          <option value="">-- Custom Code Above --</option>
                          {coupons.map((cp) => (
                            <option key={cp.id} value={cp.code}>
                              {cp.code} ({cp.discountType === 'percentage' ? `${cp.discountValue}%` : `৳${cp.discountValue}`})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STATUS & ACTIONS */}
              <div className="p-4 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white block">
                      Promotion Status
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {promoIsActive ? 'Active and visible on the store' : 'Deactive (Paused)'}
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-stone-800 px-3 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
                    <input
                      type="checkbox"
                      checked={promoIsActive}
                      onChange={(e) => setPromoIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-900 focus:ring-amber-900 cursor-pointer"
                    />
                    <span className={`text-xs font-bold ${promoIsActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                      {promoIsActive ? 'Active (Live)' : 'Deactive (Paused)'}
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-700">
                  {editingPromo ? (
                    <button
                      type="button"
                      onClick={handleDeletePromo}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Promotion</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBuilderOpen(false);
                        setEditingPromo(null);
                      }}
                      className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-white cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className={`px-6 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
                        promotionKind === 'flash_deal'
                          ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-black'
                          : 'bg-amber-900 hover:bg-amber-800'
                      }`}
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>{editingPromo ? 'Save Changes' : 'Publish Promotion / Offer'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </form>

            {/* RIGHT / LIVE PREVIEW COLUMN (5 of 12 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-700" />
                    <span>Real-Time Visual Preview</span>
                  </span>

                  {/* Surface Switcher */}
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewSurface('banner')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        previewSurface === 'banner'
                          ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-2xs'
                          : 'text-stone-500'
                      }`}
                    >
                      Banner View
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSurface('popup')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        previewSurface === 'popup'
                          ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-2xs'
                          : 'text-stone-500'
                      }`}
                    >
                      Pop-up View
                    </button>
                  </div>
                </div>

                {/* Surface 1: Banner Preview */}
                {previewSurface === 'banner' && (
                  <div
                    className={`relative w-full rounded-2xl overflow-hidden bg-stone-900 border aspect-16/9 flex items-center p-4 shadow-xl ${
                      promotionKind === 'flash_deal' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-700'
                    }`}
                  >
                    {hasImage && imageUrl ? (
                      <div className="absolute inset-0">
                        <img
                          src={imageUrl}
                          alt="Banner Artwork"
                          onError={(e) => handleImageError(e, FALLBACK_BANNER_IMAGE)}
                          className="w-full h-full object-cover"
                        />
                        {hasText && (
                          <div
                            className={`absolute inset-0 ${
                              promotionKind === 'flash_deal'
                                ? 'bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-amber-950/30'
                                : 'bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent'
                            }`}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950" />
                    )}

                    {hasText ? (
                      <div className="relative z-10 max-w-xs space-y-1.5 text-white">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {promotionKind === 'flash_deal' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                              <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                              <span>⚡ FLASH DEAL</span>
                            </span>
                          ) : promotionKind === 'general_promotion' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>NEW SHOWCASE</span>
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-amber-300 tracking-wider">
                              SPECIAL OFFER
                            </span>
                          )}

                          {discountText && (
                            <span className="px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 text-[9px] font-black uppercase">
                              {discountText}
                            </span>
                          )}
                        </div>

                        <h5 className="font-serif font-bold text-sm leading-tight text-balance">
                          {titleEn || 'Promotion Title'}
                        </h5>
                        {subtitleEn && (
                          <p className="text-[10px] text-stone-300 line-clamp-2">
                            {subtitleEn}
                          </p>
                        )}

                        {hasTimer && previewRemaining && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-950/90 rounded text-[9px] font-mono text-amber-300 border border-amber-900/60 font-bold">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {timerLabel}: {previewRemaining.days}d : {previewRemaining.hours}h : {previewRemaining.minutes}m : {previewRemaining.seconds}s
                            </span>
                          </div>
                        )}

                        {hasCoupon && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-900/80 rounded text-[9px] font-mono text-amber-200 border border-amber-500/40 font-bold ml-1">
                            <Ticket className="w-2.5 h-2.5" />
                            <span>{couponCode || 'PROMO'}</span>
                          </div>
                        )}

                        {clickableMode === 'button' ? (
                          <div className="pt-1">
                            <div
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-stone-950 rounded-lg text-[10px] font-bold shadow-xs ${
                                promotionKind === 'flash_deal'
                                  ? 'bg-gradient-to-r from-amber-400 to-rose-400 font-black'
                                  : 'bg-amber-400'
                              }`}
                            >
                              <span>{ctaTextEn || 'Shop'}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1 text-[9px] text-amber-300 font-semibold">
                            ✓ Entire banner is clickable
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative z-10 text-center w-full">
                        <span className="px-2.5 py-1 bg-stone-950/80 text-amber-300 rounded-full text-[10px] font-bold backdrop-blur-xs">
                          🖼️ Image-Only Banner Mode (Clicks target {resolvedPreviewDestination})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Surface 2: Pop-up Dialog Preview */}
                {previewSurface === 'popup' && (
                  <div className="p-4 bg-stone-950/60 rounded-2xl flex items-center justify-center min-h-[260px] border border-stone-800">
                    <div
                      className={`w-full max-w-xs bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border ${
                        promotionKind === 'flash_deal' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      {hasImage && imageUrl ? (
                        <div className="relative h-24 w-full bg-stone-900">
                          <img
                            src={imageUrl}
                            alt="Popup Artwork"
                            onError={(e) => handleImageError(e, FALLBACK_BANNER_IMAGE)}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            {promotionKind === 'flash_deal' ? (
                              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-[8px] font-black uppercase">
                                ⚡ FLASH DEAL
                              </span>
                            ) : null}
                            {discountText && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[8px] font-black uppercase">
                                {discountText}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gradient-to-r from-stone-950 to-amber-950 text-white text-center">
                          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                            {promotionKind === 'flash_deal' ? 'FLASH DEAL DIALOG' : 'PROMOTIONAL DIALOG'}
                          </span>
                        </div>
                      )}

                      <div className="p-3.5 space-y-2 text-center">
                        {hasText && (
                          <div>
                            <h5 className="font-serif font-bold text-xs text-stone-900 dark:text-white line-clamp-1">
                              {titleEn || 'Promotion Dialog'}
                            </h5>
                            {subtitleEn && (
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                                {subtitleEn}
                              </p>
                            )}
                          </div>
                        )}

                        {hasTimer && previewRemaining && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[9px] font-mono text-amber-900 dark:text-amber-300 font-bold">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {timerLabel}: {previewRemaining.hours}h : {previewRemaining.minutes}m : {previewRemaining.seconds}s
                            </span>
                          </div>
                        )}

                        {clickableMode === 'button' ? (
                          <div
                            className={`w-full py-1.5 text-white rounded-lg text-[10px] font-bold ${
                              promotionKind === 'flash_deal'
                                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 font-black'
                                : 'bg-stone-900'
                            }`}
                          >
                            {ctaTextEn || 'View Offer'}
                          </div>
                        ) : (
                          <div className="text-[9px] text-amber-700 dark:text-amber-400 font-semibold py-1">
                            ✓ Entire dialog card is clickable
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-stone-400 text-center space-y-0.5">
                  <p>Target destination: <strong>{resolvedPreviewDestination}</strong></p>
                  <p>Live preview mirrors storefront behavior.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          4. EXISTING PROMOTIONS & OFFERS LIST
          ===================================================================== */}
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              All Items ({promotions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('flash_deal')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'flash_deal'
                  ? 'bg-rose-600 text-white shadow-2xs font-black'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Flash Deals ({flashDealsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('sale_offer')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'sale_offer'
                  ? 'bg-amber-900 text-white shadow-2xs font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Sales & Discounts ({regularOffersCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('general_promotion')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'general_promotion'
                  ? 'bg-purple-900 text-white shadow-2xs font-bold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>General Promotions ({generalPromosCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterLocation('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterLocation === 'all'
                  ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-stone-500'
              }`}
            >
              All Channels
            </button>
            <button
              type="button"
              onClick={() => setFilterLocation('banner')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterLocation === 'banner'
                  ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-stone-500'
              }`}
            >
              Banners
            </button>
            <button
              type="button"
              onClick={() => setFilterLocation('popup')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterLocation === 'popup'
                  ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-stone-500'
              }`}
            >
              Pop-ups
            </button>
          </div>
        </div>

        {/* Promotions Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPromotions.map((promo) => {
            const hasBanner = promo.placements.includes('homepage_banner') || promo.placements.includes('banner');
            const hasPopup = promo.placements.includes('homepage_popup') || promo.placements.includes('popup');
            const isExternal = (promo.destinationLink || promo.ctaLink || '').startsWith('http');
            const isFlash = promo.promotionKind === 'flash_deal' || promo.type === 'flash_sale';
            const isGeneral = promo.promotionKind === 'general_promotion';

            return (
              <div
                key={promo.id}
                className={`bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 ${
                  isFlash
                    ? 'border-2 border-rose-500/80 dark:border-rose-500 ring-2 ring-rose-500/20'
                    : 'border border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="space-y-3">
                  {/* Thumbnail & Badges */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-stone-700">
                    {promo.image ? (
                      <img
                        src={promo.image}
                        alt={promo.titleEn}
                        onError={(e) => handleImageError(e, FALLBACK_BANNER_IMAGE)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/60 p-4 flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                          Typography Layout
                        </span>
                        <span className="font-serif text-sm font-bold text-white line-clamp-1 mt-1">
                          {promo.titleEn}
                        </span>
                      </div>
                    )}

                    {/* Promotion Kind Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isFlash ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md flex items-center gap-1 animate-pulse">
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Flash Deal</span>
                        </span>
                      ) : isGeneral ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/90 text-purple-200 border border-purple-400/40 shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-300" />
                          <span>General Promotion</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-900/90 text-amber-200 border border-amber-400/40 shadow-xs flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>Sale / Offer</span>
                        </span>
                      )}

                      {/* Channel Badge */}
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-stone-950/80 text-white backdrop-blur-xs w-max">
                        {hasBanner && hasPopup ? 'Banner + Pop-up' : hasBanner ? 'Banner Only' : 'Pop-up Only'}
                      </span>
                    </div>

                    {/* Status & Priority Badge */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          promo.isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-600 text-stone-200'
                        }`}
                      >
                        {promo.isActive ? 'Active' : 'Deactive'}
                      </span>
                      {promo.priority && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-stone-900/90 text-amber-300 border border-amber-400/30">
                          Priority #{promo.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                        {promo.titleEn || 'Untitled Promotion'}
                      </h5>
                      {promo.discountText && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-stone-950 uppercase shrink-0">
                          {promo.discountText}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {promo.titleBn || promo.subtitleEn || 'No subtitle provided'}
                    </p>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    {promo.hasCountdown && (
                      <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{promo.timerLabel || 'Timer'}</span>
                      </span>
                    )}
                    {promo.hiddenCategoryId && (
                      <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded font-semibold flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>Hidden Cat Target</span>
                      </span>
                    )}
                    {promo.isEntireBannerClickable && (
                      <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded">
                        Full Clickable
                      </span>
                    )}
                    {promo.code && (
                      <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded font-mono font-bold">
                        🏷️ {promo.code}
                      </span>
                    )}
                  </div>

                  {/* Destination Link */}
                  <div className="text-[11px] text-stone-400 flex items-center gap-1 truncate">
                    {isExternal ? (
                      <Globe className="w-3 h-3 text-amber-600 shrink-0" />
                    ) : (
                      <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                    )}
                    <span className="truncate">
                      Destination: {promo.destinationLink || promo.ctaLink || '/shop'}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPromo(promo)}
                    className="w-full py-2 bg-stone-100 hover:bg-amber-900 hover:text-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit {isFlash ? 'Flash Deal' : isGeneral ? 'Promotion' : 'Offer'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPromotions.length === 0 && (
          <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-center space-y-2">
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              No promotions or offers found for this filter.
            </p>
            <p className="text-xs text-stone-500">
              Click <strong>+ Add Promotion / Offer</strong> above to create one.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
