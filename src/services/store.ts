import { Product, Category, Banner, Order, CustomerAccount, PrivatePriceCode, Review, FilterState, CartItem, LandingPopupConfig, FlashSaleCampaign, AppNotification } from '../types';

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
    viewsCount: 1420
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
    viewsCount: 980
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
    viewsCount: 2150
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
    fabric: 'Certified 100% Pure Mulberry Silk Sericulture',
    fabricBn: 'রাজশাহীর ১০০% খাঁটি তুঁত সিল্কের রেশম সুতা',
    occasion: 'Weddings, Receptions & Evening Banquets',
    occasionBn: 'বিয়ে বাড়ি, রিসেপশন ও জমকালো নৈশভোজ',
    suitableAgeRange: '25-35',
    descriptionEn: 'Naturally soft Mulberry silk with a brilliant mirror-like drape. Styled with intricate hand-woven floral jaal on the anchol and contrast temple border.',
    descriptionBn: 'রাজশাহীর সেরা রেশম সুতায় তৈরি এই শাড়িটিতে রয়েছে অসাধারণ মসৃণতা ও উজ্জ্বল দীপ্তি। জমকালো অ্যান্টিক জরির আঁচল আপনাকে অনুষ্ঠানের মূল আকর্ষণে পরিণত করবে।',
    careInstructionsEn: 'Dry clean recommended. Iron on low silk setting from the reverse side.',
    careInstructionsBn: 'ড্রাই ক্লিন করা শ্রেয়। উল্টোপিঠ থেকে মৃদু তাপে ইস্ত্রি করুন।',
    length: '5.5 meters (12 Haat) with matching Blouse Piece',
    hasBlousePiece: true,
    stock: 9,
    isFeatured: true,
    isNewArrival: true,
    isSale: false,
    isActive: true,
    rating: 4.9,
    reviewCount: 26,
    keywords: ['silk', 'rajshahi', 'emerald', 'green', 'mulberry', 'resham', 'wedding', 'সিল্ক', 'রাজশাহী', 'সবুজ'],
    primaryImage: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
    images: [
      '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg'
    ],
    variants: [
      {
        id: 'v-sk302-green',
        colorNameEn: 'Deep Emerald Green',
        colorNameBn: 'গাঢ় পান্না সবুজ',
        colorHex: '#047857',
        colorFamily: 'green',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 5,
        sku: 'SK-302-GRN'
      },
      {
        id: 'v-sk302-navy',
        colorNameEn: 'Sapphire Royal Blue',
        colorNameBn: 'নীলমণি নীল',
        colorHex: '#1D4ED8',
        colorFamily: 'blue',
        image: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg',
        stock: 4,
        sku: 'SK-302-BLU'
      }
    ],
    salesCount: 31,
    viewsCount: 1100
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

const INITIAL_LANDING_POPUP: LandingPopupConfig = {
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
  ctaLink: 'shop'
};

const INITIAL_FLASH_SALES: FlashSaleCampaign[] = [
  {
    id: 'fs-eid-special',
    titleEn: 'Royal Heritage Flash Sale — Flat 15% OFF',
    titleBn: 'রাজকীয় জামদানি ফ্ল্যাশ সেল — ফ্ল্যাট ১৫% ছাড়',
    discountPercent: 15,
    hasTimer: true,
    endTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    isActive: true,
    bannerImage: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg'
  },
  {
    id: 'fs-handloom-festival',
    titleEn: 'Artisan Handloom Weekend Deals',
    titleBn: 'তাঁতি সম্মাননা উৎসব — বিশেষ মূল্যছাড়',
    discountPercent: 20,
    hasTimer: true,
    endTime: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    isActive: true,
    bannerImage: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg'
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
  private landingPopup: LandingPopupConfig = INITIAL_LANDING_POPUP;
  private notifications: AppNotification[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedProducts = localStorage.getItem('aanchol_products');
      this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;

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

      const storedPopup = localStorage.getItem('aanchol_landing_popup');
      this.landingPopup = storedPopup ? JSON.parse(storedPopup) : INITIAL_LANDING_POPUP;

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
    const idx = this.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.products[idx] = product;
    } else {
      this.products.unshift(product);
    }
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

  // LANDING POPUP
  public getLandingPopupConfig(): LandingPopupConfig {
    return this.landingPopup;
  }

  public saveLandingPopupConfig(config: LandingPopupConfig): void {
    this.landingPopup = config;
    this.persist('aanchol_landing_popup', this.landingPopup);
  }

  // FLASH SALE CAMPAIGNS
  public getFlashSales(): FlashSaleCampaign[] {
    return this.flashSales.filter((s) => s.isActive);
  }

  public getAllFlashSalesAdmin(): FlashSaleCampaign[] {
    return this.flashSales;
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

  // INTELLIGENT SEARCH & FUZZY MATCHING
  public searchProducts(query: string, filters?: Partial<FilterState>): Product[] {
    let list = this.getProducts();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();

      // Normalize common transliterated saree typos & English/Bangla terms
      const typoMap: Record<string, string> = {
        jamdany: 'jamdani',
        jomdani: 'jamdani',
        zamzami: 'jamdani',
        jamdani: 'jamdani',
        moslin: 'muslin',
        musline: 'muslin',
        maslin: 'muslin',
        tat: 'taat',
        tanti: 'taat',
        tangail: 'tangail',
        shilk: 'silk',
        silke: 'silk',
        kotan: 'katan',
        katon: 'katan',
        banarasi: 'katan',
        benarosi: 'katan',
        lal: 'red',
        neel: 'blue',
        nil: 'blue',
        shobuj: 'green',
        holud: 'yellow',
        shada: 'white',
        kalo: 'black'
      };

      const normalizedQ = typoMap[q] || q;

      list = list.filter((p) => {
        // Direct product code match (Priority 1)
        if (p.code.toLowerCase().includes(q)) return true;

        // Name match (EN & BN)
        if (p.nameEn.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(normalizedQ)) return true;
        if (p.nameBn.includes(query.trim())) return true;

        // Saree Type match
        if (p.sareeType.toLowerCase().includes(q) || p.sareeType.toLowerCase().includes(normalizedQ)) return true;

        // Keywords match
        if (p.keywords.some((k) => k.toLowerCase().includes(q) || k.toLowerCase().includes(normalizedQ))) return true;

        // Fabric match
        if (p.fabric.toLowerCase().includes(q) || p.fabricBn.includes(query.trim())) return true;

        // Color variants match
        if (
          p.variants.some(
            (v) =>
              v.colorNameEn.toLowerCase().includes(q) ||
              v.colorNameBn.includes(query.trim()) ||
              v.colorFamily.toLowerCase() === normalizedQ
          )
        ) {
          return true;
        }

        return false;
      });
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
}

export const store = new StoreService();
