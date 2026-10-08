import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  ShieldCheck,
  MapPin,
  Tag
} from 'lucide-react';
import { Product, ProductVariant, Language, Address, Order } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';
import { MapLocationPicker } from './MapLocationPicker';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant?: ProductVariant;
  initialVariant?: ProductVariant;
  language: Language;
  onSuccess?: (orderId: string) => void;
  onOrderSuccess?: (order: Order) => void;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariant: propSelectedVariant,
  initialVariant: propInitialVariant,
  language,
  onSuccess,
  onOrderSuccess
}) => {
  const initialVariant = propInitialVariant || propSelectedVariant;
  const t = translations[language];
  const activeCustomer = store.getActiveCustomer();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    initialVariant || product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(activeCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(activeCustomer?.phone || '');
  const [fullAddress, setFullAddress] = useState(activeCustomer?.savedAddresses[0]?.fullAddress || '');
  const [isInsideDhaka, setIsInsideDhaka] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pinnedCoords, setPinnedCoords] = useState<{ lat?: number; lng?: number }>({});

  // Coupon state (Requirement 10)
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');

  // Payment methods (Requirement 1: COD default/recommended, other methods available)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket' | 'card'>('cod');
  const [mfsPhone, setMfsPhone] = useState('');
  const [mfsTrxId, setMfsTrxId] = useState('');

  if (!isOpen) return null;

  const subtotal = product.price * quantity;

  // Requirement 2: Free Delivery Control
  const isFreeDelivery = store.isOrderFreeDelivery([{ productId: product.id }], appliedCoupon, subtotal);
  const deliveryFee = isFreeDelivery ? 0 : (isInsideDhaka ? 70 : 130);
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = store.validateCoupon(couponInput, subtotal, [{ productId: product.id }]);
    if (res.valid) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      setCouponDiscount(res.discount);
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

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
      division: isInsideDhaka ? 'Dhaka' : 'Outside Dhaka',
      district: isInsideDhaka ? 'Dhaka' : 'Regional Hub',
      area: 'Home Delivery',
      fullAddress: fullAddress.trim(),
      isInsideDhaka,
      lat: pinnedCoords.lat,
      lng: pinnedCoords.lng
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
      discount: couponDiscount,
      deliveryFee,
      finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      shippingAddress,
      isGift: false,
      appliedCoupon: appliedCoupon || undefined,
      customerNote: deliveryNote ? `[Direct Order] ${deliveryNote}` : '[Direct Order]',
      paymentDetails: (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') ? {
        bkashPhone: mfsPhone.trim() || customerPhone.trim(),
        transactionId: mfsTrxId.trim() || 'VERIFIED-MFS',
        isVerified: true
      } : (paymentMethod === 'card') ? {
        transactionId: `SSL-${Date.now().toString().slice(-6)}`,
        isVerified: true
      } : undefined
    });

    // Seamless loyalty & profile sync
    let account = store.getCustomerAccount(customerPhone.trim());
    if (!account) {
      account = {
        phone: customerPhone.trim(),
        name: customerName.trim(),
        isVerified: true,
        loyaltyPoints: Math.floor(finalTotal / 100),
        savedAddresses: [shippingAddress],
        wishlistProductIds: [],
        orderIds: [newOrder.id]
      };
      store.saveCustomerAccount(account);
    } else {
      if (!account.orderIds.includes(newOrder.id)) {
        account.orderIds.unshift(newOrder.id);
      }
      account.loyaltyPoints = (account.loyaltyPoints || 0) + Math.floor(finalTotal / 100);
      store.saveCustomerAccount(account);
    }

    setIsSubmitting(false);
    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }
    if (onSuccess) {
      onSuccess(newOrder.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative border border-stone-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-4 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              {language === 'bn' ? 'দ্রুত ১-ক্লিক অর্ডার' : 'Instant 1-Click Checkout'}
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            {language === 'bn' ? 'সহজেই শাড়িটি অর্ডার করুন' : 'Order Handloom Saree'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Selected Product Card Summary */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <img
              src={selectedVariant.image || product.primaryImage}
              alt={product.nameEn}
              className="w-14 h-18 object-cover rounded-xl bg-stone-200 shrink-0 border border-stone-300"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <span className="font-mono text-[10px] text-amber-900 font-bold block">
                #{product.code} · {product.sareeType}
              </span>
              <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h4>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-sm font-bold text-amber-950">
                  ৳{product.price.toLocaleString()}
                </span>
                
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
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

          {/* Payment Method Selection (Requirement 1: COD default/recommended, others available) */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <label className="text-stone-800 font-bold block text-xs">
              {language === 'bn' ? 'মূল্য পরিশোধের পদ্ধতি (Payment Method):' : 'Payment Method:'}
            </label>
            
            {/* COD Option */}
            <div
              onClick={() => setPaymentMethod('cod')}
              className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'cod'
                  ? 'border-amber-900 bg-amber-50/70 text-amber-950'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-amber-900 bg-amber-900' : 'border-stone-300'}`}>
                  {paymentMethod === 'cod' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className="font-bold text-xs">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (প্রস্তাবিত)' : 'Cash on Delivery (Recommended)'}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                {language === 'bn' ? 'দেখে পরিশোধ' : 'Inspect First'}
              </span>
            </div>

            {/* Other Payment Methods */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {(['bkash', 'nagad', 'rocket', 'card'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] capitalize cursor-pointer transition-all ${
                    paymentMethod === m
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {m === 'bkash' ? 'bKash' : m === 'nagad' ? 'Nagad' : m === 'rocket' ? 'Rocket' : 'Card'}
                </button>
              ))}
            </div>

            {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <p className="text-[11px] text-stone-600">
                  {paymentMethod.toUpperCase()} মার্চেন্ট নম্বর: <strong>{paymentMethod === 'rocket' ? '01712-444888-9' : '01712-444888'}</strong>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mfsPhone}
                    onChange={(e) => setMfsPhone(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="TrxID (e.g. 9B8C7A)"
                    value={mfsTrxId}
                    onChange={(e) => setMfsTrxId(e.target.value.toUpperCase())}
                    className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono uppercase font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Coupon Input during order (Requirement 10) */}
          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-800" />
              <span>{language === 'bn' ? 'কুপন কোড ব্যবহার করুন' : 'Apply Coupon'}</span>
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="e.g. EID15"
                className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono uppercase font-bold"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3 py-1.5 bg-stone-900 text-white font-bold rounded-lg hover:bg-amber-900 cursor-pointer text-xs"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[10px] text-rose-600">⚠️ {couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-emerald-700">✓ {couponSuccess}</p>}
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-stone-700 font-semibold">
                  {language === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা' : 'Complete Delivery Address'} *
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-amber-800" />
                  <span>{language === 'bn' ? 'ম্যাপে ঠিকানা দিন' : 'Pin on Map'}</span>
                </button>
              </div>
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

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon ({appliedCoupon}):</span>
                <span className="font-mono">-৳{couponDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>{t.deliveryCharge}:</span>
              <span className="font-mono font-bold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700">৳0 ({language === 'bn' ? 'ফ্রি ডেলিভারি' : 'FREE'})</span>
                ) : (
                  `৳${deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-1.5 font-serif">
              <span>{t.totalPayable}:</span>
              <span className="font-mono text-base text-amber-950">৳{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>
              {paymentMethod === 'cod'
                ? (language === 'bn' ? 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)' : 'Confirm Order (Cash on Delivery)')
                : (language === 'bn' ? `অর্ডার কনফার্ম করুন (${paymentMethod.toUpperCase()})` : `Confirm Order (${paymentMethod.toUpperCase()})`)}
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

      {/* Google Maps Location Picker Modal */}
      {showMapPicker && (
        <MapLocationPicker
          language={language}
          initialAddress={fullAddress}
          onSelectCoordinates={(lat, lng, addressDesc, dist) => {
            setPinnedCoords({ lat, lng });
            setFullAddress(addressDesc);
            if (dist) {
              setIsInsideDhaka(dist.toLowerCase().includes('dhaka'));
            }
          }}
          onClose={() => setShowMapPicker(false)}
        />
      )}
    </div>
  );
};
