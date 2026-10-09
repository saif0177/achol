import { Product, Category, Banner, Order, CustomerAccount, PrivatePriceCode, Review, FilterState, CartItem, LandingPopupConfig, FlashSaleCampaign, AppNotification, CategoryArticle, Promotion, HiddenPromotionalCategory, TopAnnouncement, TopAnnouncementBarConfig } from '../types';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'order',
    titleEn: 'Order #ANC-84920 Out for Delivery',
    titleBn: 'অর্ডার #ANC-84920 ডেলিভারির উদ্দেশ্যে রওয়ানা হয়েছে',
    messageEn: 'Steadfast Courier rider is on the way with your Royal Jamdani saree. Cash on Delivery payable: ৳13,600.',
    messageBn: 'স্টিডফাস্ট কুরিয়ারের রাইডার আপনার ঢাকাই জামদানি শাড়ির পার্সেলটি নিয়ে বের হয়েছেন। ক্যাশ অন ডেলিভারি: ৳১৩,৬০০।',
    timestamp: '15 mins ago',
    isRead: false,
    actionType: 'track_order',
    orderId: 'ANC-84920'
  },
  {
    id: 'notif-2',
    type: 'offer',
    titleEn: 'Heritage Flash Sale is Live! Flat 15% OFF',
    titleBn: 'ঐতিহ্যবাহী ফ্ল্যাশ সেল শুরু হয়েছে! ফ্ল্যাট ১৫% ছাড়',
    messageEn: 'Limited artisan batch of Dhakai Jamdani & Rajshahi Silk are on flash sale for the next 48 hours.',
    messageBn: 'সীমিত সংখ্যক ঢাকাই জামদানি ও রাজশাহী সিল্ক শাড়িতে পরবর্তী ৪৮ ঘণ্টার জন্য বিশেষ ছাড় চলছে।',
    timestamp: '2 hours ago',
    isRead: false,
    actionType: 'flash_sale'
  },
  {
    id: 'notif-3',
    type: 'reward',
    titleEn: '350 Aanchol Royalty Points Active',
    titleBn: '৩৫০ আঁচল রয়্যালটি পয়েন্ট যুক্ত হয়েছে',
    messageEn: 'You have 350 reward points worth ৳350 discount ready to redeem during checkout.',
    messageBn: 'আপনার অ্যাকাউন্টে ৩৫০ রিওয়ার্ড পয়েন্ট রয়েছে যা আপনি পরবর্তী কেনাকাটায় ৳৩৫০ ছাড় হিসেবে ব্যবহার করতে পারবেন।',
    timestamp: 'Yesterday',
    isRead: false,
    actionType: 'account'
  },
  {
    id: 'notif-4',
    type: 'stock',
    titleEn: 'Restocked: 80-Count Crimson Dhakai Jamdani',
    titleBn: 'পুনরায় স্টক এসেছে: ৮০ কাউন্ট রক্তিম ঢাকাই জামদানি',
    messageEn: 'Master weavers in Rupganj have completed a fresh loom batch of 5 exclusive sarees (Code: JM-108).',
    messageBn: 'রূপগঞ্জের তাঁতিদের হাতে বোনা নতুন ৫টি অনন্য জামদানি শাড়ির লট স্টকে যুক্ত হয়েছে (কোড: JM-108)।',
    timestamp: '2 days ago',
    isRead: true,
    actionType: 'shop'
  }
];

// Initial authentic categories
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'dhakai-jamdani',
    nameEn: 'Dhakai Jamdani',
    nameBn: 'ঢাকাই জামদানি',
    slug: 'dhakai-jamdani',
    image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    descriptionEn: 'Heritage fine handloom sarees with intricate floral & geometric needle motifs from Demra & Rupganj.',
    descriptionBn: 'রূপগঞ্জ ও ডেমরার ঐতিহ্যবাহী তাঁতশিল্পীদের হাতে বোনা সুতি ও রেশম সুতার নিখুঁত ঢাকাই জামদানি।',
    displayOrder: 1,
    isActive: true,
    subcategories: [
      { id: 'jamdani-80-count', nameEn: '80-100 Count Cotton Jamdani', nameBn: '৮০-১০০ কাউন্ট সুতি জামদানি' },
      { id: 'jamdani-resham-silk', nameEn: 'Resham Silk Jamdani', nameBn: 'রেশম সিল্ক জামদানি' },
      { id: 'jamdani-bridal', nameEn: 'Bridal Heavy Zari Jamdani', nameBn: 'বধূ স্পেশাল ভারী জরি জামদানি' }
    ]
  },
  {
    id: 'dhakai-muslin',
    nameEn: 'Dhakai Muslin',
    nameBn: 'ঢাকাই মসলিন',
    slug: 'dhakai-muslin',
    image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
    descriptionEn: 'The legendary ethereal fabric of Bengal, hand-spun with superfine phuti karpas cotton.',
    descriptionBn: 'বাংলার শতাব্দীর ঐতিহ্যবাহী অতিসূক্ষ্ম ফুটি কার্পাস তুলার হাতে তৈরি রাজকীয় ঢাকাই মসলিন।',
    displayOrder: 2,
    isActive: true,
    subcategories: [
      { id: 'muslin-pure', nameEn: 'Royal Pure Muslin', nameBn: 'খাঁটি রাজকীয় মসলিন' },
      { id: 'muslin-jamdani', nameEn: 'Muslin Jamdani Weave', nameBn: 'মসলিন জামদানি বুনন' }
    ]
  },
  {
    id: 'tangail-taat',
    nameEn: 'Tangail Taati Handloom',
    nameBn: 'টাঙ্গাইল তাঁত',
    slug: 'tangail-taat',
    image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    descriptionEn: 'Everyday grace and breathable comfort from the master Taatis of Tangail and Bajitpur.',
    descriptionBn: 'টাঙ্গাইলের ঐতিহ্যবাহী তাঁতিদের দক্ষ হাতের আরামদায়ক সুতি ও কারুকাজময় তাঁতের শাড়ি।',
    displayOrder: 3,
    isActive: true,
    subcategories: [
      { id: 'taat-soft-cotton', nameEn: 'Soft Combed Cotton Taat', nameBn: 'নরম সুতি তাঁত' },
      { id: 'taat-nakshi-par', nameEn: 'Nakshi Border Handloom', nameBn: 'নকশী পাড় তাঁতের শাড়ি' }
    ]
  },
  {
    id: 'rajshahi-silk',
    nameEn: 'Rajshahi Pure Silk',
    nameBn: 'রাজশাহী খাঁটি সিল্ক',
    slug: 'rajshahi-silk',
    image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
    descriptionEn: 'Lustrous Mulberry and Endi silks originating from the silk hubs of the Padma riverbanks.',
    descriptionBn: 'পদ্মার তীরবর্তী রেশমপল্লীর খাঁটি তুঁত রেশমের তৈরি আলো ঝলমলে রাজশাহী সিল্ক।',
    displayOrder: 4,
    isActive: true,
    subcategories: [
      { id: 'silk-swarnachari', nameEn: 'Swarnachari Silk', nameBn: 'স্বর্ণচরী সিল্ক' },
      { id: 'silk-mulberry', nameEn: 'Pure Mulberry Silk', nameBn: 'তুঁত রেশম সিল্ক' }
    ]
  },
  {
    id: 'bridal-festive',
    nameEn: 'Festive & Bridal Katan',
    nameBn: 'বিয়ে ও উৎসব কাতান',
    slug: 'bridal-festive',
    image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    descriptionEn: 'Regal Mirpur Benarasi and bridal Katans designed for weddings, holud, and gala celebrations.',
    descriptionBn: 'মিরপুরের ঐতিহ্যবাহী খাঁটি বেনারসি ও কাতানের নিখুঁত জমকালো বিয়ের শাড়ি।',
    displayOrder: 5,
    isActive: true,
    subcategories: [
      { id: 'katan-bridal-red', nameEn: 'Classic Bridal Red', nameBn: 'ঐতিহ্যবাহী বিয়ের লাল বেনারসি' },
      { id: 'katan-reception', nameEn: 'Reception Pastels', nameBn: 'রিসেপশন প্যাস্টেল কাতান' }
    ]
  }
];

// Initial authentic Bangladeshi Saree products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-jm108',
    code: 'JM-108',
    nameEn: 'Heritage Dhakai Jamdani (80-Count Fine Weave)',
    nameBn: 'ঐতিহ্যবাহী ঢাকাই জামদানি (৮০ কাউন্ট মিহি সুতা)',
    price: 14500,
    originalPrice: 17000,
    discountPercent: 15,
    categoryId: 'dhakai-jamdani',
    subcategoryId: 'jamdani-80-count',
    sareeType: 'Dhakai Jamdani',
    fabric: '80-Count Egyptian Combed Cotton & Resham Zari',
    fabricBn: '৮০ কাউন্ট মিহি সুতি এবং রেশম সোনালি জরি',
    occasion: 'Weddings, Formal Cultural Events & Receptions',
    occasionBn: 'বিয়ে, পারিবারিক উৎসব ও সাংস্কৃতিক সন্ধ্যা',
    suitableAgeRange: '25-35',
    descriptionEn: 'Masterfully woven by national award-winning artisans in Rupganj. Features the iconic Panna Hajar (thousand emeralds) traditional geometric motifs with a rich golden border.',
    descriptionBn: 'রূপগঞ্জের দক্ষ কারিগরদের নিপুণ হাতে বোনা পান্না-হাজার নকশার বিশেষ ঢাকাই জামদানি। এর হালকা ওজন ও অসাধারণ রাজকীয় দীপ্তি প্রতিটি বাঙালি নারীকে করে তোলে অনন্য।',
    careInstructionsEn: 'Dry clean only. Roll fold on a muslin wrap. Air out every 3 months in indirect sunlight.',
    careInstructionsBn: 'শুধুমাত্র ড্রাই ওয়াশ করুন। সূতির কাপড়ে জড়িয়ে রোল করে রাখুন। ৩ মাস পর পর ছায়াযুক্ত স্থানে মেলে বাতাস লাগান।',
    length: '5.5 meters (12 Haat) with running Blouse Piece',
    hasBlousePiece: true,
    stock: 12,
    isFreeDelivery: true,
    promotionalCategoryIds: ['promo-eid', 'promo-freedel'],
    isFeatured: true,
    isNewArrival: false,
    isSale: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 38,
    keywords: ['jamdani', 'dhakai', 'red', 'crimson', 'zari', 'rupganj', 'bridal', 'traditional', 'wedding', 'লাল', 'জামদানি'],
    primaryImage: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    images: [
      '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
      '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'
    ],
    variants: [
      {
        id: 'v-jm108-red',
        colorNameEn: 'Crimson Vermilion Red',
        colorNameBn: 'টকটকে রক্তিম লাল',
        colorHex: '#991B1B',
        colorFamily: 'red',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        stock: 5,
        sku: 'JM-108-RED'
      },
      {
        id: 'v-jm108-navy',
        colorNameEn: 'Royal Midnight Navy',
        colorNameBn: 'গাঢ় রাজকীয় নীল',
        colorHex: '#1E3A8A',
        colorFamily: 'blue',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 3,
        sku: 'JM-108-NVY'
      },
      {
        id: 'v-jm108-green',
        colorNameEn: 'Emerald Bottle Green',
        colorNameBn: 'পান্না সবুজ',
        colorHex: '#065F46',
        colorFamily: 'green',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 4,
        sku: 'JM-108-GRN'
      }
    ],
    salesCount: 42,
    viewsCount: 1420,
    flashSaleId: 'fs-eid-special',
    flashSaleDiscount: 15,
    flashSaleTitle: 'Royal Heritage Flash Sale — Flat 15% OFF',
    shortHeritageHighlightEn: '80-Count Fine Jamdani with Panna Hajar geometric motifs, hand-woven along Shitalakshya river.',
    shortHeritageHighlightBn: '৮০ কাউন্ট মিহি সুতায় শীতলক্ষ্যার তীরে বোনা পান্না-হাজার নকশাযুক্ত ঐতিহ্যবাহী ঢাকাই জামদানি।',
    artisanVillage: 'Noapara, Rupganj, Narayanganj',
    weavingDurationDays: 45,
    heritageArticleEn: 'This heirloom piece is crafted through the supplementary-weft technique without printed graphs. Master weaver Al-Amin and his assistant worked 45 consecutive days in Rupganj. Over 1,200 individual Kandari needle movements form the intricate floral pallu, reflecting 400 years of Mughal patronage.',
    heritageArticleBn: 'এই অনবদ্য শাড়িটি রূপগঞ্জের নোয়াপাড়ায় প্রবীণ তাঁতি আল-আমিন ও তাঁর সহকারীর ৪৫ দিনের একনিষ্ঠ পরিশ্রমে তৈরি। কান্দারির সুক্ষ্ম সুই দিয়ে ১,২০০ বারেরও বেশি সুতার গাঁথুনিতে ফুটে উঠেছে মোঘল আমলের ঐতিহ্যবাহী রাজকীয় পান্না-হাজার নকশা।'
  },
  {
    id: 'p-dm204',
    code: 'DM-204',
    nameEn: 'Royal Dhakai Muslin Saree (100-Count Gossamer Weave)',
    nameBn: 'খাঁটি ঢাকাই রাজকীয় মসলিন শাড়ি (১০০ কাউন্ট)',
    price: 42000,
    originalPrice: 48000,
    discountPercent: 12,
    categoryId: 'dhakai-muslin',
    subcategoryId: 'muslin-pure',
    sareeType: 'Dhakai Muslin',
    fabric: 'Superfine Pure Phuti Karpas Muslin Cotton',
    fabricBn: 'শতভাগ খাঁটি ফুটি কার্পাস তুলা ও মিহি সুতা',
    occasion: 'Prestige Occasions, Gala Dinners & High-End Family Weddings',
    occasionBn: 'বিশেষ রাজকীয় সংবর্ধনা, ভিআইপি অনুষ্ঠান ও রাজকীয় বিয়ে',
    suitableAgeRange: '35-50',
    descriptionEn: 'Recreating the lost pride of Bengal. Weighs barely 320 grams, flowing like air against the skin with delicate handmade thread butidar motifs on an ivory travertine backdrop.',
    descriptionBn: 'বাংলার হারিয়ে যাওয়া গর্বের পুনরাবির্ভাব। মাত্র ৩২০ গ্রাম ওজনের এই শাড়িটি যেন বাতাসের মতোই হালকা ও কোমল। গায়ে জড়ানোর সাথে সাথে পাওয়া যাবে রাজকীয় অনুভূতি।',
    careInstructionsEn: 'Professional dry cleaning only. Store wrapped in acid-free unbleached cotton.',
    careInstructionsBn: 'শুধুমাত্র অভিজ্ঞ ড্রাই ক্লিনারের সাহায্য নিন। রঙ ও সুতা অক্ষুণ্ণ রাখতে সুতি কাপড়ে পেঁচিয়ে সংরক্ষণ করুন।',
    length: '5.5 meters (12 Haat)',
    hasBlousePiece: false,
    stock: 4,
    isFreeDelivery: true,
    promotionalCategoryIds: ['promo-eid'],
    isFeatured: true,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 19,
    keywords: ['muslin', 'dhakai muslin', 'ivory', 'white', 'luxury', 'heritage', 'handloom', 'মসলিন', 'সাদা', 'রাজকীয়'],
    primaryImage: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
    images: [
      '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
      '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'
    ],
    variants: [
      {
        id: 'v-dm204-ivory',
        colorNameEn: 'Travertine Royal Ivory',
        colorNameBn: 'রাজকীয় শুভ্র আইভরি',
        colorHex: '#FDFBF7',
        colorFamily: 'white',
        image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
        stock: 3,
        sku: 'DM-204-IVR'
      },
      {
        id: 'v-dm204-gold',
        colorNameEn: 'Antique Champagne Gold',
        colorNameBn: 'সোনালি শ্যাম্পেন',
        colorHex: '#D4AF37',
        colorFamily: 'gold',
        image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
        stock: 1,
        sku: 'DM-204-GLD'
      }
    ],
    salesCount: 18,
    viewsCount: 980,
    flashSaleId: 'fs-eid-special',
    flashSaleDiscount: 15,
    flashSaleTitle: 'Royal Heritage Flash Sale — Flat 15% OFF',
    shortHeritageHighlightEn: 'Feather-light 100-count true Muslin recreated from Phuti Karpas cotton with certified loom seal.',
    shortHeritageHighlightBn: 'বাতাসের মতো হালকা ১০০ কাউন্টের খাঁটি ফুটি কার্পাস তুলায় বোনা রাজকীয় ঢাকাই মসলিন শাড়ি।',
    artisanVillage: 'Demra, Dhaka',
    weavingDurationDays: 60,
    heritageArticleEn: 'Recreating the legendary "Woven Air" of Bengal, this saree weighs barely 320 grams. Spun during dawn hours when humidity keeps fragile gossamer threads from snapping, it honors Bengal’s proudest historic textile revival.',
    heritageArticleBn: 'বাংলার কিংবদন্তি "বাতাসে বোনা কাপড়" ঢাকাই মসলিনের গৌরবোজ্জ্বল পুনর্জন্ম। মাত্র ৩২০ গ্রাম ওজনের এই শাড়ির প্রতিটি সুতা ভোরের আর্দ্র বাতাসে অতিসূক্ষ্মভাবে কাটা হয়েছে।'
  },
  {
    id: 'p-tt401',
    code: 'TT-401',
    nameEn: 'Tangail Handloom Cotton Taati Saree (Peacock Border)',
    nameBn: 'টাঙ্গাইল তাঁতের খাঁটি সুতি শাড়ি (ময়ূরকণ্ঠী পাড়)',
    price: 3800,
    originalPrice: 4500,
    discountPercent: 15,
    categoryId: 'tangail-taat',
    subcategoryId: 'taat-nakshi-par',
    sareeType: 'Tangail Taat',
    fabric: '100% Breathable Tangail Taati Cotton Yarn',
    fabricBn: '১০০% টাঙ্গাইলের আরামদায়ক তাঁতি সুতি সুতা',
    occasion: 'Office Elegance, Puja, Pohela Boishakh & Daytime Gatherings',
    occasionBn: 'অফিস, পূজা, পহেলা বৈশাখ ও ঘরোয়া অনুষ্ঠান',
    suitableAgeRange: 'All Ages',
    descriptionEn: 'Crafted on traditional wooden fly-shuttle pit looms in Tangail. Features a dense jacquard peacock border with mustard yellow accents and soothing teal body.',
    descriptionBn: 'টাঙ্গাইলের কাঠের পিটলুমে বোনা আরামদায়ক সুতি শাড়ি। এর ময়ূরকণ্ঠী সবুজ-নীল জমিন ও সরিষা হলুদ নকশী পাড় গরমের দিনে এনে দেয় অতুলনীয় আরাম ও আভিজাত্য।',
    careInstructionsEn: 'Cold water gentle hand wash with mild detergent or shampoo. Line dry in shade.',
    careInstructionsBn: 'ঠান্ডা পানিতে মৃদু শ্যাম্পু দিয়ে ধুয়ে ছায়ায় শুকান। হালকা মাড় দিয়ে ইস্ত্রি করলে শাড়ি দীর্ঘস্থায়ী হয়।',
    length: '5.5 meters (12 Haat) with 0.8m Blouse Piece',
    hasBlousePiece: true,
    stock: 28,
    isFreeDelivery: false,
    promotionalCategoryIds: ['promo-flash'],
    isFeatured: true,
    isNewArrival: false,
    isSale: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 54,
    keywords: ['taat', 'tangail', 'cotton', 'teal', 'peacock', 'mustard', 'handloom', 'boishakh', 'তাঁত', 'টাঙ্গাইল', 'সুতি'],
    primaryImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    images: [
      '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg'
    ],
    variants: [
      {
        id: 'v-tt401-teal',
        colorNameEn: 'Peacock Deep Teal',
        colorNameBn: 'ময়ূরকণ্ঠী টিল',
        colorHex: '#0D9488',
        colorFamily: 'teal',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 15,
        sku: 'TT-401-TEA'
      },
      {
        id: 'v-tt401-mustard',
        colorNameEn: 'Tangail Mustard Ochre',
        colorNameBn: 'সরিষা হলুদ',
        colorHex: '#CA8A04',
        colorFamily: 'yellow',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 8,
        sku: 'TT-401-MUS'
      },
      {
        id: 'v-tt401-blue',
        colorNameEn: 'Sky Indigo Blue',
        colorNameBn: 'আকাশি নীল',
        colorHex: '#2563EB',
        colorFamily: 'blue',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 5,
        sku: 'TT-401-BLU'
      }
    ],
    salesCount: 89,
    viewsCount: 2150,
    flashSaleId: 'fs-handloom-festival',
    flashSaleDiscount: 20,
    flashSaleTitle: 'Artisan Tangail Taat Handloom Festive Banner',
    shortHeritageHighlightEn: 'Breathable Tangail pitloom weave featuring iconic peacock border and combed cotton.',
    shortHeritageHighlightBn: 'টাঙ্গাইলের ঐতিহ্যবাহী পিটলুমে বোনা আরামদায়ক কম্বড সুতির ময়ূরকণ্ঠী নকশী পাড় শাড়ি।',
    artisanVillage: 'Bajitpur, Tangail',
    weavingDurationDays: 7,
    heritageArticleEn: 'Hand-woven by the generational Taati community of Bajitpur, Tangail. Celebrated for soft breathable texture, dense jacquard border, and natural cotton comfort.',
    heritageArticleBn: 'টাঙ্গাইলের বাজিতপুরের ঐতিহ্যবাহী তাঁতিদের হাতে বোনা খাঁটি সুতি শাড়ি। হালকা, টেকসই এবং গরমে পড়ার জন্য অসাধারণ আরামদায়ক।'
  },
  {
    id: 'p-sk302',
    code: 'SK-302',
    nameEn: 'Rajshahi Pure Mulberry Silk (Antique Zari Anchol)',
    nameBn: 'রাজশাহী খাঁটি তুঁত রেশম সিল্ক (অ্যান্টিক জরি আঁচল)',
    price: 12200,
    originalPrice: 14000,
    discountPercent: 12,
    categoryId: 'rajshahi-silk',
    subcategoryId: 'silk-mulberry',
    sareeType: 'Rajshahi Silk',
    fabric: '100% Pure Mulberry Silk with Silk Mark Assurance',
    fabricBn: '১০০% খাঁটি মালবেরি রেশম সিল্ক (সিল্ক মার্ক প্রত্যয়িত)',
    occasion: 'Weddings, Formal Cultural Events & Receptions',
    occasionBn: 'বিয়ে, জমকালো পারিবারিক অনুষ্ঠান ও বিশেষ উৎসব',
    suitableAgeRange: '25-35',
    descriptionEn: 'Sourced from the historic sericulture belt of Rajshahi along the Padma basin. Woven with pure Mulberry silk yarns and accented with intricate antique gold zari on the anchol.',
    descriptionBn: 'রাজশাহীর পদ্মার তীরবর্তী রেশমপল্লীর ঐতিহ্যবাহী খাঁটি তুঁত রেশম সুতায় বোনা। শাড়ির আঁচলে রয়েছে নিখুঁত অ্যান্টিক সোনালি জরির অপূর্ব অলংকরণ।',
    careInstructionsEn: 'Dry clean only. Store wrapped in cotton cloth.',
    careInstructionsBn: 'শুধুমাত্র ড্রাই ওয়াশ করুন। সূতির কাপড়ে মুড়িয়ে ছায়াযুক্ত স্থানে রাখুন।',
    length: '5.5 meters (12 Haat) with running Blouse Piece',
    hasBlousePiece: true,
    stock: 14,
    isFeatured: true,
    isNewArrival: false,
    isSale: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 31,
    keywords: ['silk', 'rajshahi', 'mulberry', 'emerald', 'green', 'zari', 'সিল্ক', 'রাজশাহী', 'রেশম'],
    primaryImage: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
    images: [
      '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg'
    ],
    variants: [
      {
        id: 'v-sk302-emerald',
        colorNameEn: 'Regal Emerald Green',
        colorNameBn: 'গাঢ় পান্না সবুজ',
        colorHex: '#047857',
        colorFamily: 'green',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 6,
        sku: 'SK-302-EME'
      }
    ],
    salesCount: 36,
    viewsCount: 1650,
    flashSaleId: 'fs-eid-special',
    flashSaleDiscount: 15,
    flashSaleTitle: 'Royal Heritage Flash Sale — Flat 15% OFF',
    shortHeritageHighlightEn: '100% Pure Mulberry Silk with rich Swarnachari zari border from the Padma sericulture basin.',
    shortHeritageHighlightBn: 'পদ্মার তীরবর্তী রেশমপল্লীর খাঁটি তুঁত রেশম ও স্বর্ণচরী জরি পাড়ের আলো ঝলমলে রাজশাহী সিল্ক।',
    artisanVillage: 'Bholahat, Rajshahi',
    weavingDurationDays: 21,
    heritageArticleEn: 'Originating from sericulture along the Padma riverbanks in Bholahat, this silk is derived from pure mulberry leaves. The resulting triangular prism fiber structure produces a regal natural sheen that refracts light softly.',
    heritageArticleBn: 'পদ্মার অববাহিকায় তুঁত রেশম পোকার গুটি থেকে সুতা কেটে তৈরি হয় ঐতিহ্যবাহী উজ্জ্বল ও দীর্ঘস্থায়ী রাজশাহী সিল্ক। সিল্ক মার্কের বিশ্বস্ততার সাথে এটি বাঙালি নারীর প্রথম পছন্দ।'
  },
  {
    id: 'p-kt505',
    code: 'KT-505',
    nameEn: 'Mirpur Bridal Katan Saree (Meenakari Gold Buti)',
    nameBn: 'মিরপুরি ঐতিহ্যবাহী বধূ কাতান শাড়ি (মীনাকারি কাজ)',
    price: 28500,
    originalPrice: 32000,
    discountPercent: 11,
    categoryId: 'bridal-festive',
    subcategoryId: 'katan-bridal-red',
    sareeType: 'Mirpur Katan',
    fabric: 'Pure Katan Silk with Authentic Golden Zari & Meenakari Threads',
    fabricBn: 'খাঁটি কাতান সিল্ক ও সোনারঙা মিহি রেশম জরি',
    occasion: 'Bridal Ceremony, Holud Night & Biye',
    occasionBn: 'বউভাত, শুভ বিবাহ ও গায়ে হলুদ',
    suitableAgeRange: '18-25',
    descriptionEn: 'The pride of Bengali brides for generations. Heavier 950g drape with rich Meenakari floral booti, traditional kalka pallu, and timeless bridal dignity.',
    descriptionBn: 'বাঙালি কনের বিয়ের স্বপ্ন পূরণ করতে নিপুণ হাতে বোনা ঐতিহ্যবাহী মিরপুরি কাতান। এতে রয়েছে ভারী কলকা আঁচল ও সূক্ষ্ম মীনাকারি কাজের রাজকীয় সমাহার।',
    careInstructionsEn: 'Strictly dry clean. Never spray perfume directly onto zari work.',
    careInstructionsBn: 'অবশ্যই ড্রাই ক্লিন করবেন। জরির উপর পারফিউম স্প্রে করবেন না।',
    length: '5.5 meters with heavy embroidered Blouse Piece',
    hasBlousePiece: true,
    stock: 6,
    isFeatured: true,
    isNewArrival: false,
    isSale: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 42,
    keywords: ['katan', 'bridal', 'mirpur', 'benarasi', 'wedding', 'maroon', 'red', 'gold', 'বিয়ে', 'কাতান', 'লাল'],
    primaryImage: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    images: [
      '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
      '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg'
    ],
    variants: [
      {
        id: 'v-kt505-maroon',
        colorNameEn: 'Bridal Crimson Maroon',
        colorNameBn: 'বউয়ের রক্তিম মেরুন',
        colorHex: '#881337',
        colorFamily: 'red',
        image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
        stock: 3,
        sku: 'KT-505-MRN'
      },
      {
        id: 'v-kt505-gold',
        colorNameEn: 'Imperial Regal Gold',
        colorNameBn: 'খাঁটি রাজকীয় সোনালি',
        colorHex: '#B45309',
        colorFamily: 'gold',
        image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
        stock: 3,
        sku: 'KT-505-GLD'
      }
    ],
    salesCount: 38,
    viewsCount: 1680
  },
  {
    id: 'p-jm112',
    code: 'JM-112',
    nameEn: 'Self-Weave Muslin Jamdani (Black Gold Luxury Edition)',
    nameBn: 'ব্ল্যাক-গোল্ড মসলিন জামদানি (সেলফ কারুকাজ স্পেশাল)',
    price: 19800,
    originalPrice: 23000,
    discountPercent: 14,
    categoryId: 'dhakai-jamdani',
    subcategoryId: 'jamdani-resham-silk',
    sareeType: 'Dhakai Jamdani',
    fabric: 'Fine Resham Silk & Antique Zari',
    fabricBn: 'মিহি রেশম সুতা ও অ্যান্টিক সোনালি জরি',
    occasion: 'Evening Galas, Eid & High-Profile Dinners',
    occasionBn: 'ঈদ, সান্ধ্যকালীন সংবর্ধনা ও বিশেষ অনুষ্ঠান',
    suitableAgeRange: '25-35',
    descriptionEn: 'A breathtaking monochrome masterpiece combining deep pitch-black weave with subtle antique gold and copper floral buta.',
    descriptionBn: 'কালো এবং সোনার নান্দনিক যুগলবন্দী। মায়াবী কালো জমিনের ওপর নিপুণ সোনালি কলকা ও পাতার কারুকাজ আপনাকে যেকোনো আলোয় আলাদা করে তুলবে।',
    careInstructionsEn: 'Dry clean only.',
    careInstructionsBn: 'শুধুমাত্র ড্রাই ক্লিন করুন।',
    length: '5.5 meters with Blouse Piece',
    hasBlousePiece: true,
    stock: 7,
    isFeatured: false,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 4.7,
    reviewCount: 14,
    keywords: ['black', 'gold', 'jamdani', 'muslin', 'eid', 'resham', 'কালো', 'জামদানি'],
    primaryImage: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    images: ['/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg'],
    variants: [
      {
        id: 'v-jm112-black',
        colorNameEn: 'Midnight Pitch Black',
        colorNameBn: 'গাঢ় কুচকুচে কালো',
        colorHex: '#18181B',
        colorFamily: 'black',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        stock: 4,
        sku: 'JM-112-BLK'
      },
      {
        id: 'v-jm112-blue',
        colorNameEn: 'Deep Navy Blue',
        colorNameBn: 'গাঢ় নেভি ব্লু',
        colorHex: '#1E3A8A',
        colorFamily: 'blue',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 3,
        sku: 'JM-112-NVY'
      }
    ],
    salesCount: 22,
    viewsCount: 890
  },
  {
    id: 'p-mk601',
    code: 'MK-601',
    nameEn: 'Mirpur Benarasi Katan (Royal Crimson & Meena Border)',
    nameBn: 'মিরপুর বেনারসি কাতান (রক্তিম লাল ও মীনাকারি পাড়)',
    price: 18500,
    originalPrice: 22000,
    discountPercent: 16,
    categoryId: 'dhakai-jamdani',
    subcategoryId: 'jamdani-80-count',
    sareeType: 'Mirpur Katan',
    fabric: 'Pure Mulberry Silk with Antique Gold Zari',
    fabricBn: 'খাঁটি তুঁত রেশম ও অ্যান্টিক সোনালি জরি',
    occasion: 'Weddings, Receptions & Grand Celebrations',
    occasionBn: 'বিয়ে, বৌভাত ও রাজকীয় উৎসব',
    suitableAgeRange: '25-35',
    descriptionEn: 'Woven with dense floral jaal work on rich crimson red silk, framed by delicate meenakari floral borders.',
    descriptionBn: 'মিরপুরের প্রবীণ কারিগরদের নিপুণ বুননে তৈরি। জমিন জুড়ে ঘন জাফরানি জাল নকশা এবং রাজকীয় মীনাকারি সোনালি পাড়।',
    careInstructionsEn: 'Dry clean only. Roll in cotton muslin wrap.',
    careInstructionsBn: 'শুধুমাত্র ড্রাই ওয়াশ করুন।',
    length: '5.5 meters with running Blouse Piece',
    hasBlousePiece: true,
    stock: 8,
    isFeatured: true,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 28,
    keywords: ['katan', 'benarasi', 'red', 'wedding', 'bridal', 'কাতান', 'বেনারসি', 'লাল'],
    primaryImage: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    images: ['/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg'],
    variants: [
      {
        id: 'v-mk601-red',
        colorNameEn: 'Crimson Red',
        colorNameBn: 'টকটকে রক্তিম লাল',
        colorHex: '#991B1B',
        colorFamily: 'red',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        stock: 5,
        sku: 'MK-601-RED'
      },
      {
        id: 'v-mk601-maroon',
        colorNameEn: 'Royal Maroon',
        colorNameBn: 'মরুন',
        colorHex: '#831843',
        colorFamily: 'red',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 3,
        sku: 'MK-601-MRN'
      }
    ],
    salesCount: 31,
    viewsCount: 1140
  },
  {
    id: 'p-pb702',
    code: 'PB-702',
    nameEn: 'Pabna Fine Handloom Taat Saree (Pastel Mint & Ganga-Jamuna Border)',
    nameBn: 'পাবনা মিহি সুতি তাঁত শাড়ি (মিন্ট সবুজ ও গঙ্গা-যমুনা পাড়)',
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    categoryId: 'tangail-taat',
    subcategoryId: 'taat-cotton',
    sareeType: 'Tangail Taat',
    fabric: '100-Count Combed Soft Cotton',
    fabricBn: '১০০ কাউন্ট মিহি চিরুনি সুতি সুতা',
    occasion: 'Daily Elegance, Office Wear & Summer Gatherings',
    occasionBn: 'প্রতিদিনের পরিধান, অফিস ও গ্রীষ্মের আড্ডা',
    suitableAgeRange: 'All Ages',
    descriptionEn: 'Breathable, featherlight 100-count cotton woven on traditional pit looms in Pabna with contrasting Ganga-Jamuna borders.',
    descriptionBn: 'পাবনার ঐতিহ্যবাহী পিট-লুমে বোনা ১০০ কাউন্টের অত্যন্ত নরম ও আরামদায়ক সুতি শাড়ি। দুই পাশে দুই রঙের অনন্য গঙ্গা-যমুনা পাড়।',
    careInstructionsEn: 'Gentle hand wash in cold water with mild shampoo.',
    careInstructionsBn: 'ঠান্ডা পানিতে মৃদু শ্যাম্পু দিয়ে ধুয়ে ছায়ায় শুকান।',
    length: '5.5 meters',
    hasBlousePiece: false,
    stock: 14,
    isFeatured: false,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 33,
    keywords: ['cotton', 'taat', 'pabna', 'summer', 'mint', 'green', 'তাঁত', 'সুতি'],
    primaryImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    images: ['/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg'],
    variants: [
      {
        id: 'v-pb702-mint',
        colorNameEn: 'Mint Green',
        colorNameBn: 'পুদিনা সবুজ',
        colorHex: '#059669',
        colorFamily: 'green',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 8,
        sku: 'PB-702-MNT'
      },
      {
        id: 'v-pb702-yellow',
        colorNameEn: 'Basanti Yellow',
        colorNameBn: 'বাসন্তী হলুদ',
        colorHex: '#D97706',
        colorFamily: 'yellow',
        image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
        stock: 6,
        sku: 'PB-702-YLW'
      }
    ],
    salesCount: 47,
    viewsCount: 1530
  },
  {
    id: 'p-sk308',
    code: 'SK-308',
    nameEn: 'Rajshahi Pure Silk Butidar Saree (Teal Peacock Shade)',
    nameBn: 'রাজশাহী খাঁটি সিল্ক বুটিদার শাড়ি (ময়ূরকণ্ঠী টিল শেড)',
    price: 14500,
    originalPrice: 17500,
    discountPercent: 17,
    categoryId: 'rajshahi-silk',
    subcategoryId: 'silk-pure',
    sareeType: 'Rajshahi Silk',
    fabric: '100% Certified Mulberry Silk',
    fabricBn: '১০০% সার্টিফাইড রেশম সিল্ক',
    occasion: 'Evening Festivities, Receptions & Formal Banquets',
    occasionBn: 'সান্ধ্যকালীন উৎসব ও সংবর্ধনা',
    suitableAgeRange: '25-35',
    descriptionEn: 'Lustrous mulberry silk handwoven by Rajshahi sericulture artisans with delicate zari peacock feather motifs.',
    descriptionBn: 'রাজশাহীর রেশম পলুপল্লীর দক্ষ তাঁতিদের বুনন। চমৎকার ময়ূরকণ্ঠী রঙের ওপর সূক্ষ্ম সোনালি বুটির মোহনীয় ছোঁয়া।',
    careInstructionsEn: 'Dry clean only.',
    careInstructionsBn: 'শুধুমাত্র ড্রাই ওয়াশ।',
    length: '5.5 meters with Blouse Piece',
    hasBlousePiece: true,
    stock: 6,
    isFeatured: true,
    isNewArrival: false,
    isSale: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 22,
    keywords: ['silk', 'rajshahi', 'teal', 'blue', 'zari', 'সিল্ক', 'রাজশাহী'],
    primaryImage: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
    images: ['/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg'],
    variants: [
      {
        id: 'v-sk308-teal',
        colorNameEn: 'Teal Blue-Green',
        colorNameBn: 'ময়ূরকণ্ঠী টিল',
        colorHex: '#0D9488',
        colorFamily: 'blue',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 3,
        sku: 'SK-308-TEL'
      },
      {
        id: 'v-sk308-purple',
        colorNameEn: 'Royal Plum Purple',
        colorNameBn: 'জাম রঙা পার্পল',
        colorHex: '#7E22CE',
        colorFamily: 'purple',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        stock: 3,
        sku: 'SK-308-PLM'
      }
    ],
    salesCount: 26,
    viewsCount: 970
  },
  {
    id: 'p-dm208',
    code: 'DM-208',
    nameEn: 'Shorno Jamdani Muslin Saree (Golden Zari Heirloom)',
    nameBn: 'স্বর্ণ জামদানি মসলিন শাড়ি (খাঁটি স্বর্ণালী জরি নকশা)',
    price: 28500,
    originalPrice: 32000,
    discountPercent: 11,
    categoryId: 'dhakai-muslin',
    subcategoryId: 'muslin-pure',
    sareeType: 'Dhakai Muslin',
    fabric: 'Superfine Phuti Karpas & Resham Zari',
    fabricBn: 'শতভাগ খাঁটি ফুটি কার্পাস তুলা ও রেশম সোনালি জরি',
    occasion: 'Weddings & High VIP Gatherings',
    occasionBn: 'রাজকীয় বিয়ে ও বিশেষ উৎসব',
    suitableAgeRange: '35-50',
    descriptionEn: 'Woven over 60 days in Sonargaon, this golden muslin drape shines like molten sunlight with timeless Terchi and Jal floral work.',
    descriptionBn: 'সোনারগাঁয়ের প্রবীণ কারিগরদের ৬০ দিনের নিরলস পরিশ্রমে বোনা স্বর্ণালী মসলিন জামদানি।',
    careInstructionsEn: 'Professional dry clean only. Wrap in unbleached cotton.',
    careInstructionsBn: 'শুধুমাত্র অভিজ্ঞ ড্রাই ক্লিনারের সাহায্য নিন।',
    length: '5.5 meters',
    hasBlousePiece: false,
    stock: 5,
    isFeatured: true,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 18,
    keywords: ['muslin', 'gold', 'zari', 'luxury', 'heirloom', 'সোনারগাঁ', 'মসলিন'],
    primaryImage: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
    images: ['/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg'],
    variants: [
      {
        id: 'v-dm208-gold',
        colorNameEn: 'Ivory Gold',
        colorNameBn: 'স্বর্ণালী আইভরি',
        colorHex: '#D97706',
        colorFamily: 'gold',
        image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
        stock: 3,
        sku: 'DM-208-GLD'
      },
      {
        id: 'v-dm208-beige',
        colorNameEn: 'Warm Cream Beige',
        colorNameBn: 'ক্রিম বেইজ',
        colorHex: '#D97706',
        colorFamily: 'gold',
        image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
        stock: 2,
        sku: 'DM-208-BGE'
      }
    ],
    salesCount: 15,
    viewsCount: 840
  },
  {
    id: 'p-tt410',
    code: 'TT-410',
    nameEn: 'Tangail Jacquard Soft Silk Saree (Meenakari Border)',
    nameBn: 'টাঙ্গাইল জ্যাকার্ড সফট সিল্ক শাড়ি (মীনাকারি পাড়)',
    price: 6800,
    originalPrice: 8500,
    discountPercent: 20,
    categoryId: 'tangail-taat',
    subcategoryId: 'taat-resham',
    sareeType: 'Tangail Taat',
    fabric: 'Soft Resham Silk & Cotton Blend',
    fabricBn: 'নরম রেশম সিল্ক ও সুতি সুতার সংমিশ্রণ',
    occasion: 'Festivals, Puja, Pohela Boishakh & Family Evenings',
    occasionBn: 'উৎসব, পূজা, পহেলা বৈশাখ ও পারিবারিক মিলনমেলা',
    suitableAgeRange: 'All Ages',
    descriptionEn: 'Light as a feather with a rich drape. Woven in Pathrail, Tangail using intricate Jacquard loom techniques.',
    descriptionBn: 'পাথরাইল টাঙ্গাইলের নিপুণ তাঁতিদের জ্যাকার্ড লুমে বোনা সফট সিল্ক শাড়ি। উজ্জ্বল রঙ ও আরামদায়ক বুনন।',
    careInstructionsEn: 'Dry clean recommended.',
    careInstructionsBn: 'ড্রাই ওয়াশ করার পরামর্শ দেয়া হচ্ছে।',
    length: '5.5 meters with Blouse Piece',
    hasBlousePiece: true,
    stock: 10,
    isFeatured: false,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 25,
    keywords: ['tangail', 'silk', 'jacquard', 'festive', 'টাঙ্গাইল', 'সিল্ক'],
    primaryImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    images: ['/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg'],
    variants: [
      {
        id: 'v-tt410-blue',
        colorNameEn: 'Royal Indigo Blue',
        colorNameBn: 'ইন্ডিগো নীল',
        colorHex: '#1E3A8A',
        colorFamily: 'blue',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        stock: 5,
        sku: 'TT-410-BLU'
      },
      {
        id: 'v-tt410-red',
        colorNameEn: 'Vermilion Red',
        colorNameBn: 'সিঁদুরে লাল',
        colorHex: '#991B1B',
        colorFamily: 'red',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        stock: 5,
        sku: 'TT-410-RED'
      }
    ],
    salesCount: 39,
    viewsCount: 1290
  },
  {
    id: 'p-nj105',
    code: 'JM-105',
    nameEn: 'Nilambari Jamdani Saree (Deep Midnight Navy with Silver Peacock Motif)',
    nameBn: 'নীলাম্বরী ঢাকাই জামদানি (গভীর রাতুল নীল ও রুপালী ময়ূর নকশা)',
    price: 16200,
    originalPrice: 19000,
    discountPercent: 15,
    categoryId: 'dhakai-jamdani',
    subcategoryId: 'jamdani-80-count',
    sareeType: 'Dhakai Jamdani',
    fabric: '80-Count Fine Egyptian Cotton & Silver Resham',
    fabricBn: '৮০ কাউন্ট মিহি সুতি এবং রুপালী রেশম সুতা',
    occasion: 'Weddings, Formal Cultural Events & Evening Receptions',
    occasionBn: 'বিয়ে, সাংস্কৃতিক অনুষ্ঠান ও সান্ধ্য উৎসব',
    suitableAgeRange: '25-35',
    descriptionEn: 'The legendary Nilambari weave capturing the hue of midnight skies, adorned with intricate silver zari floral kalkas.',
    descriptionBn: 'আবহমান বাংলার ঐতিহ্যবাহী নীলাম্বরী জামদানি। গভীর নীল জমিনে চাঁদের আলোর মতো জ্বলজ্বলে রুপালী জরি ও রেশমের কাজ।',
    careInstructionsEn: 'Dry clean only.',
    careInstructionsBn: 'শুধুমাত্র ড্রাই ওয়াশ করুন।',
    length: '5.5 meters with Blouse Piece',
    hasBlousePiece: true,
    stock: 9,
    isFeatured: true,
    isNewArrival: true,
    isSale: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 31,
    keywords: ['nilambari', 'jamdani', 'blue', 'navy', 'rupganj', 'নীলাম্বরী', 'জামদানি', 'নীল'],
    primaryImage: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    images: ['/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg'],
    variants: [
      {
        id: 'v-nj105-navy',
        colorNameEn: 'Midnight Nilambari Navy',
        colorNameBn: 'নীলাম্বরী গাঢ় নীল',
        colorHex: '#1E3A8A',
        colorFamily: 'blue',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        stock: 5,
        sku: 'JM-105-NVY'
      },
      {
        id: 'v-nj105-black',
        colorNameEn: 'Night Raven Black',
        colorNameBn: 'কুচকুচে কালো',
        colorHex: '#18181B',
        colorFamily: 'black',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 4,
        sku: 'JM-105-BLK'
      }
    ],
    salesCount: 35,
    viewsCount: 1390
  }
];

// Initial Hero Banners
const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b-hero-1',
    titleEn: 'The Rebirth of Dhakai Jamdani & Muslin',
    titleBn: 'ঢাকাই জামদানি ও মসলিনের রাজকীয় অহংকার',
    subtitleEn: 'Handwoven across Demra, Rupganj & Tangail by certified master weavers. Authentic, certified, and delivered with Cash on Delivery nationwide.',
    subtitleBn: 'রূপগঞ্জ, ডেমরা ও টাঙ্গাইলের নিপুণ তাঁতিদের দক্ষ হাতের ছোঁয়ায় বোনা শাড়ি। কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি আপনার দুয়ারে ক্যাশ অন ডেলিভারিতে।',
    image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    ctaTextEn: 'Explore Handlooms',
    ctaTextBn: 'ঐতিহ্যবাহী শাড়ি দেখুন',
    ctaLink: 'shop',
    hasCountdown: false,
    isActive: true,
    displayOrder: 1,
    sectionSlot: 'hero'
  },
  {
    id: 'b-hero-2',
    titleEn: 'Exclusive Flash Drop: 15% Off All Pure Handlooms',
    titleBn: 'ধামাকা অফার: খাঁটি দেশীয় তাঁতের শাড়িতে ফ্ল্যাট ১৫% ছাড়',
    subtitleEn: 'Order within 1-click with Cash on Delivery nationwide. Inspect your saree before paying.',
    subtitleBn: '১-ক্লিকে ক্যাশ অন ডেলিভারিতে অর্ডার করুন। হাতে পেয়ে দেখে মূল্য পরিশোধের শতভাগ নিশ্চয়তা।',
    image: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg',
    ctaTextEn: 'Shop Flash Drop',
    ctaTextBn: 'অফার উপভোগ করুন',
    ctaLink: 'shop',
    hasCountdown: true,
    countdownTarget: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days remaining
    isActive: true,
    displayOrder: 2,
    sectionSlot: 'hero'
  },
  {
    id: 'b-hero-3',
    titleEn: 'Heritage Eid & Wedding Collection 2026',
    titleBn: 'ঈদ ও বিয়ের বিশেষ ঐতিহ্যবাহী সমাহার',
    subtitleEn: 'Exclusive limited handlooms with instant Cash on Delivery and direct WhatsApp preview support.',
    subtitleBn: 'সীমিত সংস্করণের সেরা কারুকাজ করা শাড়িসমূহ। সরাসরি ভিডিও কলে দেখে নেওয়ার বিশেষ সুবিধা।',
    image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
    ctaTextEn: 'Shop Eid Specials',
    ctaTextBn: 'কালেকশন দেখুন',
    ctaLink: 'shop',
    hasCountdown: false,
    isActive: true,
    displayOrder: 3,
    sectionSlot: 'hero'
  }
];

// Initial Secret / Negotiated Private Price Codes
const INITIAL_PRIVATE_CODES: PrivatePriceCode[] = [
  {
    id: 'code-vip75',
    code: 'VIP75',
    targetProductId: 'p-dm204', // DM-204 Saree
    specialPrice: 35000, // Normally 42,000! Negotiated 35,000
    isOneTime: false,
    used: false,
    isActive: true,
    note: 'Negotiated private code for VIP client for Dhakai Muslin DM-204.'
  },
  {
    id: 'code-jm108',
    code: 'JM108SPECIAL',
    targetProductId: 'p-jm108', // JM-108
    specialPrice: 12500, // Normally 14,500
    isOneTime: false,
    used: false,
    isActive: true,
    note: 'Special negotiated rate for Royal Crimson Jamdani.'
  },
  {
    id: 'code-aanchol500',
    code: 'AANCHOL500',
    specialPrice: 500, // Fixed 500 discount
    isOneTime: false,
    used: false,
    isActive: true,
    note: 'Flat ৳500 loyalty discount.'
  }
];

// Initial sample customer orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ANC-84920',
    orderDate: '2026-10-04T14:30:00Z',
    customerPhone: '01712345678',
    customerName: 'Tasnim Rahman',
    items: [
      {
        productId: 'p-jm108',
        variantId: 'v-jm108-red',
        name: 'Heritage Dhakai Jamdani (80-Count Fine Weave)',
        code: 'JM-108',
        color: 'Crimson Vermilion Red',
        image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
        quantity: 1,
        unitPrice: 14500,
        total: 14500
      }
    ],
    subtotal: 14500,
    discount: 0,
    deliveryFee: 70,
    finalTotal: 14570,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'courier_shipped',
    shippingAddress: {
      id: 'addr-1',
      recipientName: 'Tasnim Rahman',
      phone: '01712345678',
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Dhanmondi Road 27',
      fullAddress: 'House 14/A, Road 27 (Old), Dhanmondi, Dhaka',
      isInsideDhaka: true
    },
    isGift: false,
    courier: {
      name: 'Steadfast Courier',
      consignmentId: 'STDF-892184',
      trackingCode: 'STDF-TRK-7712',
      trackingUrl: 'https://steadfast.com.bd/t/STDF-TRK-7712',
      shippedDate: '2026-10-05',
      estimatedDelivery: 'Tomorrow afternoon'
    }
  },
  {
    id: 'ANC-84921',
    orderDate: '2026-10-03T11:15:00Z',
    customerPhone: '01898765432',
    customerName: 'Samira Huq',
    items: [
      {
        productId: 'p-tt401',
        variantId: 'v-tt401-teal',
        name: 'Tangail Handloom Cotton Taati Saree',
        code: 'TT-401',
        color: 'Peacock Deep Teal',
        image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
        quantity: 2,
        unitPrice: 3800,
        total: 7600
      }
    ],
    subtotal: 7600,
    discount: 0,
    deliveryFee: 130,
    finalTotal: 7730,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    shippingAddress: {
      id: 'addr-2',
      recipientName: 'Samira Huq',
      phone: '01898765432',
      division: 'Chittagong',
      district: 'Chittagong',
      area: 'Nasirabad Housing Society',
      fullAddress: 'Flat B3, Green Villa, Road 4, Nasirabad, Chattogram',
      isInsideDhaka: false
    },
    isGift: true,
    giftDetails: {
      recipientName: 'Nusrat Jahan (Sister)',
      recipientPhone: '01811223344',
      message: 'Happy Birthday Apu! Hope you adore this authentic Tangail Taat saree.'
    },
    courier: {
      name: 'Steadfast Courier',
      consignmentId: 'STDF-881902',
      trackingCode: 'STDF-TRK-6641',
      trackingUrl: 'https://steadfast.com.bd/t/STDF-TRK-6641',
      shippedDate: '2026-10-03',
      estimatedDelivery: 'Delivered'
    }
  }
];

// Initial verified reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'p-jm108',
    customerName: 'Farhana Chowdhury',
    customerPhoneMasked: '01712***78',
    rating: 5,
    comment: 'The crimson red color and gold zari work on this Jamdani are breathtaking! The drape is light and comfortable. Delivered in 24 hours in Dhanmondi.',
    date: '2026-10-02',
    isVerifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'p-jm108',
    customerName: 'Nusrat Jahan',
    customerPhoneMasked: '01819***21',
    rating: 5,
    comment: 'অসাধারণ ঢাকাই জামদানি। বুনন এত মিহি যে হাতে ছুঁলেই বোঝা যায় আসল কারিগরের কাজ। আমার শাশুড়ি শাড়িটি দেখে দারুণ খুশি হয়েছেন।',
    date: '2026-09-28',
    isVerifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'p-dm204',
    customerName: 'Dr. Sharmin Akter',
    customerPhoneMasked: '01911***55',
    rating: 5,
    comment: 'Authentic Dhakai Muslin is truly a heritage treasure. It feels lighter than feather. Thank you Aanchol for preserving this heritage.',
    date: '2026-10-01',
    isVerifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'p-tt401',
    customerName: 'Afroza Begum',
    customerPhoneMasked: '01677***90',
    rating: 5,
    comment: 'টাঙ্গাইল তাঁতের খাঁটি সুতির এই শাড়িটি প্রতিদিন পরার জন্য অত্যন্ত আরামদায়ক। ময়ূরকণ্ঠী পাড়ের রঙটি চোখে পড়ার মতো সুন্দর।',
    date: '2026-09-30',
    isVerifiedPurchase: true
  }
];

const INITIAL_LANDING_POPUPS: LandingPopupConfig[] = [
  {
    id: 'popup-welcome',
    isActive: true,
    titleEn: 'Heritage Festival Privilege',
    titleBn: 'ঐতিহ্য উৎসবের বিশেষ উপহার',
    subtitleEn: 'Enjoy ৳500 OFF on your first authentic Dhakai Jamdani or Muslin saree order with Free Nationwide Delivery!',
    subtitleBn: 'আপনার প্রথম জামদানি বা মসলিন শাড়ির অর্ডারে পান নগদ ৫০০ টাকা ছাড় ও সারাদেশে সম্পূর্ণ ফ্রি ডেলিভারি!',
    image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    discountCode: 'WELCOME500',
    ctaTextEn: 'Claim ৳500 Discount',
    ctaTextBn: '৳৫০০ ছাড় নিয়ে অর্ডার করুন',
    ctaLink: 'shop',
    displayMode: 'standard',
    hasTimer: true,
    endTime: new Date(Date.now() + 72 * 3600 * 1000).toISOString()
  },
  {
    id: 'popup-jamdani-flash',
    isActive: true,
    titleEn: 'Royal Jamdani Artisan Drop',
    titleBn: 'রাজকীয় জামদানি বিশেষ কারিগর অফার',
    subtitleEn: 'Limited 100-count heirloom Jamdani batch direct from Rupganj looms with Flat 15% OFF!',
    subtitleBn: 'রূপগঞ্জের তাঁতিদের হাতে বোনা মিহি জামদানিতে পরবর্তী ৪৮ ঘণ্টার জন্য বিশেষ ১৫% ছাড়!',
    image: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    discountCode: 'JAMDANI15',
    ctaTextEn: 'Explore Jamdani Drop',
    ctaTextBn: 'জামদানি কালেকশন দেখুন',
    ctaLink: 'dhakai-jamdani',
    displayMode: 'standard',
    hasTimer: true,
    endTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
  },
  {
    id: 'popup-pure-graphic',
    isActive: true,
    titleEn: 'Silk & Handloom Visual Banner',
    titleBn: 'সিল্ক ও তাঁত ভিজ্যুয়াল ব্যানার',
    subtitleEn: 'Direct photoshoot from weavers hub. Tap anywhere to claim VIP offer.',
    subtitleBn: 'সরাসরি তাঁতপল্লী থেকে বিশেষ আয়োজন। অফার পেতে ট্যাপ করুন।',
    image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
    discountCode: 'VIPROYAL',
    ctaTextEn: 'Shop Collection',
    ctaTextBn: 'কালেকশন দেখুন',
    ctaLink: 'rajshahi-silk',
    displayMode: 'image_only',
    hasTimer: false
  }
];

const INITIAL_TOP_ANNOUNCEMENTS: TopAnnouncementBarConfig = {
  isEnabled: true,
  rotationSpeedSeconds: 4,
  hotline: '09612-444888',
  announcements: [
    {
      id: 'ann-1',
      textBn: '🔥 ঈদ ধামাকা: ৩টি শাড়ির অর্ডারে ফ্রি হোম ডেলিভারি + ৫% ছাড় | কোড: AANCHOL500',
      textEn: '🔥 Special Offer: Free Delivery on 3 sarees + Extra 5% Off | Code: AANCHOL500',
      isActive: true
    },
    {
      id: 'ann-2',
      textBn: '📞 শাড়ির মাপ বা যে কোনো তথ্যের জন্য হটলাইনে যোগাযোগ করুন: 09612-444888 (সকাল ১০টা - রাত ১০টা)',
      textEn: '📞 Saree Inquiries & Customer Care Hotline: 09612-444888 (10 AM - 10 PM)',
      isActive: true
    },
    {
      id: 'ann-3',
      textBn: '🚚 সারাদেশে ক্যাশ অন ডেলিভারি · পার্সেল খুলে দেখে মূল্য পরিশোধের সুবিধা',
      textEn: '🚚 Cash on Delivery Nationwide · Inspect saree before payment',
      isActive: true
    }
  ]
};

const INITIAL_LANDING_POPUP: LandingPopupConfig = INITIAL_LANDING_POPUPS[0];

const INITIAL_FLASH_SALES: FlashSaleCampaign[] = [
  {
    id: 'fs-eid-special',
    titleEn: 'Royal Heritage Flash Sale — Flat 15% OFF',
    titleBn: 'রাজকীয় জামদানি ফ্ল্যাশ সেল — ফ্ল্যাট ১৫% ছাড়',
    subtitleEn: 'Limited master artisan batch of Dhakai Jamdani & Muslin with verified loom certificate.',
    subtitleBn: 'রূপগঞ্জ ও ডেমরার ঐতিহ্যবাহী তাঁতশিল্পীদের হাতে বোনা খাঁটি শাড়িতে বিশেষ ছাড়।',
    discountPercent: 15,
    hasTimer: true,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 36 * 3600 * 1000 + 42 * 60 * 1000).toISOString(),
    isActive: true,
    bannerImage: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    displayMode: 'banner_with_text',
    showButton: true,
    buttonTextEn: 'Shop Flash Deals',
    buttonTextBn: 'ফ্ল্যাশ ডিল কিনুন',
    targetLink: 'flash-sale',
    badgeTextEn: 'LIMITED FLASH DROP',
    badgeTextBn: 'সীমিত সময়ের ধামাকা'
  },
  {
    id: 'fs-handloom-festival',
    titleEn: 'Artisan Tangail Taat Handloom Festive Banner',
    titleBn: 'টাঙ্গাইল তাঁত উৎসব — গ্রাফিক ব্যানার অফার',
    subtitleEn: 'Pure combed cotton weaves from Bajitpur and Tangail master weavers.',
    subtitleBn: 'টাঙ্গাইলের ঐতিহ্যবাহী সুতি শাড়িতে বিশেষ কারিগর অফার।',
    discountPercent: 20,
    hasTimer: true,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 52 * 3600 * 1000).toISOString(),
    isActive: true,
    bannerImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    displayMode: 'image_only',
    showButton: false,
    buttonTextEn: 'Explore Handlooms',
    buttonTextBn: 'তাঁতের শাড়ি দেখুন',
    targetLink: 'tangail-taat',
    badgeTextEn: 'ARTISAN WEAVE',
    badgeTextBn: 'তাঁতি সম্মাননা'
  }
];

export const INITIAL_CATEGORY_ARTICLES: CategoryArticle[] = [
  {
    id: 'art-dhakai-jamdani',
    categoryId: 'dhakai-jamdani',
    titleEn: 'The Immortal Art of Dhakai Jamdani: Weaving Whispers Along the Shitalakshya',
    titleBn: 'শীতলক্ষ্যার তীরে ঢাকাই জামদানির বুনন উপাখ্যান ও মোঘল ঐতিহ্যের মহিমা',
    slug: 'dhakai-jamdani-heritage-story',
    summaryEn: 'Declared a UNESCO Intangible Cultural Heritage, Dhakai Jamdani represents the pinnacle of supplementary-weft geometric weaving crafted from memory.',
    summaryBn: 'ইউনেস্কোর বিশ্ব সাংস্কৃতিক ঐতিহ্য হিসেবে স্বীকৃতি পাওয়া ঢাকাই জামদানি হলো বিশ্বের অন্যতম সেরা অলংকরণ বুনন শিল্প যা কোনো লিখিত গ্রাফ ছাড়াই মনের স্মৃতি থেকে বোনা হয়।',
    contentEn: `Dhakai Jamdani is not merely a saree; it is a canvas of breathing history nurtured for centuries along the banks of the Shitalakshya river in Rupganj, Narayanganj. Unlike modern automated jacquard looms, the Jamdani weaver holds no graph paper—every intricate motif is drawn purely from memory, passed down from father to son across four hundred years.

During the Mughal zenith under Emperor Jahangir, royal karkhanas produced ethereal fabrics celebrated as "Ab-i-Rawan" (Running Water) and "Shabnam" (Morning Dew) so translucent that imperial courtiers marvelled at their sheer divinity. The magic lies in the supplementary weft technique: while the basic warp holds the fabric, master craftsmen work with fine bamboo needle-like spools (Kandari) to interlace gold zari or fine cotton threads into poetic motifs.

Iconic traditional Jamdani motifs include:
• Panna Hajar (Thousand Emeralds): Dense floral clusters radiating across the body.
• Tercha: Diagonal floral vine sprays creating rhythmic movement.
• Jal / Dubli Jal: Continuous delicate lattice net reminiscent of morning mist.
• Korola & Kalki: Classic paisley and bitter-gourd blossoms adorning the pallu.

Today in Rupganj and Demra, Aanchol directly partners with master weaver families. Each 80-count to 100-count saree requires between 20 to 65 days of synchronized dedication by two weavers. Owning an authentic Dhakai Jamdani is preserving a piece of Bengal’s living soul.`,
    contentBn: `ঢাকাই জামদানি কেবল একটি পোশাক নয়, এটি শীতলক্ষ্যার তীরের শতাব্দীর জীবন্ত ইতিহাস। নারায়ণগঞ্জের রূপগঞ্জ ও ডেমরায় বংশপরম্পরায় গড়ে ওঠা তাঁতিদের স্মৃতি থেকেই জন্ম নেয় এই অনুপম অলংকরণ। কোনো লিখিত গ্রাফ বা আধুনিক যন্ত্র ছাড়া কেবল হাতের কারুকার্যে এই শাড়ি বোনা হয়।

মুঘল সম্রাট জাহাঙ্গীরের আমলে এই কাপড়ের নাম ছিল "আব-ই-রওয়ান" (প্রবহমান জল) এবং "শব-নম" (ভোরের শিশির)। বংশপরম্পরায় চলে আসা কান্দারির নিখুঁত স্পর্শে তৈরি হয় পান্না-হাজার, তেরছা, জলছাপ, করলা ও কলকা নকশা।

ঐতিহ্যবাহী জামদানির বিখ্যাত নকশাসমূহ:
• পান্না হাজার: শাড়ির জমিন জুড়ে হাজার হাজার ক্ষুদ্র ফুলের চমৎকার বিন্যাস।
• তেরছা: কোনাকুনি লতা ও পাতার নান্দনিক নকশা।
• জাল বুনন: কুয়াশার মতো সূক্ষ্ম জালের মায়াবী বিস্তার।
• কলকা ও করলা: আঁচল ও পাড়ে ঐতিহ্যবাহী রাজকীয় অলংকরণ।

আঁচল সরাসরি রূপগঞ্জের জাতীয় পুরস্কারপ্রাপ্ত কারিগর পরিবারের সাথে কাজ করে। একটি ৮০ থেকে ১০০ কাউন্টের জামদানি বুনতে দুই জন তাঁতির ২০ থেকে ৬৫ দিন একটানা শ্রম লাগে। খাঁটি ঢাকাই জামদানি পরিধান করা মানেই বাংলার আত্মাকে ধারণ করা।`,
    featuredImage: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg',
    author: 'Aanchol Heritage Textile Research Wing',
    publishedAt: '2026-10-01',
    readTime: '4 min read',
    tags: ['UNESCO Heritage', 'Rupganj Weavers', '80 Count Cotton', 'Mughal Jamdani', 'Artisan Handloom'],
    historicalEra: '16th Century Mughal Bengal to Present',
    artisanHub: 'Rupganj & Demra, Narayanganj'
  },
  {
    id: 'art-dhakai-muslin',
    categoryId: 'dhakai-muslin',
    titleEn: 'Woven Air: The Miracle Revival of Phuti Karpas and Royal Dhakai Muslin',
    titleBn: 'বাতাসে বোনা মায়াজাল: ফুটি কার্পাস ও বাংলার রাজকীয় ঢাকাই মসলিনের পুনর্জন্ম',
    slug: 'dhakai-muslin-revival-story',
    summaryEn: 'Celebrated as fabric so gossamer a 50-meter length could pass through a signet ring, Dhakai Muslin has returned to Bengal looms through scientific research.',
    summaryBn: 'আংটির ভেতর দিয়ে গলে যাওয়া যে কিংবদন্তি ঢাকাই মসলিন হারিয়ে গিয়েছিল, তা আজ বাংলার তাঁতে নতুন করে ফিরে এসেছে।',
    contentEn: `For over two centuries, the world believed the legendary Dhakai Muslin had vanished forever into the annals of colonial history. Spun from the elusive Phuti Karpas cotton (Gossypium arboreum var. neglecta) that bloomed exclusively along the Meghna river basin, this miraculous fabric weighed mere grams and earned names like "Baft Hawa" (Woven Air).

Through groundbreaking genetic research and revived hand-spinning techniques in Bangladesh, master artisans have successfully restored the 100-count to 300-count true Dhakai Muslin. Spun during dawn hours when humidity keeps the ultra-fine fiber from snapping, each thread is hand-drawn with thumb and forefinger lubricated with natural dew.

Aanchol’s Royal Muslin series celebrates this triumphant revival. Each saree is delivered with a certified heritage seal, honoring the weavers who restored Bengal’s proudest textile jewel to the modern era.`,
    contentBn: `বাংলার হারিয়ে যাওয়া গর্বের গৌরবোজ্জ্বল পুনর্জন্ম ঢাকাই মসলিন। ফুটি কার্পাস তুলার অতিসূক্ষ্ম সুতায় বোনা এই শাড়ি এত হালকা যে গায়ে দিলে মনে হয় এক টুকরো বাতাস। 

বাংলাদেশের বিজ্ঞানী ও তাঁতিদের নিরলস গবেষণায় এই অতিপ্রাচীন ঐতিহ্য পুনরায় জীবন্ত হয়ে উঠেছে। ভোরের প্রথম আলোয় যখন বাতাসে আর্দ্রতা বেশি থাকে, তখন অভিজ্ঞ সুতা কাটুনীদের আঙুলের ছোঁয়ায় তৈরি হয় ১০০ থেকে ৩০০ কাউন্টের মিহি সুতা।

আঁচলের প্রতিটি মসলিন শাড়ি শতভাগ খাঁটি ও তাঁত সার্টিফিকেশনসহ সরবরাহ করা হয়, যা ভবিষ্যৎ প্রজন্মের কাছে বাংলার সর্বশ্রেষ্ঠ ঐতিহ্যের স্মারক।`,
    featuredImage: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
    author: 'Farhana Chowdhury, Handloom Curator',
    publishedAt: '2026-09-25',
    readTime: '5 min read',
    tags: ['Phuti Karpas', 'Royal Muslin', 'Woven Air', 'Meghna Basin', 'Heritage Revival'],
    historicalEra: 'Ancient Bengal & Modern Scientific Revival',
    artisanHub: 'Demra & Rupganj Hub'
  },
  {
    id: 'art-tangail-taat',
    categoryId: 'tangail-taat',
    titleEn: 'Rhythms of Bajitpur: How Tangail Taatis Crafted the Everyday Breath of Bengal',
    titleBn: 'বাজিতপুরের খটখট শব্দ: টাঙ্গাইল তাঁতের খাঁটি সুতি ও নকশী পাড়ের ইতিহাস',
    slug: 'tangail-taat-artisan-heritage',
    summaryEn: 'Famed for soft combed cotton, striking border motifs, and comfortable drape, Tangail Taat is Bengal’s most beloved daily elegance.',
    summaryBn: 'টাঙ্গাইলের ঐতিহ্যবাহী বসাক তাঁতিদের পিটলুমে বোনা আরামদায়ক সুতি ও নকশী পাড়ের শাড়ি বাঙালি নারীর চিরন্তন পছন্দের পোশাক।',
    contentEn: `In the villages of Bajitpur, Pathrail, and Karatia in Tangail, the rhythmic clatter of wooden fly-shuttle pit looms begins before sunrise. The Basak weaving community has practiced this craft for generations, perfecting the balance between high tensile combed cotton and airy, breathable comfort.

Unlike heavy silks, Tangail Taat is designed for the tropical climate of Bengal. Master weavers introduce exquisite borders—known locally as Nakshi Par, Bel Par, and Peacock motifs—while maintaining a feather-light body that drapes effortlessly throughout long festive days or professional settings.`,
    contentBn: `টাঙ্গাইলের পাথরাইল, বাজিতপুর ও করটিয়ার গ্রামগুলোতে ভোর হতেই শুরু হয় কাঠের তাঁতের খটখট মধুর শব্দ। প্রজন্মের পর প্রজন্ম ধরে বসাক তাঁতিরা নিখুঁত দক্ষতায় বুনে চলেছেন এই আরামদায়ক সুতি শাড়ি।

গরমের দিনে স্বস্তি দিতে এবং যেকোনো ঘরোয়া বা অফিশিয়াল অনুষ্ঠানে আভিজাত্য ফুটিয়ে তুলতে টাঙ্গাইল তাঁতের জুড়ি নেই। এর ময়ূরকণ্ঠী পাড়, বেল পাড় ও নকশী পাড় বাংলার নিজস্ব সংস্কৃতির মূর্ত প্রতীক।`,
    featuredImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    author: 'Subrata Basak, Master Weaver Collective',
    publishedAt: '2026-09-18',
    readTime: '3 min read',
    tags: ['Tangail Taat', 'Bajitpur Looms', 'Combed Cotton', 'Nakshi Border', 'Daily Elegance'],
    historicalEra: '19th Century Taati Guilds to Present',
    artisanHub: 'Pathrail & Bajitpur, Tangail'
  },
  {
    id: 'art-rajshahi-silk',
    categoryId: 'rajshahi-silk',
    titleEn: 'Padma River’s Golden Thread: The Splendor of Rajshahi Mulberry & Swarnachari Silk',
    titleBn: 'পদ্মার তীরবর্তী রেশমপল্লী: খাঁটি রাজশাহী সিল্ক ও স্বর্ণচরীর উজ্জ্বল ইতিহাস',
    slug: 'rajshahi-pure-silk-tradition',
    summaryEn: 'From mulberry silkworm cocoon to ceremonial handloom, Rajshahi’s sericulture produces ultra-lustrous silks revered across the nation.',
    summaryBn: 'পদ্মার অববাহিকায় তুঁত রেশম পোকার গুটি থেকে সুতা কেটে তৈরি হয় ঐতিহ্যবাহী উজ্জ্বল ও দীর্ঘস্থায়ী রাজশাহী সিল্ক।',
    contentEn: `Rajshahi Silk is famously known as the Queen of Fabrics in Bangladesh. Originating from sericulture along the Padma riverbanks in Bholahat and Mirganj, this silk is derived from the Bombyx mori silkworm nurtured on pure mulberry leaves.

The resulting silk filament possesses a triangular prism-like structure that refracts light at different angles, producing a regal natural sheen. Aanchol’s Rajshahi Silk collection includes both understated monochrome weaves and lavish Swarnachari motifs depicting royal folk court scenes in golden zari.`,
    contentBn: `বাংলাদেশের পোশাকশিল্পে রাজশাহী সিল্ককে বলা হয় রানীর পোশাক। পদ্মার তীরবর্তী ভোলাহাট ও রেশমপল্লীর তুঁত গাছের পাতায় লালিত রেশম পোকার গুটি থেকে আহরিত হয় এই খাঁটি রেশম সুতা।

এর প্রাকৃতিক ঔজ্জ্বল্য ও দীর্ঘস্থায়িত্ব যেকোনো বিয়ে, উৎসব বা বিশেষ সন্ধ্যার জন্য অতুলনীয়। আঁচলের রাজশাহী সিল্ক শাড়িতে রয়েছে খাঁটি সিল্ক মার্কের নিশ্চয়তা।`,
    featuredImage: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
    author: 'Aanchol Sericulture Advisory',
    publishedAt: '2026-09-10',
    readTime: '4 min read',
    tags: ['Mulberry Silk', 'Rajshahi Sericulture', 'Swarnachari', 'Padma Basin', 'Royal Lustre'],
    historicalEra: 'Sericulture Heritage of Greater Bengal',
    artisanHub: 'Bholahat & Rajshahi Town'
  }
];

export const INITIAL_HIDDEN_PROMOTIONAL_CATEGORIES: HiddenPromotionalCategory[] = [
  {
    id: 'promo-eid',
    nameEn: 'Eid Special Handloom Drop',
    nameBn: 'পবিত্র ঈদ স্পেশাল কালেকশন',
    slug: 'eid-special-drop',
    descriptionEn: 'Curated royal sarees with exclusive Eid privileges and festive discounts.',
    descriptionBn: 'পবিত্র ঈদ উপলক্ষে বিশেষ ছাড়ে নির্বাচিত রাজকীয় শাড়িসমূহ।',
    bannerImage: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg',
    hasFreeDelivery: true,
    isActive: true,
    productIds: ['p-jm108', 'p-dm204', 'p-tt401']
  },
  {
    id: 'promo-freedel',
    nameEn: 'Free Nationwide Delivery Sarees',
    nameBn: 'ফ্রি ডেলিভারি শাড়ি সম্ভার',
    slug: 'free-delivery-sarees',
    descriptionEn: 'Handpicked heirloom weaves delivered anywhere in Bangladesh with ৳0 delivery charge.',
    descriptionBn: 'নির্বাচিত এই শাড়িগুলোতে থাকছে সারাদেশে সম্পূর্ণ ফ্রি ডেলিভারি (৳০)।',
    bannerImage: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    hasFreeDelivery: true,
    isActive: true,
    productIds: ['p-jm108', 'p-ms204']
  },
  {
    id: 'promo-flash',
    nameEn: 'Flash Sale Limited Drop',
    nameBn: 'ফ্ল্যাশ সেল সীমিত অফার',
    slug: 'flash-sale-drop',
    descriptionEn: 'Flash price drops on authentic handloom masterworks for the next 48 hours only.',
    descriptionBn: 'সীমিত সময়ের জন্য বিশেষ মূল্যে সরাসরি তাঁত থেকে প্রাপ্ত শাড়ি।',
    bannerImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    hasFreeDelivery: false,
    isActive: true,
    productIds: ['p-tt401', 'p-sk501']
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-eid-15',
    titleEn: 'Royal Eid Handloom Celebration — 15% OFF',
    titleBn: 'পবিত্র ঈদ স্পেশাল উৎসব অফার — ১৫% ছাড়',
    subtitleEn: 'Enjoy flat 15% discount on all authentic Dhakai Jamdani & Rajshahi Silk sarees with code EID15.',
    subtitleBn: 'কুপন কোড EID15 ব্যবহার করে সকল ঐতিহ্যবাহী ঢাকাই জামদানি ও রাজশাহী সিল্কে পান ফ্ল্যাট ১৫% ছাড়।',
    type: 'percentage',
    discountPercent: 15,
    code: 'EID15',
    promotionalCategoryId: 'promo-eid',
    destinationType: 'hidden_promotional_category',
    destinationCategoryId: 'promo-eid',
    productIds: ['p-jm108', 'p-dm204', 'p-tt401'],
    placements: ['homepage_banner', 'homepage_popup', 'offer_page', 'sale_category'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    isActive: true,
    image: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg',
    ctaTextEn: 'Claim 15% Off',
    ctaTextBn: '১৫% ছাড় উপভোগ করুন',
    ctaLink: 'offer-promo-eid-15',
    badgeEn: 'FESTIVE DROP',
    badgeBn: 'ঈদ ধামাকা'
  },
  {
    id: 'promo-free-delivery',
    titleEn: 'Nationwide Free Express Delivery Promotion',
    titleBn: 'সারাদেশে সম্পূর্ণ ফ্রি এক্সপ্রেস হোম ডেলিভারি অফার',
    subtitleEn: 'Zero delivery charges anywhere across Bangladesh on selected sarees or with code FREESHIP.',
    subtitleBn: 'নির্বাচিত শাড়িতে অথবা কোড FREESHIP দিয়ে পান শূন্য খরচে সারাদেশের হোম ডেলিভারি।',
    type: 'free_delivery',
    code: 'FREESHIP',
    hasFreeDelivery: true,
    promotionalCategoryId: 'promo-freedel',
    destinationType: 'hidden_promotional_category',
    destinationCategoryId: 'promo-freedel',
    productIds: ['p-jm108', 'p-ms204'],
    minOrderAmount: 0,
    placements: ['homepage_banner', 'offer_page', 'sale_category'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    isActive: true,
    image: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
    ctaTextEn: 'Shop With Free Delivery',
    ctaTextBn: 'ফ্রি ডেলিভারিতে অর্ডার করুন',
    ctaLink: 'offer-promo-free-delivery',
    badgeEn: 'ZERO SHIPPING',
    badgeBn: 'ফ্রি ডেলিভারি'
  },
  {
    id: 'promo-welcome-500',
    titleEn: '৳500 Welcome Voucher on First Saree Order',
    titleBn: 'প্রথম অর্ডারে নগদ ৫০০ টাকা স্বাগতম ভাউচার',
    subtitleEn: 'New to Aanchol? Enjoy flat ৳500 discount on your first handloom heirloom saree order with code WELCOME500.',
    subtitleBn: 'আঁচলে প্রথমবার শাড়ি কিনছেন? কোড WELCOME500 দিয়ে প্রথম অর্ডারে পান নগদ ৫০০ টাকা ছাড়।',
    type: 'fixed',
    fixedDiscount: 500,
    code: 'WELCOME500',
    minOrderAmount: 3000,
    destinationType: 'shop',
    placements: ['homepage_popup', 'offer_page'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    isActive: true,
    image: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg',
    ctaTextEn: 'Use ৳500 Voucher',
    ctaTextBn: '৫০০ টাকার ভাউচার ব্যবহার করুন',
    ctaLink: 'offer-promo-welcome-500',
    badgeEn: 'WELCOME GIFT',
    badgeBn: 'স্বাগতম উপহার'
  },
  {
    id: 'promo-flash-drop',
    titleEn: 'Artisan Tangail Taat & Silk Flash Sale — 20% OFF',
    titleBn: 'টাঙ্গাইল তাঁত ও সিল্ক ফ্ল্যাশ সেল — ২০% মূল্যছাড়',
    subtitleEn: 'Limited loom batch from Tangail and Rajshahi basin on instant 20% promotional discount.',
    subtitleBn: 'টাঙ্গাইল ও রাজশাহীর তাঁতিদের হাতে বোনা নির্বাচিত শাড়িতে সীমিত সময়ের জন্য ২০% মূল্যছাড়।',
    type: 'flash_sale',
    discountPercent: 20,
    code: 'FLASH20',
    promotionalCategoryId: 'promo-flash',
    destinationType: 'hidden_promotional_category',
    destinationCategoryId: 'promo-flash',
    productIds: ['p-tt401', 'p-sk501'],
    placements: ['flash_sale_section', 'offer_page'],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    isActive: true,
    image: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg',
    ctaTextEn: 'Shop Flash Deals',
    ctaTextBn: 'ফ্ল্যাশ ডিল দেখুন',
    ctaLink: 'offer-promo-flash-drop',
    badgeEn: 'LIMITED 48H',
    badgeBn: '৪৮ ঘণ্টার অফার'
  }
];

class StoreService {
  private products: Product[] = [];
  private categories: Category[] = [];
  private banners: Banner[] = [];
  private orders: Order[] = [];
  private privateCodes: PrivatePriceCode[] = [];
  private reviews: Review[] = [];
  private customerAccounts: Map<string, CustomerAccount> = new Map();
  private flashSales: FlashSaleCampaign[] = [];
  private landingPopups: LandingPopupConfig[] = INITIAL_LANDING_POPUPS;
  private landingPopup: LandingPopupConfig = INITIAL_LANDING_POPUP;
  private notifications: AppNotification[] = [];
  private categoryArticles: CategoryArticle[] = INITIAL_CATEGORY_ARTICLES;
  private promotions: Promotion[] = INITIAL_PROMOTIONS;
  private hiddenPromotionalCategories: HiddenPromotionalCategory[] = INITIAL_HIDDEN_PROMOTIONAL_CATEGORIES;
  private topAnnouncementConfig: TopAnnouncementBarConfig = INITIAL_TOP_ANNOUNCEMENTS;
  private activeCustomerPhone: string | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedProducts = localStorage.getItem('aanchol_products');
      if (storedProducts) {
        const parsed: Product[] = JSON.parse(storedProducts);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
        this.products = [...parsed, ...missing];
      } else {
        this.products = INITIAL_PRODUCTS;
      }

      const storedHiddenCategories = localStorage.getItem('aanchol_hidden_promotional_categories');
      this.hiddenPromotionalCategories = storedHiddenCategories ? JSON.parse(storedHiddenCategories) : INITIAL_HIDDEN_PROMOTIONAL_CATEGORIES;

      const storedCategories = localStorage.getItem('aanchol_categories');
      this.categories = storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES;

      const storedBanners = localStorage.getItem('aanchol_banners');
      this.banners = storedBanners ? JSON.parse(storedBanners) : INITIAL_BANNERS;

      const storedOrders = localStorage.getItem('aanchol_orders');
      this.orders = storedOrders ? JSON.parse(storedOrders) : INITIAL_ORDERS;

      const storedCodes = localStorage.getItem('aanchol_private_codes');
      this.privateCodes = storedCodes ? JSON.parse(storedCodes) : INITIAL_PRIVATE_CODES;

      const storedReviews = localStorage.getItem('aanchol_reviews');
      this.reviews = storedReviews ? JSON.parse(storedReviews) : INITIAL_REVIEWS;

      const storedPopups = localStorage.getItem('aanchol_landing_popups');
      if (storedPopups) {
        this.landingPopups = JSON.parse(storedPopups);
      } else {
        const storedPopup = localStorage.getItem('aanchol_landing_popup');
        this.landingPopups = storedPopup ? [JSON.parse(storedPopup)] : INITIAL_LANDING_POPUPS;
      }
      this.landingPopup = this.landingPopups[0] || INITIAL_LANDING_POPUP;

      const storedFlashSales = localStorage.getItem('aanchol_flash_sales');
      this.flashSales = storedFlashSales ? JSON.parse(storedFlashSales) : INITIAL_FLASH_SALES;

      const storedNotifications = localStorage.getItem('aanchol_notifications');
      this.notifications = storedNotifications ? JSON.parse(storedNotifications) : INITIAL_NOTIFICATIONS;

      const storedAccounts = localStorage.getItem('aanchol_accounts');
      if (storedAccounts) {
        const parsed = JSON.parse(storedAccounts);
        Object.keys(parsed).forEach((key) => {
          this.customerAccounts.set(key, parsed[key]);
        });
      } else {
        // Seed demo account with initial loyalty points
        const demoAccount: CustomerAccount = {
          phone: '01712345678',
          name: 'Tasnim Rahman',
          isVerified: true,
          loyaltyPoints: 350,
          savedAddresses: [
            {
              id: 'addr-1',
              recipientName: 'Tasnim Rahman',
              phone: '01712345678',
              division: 'Dhaka',
              district: 'Dhaka',
              area: 'Dhanmondi Road 27',
              fullAddress: 'House 14/A, Road 27 (Old), Dhanmondi, Dhaka',
              isInsideDhaka: true,
              isDefault: true
            }
          ],
          wishlistProductIds: ['p-jm108', 'p-dm204'],
          orderIds: ['ANC-84920']
        };
        this.customerAccounts.set('01712345678', demoAccount);
      }
      const storedArticles = localStorage.getItem('aanchol_category_articles');
      this.categoryArticles = storedArticles ? JSON.parse(storedArticles) : INITIAL_CATEGORY_ARTICLES;

      const storedPromotions = localStorage.getItem('aanchol_promotions');
      this.promotions = storedPromotions ? JSON.parse(storedPromotions) : INITIAL_PROMOTIONS;

      const storedAnnouncements = localStorage.getItem('aanchol_top_announcements');
      this.topAnnouncementConfig = storedAnnouncements ? JSON.parse(storedAnnouncements) : INITIAL_TOP_ANNOUNCEMENTS;

      const storedActivePhone = localStorage.getItem('aanchol_active_phone');
      this.activeCustomerPhone = storedActivePhone || '01712345678';
    } catch {
      this.products = INITIAL_PRODUCTS;
      this.categories = INITIAL_CATEGORIES;
      this.banners = INITIAL_BANNERS;
      this.orders = INITIAL_ORDERS;
      this.privateCodes = INITIAL_PRIVATE_CODES;
      this.reviews = INITIAL_REVIEWS;
      this.landingPopup = INITIAL_LANDING_POPUP;
      this.flashSales = INITIAL_FLASH_SALES;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.categoryArticles = INITIAL_CATEGORY_ARTICLES;
      this.promotions = INITIAL_PROMOTIONS;
      this.hiddenPromotionalCategories = INITIAL_HIDDEN_PROMOTIONAL_CATEGORIES;
      this.topAnnouncementConfig = INITIAL_TOP_ANNOUNCEMENTS;
      this.activeCustomerPhone = '01712345678';
    }
  }

  private persist(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // PRODUCTS
  public getProducts(): Product[] {
    return this.products.filter((p) => p.isActive);
  }

  public getAllProductsAdmin(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getProductByCode(code: string): Product | undefined {
    return this.products.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
  }

  public saveProduct(product: Product): void {
    if (product.flashSaleId) {
      const campaign = this.flashSales.find((s) => s.id === product.flashSaleId);
      if (campaign) {
        product.flashSaleDiscount = campaign.discountPercent;
        product.flashSaleTitle = campaign.titleEn;
        product.isSale = true;
        if (!product.originalPrice || product.originalPrice <= product.price) {
          product.originalPrice = product.price;
        }
        product.price = Math.round(product.originalPrice * (1 - campaign.discountPercent / 100));
        product.discountPercent = campaign.discountPercent;
      }
    } else {
      product.flashSaleDiscount = undefined;
      product.flashSaleTitle = undefined;
    }

    const idx = this.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.products[idx] = product;
    } else {
      this.products.unshift(product);
    }
    this.persist('aanchol_products', this.products);
  }

  public getProductsForFlashSale(flashSaleId: string): Product[] {
    return this.products.filter((p) => p.flashSaleId === flashSaleId && p.isActive);
  }

  public assignProductsToFlashSale(flashSaleId: string, productIds: string[]): void {
    const campaign = this.flashSales.find((s) => s.id === flashSaleId);
    const discount = campaign ? campaign.discountPercent : 0;
    const title = campaign ? campaign.titleEn : '';

    this.products.forEach((p) => {
      if (productIds.includes(p.id)) {
        p.flashSaleId = flashSaleId;
        p.flashSaleDiscount = discount;
        p.flashSaleTitle = title;
        p.isSale = true;
        if (!p.originalPrice || p.originalPrice <= p.price) {
          p.originalPrice = p.price;
        }
        p.price = Math.round(p.originalPrice * (1 - discount / 100));
        p.discountPercent = discount;
      } else if (p.flashSaleId === flashSaleId) {
        p.flashSaleId = undefined;
        p.flashSaleDiscount = undefined;
        p.flashSaleTitle = undefined;
      }
    });
    this.persist('aanchol_products', this.products);
  }

  public deleteProduct(id: string): void {
    this.products = this.products.filter((p) => p.id !== id);
    this.persist('aanchol_products', this.products);
  }

  // CATEGORIES
  public getCategories(): Category[] {
    return this.categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getAllCategoriesAdmin(): Category[] {
    return this.categories;
  }

  public saveCategory(category: Category): void {
    const idx = this.categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      this.categories[idx] = category;
    } else {
      this.categories.push(category);
      // Auto-create a starter blogger-style article for the new category if not already present
      const existingArticle = this.categoryArticles.find((a) => a.categoryId === category.id);
      if (!existingArticle) {
        const newArt: CategoryArticle = {
          id: `art-${category.id}-${Date.now()}`,
          categoryId: category.id,
          titleEn: `${category.nameEn}: The Living Handloom Heritage & Master Artisan Lore`,
          titleBn: `${category.nameBn}: ঐতিহ্যবাহী বুননশিল্প ও কারিগর ইতিহাস`,
          slug: `${category.slug || category.id}-heritage-story`,
          summaryEn: category.descriptionEn,
          summaryBn: category.descriptionBn,
          contentEn: `${category.nameEn} represents one of Bengal’s timeless handloom expressions. Each weave embodies generational artistry preserved across decades.\n\nWoven with utmost devotion, our master weavers bring forward authentic motifs, premium thread counts, and enduring grace suited for royal festivities and modern wardrobes alike.`,
          contentBn: `${category.nameBn} বাংলার ঐতিহ্যবাহী তাঁত সংস্কৃতির এক অনবদ্য নিদর্শন। প্রতিটি সুতায় জড়িয়ে রয়েছে শতাব্দীপ্রাচীন কারিগরদের ভালোবাসা ও অক্লান্ত পরিশ্রম।\n\nআঁচল সরাসরি তাঁতিদের সাথে যুক্ত হয়ে খাঁটি মান ও শ্রেষ্ঠত্বের নিশ্চয়তা প্রদান করে।`,
          featuredImage: category.image || '/src/assets/images/hero_jamdani_craft_1791268697306.jpg',
          author: 'Aanchol Handloom Research Desk',
          publishedAt: new Date().toISOString().split('T')[0],
          readTime: '3 min read',
          tags: [category.nameEn, 'Artisan Weaves', 'Bangladeshi Handloom', 'Heritage Collection'],
          historicalEra: 'Generational Bengal Heritage',
          artisanHub: category.originHub || 'Dhaka Division'
        };
        this.categoryArticles.push(newArt);
        this.persist('aanchol_category_articles', this.categoryArticles);
      }
    }
    this.persist('aanchol_categories', this.categories);
  }

  public deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.persist('aanchol_categories', this.categories);
  }

  public addSubcategory(categoryId: string, subcat: { id: string; nameEn: string; nameBn: string; slug?: string }): void {
    const cat = this.categories.find((c) => c.id === categoryId);
    if (cat) {
      if (!cat.subcategories) cat.subcategories = [];
      const existingIdx = cat.subcategories.findIndex((s) => s.id === subcat.id);
      if (existingIdx >= 0) {
        cat.subcategories[existingIdx] = subcat;
      } else {
        cat.subcategories.push(subcat);
      }
      this.persist('aanchol_categories', this.categories);
    }
  }

  public deleteSubcategory(categoryId: string, subcatId: string): void {
    const cat = this.categories.find((c) => c.id === categoryId);
    if (cat && cat.subcategories) {
      cat.subcategories = cat.subcategories.filter((s) => s.id !== subcatId);
      this.persist('aanchol_categories', this.categories);
    }
  }

  public updateSubcategory(
    categoryId: string,
    subcatId: string,
    updated: { nameEn: string; nameBn: string; slug?: string }
  ): void {
    const cat = this.categories.find((c) => c.id === categoryId);
    if (cat && cat.subcategories) {
      const idx = cat.subcategories.findIndex((s) => s.id === subcatId);
      if (idx >= 0) {
        cat.subcategories[idx] = { ...cat.subcategories[idx], ...updated };
        this.persist('aanchol_categories', this.categories);
      }
    }
  }

  // LANDING POPUPS (Requirement 3: Multiple popups, random rotation on direct jump, add/edit/delete/toggle)
  public getLandingPopups(): LandingPopupConfig[] {
    return this.landingPopups.filter((p) => p.isActive);
  }

  public getAllLandingPopupsAdmin(): LandingPopupConfig[] {
    return this.landingPopups;
  }

  public getRandomActiveLandingPopup(): LandingPopupConfig | null {
    const active = this.getLandingPopups();
    if (active.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * active.length);
    return active[randomIndex];
  }

  public saveLandingPopup(popup: LandingPopupConfig): void {
    const idx = this.landingPopups.findIndex((p) => p.id === popup.id);
    if (idx >= 0) {
      this.landingPopups[idx] = popup;
    } else {
      this.landingPopups.unshift(popup);
    }
    this.persist('aanchol_landing_popups', this.landingPopups);
    this.landingPopup = this.landingPopups[0] || INITIAL_LANDING_POPUP;
  }

  public deleteLandingPopup(id: string): void {
    this.landingPopups = this.landingPopups.filter((p) => p.id !== id);
    this.persist('aanchol_landing_popups', this.landingPopups);
    this.landingPopup = this.landingPopups[0] || INITIAL_LANDING_POPUP;
  }

  public toggleLandingPopup(id: string): void {
    const p = this.landingPopups.find((item) => item.id === id);
    if (p) {
      p.isActive = !p.isActive;
      this.persist('aanchol_landing_popups', this.landingPopups);
    }
  }

  public getLandingPopupConfig(): LandingPopupConfig {
    const random = this.getRandomActiveLandingPopup();
    return random || this.landingPopups[0] || INITIAL_LANDING_POPUP;
  }

  public saveLandingPopupConfig(config: LandingPopupConfig): void {
    this.saveLandingPopup(config);
  }

  // FLASH SALE CAMPAIGNS (Requirement 1 & 2: Edit sale, Live Timer control, Image-only mode, custom banners)
  public getFlashSales(): FlashSaleCampaign[] {
    return this.flashSales.filter((s) => s.isActive);
  }

  public getAllFlashSalesAdmin(): FlashSaleCampaign[] {
    return this.flashSales;
  }

  public getFlashSaleById(id: string): FlashSaleCampaign | undefined {
    return this.flashSales.find((s) => s.id === id);
  }

  public saveFlashSale(sale: FlashSaleCampaign): void {
    const idx = this.flashSales.findIndex((s) => s.id === sale.id);
    if (idx >= 0) {
      this.flashSales[idx] = sale;
    } else {
      this.flashSales.unshift(sale);
    }
    this.persist('aanchol_flash_sales', this.flashSales);
  }

  public deleteFlashSale(id: string): void {
    this.flashSales = this.flashSales.filter((s) => s.id !== id);
    this.persist('aanchol_flash_sales', this.flashSales);
  }

  public updateFlashSaleTimer(id: string, endTime: string): void {
    const sale = this.flashSales.find((s) => s.id === id);
    if (sale) {
      sale.endTime = endTime;
      sale.hasTimer = true;
      this.persist('aanchol_flash_sales', this.flashSales);
    }
  }

  public toggleFlashSaleActive(id: string): void {
    const sale = this.flashSales.find((s) => s.id === id);
    if (sale) {
      sale.isActive = !sale.isActive;
      this.persist('aanchol_flash_sales', this.flashSales);
    }
  }

  // BANNERS
  public getBanners(slot: 'hero' | 'promo_mid'): Banner[] {
    return this.banners.filter((b) => b.isActive && b.sectionSlot === slot).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getAllBannersAdmin(): Banner[] {
    return this.banners;
  }

  public saveBanner(banner: Banner): void {
    const idx = this.banners.findIndex((b) => b.id === banner.id);
    if (idx >= 0) {
      this.banners[idx] = banner;
    } else {
      this.banners.push(banner);
    }
    this.persist('aanchol_banners', this.banners);
  }

  public deleteBanner(id: string): void {
    this.banners = this.banners.filter((b) => b.id !== id);
    this.persist('aanchol_banners', this.banners);
  }

  // TOP ANNOUNCEMENT BAR TICKER
  public getTopAnnouncementConfig(): TopAnnouncementBarConfig {
    return this.topAnnouncementConfig;
  }

  public saveTopAnnouncementConfig(config: TopAnnouncementBarConfig): void {
    this.topAnnouncementConfig = config;
    this.persist('aanchol_top_announcements', this.topAnnouncementConfig);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aanchol_announcements_updated'));
    }
  }

  public addAnnouncement(item: Omit<TopAnnouncement, 'id'>): void {
    const newAnn: TopAnnouncement = {
      ...item,
      id: `ann-${Date.now()}`
    };
    this.topAnnouncementConfig.announcements.unshift(newAnn);
    this.saveTopAnnouncementConfig(this.topAnnouncementConfig);
  }

  public updateAnnouncement(ann: TopAnnouncement): void {
    const idx = this.topAnnouncementConfig.announcements.findIndex((a) => a.id === ann.id);
    if (idx >= 0) {
      this.topAnnouncementConfig.announcements[idx] = ann;
      this.saveTopAnnouncementConfig(this.topAnnouncementConfig);
    }
  }

  public deleteAnnouncement(id: string): void {
    this.topAnnouncementConfig.announcements = this.topAnnouncementConfig.announcements.filter((a) => a.id !== id);
    this.saveTopAnnouncementConfig(this.topAnnouncementConfig);
  }

  public toggleAnnouncement(id: string): void {
    const ann = this.topAnnouncementConfig.announcements.find((a) => a.id === id);
    if (ann) {
      ann.isActive = !ann.isActive;
      this.saveTopAnnouncementConfig(this.topAnnouncementConfig);
    }
  }

  // INTELLIGENT SEARCH & FUZZY MATCHING (Requirement 6)
  public searchProducts(query: string, filters?: Partial<FilterState>): Product[] {
    let list = this.getProducts();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);

      const synonymMap: Record<string, string[]> = {
        jamdani: ['jamdani', 'jamdany', 'jomdani', 'zamzami', 'জামদানি', 'dhakai jamdani'],
        muslin: ['muslin', 'moslin', 'musline', 'maslin', 'মসলিন', 'phuti karpas'],
        taat: ['taat', 'tat', 'tanti', 'তাঁত', 'টাঙ্গাইল', 'tangail', 'pitloom'],
        silk: ['silk', 'shilk', 'silke', 'সিল্ক', 'রেশম', 'mulberry', 'rajshahi'],
        katan: ['katan', 'kotan', 'katon', 'কাতান', 'বেনারসি', 'benarasi', 'banarasi', 'মিরপুর', 'mirpur'],
        red: ['red', 'crimson', 'vermilion', 'maroon', 'lal', 'লাল', 'রক্তিম', 'মেরুন'],
        blue: ['blue', 'navy', 'neel', 'nil', 'indigo', 'নীল', 'আসমানী'],
        green: ['green', 'emerald', 'shobuj', 'সবুজ', 'পান্না'],
        yellow: ['yellow', 'mustard', 'holud', 'হলুদ', 'সরিষা'],
        white: ['white', 'ivory', 'shada', 'সাদা', 'শুভ্র', 'আইভরি'],
        black: ['black', 'kalo', 'কালো'],
        gold: ['gold', 'zari', 'golden', 'sonali', 'সোনালি', 'জরি'],
        cotton: ['cotton', 'suti', 'সুতি', 'কম্বড'],
        bridal: ['bridal', 'wedding', 'biye', 'বিয়ে', 'বধূ', 'কনে', 'হলুদ', 'holud']
      };

      const matchScore = (p: Product): number => {
        let score = 0;
        const codeLower = p.code.toLowerCase();
        const nameEnLower = p.nameEn.toLowerCase();
        const nameBn = p.nameBn;
        const sareeTypeLower = p.sareeType.toLowerCase();
        const fabricLower = p.fabric.toLowerCase();
        const fabricBn = p.fabricBn;
        const occasionLower = p.occasion.toLowerCase();
        const occasionBn = p.occasionBn;
        const descEn = p.descriptionEn.toLowerCase();
        const descBn = p.descriptionBn;
        const keywords = p.keywords.map((k) => k.toLowerCase());

        // Exact code match (Highest priority)
        if (codeLower === q) return 100;
        if (codeLower.includes(q)) score += 50;

        // Exact name match
        if (nameEnLower.includes(q)) score += 40;
        if (nameBn.includes(query.trim())) score += 40;

        // Token matching
        let matchedTokensCount = 0;
        for (const token of tokens) {
          // Check synonym expansion
          let tokenExpanded: string[] = [token];
          for (const [key, syns] of Object.entries(synonymMap)) {
            if (syns.some((s) => s.includes(token) || token.includes(s))) {
              tokenExpanded.push(key, ...syns);
            }
          }
          tokenExpanded = Array.from(new Set(tokenExpanded));

          const matchesAnySyn = (target: string) =>
            tokenExpanded.some((s) => target.includes(s));

          let tokenMatched = false;
          if (matchesAnySyn(codeLower)) { score += 25; tokenMatched = true; }
          if (matchesAnySyn(nameEnLower) || tokenExpanded.some((s) => nameBn.includes(s))) { score += 30; tokenMatched = true; }
          if (matchesAnySyn(sareeTypeLower)) { score += 25; tokenMatched = true; }
          if (matchesAnySyn(fabricLower) || tokenExpanded.some((s) => fabricBn.includes(s))) { score += 20; tokenMatched = true; }
          if (matchesAnySyn(occasionLower) || tokenExpanded.some((s) => occasionBn.includes(s))) { score += 15; tokenMatched = true; }
          if (keywords.some((k) => matchesAnySyn(k))) { score += 20; tokenMatched = true; }
          if (p.variants.some((v) => matchesAnySyn(v.colorFamily) || matchesAnySyn(v.colorNameEn.toLowerCase()) || tokenExpanded.some((s) => v.colorNameBn.includes(s)))) {
            score += 25; tokenMatched = true;
          }
          if (p.specifications?.some((spec) => matchesAnySyn(spec.key.toLowerCase()) || matchesAnySyn(spec.value.toLowerCase()))) {
            score += 15; tokenMatched = true;
          }
          if (matchesAnySyn(descEn) || tokenExpanded.some((s) => descBn.includes(s))) {
            score += 10; tokenMatched = true;
          }

          if (tokenMatched) matchedTokensCount++;
        }

        if (tokens.length > 1 && matchedTokensCount < Math.ceil(tokens.length * 0.7)) {
          return 0;
        }

        return score;
      };

      list = list
        .map((p) => ({ product: p, score: matchScore(p) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.product);
    }

    // Apply Filters
    if (filters) {
      if (filters.categoryId) {
        list = list.filter((p) => p.categoryId === filters.categoryId);
      }
      if (filters.sareeType) {
        list = list.filter((p) => p.sareeType === filters.sareeType);
      }
      if (filters.colorFamily) {
        // Intelligent color mapping (e.g. blue includes royal, navy, sky, teal)
        list = list.filter((p) => p.variants.some((v) => v.colorFamily === filters.colorFamily));
      }
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        list = list.filter((p) => p.price >= filters.minPrice! && p.price <= filters.maxPrice!);
      }
      if (filters.ageRange && filters.ageRange !== 'All Ages') {
        list = list.filter((p) => p.suitableAgeRange === filters.ageRange || p.suitableAgeRange === 'All Ages');
      }
      if (filters.minRating) {
        list = list.filter((p) => p.rating >= filters.minRating!);
      }
      if (filters.onlyInStock) {
        list = list.filter((p) => p.stock > 0);
      }
      if (filters.onlyOnSale) {
        list = list.filter((p) => p.isSale || (p.discountPercent && p.discountPercent > 0));
      }

      // Sort
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
            break;
          case 'price_asc':
            list.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            list.sort((a, b) => b.price - a.price);
            break;
          case 'top_rated':
            list.sort((a, b) => b.rating - a.rating);
            break;
          case 'top_selling':
            list.sort((a, b) => b.salesCount - a.salesCount);
            break;
          case 'biggest_discount':
            list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
            break;
          default:
            // Relevance: Featured first, then highest sales
            list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.salesCount - a.salesCount);
        }
      }
    }

    return list;
  }

  // AUTOMATIC HOMEPAGE COLLECTIONS
  public getTopSelling(limit = 4): Product[] {
    return [...this.getProducts()].sort((a, b) => b.salesCount - a.salesCount).slice(0, limit);
  }

  public getTopRated(limit = 4): Product[] {
    return [...this.getProducts()].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, limit);
  }

  public getNewArrivals(limit = 4): Product[] {
    return [...this.getProducts()].filter((p) => p.isNewArrival || p.stock > 0).slice(0, limit);
  }

  public getSpecialOffers(limit = 4): Product[] {
    return [...this.getProducts()].filter((p) => p.isSale || (p.discountPercent && p.discountPercent > 0)).slice(0, limit);
  }

  public getRecommended(currentProductId?: string, limit = 4): Product[] {
    const all = this.getProducts();
    if (!currentProductId) return all.slice(0, limit);

    const current = all.find((p) => p.id === currentProductId);
    if (!current) return all.slice(0, limit);

    // Recommend same saree type or same category first
    return all
      .filter((p) => p.id !== currentProductId)
      .sort((a, b) => {
        const aScore = (a.categoryId === current.categoryId ? 2 : 0) + (a.sareeType === current.sareeType ? 2 : 0);
        const bScore = (b.categoryId === current.categoryId ? 2 : 0) + (b.sareeType === current.sareeType ? 2 : 0);
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  // PRIVATE NEGOTIATED PRICE CODE ENGINE
  public getAllPrivateCodesAdmin(): PrivatePriceCode[] {
    return this.privateCodes;
  }

  public savePrivateCode(code: PrivatePriceCode): void {
    const idx = this.privateCodes.findIndex((c) => c.id === code.id);
    if (idx >= 0) {
      this.privateCodes[idx] = code;
    } else {
      this.privateCodes.unshift(code);
    }
    this.persist('aanchol_private_codes', this.privateCodes);
  }

  public deletePrivateCode(id: string): void {
    this.privateCodes = this.privateCodes.filter((c) => c.id !== id);
    this.persist('aanchol_private_codes', this.privateCodes);
  }

  public validatePrivateCode(
    codeStr: string,
    cartItems: CartItem[],
    customerPhone?: string
  ): { valid: boolean; discountAmount: number; message: string; code?: PrivatePriceCode } {
    const trimmed = codeStr.trim().toUpperCase();
    const found = this.privateCodes.find((c) => c.code.toUpperCase() === trimmed && c.isActive && !c.used);

    if (!found) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired code.' };
    }

    if (found.targetPhone && customerPhone && found.targetPhone !== customerPhone) {
      return { valid: false, discountAmount: 0, message: 'This private code is reserved for another authorized phone number.' };
    }

    // Specific product price override
    if (found.targetProductId) {
      const targetItem = cartItems.find((item) => item.productId === found.targetProductId);
      if (!targetItem) {
        return { valid: false, discountAmount: 0, message: 'This code applies only to a specific negotiated saree.' };
      }
      const standardPrice = targetItem.price;
      const negotiatedPrice = found.specialPrice;
      const savingPerItem = Math.max(0, standardPrice - negotiatedPrice);
      const totalSaving = savingPerItem * targetItem.quantity;

      return {
        valid: true,
        discountAmount: totalSaving,
        message: `Special price applied: ৳${negotiatedPrice.toLocaleString()} per saree!`,
        code: found
      };
    }

    // General fixed discount (e.g. AANCHOL500)
    return {
      valid: true,
      discountAmount: found.specialPrice,
      message: `৳${found.specialPrice} discount applied!`,
      code: found
    };
  }

  // ORDERS & CHECKOUT ENGINE
  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderByIdOrPhone(query: string): Order[] {
    const q = query.trim().toUpperCase();
    return this.orders.filter(
      (o) => o.id.toUpperCase() === q || o.customerPhone.includes(query.trim()) || o.shippingAddress.phone.includes(query.trim())
    );
  }

  public placeOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'orderStatus'>): Order {
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ANC-${randNum}`,
      orderDate: new Date().toISOString(),
      orderStatus: 'placed',
      courier: {
        name: 'Steadfast Courier',
        consignmentId: `STDF-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingCode: `STDF-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingUrl: 'https://steadfast.com.bd/tracking',
        estimatedDelivery: orderData.shippingAddress.isInsideDhaka ? 'Within 24-48 Hours' : 'Within 2-4 Days'
      }
    };

    // Deduct stock safely on server/store
    newOrder.items.forEach((item) => {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.salesCount = (prod.salesCount || 0) + item.quantity;
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    });

    this.orders.unshift(newOrder);
    this.persist('aanchol_orders', this.orders);
    this.persist('aanchol_products', this.products);

    // Update customer account
    this.saveCustomerOrder(newOrder);

    // Create instant notification
    this.addNotification({
      type: 'order',
      titleEn: `Order #${newOrder.id} Placed Successfully`,
      titleBn: `অর্ডার #${newOrder.id} সফলভাবে সম্পন্ন হয়েছে`,
      messageEn: `Your order for ৳${newOrder.finalTotal.toLocaleString()} with Cash on Delivery is confirmed. Steadfast Courier tracking will begin shortly.`,
      messageBn: `৳${newOrder.finalTotal.toLocaleString()} মূল্যের ক্যাশ অন ডেলিভারি অর্ডারটি সফলভাবে সম্পন্ন হয়েছে। কিছুক্ষণের মধ্যে ট্র্যাকিং চালু হবে।`,
      actionType: 'track_order',
      orderId: newOrder.id
    });

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus'], courierTracking?: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      if (courierTracking && order.courier) {
        order.courier.trackingCode = courierTracking;
      }
      this.persist('aanchol_orders', this.orders);
    }
  }

  public updatePaymentStatus(orderId: string, status: Order['paymentStatus']): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.paymentStatus = status;
      if (order.paymentDetails) {
        order.paymentDetails.isVerified = status === 'paid';
        if (status === 'paid') {
          order.paymentDetails.verifiedAt = new Date().toISOString();
        }
      }
      this.persist('aanchol_orders', this.orders);
    }
  }

  public cancelOrder(orderId: string, reason?: string): { success: boolean; message: string } {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    if (order.orderStatus === 'courier_shipped' || order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered') {
      return {
        success: false,
        message: 'This order has already been handed over to Steadfast Courier. Online cancellation is closed.'
      };
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason || 'Customer requested cancellation';

    // Restore stock
    order.items.forEach((item) => {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock += item.quantity;
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variant.stock += item.quantity;
        }
      }
    });

    this.persist('aanchol_orders', this.orders);
    this.persist('aanchol_products', this.products);

    return { success: true, message: 'Order cancelled successfully.' };
  }

  // CUSTOMER ACCOUNT & PROFILE
  public getCustomerAccount(phone: string): CustomerAccount | null {
    const cleanPhone = phone.trim();
    if (!cleanPhone) return null;
    return this.customerAccounts.get(cleanPhone) || null;
  }

  public saveCustomerAccount(account: CustomerAccount): void {
    this.customerAccounts.set(account.phone, account);
    const obj: Record<string, CustomerAccount> = {};
    this.customerAccounts.forEach((val, key) => {
      obj[key] = val;
    });
    this.persist('aanchol_accounts', obj);
  }

  private saveCustomerOrder(order: Order): void {
    let account = this.getCustomerAccount(order.customerPhone);
    const earned = Math.floor(order.subtotal / 100);
    const redeemed = order.redeemedPoints || 0;

    if (!account) {
      account = {
        phone: order.customerPhone,
        name: order.customerName,
        isVerified: true,
        loyaltyPoints: earned,
        savedAddresses: [order.shippingAddress],
        wishlistProductIds: [],
        orderIds: [order.id]
      };
    } else {
      account.loyaltyPoints = Math.max(0, (account.loyaltyPoints || 0) - redeemed + earned);
      if (!account.orderIds.includes(order.id)) {
        account.orderIds.unshift(order.id);
      }
      // Add shipping address if not already present
      const exists = account.savedAddresses.some((a) => a.fullAddress === order.shippingAddress.fullAddress);
      if (!exists) {
        account.savedAddresses.push(order.shippingAddress);
      }
    }
    this.saveCustomerAccount(account);
  }

  // REVIEWS
  public getAllReviews(): Review[] {
    return this.reviews;
  }

  public getReviewsForProduct(productId: string): Review[] {
    return this.reviews.filter((r) => r.productId === productId);
  }

  public addReview(review: Review): void {
    this.reviews.unshift(review);
    this.persist('aanchol_reviews', this.reviews);

    // Recalculate product rating
    const prodReviews = this.reviews.filter((r) => r.productId === review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.products.find((p) => p.id === review.productId);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
      this.persist('aanchol_products', this.products);
    }
  }

  // CUSTOMER ACCOUNT MANAGEMENT
  public updateCustomerAccount(phone: string, updates: Partial<CustomerAccount>): CustomerAccount | null {
    const cleanPhone = phone.trim();
    const existing = this.customerAccounts.get(cleanPhone);
    if (!existing) return null;
    const updated: CustomerAccount = { ...existing, ...updates };
    this.saveCustomerAccount(updated);
    return updated;
  }

  public deleteCustomerAccount(phone: string): boolean {
    const cleanPhone = phone.trim();
    if (this.customerAccounts.has(cleanPhone)) {
      this.customerAccounts.delete(cleanPhone);
      const obj: Record<string, CustomerAccount> = {};
      this.customerAccounts.forEach((val, key) => {
        obj[key] = val;
      });
      this.persist('aanchol_accounts', obj);
      return true;
    }
    return false;
  }

  // CATEGORY ARTICLES (BLOGGER WEBSITE STYLE)
  public getCategoryArticles(): CategoryArticle[] {
    return this.categoryArticles;
  }

  public getCategoryArticle(identifier: string): CategoryArticle | undefined {
    return this.categoryArticles.find((a) => a.id === identifier || a.categoryId === identifier || a.slug === identifier);
  }

  public getCategoryArticleByCategoryId(categoryId: string): CategoryArticle | undefined {
    return this.categoryArticles.find((a) => a.categoryId === categoryId);
  }

  public getCategoryArticleById(id: string): CategoryArticle | undefined {
    return this.categoryArticles.find((a) => a.id === id);
  }

  public saveCategoryArticle(article: CategoryArticle): void {
    const idx = this.categoryArticles.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      this.categoryArticles[idx] = article;
    } else {
      this.categoryArticles.unshift(article);
    }
    this.persist('aanchol_category_articles', this.categoryArticles);
  }

  public deleteCategoryArticle(id: string): void {
    this.categoryArticles = this.categoryArticles.filter((a) => a.id !== id);
    this.persist('aanchol_category_articles', this.categoryArticles);
  }

  // NOTIFICATIONS
  public getNotifications(): AppNotification[] {
    return this.notifications;
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  public markNotificationRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.persist('aanchol_notifications', this.notifications);
  }

  public markAllNotificationsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.persist('aanchol_notifications', this.notifications);
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.persist('aanchol_notifications', this.notifications);
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.persist('aanchol_notifications', this.notifications);
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): AppNotification {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    this.notifications.unshift(newNotif);
    this.persist('aanchol_notifications', this.notifications);
    return newNotif;
  }

  // ==========================================
  // UNIFIED PROMOTION CAMPAIGNS (Requirement 4C, 4D, 22)
  // ==========================================
  public getPromotions(): Promotion[] {
    const now = Date.now();
    return this.promotions.filter((p) => {
      if (!p.isActive) return false;
      if (p.startDate && new Date(p.startDate).getTime() > now) return false;
      if (p.endDate && new Date(p.endDate).getTime() < now) return false; // Automatic expiration!
      return true;
    });
  }

  public getAllPromotionsAdmin(): Promotion[] {
    return this.promotions;
  }

  public getPromotionById(id: string): Promotion | undefined {
    return this.promotions.find((p) => p.id === id);
  }

  public savePromotion(promotion: Promotion): void {
    const idx = this.promotions.findIndex((p) => p.id === promotion.id);
    if (idx >= 0) {
      this.promotions[idx] = promotion;
    } else {
      this.promotions.unshift(promotion);
    }
    this.persist('aanchol_promotions', this.promotions);
  }

  public deletePromotion(id: string): void {
    this.promotions = this.promotions.filter((p) => p.id !== id);
    this.persist('aanchol_promotions', this.promotions);
  }

  public togglePromotionActive(id: string): void {
    const p = this.promotions.find((item) => item.id === id);
    if (p) {
      p.isActive = !p.isActive;
      this.persist('aanchol_promotions', this.promotions);
    }
  }

  // ==========================================
  // HIDDEN PROMOTIONAL CATEGORIES (Requirement 11)
  // ==========================================
  public getHiddenPromotionalCategories(): HiddenPromotionalCategory[] {
    return this.hiddenPromotionalCategories;
  }

  public getActiveHiddenPromotionalCategories(): HiddenPromotionalCategory[] {
    return this.hiddenPromotionalCategories.filter((c) => c.isActive);
  }

  public getHiddenPromotionalCategoryById(id: string): HiddenPromotionalCategory | undefined {
    return this.hiddenPromotionalCategories.find((c) => c.id === id);
  }

  public saveHiddenPromotionalCategory(category: HiddenPromotionalCategory): void {
    const idx = this.hiddenPromotionalCategories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      this.hiddenPromotionalCategories[idx] = category;
    } else {
      this.hiddenPromotionalCategories.push(category);
    }
    this.persist('aanchol_hidden_promotional_categories', this.hiddenPromotionalCategories);
  }

  public deleteHiddenPromotionalCategory(id: string): void {
    this.hiddenPromotionalCategories = this.hiddenPromotionalCategories.filter((c) => c.id !== id);
    // Remove this category from products
    this.products.forEach((p) => {
      if (p.promotionalCategoryIds) {
        p.promotionalCategoryIds = p.promotionalCategoryIds.filter((cid) => cid !== id);
      }
      if (p.promotionalCategoryId === id) {
        p.promotionalCategoryId = undefined;
      }
    });
    this.persist('aanchol_hidden_promotional_categories', this.hiddenPromotionalCategories);
    this.persist('aanchol_products', this.products);
  }

  public toggleHiddenPromotionalCategoryActive(id: string): void {
    const c = this.hiddenPromotionalCategories.find((item) => item.id === id);
    if (c) {
      c.isActive = !c.isActive;
      this.persist('aanchol_hidden_promotional_categories', this.hiddenPromotionalCategories);
    }
  }

  // Find all products associated with a promotion or hidden category
  public getProductsForPromotion(promotion: Promotion): Product[] {
    const all = this.getProducts();

    // 1. Explicit productIds
    if (promotion.productIds && promotion.productIds.length > 0) {
      const explicit = all.filter((p) => promotion.productIds?.includes(p.id));
      if (explicit.length > 0) return explicit;
    }

    // 2. Hidden promotional category link
    if (promotion.promotionalCategoryId) {
      const promoCat = this.hiddenPromotionalCategories.find((c) => c.id === promotion.promotionalCategoryId);
      const catProducts = all.filter(
        (p) =>
          p.promotionalCategoryIds?.includes(promotion.promotionalCategoryId!) ||
          p.promotionalCategoryId === promotion.promotionalCategoryId ||
          (promoCat?.productIds && promoCat.productIds.includes(p.id))
      );
      if (catProducts.length > 0) return catProducts;
    }

    // 3. Normal category link
    if (promotion.destinationCategoryId) {
      const byCat = all.filter((p) => p.categoryId === promotion.destinationCategoryId);
      if (byCat.length > 0) return byCat;
    }

    if (promotion.categoryIds && promotion.categoryIds.length > 0) {
      const byCats = all.filter((p) => promotion.categoryIds?.includes(p.categoryId));
      if (byCats.length > 0) return byCats;
    }

    // Fallback: if flash sale, find flash sale products or sale products
    if (promotion.type === 'flash_sale') {
      const flashProds = all.filter((p) => p.flashSaleId || p.isSale);
      if (flashProds.length > 0) return flashProds;
    }

    return all.filter((p) => p.isSale).slice(0, 8);
  }

  public getProductsByPromotionalCategory(promoCatId: string): Product[] {
    const promoCat = this.hiddenPromotionalCategories.find((c) => c.id === promoCatId);
    return this.getProducts().filter(
      (p) =>
        p.promotionalCategoryIds?.includes(promoCatId) ||
        p.promotionalCategoryId === promoCatId ||
        (promoCat?.productIds && promoCat.productIds.includes(p.id))
    );
  }

  // ==========================================
  // COUPON & FREE DELIVERY CALCULATION (Requirements 2 & 10)
  // ==========================================
  public validateCoupon(
    rawCode: string,
    subtotal: number,
    items?: (CartItem | { productId: string })[]
  ): { valid: boolean; discount: number; isFreeDelivery: boolean; promo?: Promotion; message: string } {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { valid: false, discount: 0, isFreeDelivery: false, message: 'Please enter a coupon code.' };
    }

    // Check promotions
    const activePromos = this.getPromotions();
    const promo = activePromos.find((p) => p.code && p.code.trim().toUpperCase() === code);

    if (promo) {
      // Check expiration
      if (promo.endDate && new Date(promo.endDate).getTime() < Date.now()) {
        return { valid: false, discount: 0, isFreeDelivery: false, message: 'This coupon has expired.' };
      }

      // Check min order amount
      if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
        return {
          valid: false,
          discount: 0,
          isFreeDelivery: false,
          message: `Minimum order amount of ৳${promo.minOrderAmount.toLocaleString()} required for this coupon.`
        };
      }

      let discount = 0;
      let isFreeDelivery = promo.type === 'free_delivery' || !!promo.hasFreeDelivery;

      if (promo.type === 'percentage') {
        discount = Math.round((subtotal * (promo.discountPercent || 0)) / 100);
      } else if (promo.type === 'fixed') {
        discount = promo.fixedDiscount || 0;
      } else if (promo.type === 'flash_sale') {
        discount = Math.round((subtotal * (promo.discountPercent || 0)) / 100);
      }

      return {
        valid: true,
        discount,
        isFreeDelivery,
        promo,
        message: promo.type === 'free_delivery'
          ? 'Free Delivery coupon applied!'
          : `Coupon applied: ৳${discount.toLocaleString()} discount!`
      };
    }

    // Check private codes
    const privateCode = this.privateCodes.find(
      (c) => c.code.trim().toUpperCase() === code && c.isActive && !c.used
    );
    if (privateCode) {
      const discount = privateCode.specialPrice;
      return {
        valid: true,
        discount,
        isFreeDelivery: false,
        message: `Private VIP code applied: ৳${discount.toLocaleString()} discount!`
      };
    }

    return { valid: false, discount: 0, isFreeDelivery: false, message: 'Invalid or expired coupon code.' };
  }

  // Calculate if order qualifies for Free Delivery (individually controlled per product or promotional offer)
  public isOrderFreeDelivery(
    items: (CartItem | { productId: string })[],
    couponCode?: string,
    subtotal = 0
  ): boolean {
    if (couponCode) {
      const validated = this.validateCoupon(couponCode, subtotal, items);
      if (validated.valid && validated.isFreeDelivery) {
        return true;
      }
    }

    if (!items || items.length === 0) return false;

    // Check product individual free delivery setting
    const hasFreeDeliveryProduct = items.some((item) => {
      const prod = this.getProductById(item.productId);
      return prod?.isFreeDelivery === true;
    });
    if (hasFreeDeliveryProduct) return true;

    // Check active promotional offers with free delivery
    const activePromos = this.getPromotions().filter(
      (p) => p.type === 'free_delivery' || p.hasFreeDelivery === true
    );

    for (const promo of activePromos) {
      // Check if promo has threshold without specific items
      if (
        promo.minOrderAmount !== undefined &&
        subtotal >= promo.minOrderAmount &&
        (!promo.productIds || promo.productIds.length === 0) &&
        !promo.promotionalCategoryId
      ) {
        return true;
      }

      // Check if any item in cart is part of the promo's products
      if (promo.productIds && promo.productIds.length > 0) {
        const matches = items.some((item) => promo.productIds?.includes(item.productId));
        if (matches) return true;
      }

      // Check if any item belongs to the promotional category
      if (promo.promotionalCategoryId) {
        const matchesCat = items.some((item) => {
          const prod = this.getProductById(item.productId);
          return (
            prod?.promotionalCategoryIds?.includes(promo.promotionalCategoryId!) ||
            prod?.promotionalCategoryId === promo.promotionalCategoryId
          );
        });
        if (matchesCat) return true;
      }
    }

    return false;
  }

  // Calculate if Free Delivery promotion applies (Requirement 23)
  public isFreeDeliveryActive(subtotal: number, couponCode?: string): boolean {
    const activePromos = this.getPromotions();
    const freeDelPromo = activePromos.find((p) => p.type === 'free_delivery');
    if (!freeDelPromo) return false;

    if (couponCode && freeDelPromo.code && couponCode.trim().toUpperCase() === freeDelPromo.code.toUpperCase()) {
      return true;
    }

    if (freeDelPromo.minOrderAmount !== undefined) {
      return subtotal >= freeDelPromo.minOrderAmount;
    }

    return true;
  }

  // ==========================================
  // INVENTORY MANAGEMENT (Requirement 26)
  // ==========================================
  public adjustStock(productId: string, variantId: string | undefined, delta: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.stock = Math.max(0, product.stock + delta);
      if (variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          variant.stock = Math.max(0, variant.stock + delta);
        }
      }
      this.persist('aanchol_products', this.products);
    }
  }

  public setStock(productId: string, variantId: string | undefined, newStock: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      if (variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          variant.stock = Math.max(0, newStock);
        }
        product.stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
      } else {
        product.stock = Math.max(0, newStock);
      }
      this.persist('aanchol_products', this.products);
    }
  }

  public getLowStockProducts(threshold = 5): Product[] {
    return this.products.filter((p) => p.stock > 0 && p.stock <= threshold);
  }

  public getOutOfStockProducts(): Product[] {
    return this.products.filter((p) => p.stock === 0);
  }

  // ==========================================
  // CUSTOMER AUTH & MOBILE OTP SESSION (Requirement 13)
  // ==========================================
  public getActiveCustomerPhone(): string | null {
    return this.activeCustomerPhone;
  }

  public getActiveCustomer(): CustomerAccount | null {
    if (!this.activeCustomerPhone) return null;
    return this.getCustomerAccount(this.activeCustomerPhone);
  }

  public setActiveCustomerPhone(phone: string | null): void {
    this.activeCustomerPhone = phone;
    if (phone) {
      this.persist('aanchol_active_phone', phone);
    } else {
      try {
        localStorage.removeItem('aanchol_active_phone');
      } catch {}
    }
  }

  public sendOtp(phone: string): { success: boolean; otp: string; message: string } {
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 11) {
      return { success: false, otp: '', message: 'Invalid mobile phone number.' };
    }
    // Simulation OTP for testing/demo purposes: '1234'
    return {
      success: true,
      otp: '1234',
      message: `OTP sent to ${cleanPhone}. (Use 1234 for testing)`
    };
  }

  public loginWithOtp(
    phone: string,
    otp: string,
    name?: string
  ): { success: boolean; account: CustomerAccount | null; message: string } {
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 11) {
      return { success: false, account: null, message: 'Please enter a valid 11-digit phone number.' };
    }
    if (otp !== '1234' && otp.length < 4) {
      return { success: false, account: null, message: 'Invalid OTP code. Please enter 1234.' };
    }

    let existing = this.getCustomerAccount(cleanPhone);
    if (!existing) {
      // First-time customer: create verified account with 100 welcome loyalty points
      existing = {
        phone: cleanPhone,
        name: name?.trim() || 'Tasnim Rahman',
        isVerified: true,
        loyaltyPoints: 100,
        savedAddresses: [
          {
            id: `addr-${Date.now()}`,
            recipientName: name?.trim() || 'Tasnim Rahman',
            phone: cleanPhone,
            division: 'Dhaka',
            district: 'Dhaka',
            area: 'Dhanmondi',
            fullAddress: 'Dhanmondi, Dhaka',
            isInsideDhaka: true,
            isDefault: true
          }
        ],
        wishlistProductIds: [],
        orderIds: []
      };
      this.saveCustomerAccount(existing);
    } else {
      existing.isVerified = true;
      if (name && name.trim()) {
        existing.name = name.trim();
      }
      this.saveCustomerAccount(existing);
    }

    this.activeCustomerPhone = cleanPhone;
    this.persist('aanchol_active_phone', cleanPhone);

    return {
      success: true,
      account: existing,
      message: 'Mobile number verified successfully!'
    };
  }

  public logoutCustomer(): void {
    this.activeCustomerPhone = null;
    try {
      localStorage.removeItem('aanchol_active_phone');
    } catch {}
  }
}

export const store = new StoreService();
