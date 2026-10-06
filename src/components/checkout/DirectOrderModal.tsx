import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Sparkles,
  ArrowRight,
  Phone,
  User,
  MapPin,
  Clock
} from 'lucide-react';
import { Product, ProductVariant, Language, Order, Address } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialVariant?: ProductVariant;
  language: Language;
  onOrderSuccess: (order: Order) => void;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  initialVariant,
  language,
  onOrderSuccess
}) => {
  const t = translations[language];

  // Selected Variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    initialVariant || product.variants[0] || {
      id: 'default',
      colorNameEn: 'Original',
      colorNameBn: 'আসল রঙ',
      colorHex: '#991B1B',
      colorFamily: 'red',
      image: product.primaryImage,
      stock: product.stock,
      sku: product.code
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isInsideDhaka, setIsInsideDhaka] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = product.price * quantity;
  const deliveryFee = 0; // 100% Free Delivery across Bangladesh!
  const finalTotal = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 11) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে ১১ সংখ্যার সঠিক মোবাইল নম্বর লিখুন।' : 'Please enter a valid 11-digit mobile phone number.');
      return;
    }

    if (!fullAddress.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে বিস্তারিত ডেলিভারির ঠিকানা লিখুন।' : 'Please enter your complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      recipientName: customerName.trim(),
      phone: customerPhone.trim(),
      division: 'Nationwide',
      district: 'Nationwide',
      area: 'Home Delivery',
      fullAddress: fullAddress.trim(),
      isInsideDhaka: true
    };

    const newOrder = store.placeOrder({
      customerPhone: customerPhone.trim(),
      customerName: customerName.trim(),
      items: [
        {
          productId: product.id,
          variantId: selectedVariant.id,
          name: language === 'bn' ? product.nameBn : product.nameEn,
          code: product.code,
          color: language === 'bn' ? selectedVariant.colorNameBn : selectedVariant.colorNameEn,
          image: selectedVariant.image || product.primaryImage,
          quantity,
          unitPrice: product.price,
          total: subtotal
        }
      ],
      subtotal,
      discount: 0,
      deliveryFee: 0,
      finalTotal,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      shippingAddress,
      isGift: false,
      customerNote: deliveryNote ? `[Direct 1-Click Order] ${deliveryNote}` : '[Direct 1-Click Order]'
    });

    setIsSubmitting(false);
    onOrderSuccess(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Direct Order Box */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-[96vh] flex flex-col border border-stone-200">
        
        {/* Fabrilife Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight font-serif flex items-center gap-1.5">
                <span>{language === 'bn' ? 'সহজ ১-ক্লিক অর্ডার ফর্ম' : 'Express 1-Click Order Form'}</span>
                <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded font-sans font-bold">
                  COD
                </span>
              </h2>
              <p className="text-[11px] text-stone-300">
                {language === 'bn'
                  ? 'কোনো অ্যাকাউন্ট খোলার ঝামেলা ছাড়াই সরাসরি অর্ডার করুন'
                  : 'Order directly with Cash on Delivery in 30 seconds'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Selected Product Summary Card */}
          <div className="flex gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <img
              src={selectedVariant.image || product.primaryImage}
              alt={product.nameEn}
              className="w-16 h-20 object-cover rounded-lg bg-white shrink-0 border border-stone-200"
            />
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-amber-900 font-bold">
                    #{product.code}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {product.sareeType}
                  </span>
                </div>
                <h4 className="font-semibold text-stone-900 text-xs truncate">
                  {language === 'bn' ? product.nameBn : product.nameEn}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 pt-0.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-stone-300"
                    style={{ backgroundColor: selectedVariant.colorHex }}
                  />
                  <span>{language === 'bn' ? selectedVariant.colorNameBn : selectedVariant.colorNameEn}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-sm font-bold text-stone-900 font-mono">
                  ৳{product.price.toLocaleString()}
                </span>
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded bg-white text-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 py-0.5 hover:bg-stone-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock || 5, q + 1))}
                    className="px-2 py-0.5 hover:bg-stone-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Switcher */}
          {product.variants.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-stone-700 font-semibold block text-[11px] uppercase tracking-wider">
                {language === 'bn' ? 'রঙ নির্বাচন করুন:' : 'Select Color:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                      selectedVariant.id === v.id
                        ? 'border-amber-900 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-900'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300"
                      style={{ backgroundColor: v.colorHex }}
                    />
                    <span>{language === 'bn' ? v.colorNameBn : v.colorNameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Free Nationwide Delivery Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'bn'
                  ? 'সারাদেশে সম্পূর্ণ ফ্রি ডেলিভারি (৳০) · ক্যাশ অন ডেলিভারি'
                  : '100% Free Delivery Nationwide (৳0) · Cash on Delivery'}
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-700">FREE</span>
          </div>

          {/* Customer Inputs */}
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: তাসনিম রহমান' : 'e.g. Samira Khan'}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'} *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {language === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা' : 'Complete Delivery Address'} *
              </label>
              <textarea
                rows={2}
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'বাড়ি নং, রোড নং, এলাকা / গ্রাম, থানা ও জেলা...'
                    : 'House #, Road #, Sector / Area, District...'
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-rose-600 text-xs font-medium bg-rose-50 p-2 rounded-lg">
              {errorMessage}
            </p>
          )}

          {/* Total Calculation Row */}
          <div className="p-3 bg-stone-100 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{t.subtotal}:</span>
              <span className="font-mono">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{t.deliveryCharge}:</span>
              <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-1.5 font-serif">
              <span>{t.totalPayable}:</span>
              <span className="font-mono text-base text-amber-950">৳{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Big Green / Amber Fabrilife CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>
              {language === 'bn'
                ? 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)'
                : 'Confirm Order (Cash on Delivery)'}
            </span>
          </button>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>পণ্য দেখে টাকা পরিশোধ</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-900" />
              <span>স্টিডফাস্ট দ্রুত ডেলিভারি</span>
            </span>
          </div>

        </form>

      </div>
    </div>
  );
};
