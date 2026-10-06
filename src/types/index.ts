export type Language = 'en' | 'bn';

export interface ProductVariant {
  id: string;
  colorNameEn: string;
  colorNameBn: string;
  colorHex: string;
  colorFamily: 'red' | 'blue' | 'green' | 'yellow' | 'white' | 'black' | 'pink' | 'purple' | 'gold' | 'teal';
  image: string;
  stock: number;
  sku: string;
  priceDelta?: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerPhoneMasked: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
}

export interface Product {
  id: string;
  code: string; // e.g. "JM-108", "DM-204"
  nameEn: string;
  nameBn: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  fixedDiscountPrice?: number;
  categoryId: string;
  subcategoryId?: string;
  sareeType: 'Dhakai Jamdani' | 'Dhakai Muslin' | 'Tangail Taat' | 'Rajshahi Silk' | 'Mirpur Katan' | 'Monipuri Handloom';
  fabric: string;
  fabricBn: string;
  occasion: string;
  occasionBn: string;
  suitableAgeRange: '18-25' | '25-35' | '35-50' | '50+' | 'All Ages';
  descriptionEn: string;
  descriptionBn: string;
  careInstructionsEn: string;
  careInstructionsBn: string;
  length: string; // e.g. "5.5m (12 Haat) with 0.8m Blouse Piece"
  hasBlousePiece: boolean;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  isActive: boolean;
  separateVariantCards?: boolean;
  rating: number;
  reviewCount: number;
  keywords: string[];
  primaryImage: string;
  images: string[];
  variants: ProductVariant[];
  salesCount: number;
  viewsCount: number;
}

export interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  image: string;
  descriptionEn: string;
  descriptionBn: string;
  heritageStoryEn?: string;
  heritageStoryBn?: string;
  loomType?: string;
  originHub?: string;
  threadCount?: string;
  displayOrder: number;
  isActive: boolean;
  subcategories: { id: string; nameEn: string; nameBn: string; slug?: string }[];
}

export interface LandingPopupConfig {
  id: string;
  isActive: boolean;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  image: string;
  discountCode?: string;
  ctaTextEn: string;
  ctaTextBn: string;
  ctaLink: string;
}

export interface FlashSaleCampaign {
  id: string;
  titleEn: string;
  titleBn: string;
  discountPercent: number;
  hasTimer: boolean;
  endTime?: string;
  isActive: boolean;
  bannerImage?: string;
}

export interface Banner {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  image: string;
  ctaTextEn: string;
  ctaTextBn: string;
  ctaLink: string;
  startDate?: string;
  endDate?: string;
  hasCountdown: boolean;
  countdownTarget?: string; // ISO date string
  isActive: boolean;
  displayOrder: number;
  sectionSlot: 'hero' | 'promo_mid';
}

export interface HomepageSection {
  id: string;
  titleEn: string;
  titleBn: string;
  rule: 'featured' | 'top_selling' | 'top_rated' | 'new_collection' | 'sale' | 'category' | 'recommended';
  categoryId?: string;
  layout: 'carousel' | 'grid_4';
  displayOrder: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  colorNameEn: string;
  colorNameBn: string;
  colorHex: string;
  price: number;
  code: string;
  nameEn: string;
  nameBn: string;
  image: string;
}

export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  isInsideDhaka: boolean;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface CustomerAccount {
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
  loyaltyPoints: number; // 1 point for every ৳100 spent, 1 point = ৳1 discount
  savedAddresses: Address[];
  wishlistProductIds: string[];
  orderIds: string[];
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'courier_shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  code: string;
  color: string;
  image: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string; // e.g. "ANC-84920"
  orderDate: string;
  customerPhone: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  pointsDiscount?: number;
  redeemedPoints?: number;
  pointsEarned?: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'pending' | 'paid';
  orderStatus: OrderStatus;
  shippingAddress: Address;
  isGift: boolean;
  giftDetails?: {
    recipientName: string;
    recipientPhone: string;
    message?: string;
  };
  appliedCoupon?: string;
  appliedPrivateCode?: string;
  courier?: {
    name: string;
    consignmentId: string;
    trackingCode: string;
    trackingUrl: string;
    shippedDate?: string;
    estimatedDelivery?: string;
  };
  customerNote?: string;
  cancellationReason?: string;
}

export interface PrivatePriceCode {
  id: string;
  code: string; // e.g. "VIP75", "JM108SPECIAL"
  targetProductId?: string; // specific saree
  targetPhone?: string; // restricted to phone
  specialPrice: number; // custom negotiated price
  isOneTime: boolean;
  used: boolean;
  isActive: boolean;
  note?: string;
}

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  subcategoryId?: string;
  sareeType: string;
  colorFamily: string;
  targetColorHex?: string;
  minPrice: number;
  maxPrice: number;
  ageRange: string;
  minAge?: number;
  maxAge?: number;
  minRating: number;
  onlyInStock: boolean;
  onlyOnSale: boolean;
  sortBy: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'top_rated' | 'top_selling' | 'biggest_discount';
}

export interface AppNotification {
  id: string;
  type: 'order' | 'offer' | 'reward' | 'stock' | 'system';
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionType?: 'track_order' | 'flash_sale' | 'account' | 'shop';
  actionTargetId?: string;
  orderId?: string;
}
