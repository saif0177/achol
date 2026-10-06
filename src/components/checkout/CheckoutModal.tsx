import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Gift,
  Phone,
  User,
  Truck,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import { CartItem, Language, Address, Order } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';
import { MapLocationPicker } from './MapLocationPicker';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  appliedDiscount: number;
  appliedCodeName: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  language,
  appliedDiscount,
  appliedCodeName,
  onOrderSuccess
}) => {
  const t = translations[language];

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('01712345678');
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Delivery
  const [fullAddress, setFullAddress] = useState('House 12, Road 4, Sector 3, Uttara, Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pinnedCoords, setPinnedCoords] = useState<{ lat?: number; lng?: number; desc?: string }>({});

  // Loyalty Points (Requirement: Loyalty Points Redemption)
  const [availableLoyaltyPoints, setAvailableLoyaltyPoints] = useState<number>(350);
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = useState<boolean>(false);

  // Gift Order
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [giftRecipientName, setGiftRecipientName] = useState('');
  const [giftRecipientPhone, setGiftRecipientPhone] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  // Payment: Default Cash on Delivery (Requirement 11)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [isPlacing, setIsPlacing] = useState(false);

  // Check if returning customer & load loyalty points
  useEffect(() => {
    if (customerPhone && customerPhone.length >= 11) {
      const existingAccount = store.getCustomerAccount(customerPhone);
      if (existingAccount) {
        setCustomerName(existingAccount.name || 'Tasnim Rahman');
        setIsPhoneVerified(true);
        setAvailableLoyaltyPoints(existingAccount.loyaltyPoints || 350);
        if (existingAccount.savedAddresses.length > 0) {
          const defaultAddr = existingAccount.savedAddresses[0];
          setFullAddress(defaultAddr.fullAddress);
        }
      } else {
        setAvailableLoyaltyPoints(350);
      }
    }
  }, [customerPhone]);

  if (!isOpen) return null;

  // Subtotal & Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Delivery Fee is ALWAYS 0 nationwide (Requirement 11: Free delivery across Bangladesh)
  const deliveryFee = 0;

  // Loyalty Points discount calculation
  const pointsDiscount = redeemLoyaltyPoints ? Math.min(availableLoyaltyPoints, subtotal - appliedDiscount) : 0;
  const finalTotal = Math.max(0, subtotal - appliedDiscount - pointsDiscount + deliveryFee);
  const pointsEarned = Math.floor(subtotal / 100);

  // OTP handlers
  const handleSendOtp = () => {
    if (!customerPhone || customerPhone.length < 11) {
      setOtpError('Please enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }
    setShowOtpField(true);
    setOtpError('');
  };

  const handleVerifyOtp = () => {
    if (otpInput === '1234' || otpInput.length >= 4) {
      setIsPhoneVerified(true);
      setShowOtpField(false);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please enter 1234 for testing.');
    }
  };

  const handleAutofillDemoOtp = () => {
    setOtpInput('1234');
    setIsPhoneVerified(true);
    setShowOtpField(false);
    setOtpError('');
  };

  // Place Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!isPhoneVerified) {
      alert('Please verify your mobile phone number with OTP first.');
      return;
    }

    if (!fullAddress.trim()) {
      alert('Please enter your complete delivery address.');
      return;
    }

    setIsPlacing(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      recipientName: isGiftOrder ? giftRecipientName : customerName,
      phone: isGiftOrder ? giftRecipientPhone : customerPhone,
      division: district,
      district: district,
      area: 'Local Hub',
      fullAddress: fullAddress.trim(),
      isInsideDhaka: district.toLowerCase().includes('dhaka'),
      lat: pinnedCoords.lat,
      lng: pinnedCoords.lng
    };

    const newOrder = store.placeOrder({
      customerPhone: customerPhone.trim(),
      customerName: customerName.trim(),
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.nameEn,
        code: item.code,
        color: item.colorNameEn,
        image: item.image,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      subtotal,
      discount: appliedDiscount,
      pointsDiscount: pointsDiscount,
      redeemedPoints: redeemLoyaltyPoints ? pointsDiscount : 0,
      pointsEarned: pointsEarned,
      deliveryFee: 0, // Free Delivery
      finalTotal,
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress,
      isGift: isGiftOrder,
      giftDetails: isGiftOrder
        ? {
            recipientName: giftRecipientName,
            recipientPhone: giftRecipientPhone,
            message: giftMessage
          }
        : undefined,
      appliedCoupon: appliedCodeName || undefined,
      customerNote: deliveryNote.trim() || undefined
    });

    setIsPlacing(false);
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-none sm:rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-screen sm:max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-900" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              {language === 'bn' ? 'নিরাপদ চেকআউট' : 'Secure Express Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Nationwide Delivery Banner */}
        <div className="bg-emerald-700 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-200" />
            <span>
              {language === 'bn'
                ? '🎉 অভিনন্দন! আপনার অর্ডারে সারাদেশে সম্পূর্ণ ফ্রি হোম ডেলিভারি প্রযোজ্য (৳০ ডেলিভারি চার্জ)।'
                : '🎉 100% Free Nationwide Home Delivery included on this order (৳0 Delivery Fee).'}
            </span>
          </div>
          <span className="font-bold uppercase tracking-wider bg-emerald-800/80 px-2 py-0.5 rounded text-[10px]">
            Free Shipping
          </span>
        </div>

        {/* 2-Column Form Body */}
        <form
          onSubmit={handlePlaceOrder}
          className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Info */}
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <User className="w-4 h-4 text-amber-900" />
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  {t.step1Customer}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tasnim Rahman"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {t.phoneNumber} *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setIsPhoneVerified(false);
                      }}
                      placeholder="01XXXXXXXXX"
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                    {!isPhoneVerified && !showOtpField && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors shrink-0 cursor-pointer"
                      >
                        {t.sendOtp}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* OTP Field if needed */}
              {showOtpField && !isPhoneVerified && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2 text-xs">
                  <p className="text-amber-900 font-medium">
                    {t.otpSentTo.replace('{phone}', customerPhone)}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="1234"
                      className="w-28 px-3 py-1.5 text-center font-mono text-sm bg-white border border-stone-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-3.5 py-1.5 bg-amber-900 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      {t.verifyOtp}
                    </button>
                    <button
                      type="button"
                      onClick={handleAutofillDemoOtp}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                    >
                      {t.quickVerifyOtp}
                    </button>
                  </div>
                  {otpError && <p className="text-rose-600 text-[11px]">{otpError}</p>}
                </div>
              )}

              {isPhoneVerified && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.phoneVerified} ({customerPhone})</span>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Address (Nationwide Free) */}
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Truck className="w-4 h-4 text-amber-900" />
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  {t.step2Delivery}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {language === 'bn' ? 'জেলা / অঞ্চল (District)' : 'District / City'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Dhaka, Chittagong, Sylhet, Rajshahi"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-700 font-semibold">
                      {language === 'bn' ? 'সম্পূর্ণ ঠিকানা' : 'Complete Delivery Address'} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'bn' ? 'গুগল ম্যাপে ঠিকানা পিন করুন' : 'Pinpoint on Google Map'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="House, Road, Area, Sector, Landmarks..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />

                  {pinnedCoords.lat && (
                    <div className="mt-1.5 flex items-center gap-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>
                        {language === 'bn' ? 'গুগল ম্যাপস লোকেশন ভেরিফাইড' : 'Google Maps Location Verified'}: ({pinnedCoords.lat.toFixed(4)}, {pinnedCoords.lng?.toFixed(4)})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Note */}
              <div className="pt-1 text-xs">
                <label className="block text-stone-600 mb-1">{t.orderNotes}</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Please call before arriving or deliver in afternoon"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Payment Method: Cash on Delivery Recommended (Requirement 11) */}
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-3">
              <label className="font-serif text-sm font-bold text-stone-900 block">
                {language === 'bn' ? 'মূল্য পরিশোধের পদ্ধতি (পেমেন্ট)' : 'Payment Method'}
              </label>

              {/* Cash On Delivery (Preselected & Recommended) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className="p-3.5 rounded-xl border-2 border-amber-900 bg-amber-50/50 flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-900 flex items-center justify-center bg-amber-900">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-950 flex items-center gap-2">
                      <span>{t.codRecommended}</span>
                      <span className="bg-amber-600 text-stone-950 px-2 py-0.2 rounded text-[10px] font-bold uppercase">
                        {language === 'bn' ? 'প্রস্তাবিত' : 'Recommended'}
                      </span>
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5">
                      {language === 'bn'
                        ? 'পার্সেল খুলে শাড়ি চেক করে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।'
                        : 'Unbox & inspect your saree before handing payment to Steadfast rider.'}
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-stone-500">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50 text-pink-900'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  bKash Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50 text-orange-900'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Nagad Payment
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Loyalty Redemption (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4 sticky top-20">
              <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                {language === 'bn' ? 'অর্ডার বিবরণ' : 'Order Summary'}
              </h3>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="py-2 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-10 h-12 rounded object-cover border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </h4>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {item.code} | {item.colorNameEn} x{item.quantity}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-xs text-stone-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Loyalty Points Redemption Box (Requirement: Loyalty Points System) */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Award className="w-4 h-4 text-amber-800" />
                    <span>{language === 'bn' ? 'লয়্যালটি রিওয়ার্ড পয়েন্ট' : 'Redeem Loyalty Points'}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-900">
                    {availableLoyaltyPoints} PTS
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={redeemLoyaltyPoints}
                    onChange={(e) => setRedeemLoyaltyPoints(e.target.checked)}
                    className="rounded border-stone-300 text-amber-900 focus:ring-amber-900 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-stone-800 font-semibold">
                    {language === 'bn'
                      ? `৳${Math.min(availableLoyaltyPoints, subtotal).toLocaleString()} ছাড়ের জন্য পয়েন্ট ব্যবহার করুন`
                      : `Apply ৳${Math.min(availableLoyaltyPoints, subtotal).toLocaleString()} discount using points`}
                  </span>
                </label>

                <div className="text-[10px] text-stone-500">
                  {language === 'bn'
                    ? `এই ক্রয়ে আপনি পাবেন +${pointsEarned} পয়েন্ট!`
                    : `You will earn +${pointsEarned} loyalty points on this order!`}
                </div>
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>{t.subtotal}</span>
                  <span className="font-mono font-medium">৳{subtotal.toLocaleString()}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{language === 'bn' ? 'বিশেষ ছাড়' : 'Discount'} ({appliedCodeName})</span>
                    <span className="font-mono">-৳{appliedDiscount.toLocaleString()}</span>
                  </div>
                )}

                {redeemLoyaltyPoints && pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>Loyalty Points Discount</span>
                    <span className="font-mono">-৳{pointsDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>{t.deliveryCharge}</span>
                  <span className="font-mono font-bold text-emerald-700">৳0 (FREE)</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>{t.totalPayable}</span>
                  <span className="font-serif text-xl font-bold text-stone-900">
                    ৳{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPlacing}
                className="w-full py-3.5 bg-stone-900 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPlacing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>
                      {language === 'bn'
                        ? 'অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)'
                        : 'Confirm Order (Cash on Delivery)'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[10px] text-stone-400 text-center space-y-1">
                <p>🔒 256-bit encrypted checkout · 100% Authentic Handloom Guarantee</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Google Maps Location Picker Modal */}
      {showMapPicker && (
        <MapLocationPicker
          language={language}
          initialAddress={fullAddress}
          onSelectCoordinates={(lat, lng, addressDesc, dist) => {
            setPinnedCoords({ lat, lng, desc: addressDesc });
            setFullAddress(addressDesc);
            if (dist) setDistrict(dist);
          }}
          onClose={() => setShowMapPicker(false)}
        />
      )}
    </div>
  );
};
