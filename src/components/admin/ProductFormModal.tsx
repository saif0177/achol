import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Ruler,
  Palette,
  Tag,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Download,
  Eye,
  CheckCircle2,
  Star,
  Flame
} from 'lucide-react';
import QRCode from 'qrcode';
import { Product, ProductVariant, Category, Language } from '../../types';
import { store } from '../../services/store';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  categories: Category[];
  language: Language;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  language,
  onSaved
}) => {
  // Preset curated authentic images
  const sampleImages = [
    { label: 'Crimson Dhakai Jamdani', url: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg' },
    { label: 'Royal Dhakai Muslin Ivory', url: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg' },
    { label: 'Tangail Taat Peacock Cotton', url: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg' },
    { label: 'Rajshahi Pure Mulberry Silk', url: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg' },
    { label: 'Mirpur Bridal Katan Gold', url: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg' }
  ];

  // Wizard Step State (Requirement 5: "completing a form for creating account or creating post")
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [nameEn, setNameEn] = useState(productToEdit?.nameEn || '');
  const [nameBn, setNameBn] = useState(productToEdit?.nameBn || '');
  const [code, setCode] = useState(productToEdit?.code || `JM-${Math.floor(100 + Math.random() * 900)}`);
  const [price, setPrice] = useState(productToEdit?.price || 12000);
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice || 14000);
  const [discountPercent, setDiscountPercent] = useState(productToEdit?.discountPercent || 14);
  const [categoryId, setCategoryId] = useState(productToEdit?.categoryId || categories[0]?.id || 'dhakai-jamdani');
  const [subcategoryId, setSubcategoryId] = useState(productToEdit?.subcategoryId || '');
  const [sareeType, setSareeType] = useState<Product['sareeType']>(productToEdit?.sareeType || 'Dhakai Jamdani');
  const [fabric, setFabric] = useState(productToEdit?.fabric || '80-Count Pure Cotton & Fine Resham Zari');
  const [fabricBn, setFabricBn] = useState(productToEdit?.fabricBn || '৮০ কাউন্ট সুতি ও খাঁটি রেশম জরি');
  const [occasion, setOccasion] = useState(productToEdit?.occasion || 'Weddings, Formal Occasions & Festivals');
  const [occasionBn, setOccasionBn] = useState(productToEdit?.occasionBn || 'বিয়ে, পারিবারিক উৎসব ও বিশেষ অনুষ্ঠান');
  const [suitableAgeRange, setSuitableAgeRange] = useState<Product['suitableAgeRange']>(productToEdit?.suitableAgeRange || '25-35');
  const [length, setLength] = useState(productToEdit?.length || '5.5 meters (12 Haat) with Blouse Piece');
  const [hasBlousePiece, setHasBlousePiece] = useState(productToEdit?.hasBlousePiece ?? true);
  const [descriptionEn, setDescriptionEn] = useState(
    productToEdit?.descriptionEn ||
      'Exquisite handloom masterpiece featuring authentic traditional motifs hand-woven by master weavers.'
  );
  const [descriptionBn, setDescriptionBn] = useState(
    productToEdit?.descriptionBn ||
      'ঐতিহ্যবাহী তাঁতশিল্পীদের নিপুণ হাতে বোনা খাঁটি বাংলাদেশি শাড়ি।'
  );
  const [careInstructionsEn, setCareInstructionsEn] = useState(
    productToEdit?.careInstructionsEn || 'Dry clean only. Roll fold on a soft muslin fabric.'
  );
  const [careInstructionsBn, setCareInstructionsBn] = useState(
    productToEdit?.careInstructionsBn || 'শুধুমাত্র ড্রাই ওয়াশ করুন। সূতির কাপড়ে জড়িয়ে রাখুন।'
  );

  const [isFeatured, setIsFeatured] = useState(productToEdit?.isFeatured ?? true);
  const [isSale, setIsSale] = useState(productToEdit?.isSale ?? true);
  const [isNewArrival, setIsNewArrival] = useState(productToEdit?.isNewArrival ?? false);
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(productToEdit?.isFreeDelivery ?? false);
  const [promotionalCategoryIds, setPromotionalCategoryIds] = useState<string[]>(
    productToEdit?.promotionalCategoryIds || (productToEdit?.promotionalCategoryId ? [productToEdit.promotionalCategoryId] : [])
  );
  const hiddenPromotionalCategories = store.getHiddenPromotionalCategories();

  // Requirement 4: Flash Sale Offer selection & automatic price calculation
  const [flashSaleId, setFlashSaleId] = useState(productToEdit?.flashSaleId || '');
  const [flashSaleTitle, setFlashSaleTitle] = useState(productToEdit?.flashSaleTitle || '');
  const [flashSaleDiscount, setFlashSaleDiscount] = useState(productToEdit?.flashSaleDiscount || 0);
  const flashSaleCampaigns = store.getFlashSales();

  const handleSelectOfferCampaign = (campaignId: string) => {
    setFlashSaleId(campaignId);
    if (!campaignId) {
      setFlashSaleTitle('');
      setFlashSaleDiscount(0);
      return;
    }
    const camp = flashSaleCampaigns.find((c) => c.id === campaignId);
    if (camp) {
      setFlashSaleTitle(camp.titleEn);
      setFlashSaleDiscount(camp.discountPercent);
      setDiscountPercent(camp.discountPercent);
      setIsSale(true);
      // Automatically calculate discounted price on the saree
      const base = originalPrice && originalPrice > 0 ? originalPrice : (price > 0 ? price : 10000);
      if (!originalPrice || originalPrice <= price) {
        setOriginalPrice(base);
      }
      const calculatedSalePrice = Math.round(base * (1 - camp.discountPercent / 100));
      setPrice(calculatedSalePrice);
    }
  };

  // Images list
  const [images, setImages] = useState<string[]>(
    productToEdit?.images || [sampleImages[0].url]
  );
  const [primaryImage, setPrimaryImage] = useState<string>(
    productToEdit?.primaryImage || sampleImages[0].url
  );

  // Variants list - Requirement 5: main variant first, then tap to add variant with custom name, image, SKU, stock
  const [variants, setVariants] = useState<ProductVariant[]>(
    productToEdit?.variants || [
      {
        id: `v-main`,
        colorNameEn: 'Crimson Vermilion Red',
        colorNameBn: 'রক্তিম লাল',
        colorHex: '#991B1B',
        colorFamily: 'red',
        image: sampleImages[0].url,
        stock: 5,
        sku: `${code}-MAIN-01`
      },
      {
        id: `v-extra-1`,
        colorNameEn: 'Royal Midnight Navy',
        colorNameBn: 'গাঢ় রাজকীয় নীল',
        colorHex: '#1E3A8A',
        colorFamily: 'blue',
        image: sampleImages[2].url,
        stock: 3,
        sku: `${code}-BL-02`
      }
    ]
  );

  // QR Code Data URL State (Requirement 4: "on QR I can addicted")
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Active category subcategories
  const currentCategory = categories.find((c) => c.id === categoryId);

  // Auto-calculated total stock from all variants
  const calculatedTotalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  // Generate QR Code whenever code or product identity changes
  useEffect(() => {
    const qrPayload = JSON.stringify({
      code: code.trim().toUpperCase(),
      name: nameEn || 'Aanchol Saree',
      url: `https://aanchol.com.bd/product/${code.toLowerCase()}`
    });

    QRCode.toDataURL(qrPayload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#451a03',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [code, nameEn]);

  // Update variant SKU when model code changes
  useEffect(() => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (!v.sku || v.sku.startsWith('JM-') || v.sku.startsWith('DM-') || v.sku.startsWith('TT-') || v.sku.startsWith('SK-')) {
          const colorCode = v.colorFamily ? v.colorFamily.slice(0, 2).toUpperCase() : 'VR';
          return { ...v, sku: `${code}-${colorCode}-0${i + 1}` };
        }
        return v;
      })
    );
  }, [code]);

  // Sync form state when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setNameEn(productToEdit.nameEn || '');
      setNameBn(productToEdit.nameBn || '');
      setCode(productToEdit.code || '');
      setPrice(productToEdit.price || 0);
      setOriginalPrice(productToEdit.originalPrice || 0);
      setDiscountPercent(productToEdit.discountPercent || 0);
      setCategoryId(productToEdit.categoryId || categories[0]?.id || 'dhakai-jamdani');
      setSubcategoryId(productToEdit.subcategoryId || '');
      setSareeType(productToEdit.sareeType || 'Dhakai Jamdani');
      setFabric(productToEdit.fabric || '');
      setFabricBn(productToEdit.fabricBn || '');
      setOccasion(productToEdit.occasion || '');
      setOccasionBn(productToEdit.occasionBn || '');
      setSuitableAgeRange(productToEdit.suitableAgeRange || '25-35');
      setLength(productToEdit.length || '');
      setHasBlousePiece(productToEdit.hasBlousePiece ?? true);
      setDescriptionEn(productToEdit.descriptionEn || '');
      setDescriptionBn(productToEdit.descriptionBn || '');
      setCareInstructionsEn(productToEdit.careInstructionsEn || '');
      setCareInstructionsBn(productToEdit.careInstructionsBn || '');
      setIsFeatured(productToEdit.isFeatured ?? true);
      setIsSale(productToEdit.isSale ?? true);
      setIsNewArrival(productToEdit.isNewArrival ?? false);
      setIsFreeDelivery(productToEdit.isFreeDelivery ?? false);
      setPromotionalCategoryIds(
        productToEdit.promotionalCategoryIds || (productToEdit.promotionalCategoryId ? [productToEdit.promotionalCategoryId] : [])
      );
      setFlashSaleId(productToEdit.flashSaleId || '');
      setFlashSaleTitle(productToEdit.flashSaleTitle || '');
      setFlashSaleDiscount(productToEdit.flashSaleDiscount || 0);
      setImages(productToEdit.images || [sampleImages[0].url]);
      setPrimaryImage(productToEdit.primaryImage || sampleImages[0].url);
      setVariants(productToEdit.variants || []);
      setCurrentStep(1);
    }
  }, [productToEdit]);

  // Image Upload File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (variantIndex !== undefined) {
        handleUpdateVariant(variantIndex, 'image', dataUrl);
      } else {
        setPrimaryImage(dataUrl);
        if (!images.includes(dataUrl)) {
          setImages([dataUrl, ...images]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Add new variant (Requirement 5)
  const handleAddVariant = () => {
    const nextIdx = variants.length + 1;
    const presets = [
      { en: 'Emerald Green', bn: 'পান্না সবুজ', hex: '#059669', family: 'green' as const },
      { en: 'Mustard Gold', bn: 'সোনালী হলুদ', hex: '#D97706', family: 'gold' as const },
      { en: 'Royal Magenta', bn: 'রানি গোলাপি', hex: '#BE185D', family: 'pink' as const },
      { en: 'Pure Pearl White', bn: 'খাঁটি মুক্তা সাদা', hex: '#F3F4F6', family: 'white' as const },
      { en: 'Midnight Black', bn: 'কালো রেশম', hex: '#111827', family: 'black' as const }
    ];
    const picked = presets[(nextIdx - 1) % presets.length];

    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      colorNameEn: picked.en,
      colorNameBn: picked.bn,
      colorHex: picked.hex,
      colorFamily: picked.family,
      image: primaryImage,
      stock: 4,
      sku: `${code}-${picked.family.slice(0, 2).toUpperCase()}-0${nextIdx}`
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const handleSetAsMainVariant = (index: number) => {
    if (index === 0) return;
    const target = variants[index];
    const rest = variants.filter((_, i) => i !== index);
    setVariants([target, ...rest]);
    setPrimaryImage(target.image);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      alert('A saree must have at least one variant.');
      return;
    }
    setVariants(variants.filter((v) => v.id !== id));
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `Aanchol-QR-${code}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim()) {
      alert('Please enter Saree Name.');
      setCurrentStep(1);
      return;
    }

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `p-${code.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      code: code.trim().toUpperCase(),
      nameEn: nameEn.trim(),
      nameBn: nameBn.trim() || nameEn.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      sareeType,
      fabric,
      fabricBn,
      occasion,
      occasionBn,
      suitableAgeRange,
      descriptionEn,
      descriptionBn,
      careInstructionsEn,
      careInstructionsBn,
      length,
      hasBlousePiece,
      stock: calculatedTotalStock,
      isFeatured,
      isNewArrival,
      isSale,
      isFreeDelivery,
      promotionalCategoryId: promotionalCategoryIds[0] || undefined,
      promotionalCategoryIds,
      isActive: true,
      flashSaleId: flashSaleId || undefined,
      flashSaleTitle: flashSaleTitle || undefined,
      flashSaleDiscount: flashSaleDiscount || undefined,
      rating: productToEdit ? productToEdit.rating : 5.0,
      reviewCount: productToEdit ? productToEdit.reviewCount : 12,
      keywords: [code, nameEn, nameBn, sareeType, fabric, 'handloom', 'saree'],
      primaryImage,
      images,
      variants,
      salesCount: productToEdit ? productToEdit.salesCount : 0,
      viewsCount: productToEdit ? productToEdit.viewsCount : 45
    };

    store.saveProduct(newProduct);
    onSaved();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden my-auto max-h-[94vh] flex flex-col border border-stone-200">
        
        {/* Header - Styled like a High-End Creation Studio / Account Post Wizard */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                {productToEdit ? 'Edit Saree Listing' : 'Create New Authentic Saree Post'}
              </h2>
              <p className="text-[11px] text-stone-300">
                Step-by-step master post creation for weavers & catalog management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs (1 -> 2 -> 3 -> 4 -> 5) */}
        <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {[
            { step: 1, label: '1. Identity & Cat', icon: Tag },
            { step: 2, label: '2. Pricing & Stock', icon: Layers },
            { step: 3, label: '3. Variants Studio', icon: Palette },
            { step: 4, label: '4. Craft & Specs', icon: Ruler },
            { step: 5, label: '5. Photos & QR', icon: ImageIcon }
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                type="button"
                key={s.step}
                onClick={() => setCurrentStep(s.step as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-900 text-amber-50 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'text-stone-500 hover:bg-stone-200/60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body with Smooth Tabbed Steps */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs space-y-6">
          
          {/* STEP 1: Basic Identifiers & Categories */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Step 1: General Details & Model Identity
                  </h3>
                  <p className="text-stone-500 text-[11px]">Set the unique saree code and bilingual titles</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-mono font-bold rounded-lg text-xs">
                  Code: {code}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Model Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono font-bold text-amber-950 focus:ring-2 focus:ring-amber-800 text-sm"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Used for tracking & QR code</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-800 block mb-1">Saree Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Royal Heritage Dhakai Jamdani"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-semibold text-stone-900 focus:ring-2 focus:ring-amber-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Saree Name (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ঐতিহ্যবাহী রাজকীয় ঢাকাই জামদানি"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-semibold text-stone-900 focus:ring-2 focus:ring-amber-800 text-sm"
                />
              </div>

              {/* Saree Type & Category Hierarchy (Requirement 4) */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
                <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                  Category & Weave Type Placement
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Saree Type *</label>
                    <select
                      value={sareeType}
                      onChange={(e) => setSareeType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-semibold"
                    >
                      <option value="Dhakai Jamdani">Dhakai Jamdani</option>
                      <option value="Dhakai Muslin">Dhakai Muslin</option>
                      <option value="Tangail Taat">Tangail Taat</option>
                      <option value="Rajshahi Silk">Rajshahi Silk</option>
                      <option value="Mirpur Katan">Mirpur Katan</option>
                      <option value="Monipuri Handloom">Monipuri Handloom</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Primary Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSubcategoryId('');
                      }}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameEn} ({c.nameBn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Subcategory</label>
                    <select
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-semibold"
                    >
                      <option value="">-- No Subcategory / General --</option>
                      {currentCategory?.subcategories?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nameEn} ({s.nameBn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Story & Description (EN)</label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Story & Description (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing & Auto-Stock */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="pb-2 border-b border-stone-200">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Step 2: Pricing, Discounts & Automated Stock
                </h3>
                <p className="text-stone-500 text-[11px]">Configure selling rates and watch auto-calculated stock</p>
              </div>

              {/* Requirement 4: Flash Sale Offer Campaign Selector with Auto-discount calculation */}
              <div className="bg-gradient-to-r from-rose-900/10 via-amber-900/10 to-rose-900/5 p-4 rounded-2xl border border-rose-300 dark:border-rose-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-rose-950 dark:text-rose-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-rose-600 fill-rose-600 animate-pulse" />
                    <span>Assign Flash Sale / Special Offer Campaign (অফার নির্বাচন)</span>
                  </label>
                  {flashSaleId && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded-md uppercase">
                      Auto-discount Applied (-{flashSaleDiscount}%)
                    </span>
                  )}
                </div>
                <select
                  value={flashSaleId}
                  onChange={(e) => handleSelectOfferCampaign(e.target.value)}
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl font-semibold text-xs text-stone-900 cursor-pointer shadow-xs focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">No Active Flash Sale Offer (Standard Pricing)</option>
                  {flashSaleCampaigns.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      🔥 {camp.titleEn} ({camp.titleBn}) — {camp.discountPercent}% OFF
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Selecting an offer campaign automatically calculates and applies the discount rate to this saree, sets the sale price, and displays the offer badge directly on the website product card.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1">
                  <label className="font-bold text-stone-800 block text-xs">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-lg text-amber-950"
                  />
                  <span className="text-[10px] text-amber-800 block">Final customer payable amount</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                  <label className="font-bold text-stone-800 block text-xs">Original / Retail Price (৳)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-semibold text-lg text-stone-700"
                  />
                  <span className="text-[10px] text-stone-500 block">Strike-through reference price</span>
                </div>

                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-1">
                  <label className="font-bold text-rose-900 block text-xs">Discount Rate (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-rose-300 rounded-xl font-bold text-lg text-rose-950"
                  />
                  <span className="text-[10px] text-rose-800 block">Displayed as discount badge</span>
                </div>
              </div>

              {/* Total Stock Auto-Sum Card */}
              <div className="bg-gradient-to-r from-amber-100 via-stone-100 to-amber-50 p-4 rounded-2xl border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 text-xs uppercase tracking-wider block">
                    Calculated Total Inventory
                  </span>
                  <p className="text-[11px] text-amber-800">
                    Automatically aggregated across all {variants.length} color variants
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-amber-950 block">
                    {calculatedTotalStock} sarees
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Ready for checkout</span>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-900 w-4 h-4"
                  />
                  <span className="font-bold text-stone-800">Featured Showcase</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={isSale}
                    onChange={(e) => setIsSale(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-600 w-4 h-4"
                  />
                  <span className="font-bold text-stone-800">Flash Sale Eligible</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-900 w-4 h-4"
                  />
                  <span className="font-bold text-stone-800">New Arrival Tag</span>
                </label>
              </div>

              {/* Requirement 2: Free Delivery Control - clear selectable option "Free Delivery: Yes / No" */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-900 block">
                      Free Delivery: Yes / No
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Individually control free shipping for this saree. When set to &quot;No&quot;, regular delivery fee applies at checkout.
                    </p>
                  </div>
                  <div className="inline-flex items-center bg-white border border-stone-300 rounded-xl p-1 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsFreeDelivery(true)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isFreeDelivery
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      ✓ Yes (Free Delivery)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFreeDelivery(false)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !isFreeDelivery
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      ✕ No (Standard Fee)
                    </button>
                  </div>
                </div>
              </div>

              {/* Requirement 2 & 11: Promotional / Offer Category assignment */}
              {hiddenPromotionalCategories.length > 0 && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <label className="text-xs font-bold text-stone-900 block">
                    Promotional &amp; Offer Categories (Campaign Assignment)
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Select promotional campaigns or offers this saree belongs to. Sarees can belong to multiple promotional categories without catalog duplication.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {hiddenPromotionalCategories.map((promoCat) => {
                      const isSelected = promotionalCategoryIds.includes(promoCat.id);
                      return (
                        <button
                          key={promoCat.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setPromotionalCategoryIds(promotionalCategoryIds.filter((id) => id !== promoCat.id));
                            } else {
                              setPromotionalCategoryIds([...promotionalCategoryIds, promoCat.id]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-900 border-amber-950 text-white shadow-xs'
                              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {promoCat.nameEn}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Variants Studio (Requirement 5: "variant option that have a menbean that already get and then add variant of phone we can tap the thing we can that also like before and image and different name different good name") */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Step 3: Color & Style Variants Studio
                  </h3>
                  <p className="text-stone-500 text-[11px]">
                    Main display variant is on top. Tap &quot;+ Add New Variant&quot; to add more colors with individual SKU & photo!
                  </p>
                </div>

                {/* Primary Add Variant Action */}
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-4 py-2 bg-gradient-to-r from-stone-900 to-amber-950 hover:from-amber-900 hover:to-amber-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Variant</span>
                </button>
              </div>

              {/* Variants Stack */}
              <div className="space-y-4">
                {variants.map((variant, idx) => {
                  const isMain = idx === 0;
                  return (
                    <div
                      key={variant.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isMain
                          ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                          : 'bg-white border-stone-200 shadow-2xs hover:border-stone-300'
                      }`}
                    >
                      {/* Variant Badge & Actions Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
                        <div className="flex items-center gap-2">
                          {isMain ? (
                            <span className="px-2.5 py-1 bg-amber-900 text-amber-50 text-[10px] font-bold uppercase rounded-lg tracking-wider flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-amber-400" />
                              <span>MAIN DISPLAY VARIANT</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-stone-200 text-stone-800 text-[10px] font-bold rounded-md">
                              Variant #{idx + 1}
                            </span>
                          )}

                          <span className="text-xs font-semibold text-stone-700">
                            {variant.colorNameEn} ({variant.colorNameBn})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetAsMainVariant(idx)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-bold rounded-lg text-[10px] transition-colors"
                            >
                              Make Main Variant
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Remove Variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Variant Inputs Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Variant Swatch & Color Picker */}
                        <div className="sm:col-span-1 flex flex-col items-center gap-1">
                          <label className="text-[10px] font-bold text-stone-500 block">Swatch</label>
                          <input
                            type="color"
                            value={variant.colorHex}
                            onChange={(e) => handleUpdateVariant(idx, 'colorHex', e.target.value)}
                            className="w-9 h-9 p-0.5 rounded-xl border border-stone-300 cursor-pointer"
                            title="Pick color"
                          />
                        </div>

                        {/* Color Name EN */}
                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                            Color Name (English) *
                          </label>
                          <input
                            type="text"
                            required
                            value={variant.colorNameEn}
                            onChange={(e) => handleUpdateVariant(idx, 'colorNameEn', e.target.value)}
                            className="w-full p-2 border border-stone-300 rounded-xl font-semibold text-xs"
                            placeholder="e.g. Peacock Royal Blue"
                          />
                        </div>

                        {/* Color Name BN */}
                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                            Color Name (বাংলা) *
                          </label>
                          <input
                            type="text"
                            required
                            value={variant.colorNameBn}
                            onChange={(e) => handleUpdateVariant(idx, 'colorNameBn', e.target.value)}
                            className="w-full p-2 border border-stone-300 rounded-xl font-semibold text-xs"
                            placeholder="যেমন: ময়ূরকণ্ঠী নীল"
                          />
                        </div>

                        {/* Unique SKU */}
                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-amber-900 block mb-0.5">
                            Unique SKU Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={variant.sku}
                            onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value.toUpperCase())}
                            className="w-full p-2 border border-amber-300 bg-amber-50/70 rounded-xl font-mono font-bold text-amber-950 text-xs"
                          />
                        </div>

                        {/* Stock */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                            Stock (Units) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={variant.stock}
                            onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                            className="w-full p-2 border border-stone-300 rounded-xl font-bold text-xs"
                          />
                        </div>
                      </div>

                      {/* Variant Specific Image Upload/Selection */}
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={variant.image}
                            alt={variant.colorNameEn}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-300 shadow-2xs"
                          />
                          <span className="text-[11px] text-stone-500 font-medium">
                            Variant Photo Attached
                          </span>
                        </div>

                        <label className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-[10px] cursor-pointer flex items-center gap-1 transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, idx)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Technical Specifications & Craft */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="pb-2 border-b border-stone-200">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Step 4: Artisan Craft & Drape Specifications
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Provide authentic customer details like haat length and blouse piece
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Saree Length (Haat / Meters) *
                  </label>
                  <input
                    type="text"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="e.g. 5.5 meters (12 Haat) with Blouse Piece"
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="blouse_checkbox"
                    checked={hasBlousePiece}
                    onChange={(e) => setHasBlousePiece(e.target.checked)}
                    className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="blouse_checkbox" className="font-bold text-stone-800 cursor-pointer">
                    Includes Running Blouse Piece (০.৮ মি. ব্লাউজ পিস সহ)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fabric & Yarn Count (English)</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fabric & Yarn Count (বাংলা)</label>
                  <input
                    type="text"
                    value={fabricBn}
                    onChange={(e) => setFabricBn(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Occasion Recommendation (EN)</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Occasion Recommendation (বাংলা)</label>
                  <input
                    type="text"
                    value={occasionBn}
                    onChange={(e) => setOccasionBn(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Care Instructions (English)</label>
                  <input
                    type="text"
                    value={careInstructionsEn}
                    onChange={(e) => setCareInstructionsEn(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Care Instructions (বাংলা)</label>
                  <input
                    type="text"
                    value={careInstructionsBn}
                    onChange={(e) => setCareInstructionsBn(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Photos, QR Code Generator & Customer Live Preview */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-2 border-b border-stone-200">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Step 5: Media Gallery, Printable QR Code & Customer Preview
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Upload high-res photography, generate scannable QR tags, and preview live
                </p>
              </div>

              {/* Main Photo Uploader & Sample Selector */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
                <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                  Primary Saree Photography
                </span>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-28 h-36 rounded-2xl overflow-hidden border border-stone-300 bg-white shrink-0 shadow-sm">
                    <img
                      src={primaryImage}
                      alt="Primary Saree"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2.5 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload Saree Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-stone-500">Supports JPG, PNG, WebP</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">
                        Or pick authentic handloom photoshoot sample:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sampleImages.map((sample, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setPrimaryImage(sample.url)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                              primaryImage === sample.url
                                ? 'border-amber-900 bg-amber-100 text-amber-950 font-bold shadow-2xs'
                                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {sample.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR CODE GENERATOR SECTION (Requirement 4: "on QR I can addicted") */}
              <div className="bg-gradient-to-r from-amber-50 to-stone-50 p-4 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code ${code}`}
                      className="w-20 h-20 bg-white p-1 rounded-xl border border-amber-400 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-xl border border-stone-200 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-stone-400 animate-pulse" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-900" />
                      <h4 className="font-serif text-sm font-bold text-amber-950">
                        Printable Artisan QR Code Tag
                      </h4>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Encodes saree model code <span className="font-mono font-bold">{code}</span> and catalog URL for garment tags
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors text-xs cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR PNG</span>
                </button>
              </div>

              {/* LIVE CUSTOMER CARD PREVIEW */}
              <div className="bg-stone-900 text-white p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Customer Card Preview</span>
                  </span>
                  <span>Will display in store as shown</span>
                </div>

                <div className="max-w-xs mx-auto bg-white text-stone-900 rounded-2xl overflow-hidden shadow-xl border border-stone-200">
                  <div className="relative h-56 bg-stone-100">
                    <img
                      src={primaryImage}
                      alt={nameEn}
                      className="w-full h-full object-cover"
                    />
                    {discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] rounded-lg">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>{code}</span>
                      <span className="text-amber-800 font-bold">{sareeType}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                      {nameEn || 'Saree Title'}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium line-clamp-1">
                      {nameBn || 'শাড়ির নাম'}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-bold text-amber-950 font-mono">
                        ৳{price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        In Stock ({calculatedTotalStock})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Controls (Back / Next / Save) */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3 sticky bottom-0 bg-white pb-1">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-stone-500 hover:text-stone-800 font-semibold text-xs"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-2">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep + 1) as any)}
                  className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow-md transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 text-xs shadow-lg transition-all cursor-pointer transform hover:scale-102"
                >
                  <Check className="w-4 h-4" />
                  <span>{productToEdit ? 'Save Changes' : 'Publish Saree to Store'}</span>
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
