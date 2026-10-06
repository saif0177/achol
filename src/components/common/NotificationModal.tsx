import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Truck,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
  Package,
  Clock,
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { AppNotification, Language } from '../../types';
import { store } from '../../services/store';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenOrderTracking: (orderId?: string) => void;
  onOpenFlashSale: () => void;
  onOpenAccount: () => void;
  onNavigateShop: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenOrderTracking,
  onOpenFlashSale,
  onOpenAccount,
  onNavigateShop
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'order' | 'offer' | 'reward'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>(() => store.getNotifications());

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    store.markNotificationRead(id);
    setNotifications(store.getNotifications());
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead();
    setNotifications(store.getNotifications());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.deleteNotification(id);
    setNotifications(store.getNotifications());
  };

  const handleClearAll = () => {
    store.clearAllNotifications();
    setNotifications([]);
  };

  const handleNotificationAction = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    onClose();

    if (notif.actionType === 'track_order') {
      onOpenOrderTracking(notif.orderId);
    } else if (notif.actionType === 'flash_sale') {
      onOpenFlashSale();
    } else if (notif.actionType === 'account') {
      onOpenAccount();
    } else if (notif.actionType === 'shop') {
      onNavigateShop();
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <Truck className="w-4 h-4 text-emerald-700" />;
      case 'offer':
        return <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />;
      case 'reward':
        return <Award className="w-4 h-4 text-amber-700" />;
      case 'stock':
        return <Sparkles className="w-4 h-4 text-purple-700" />;
      default:
        return <Bell className="w-4 h-4 text-stone-700" />;
    }
  };

  const getTypeBadgeClass = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'offer':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'reward':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'stock':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full sm:max-w-md bg-[#FAF8F5] h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden border-stone-200 sm:border animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  {language === 'bn' ? 'বিজ্ঞপ্তি ও আপডেট' : 'Notifications'}
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold">
                    {unreadCount} {language === 'bn' ? 'নতুন' : 'new'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {language === 'bn' ? 'অর্ডার ট্র্যাকিং, বিশেষ অফার ও রিওয়ার্ড' : 'Live order tracking, offers & perks'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Actions */}
        <div className="bg-white px-4 py-2.5 border-b border-stone-200 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amber-950 text-amber-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'সবগুলো' : 'All'} ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('order')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === 'order'
                  ? 'bg-amber-950 text-amber-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'অর্ডার' : 'Orders'}
            </button>
            <button
              onClick={() => setActiveFilter('offer')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === 'offer'
                  ? 'bg-amber-950 text-amber-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'অফার' : 'Offers'}
            </button>
            <button
              onClick={() => setActiveFilter('reward')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === 'reward'
                  ? 'bg-amber-950 text-amber-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'bn' ? 'পয়েন্টস' : 'Rewards'}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পড়া হয়েছে' : 'Read All'}</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-200/80 p-2 sm:p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-200/80 text-stone-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="font-serif text-base font-bold text-stone-700">
                {language === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No Notifications'}
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {language === 'bn'
                  ? 'আপনার নতুন অর্ডার বা বিশেষ উৎসবের অফার আসলে এখানে নোটিফিকেশন পাবেন।'
                  : 'New updates on your handloom saree orders, discounts, and rewards will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationAction(notif)}
                className={`group p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  !notif.isRead
                    ? 'bg-white border-amber-900/30 shadow-xs hover:border-amber-900'
                    : 'bg-stone-50/80 border-stone-200/70 hover:bg-white text-stone-600'
                }`}
              >
                {/* Unread indicator dot */}
                {!notif.isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-600 ring-4 ring-amber-100" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getTypeBadgeClass(
                      notif.type
                    )}`}
                  >
                    {getTypeIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-xs font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                        {language === 'bn' ? notif.titleBn : notif.titleEn}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {language === 'bn' ? notif.messageBn : notif.messageEn}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-stone-100 text-[11px]">
                      <span className="text-stone-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>

                      {/* Direct CTA */}
                      {notif.actionType && (
                        <span className="text-amber-900 font-bold flex items-center gap-1 group-hover:underline">
                          <span>
                            {notif.actionType === 'track_order'
                              ? language === 'bn'
                                ? 'ট্র্যাকিং দেখুন'
                                : 'Track Order'
                              : notif.actionType === 'flash_sale'
                              ? language === 'bn'
                                ? 'অফার দেখুন'
                                : 'View Offers'
                              : notif.actionType === 'account'
                              ? language === 'bn'
                                ? 'পয়েন্ট দেখুন'
                                : 'View Points'
                              : language === 'bn'
                              ? 'কালেকশন দেখুন'
                              : 'Shop Now'}
                          </span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dismiss single button */}
                <button
                  onClick={(e) => handleDelete(notif.id, e)}
                  className="opacity-0 group-hover:opacity-100 absolute bottom-3 right-3 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <button
              onClick={handleClearAll}
              className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAccount();
              }}
              className="text-amber-900 font-bold hover:underline cursor-pointer"
            >
              {language === 'bn' ? 'আমার প্রোফাইল ও অর্ডার' : 'My Account & Orders'} →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
