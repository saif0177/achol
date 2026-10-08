import React from 'react';
import { ShieldCheck, Truck, MessageCircle, Award } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface TrustHighlightsProps {
  language: Language;
}

export const TrustHighlights: React.FC<TrustHighlightsProps> = ({ language }) => {
  const t = translations[language];

  const highlights = [
    {
      icon: Award,
      title: t.trustHandloomTitle,
      desc: t.trustHandloomDesc
    },
    {
      icon: ShieldCheck,
      title: t.trustCodTitle,
      desc: t.trustCodDesc
    },
    {
      icon: Truck,
      title: t.trustDeliveryTitle,
      desc: t.trustDeliveryDesc
    },
    {
      icon: MessageCircle,
      title: t.trustWhatsAppTitle,
      desc: t.trustWhatsAppDesc
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
