import React, { useState } from 'react';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  ExternalLink,
  Ban
} from 'lucide-react';
import { Order, Language, OrderStatus } from '../../types';
import { translations } from '../../i18n/translations';
import { store } from '../../services/store';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  language,
  initialOrderId = ''
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState(initialOrderId || 'ANC-84920');
  const [searchedOrders, setSearchedOrders] = useState<Order[]>(
    store.getOrderByIdOrPhone(initialOrderId || 'ANC-84920')
  );
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    searchedOrders[0] || null
  );
  const [cancelMessage, setCancelMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCancelMessage(null);
    const results = store.getOrderByIdOrPhone(searchQuery);
    setSearchedOrders(results);
    setActiveOrder(results[0] || null);
  };

  const handleCancelOrder = (orderId: string) => {
    if (!window.confirm(t.cancelOrderConfirm)) return;
    const res = store.cancelOrder(orderId, 'Customer requested via tracking portal');
    setCancelMessage({ text: res.message, success: res.success });
    if (res.success && activeOrder) {
      setActiveOrder({ ...activeOrder, orderStatus: 'cancelled' });
    }
  };

  const steps: { key: OrderStatus; labelEn: string; labelBn: string; desc: string }[] = [
    { key: 'placed', labelEn: 'Order Placed', labelBn: 'অর্ডার গৃহিত', desc: 'Order logged in our artisan handloom records' },
    { key: 'confirmed', labelEn: 'Confirmed', labelBn: 'কনফার্মড', desc: 'Weaver verified piece & ready for packaging' },
    { key: 'processing', labelEn: 'Inspection', labelBn: 'কোয়ালিটি যাচাই', desc: 'Fabric & zari inspection at Dhaka center' },
    { key: 'packed', labelEn: 'Packed', labelBn: 'প্যাকেজিং সম্পন্ন', desc: 'Placed in traditional protective wooden/box wrap' },
    { key: 'courier_shipped', labelEn: 'Steadfast Courier', labelBn: 'স্টিডফাস্ট কুরিয়ার', desc: 'Dispatched to Steadfast hub for shipment' },
    { key: 'out_for_delivery', labelEn: 'Out for Delivery', labelBn: 'ডেলিভারির জন্য বের হয়েছে', desc: 'Rider is on the way to your doorstep' },
    { key: 'delivered', labelEn: 'Delivered', labelBn: 'সফলভাবে ডেলিভারড', desc: 'Received & inspected by customer' }
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    const statusOrder: OrderStatus[] = [
      'placed',
      'confirmed',
      'processing',
      'packed',
      'courier_shipped',
      'out_for_delivery',
      'delivered'
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  // Cancellation availability: allowed only for 'placed' or 'confirmed'
  const isCancellable =
    activeOrder &&
    (activeOrder.orderStatus === 'placed' || activeOrder.orderStatus === 'confirmed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-none sm:rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-screen sm:max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-900" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              {t.trackOrderTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.enterOrderIdOrPhone}
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors shrink-0"
            >
              {t.searchOrderBtn}
            </button>
          </form>

          {/* If no order found */}
          {!activeOrder && (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200/80 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="font-serif text-sm font-bold text-stone-800">
                {language === 'bn' ? 'অর্ডার খুঁজে পাওয়া যায়নি' : 'No Order Found'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'অনুগ্রহ করে সঠিক অর্ডার কোড (যেমন: ANC-84920) অথবা ফোন নম্বর দিয়ে চেষ্টা করুন।'
                  : 'Please check your Order ID (e.g. ANC-84920) or mobile phone number.'}
              </p>
            </div>
          )}

          {/* Active Order Card */}
          {activeOrder && (
            <div className="space-y-6">
              
              {/* Order Meta Header */}
              <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-950">
                      #{activeOrder.id}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      · {new Date(activeOrder.orderDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {activeOrder.orderStatus === 'cancelled' ? (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 uppercase">
                        Cancelled
                      </span>
                    ) : activeOrder.orderStatus === 'delivered' ? (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase">
                        Delivered
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 uppercase">
                        In Transit / Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-md bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 overflow-hidden">
                        <span className="font-mono text-[10px] text-amber-900 font-semibold block">
                          #{item.code}
                        </span>
                        <h4 className="font-semibold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-stone-500 text-[11px]">
                          Color: {item.color} · Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-stone-900">
                        ৳{item.total.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                  <span>Payable via Cash on Delivery:</span>
                  <span className="font-mono text-amber-950 text-sm">
                    ৳{activeOrder.finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Steadfast Courier Integration Card */}
              {activeOrder.courier && activeOrder.orderStatus !== 'cancelled' && (
                <div className="p-4 bg-amber-900/5 rounded-xl border border-amber-900/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-900" />
                      <span className="font-semibold text-amber-950">
                        {activeOrder.courier.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      ETA: {activeOrder.courier.estimatedDelivery}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase">
                        {t.consignmentId}
                      </span>
                      <span>{activeOrder.courier.consignmentId}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase">
                        {t.trackingCode}
                      </span>
                      <span>{activeOrder.courier.trackingCode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Progress Timeline */}
              {activeOrder.orderStatus !== 'cancelled' ? (
                <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-stone-900">
                    {t.orderTimeline}
                  </h3>

                  <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
                    {steps.map((st, i) => {
                      const state = getStepStatus(st.key, activeOrder.orderStatus);
                      return (
                        <div key={i} className="flex items-start gap-4 relative">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                              state === 'completed'
                                ? 'bg-emerald-700 text-white'
                                : state === 'current'
                                ? 'bg-amber-900 text-white ring-4 ring-amber-100'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <span>{i + 1}</span>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs">
                            <span
                              className={`font-semibold block ${
                                state === 'current'
                                  ? 'text-amber-950 text-sm'
                                  : state === 'completed'
                                  ? 'text-stone-900'
                                  : 'text-stone-400'
                              }`}
                            >
                              {language === 'bn' ? st.labelBn : st.labelEn}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {st.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-1">
                  <span className="font-bold block">Status: Cancelled</span>
                  <p>Reason: {activeOrder.cancellationReason || 'Cancelled upon customer request.'}</p>
                </div>
              )}

              {/* Cancellation Option */}
              {activeOrder.orderStatus !== 'cancelled' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-800 block">
                        Need to Cancel this Order?
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {isCancellable
                          ? 'Cancellation is available before dispatch to courier.'
                          : t.cancelNotAllowedNotice}
                      </span>
                    </div>

                    {isCancellable && (
                      <button
                        onClick={() => handleCancelOrder(activeOrder.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{t.cancelOrder}</span>
                      </button>
                    )}
                  </div>

                  {cancelMessage && (
                    <p
                      className={`text-[11px] font-medium pt-1 ${
                        cancelMessage.success ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {cancelMessage.text}
                    </p>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
