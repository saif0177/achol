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
  Tag
} from 'lucide-react';
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
  if (!isOpen) return null;

  // Preset curated authentic images
  const sampleImages = [
    { label: 'Crimson Dhakai Jamdani', url: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg' },
    { label: 'Royal Dhakai Muslin Ivory', url: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg' },
    { label: 'Tangail Taat Peacock Cotton', url: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg' },
    { label: 'Rajshahi Pure Mulberry Silk', url: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg' },
    { label: 'Mirpur Bridal Katan Gold', url: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg' }
  ];

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

  // Images list
  const [images, setImages] = useState<string[]>(
    productToEdit?.images || [sampleImages[0].url]
  );
  const [primaryImage, setPrimaryImage] = useState<string>(
    productToEdit?.primaryImage || sampleImages[0].url
  );

  // Variants list - each with UNIQUE code, color, image, and stock
  const [variants, setVariants] = useState<ProductVariant[]>(
    productToEdit?.variants || [
      {
        id: `v-1`,
        colorNameEn: 'Crimson Vermilion Red',
        colorNameBn: 'রক্তিম লাল',
        colorHex: '#991B1B',
        colorFamily: 'red',
        image: sampleImages[0].url,
        stock: 5,
        sku: `${code}-RD-01`
      },
      {
        id: `v-2`,
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

  // Active category subcategories
  const currentCategory = categories.find((c) => c.id === categoryId);

  // Auto-calculated total stock from all variants
  const calculatedTotalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

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

  // Variant operations
  const handleAddVariant = () => {
    const nextIdx = variants.length + 1;
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      colorNameEn: 'Emerald Green',
      colorNameBn: 'পান্না সবুজ',
      colorHex: '#059669',
      colorFamily: 'green',
      image: primaryImage,
      stock: 4,
      sku: `${code}-GR-0${nextIdx}`
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      alert('A saree must have at least one variant.');
      return;
    }
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim()) {
      alert('Please enter Product Name.');
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
      stock: calculatedTotalStock, // Automatically adjusted from variants!
      isFeatured,
      isNewArrival,
      isSale,
      isActive: true,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header (Facebook Post Creator Style) */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg font-bold">
              {productToEdit ? 'Edit Saree Listing' : 'Create New Authentic Saree Post'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Section 1: Basic Identifiers */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <span className="font-bold text-stone-900 uppercase tracking-wider block">
              1. General Details & Codes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Model Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono font-bold text-amber-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Saree Name (English) *</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Heritage Royal Dhakai Jamdani"
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Saree Name (বাংলা) *</label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: ঐতিহ্যবাহী রাজকীয় ঢাকাই জামদানি"
                className="w-full p-2 bg-white border border-stone-300 rounded-lg font-medium"
              />
            </div>

            {/* Categories & Subcategories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Primary Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryId('');
                  }}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
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
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
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

          {/* Section 2: Pricing & Auto-Stock */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <span className="font-bold text-stone-900 uppercase tracking-wider block">
              2. Pricing & Calculated Stock
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Selling Price (৳) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Original Price (৳)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div className="bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                <span className="font-bold text-amber-950 block text-[10px] uppercase">
                  Total Stock (Auto-Summed)
                </span>
                <span className="text-lg font-mono font-bold text-amber-950 block">
                  {calculatedTotalStock} sarees
                </span>
                <span className="text-[9px] text-amber-800">
                  (Sum of all variant stocks)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Saree Specifications (Requirement 14: how big, blouse piece, etc.) */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <span className="font-bold text-stone-900 uppercase tracking-wider block">
              3. Saree Technical Specifications
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Saree Length (Haat / Meters)
                </label>
                <input
                  type="text"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g. 5.5 meters (12 Haat)"
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="blouse_toggle"
                  checked={hasBlousePiece}
                  onChange={(e) => setHasBlousePiece(e.target.checked)}
                  className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="blouse_toggle" className="font-bold text-stone-800 cursor-pointer">
                  Includes Running Blouse Piece (০.৮ মি. ব্লাউজ পিস সহ)
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Fabric & Yarn Count</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Fabric (বাংলা)</label>
                <input
                  type="text"
                  value={fabricBn}
                  onChange={(e) => setFabricBn(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Care Instructions (EN)</label>
                <input
                  type="text"
                  value={careInstructionsEn}
                  onChange={(e) => setCareInstructionsEn(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Care Instructions (বাংলা)</label>
                <input
                  type="text"
                  value={careInstructionsBn}
                  onChange={(e) => setCareInstructionsBn(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Primary Image & Local File Upload (Requirement 8 & 13) */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 uppercase tracking-wider block">
              4. Primary Image (Upload Local File or Pick Sample)
            </span>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-24 h-32 rounded-xl overflow-hidden border border-stone-300 bg-white shrink-0">
                <img
                  src={primaryImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                {/* Local File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-stone-500">JPG, PNG, WebP supported</span>
                </div>

                {/* Preset sample images */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {sampleImages.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPrimaryImage(sample.url)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                        primaryImage === sample.url
                          ? 'border-amber-900 bg-amber-100 text-amber-950 font-bold'
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

          {/* Section 5: Variants Builder (Requirement 8 & 13: Unique Variant SKU Code & Stock) */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 uppercase tracking-wider block">
                  5. Color Variants & Unique SKU Codes
                </span>
                <span className="text-stone-500 text-[11px]">
                  Every color variant has its own unique SKU code and stock count.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-stone-900 hover:bg-amber-900 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, idx) => (
                <div
                  key={variant.id}
                  className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                        Color Name (EN)
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.colorNameEn}
                        onChange={(e) => handleUpdateVariant(idx, 'colorNameEn', e.target.value)}
                        className="w-full p-1.5 border border-stone-300 rounded-md font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                        Color Name (বাংলা)
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.colorNameBn}
                        onChange={(e) => handleUpdateVariant(idx, 'colorNameBn', e.target.value)}
                        className="w-full p-1.5 border border-stone-300 rounded-md font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-amber-900 block mb-0.5">
                        Unique Variant SKU *
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.sku}
                        onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value.toUpperCase())}
                        className="w-full p-1.5 border border-amber-300 bg-amber-50 rounded-md font-mono font-bold text-amber-950"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-0.5">
                        Variant Stock *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={variant.stock}
                        onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                        className="w-full p-1.5 border border-stone-300 rounded-md font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-3 sm:pt-0">
                      <input
                        type="color"
                        value={variant.colorHex}
                        onChange={(e) => handleUpdateVariant(idx, 'colorHex', e.target.value)}
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5 shrink-0"
                      />
                      <label className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-bold cursor-pointer shrink-0">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, idx)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                        title="Remove Variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Story Descriptions */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 uppercase tracking-wider block">
              6. Heritage Descriptions
            </span>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Description (English)</label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Description (বাংলা)</label>
              <textarea
                rows={3}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold shadow-md cursor-pointer"
            >
              Save Saree Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
