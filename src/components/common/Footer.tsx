import React from 'react';
import { ShieldCheck, Truck, Clock, Phone, Heart } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface FooterProps {
  language: Language;
  onSelectCategory: (categoryId: string) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectCategory,
  onOpenTracking,
  onOpenAdmin
}) => {
  const t = translations[language];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand story & origin */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-stone-950 font-serif font-bold text-lg">
                আ
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-100">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">
              {language === 'bn'
                ? 'আঁচল হলো ঐতিহ্যবাহী ঢাকাই তাঁতশিল্পের একটি নিবেদিত প্রতিষ্ঠান। রূপগঞ্জ, ডেমরা ও টাঙ্গাইলের শতাব্দী প্রাচীন তাঁতীদের সাথে সরাসরি কাজ করে আমরা বাংলার খাঁটি জামদানি, মসলিন ও সিল্ক শাড়ি পৌঁছে দিচ্ছি আপনার দুয়ারে।'
                : 'Aanchol preserves Bengal’s historic textile mastery. Working directly with master pitloom artisans in Demra, Rupganj, and Tangail, we bring authentic Jamdani, Muslin, and Silk directly to discerning women worldwide.'}
            </p>
            <div className="text-xs text-amber-400/90 font-medium flex items-center gap-1.5">
              <span>📍 Dhaka Handloom Hub, Bangladesh</span>
            </div>
          </div>

          {/* Col 2: Heritage Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4">
              {language === 'bn' ? 'ঐতিহ্যবাহী শাড়ি' : 'Heritage Weaves'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('dhakai-jamdani')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t.navJamdani} (৮০-১০০ কাউন্ট)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dhakai-muslin')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t.navMuslin} (ফুটি কার্পাস)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('tangail-taat')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t.navTaat} (খাঁটি সুতি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('rajshahi-silk')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t.navSilk} (তুঁত রেশম)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bridal-festive')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {language === 'bn' ? 'বিয়ের বধূ কাতান ও বেনারসি' : 'Bridal & Festive Katans'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4">
              {language === 'bn' ? 'গ্রাহক সেবা ও ট্র্যাকিং' : 'Client Care'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.navTrackOrder}</span>
                </button>
              </li>
              <li>
                <span className="text-stone-400">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি (সারাদেশে)' : 'Cash on Delivery (Nationwide)'}
                </span>
              </li>
              <li>
                <span className="text-stone-400">
                  {language === 'bn' ? 'স্টিডফাস্ট কুরিয়ার পার্টনার' : 'Steadfast Courier Delivery'}
                </span>
              </li>
              <li>
                <span className="text-stone-400">
                  {language === 'bn' ? 'সরাসরি চ্যাট সহায়তা' : 'Direct Chat Assistance'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Direct Assistance */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4">
              {language === 'bn' ? 'সরাসরি সহায়তা' : 'Direct Assistance'}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              {language === 'bn'
                ? 'শাড়ির ম্যাচিং ব্লাউজ পিস, সুতার কাউন্ট অথবা বিশেষ নেগোশিয়েটেড রেটের জন্য আমাদের সাথে যোগাযোগ করুন।'
                : 'Need custom blouse tailoring, thread certification, or negotiated bulk wedding pricing? Talk directly to our weaving curator.'}
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-md transition-colors"
                title="Direct messaging support"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.507 14.307l-.009.075c-.244-.122-1.45-.716-1.676-.798-.225-.082-.389-.122-.553.123-.164.244-.637.798-.78 1.002-.144.205-.287.225-.531.102-.244-.122-1.031-.38-1.964-1.212-.725-.647-1.216-1.446-1.359-1.691-.143-.245-.015-.378.107-.5.11-.11.244-.287.367-.43.122-.144.164-.245.245-.409.082-.164.041-.307-.02-.43-.062-.123-.553-1.332-.757-1.823-.2-.48-.403-.415-.553-.423l-.471-.01c-.164 0-.43.061-.655.307-.225.245-.86.84-.86 2.05 0 1.208.88 2.373 1.003 2.536.123.164 1.733 2.646 4.2 3.71 1.64.708 2.285.772 3.103.65.91-.136 1.794-.733 2.049-1.442.256-.708.256-1.316.179-1.442-.077-.126-.282-.205-.526-.327zM12 21.804c-1.8 0-3.567-.482-5.116-1.393l-.367-.218-3.805 1 1.016-3.708-.239-.38A9.774 9.774 0 0 1 2.2 12c0-5.404 4.396-9.8 9.8-9.8 2.617 0 5.078 1.02 6.929 2.871A9.739 9.739 0 0 1 21.8 12c0 5.404-4.396 9.804-9.8 9.804zm0-17.804c-4.411 0-8 3.589-8 8 0 1.411.368 2.784 1.066 3.992l.256.444-.672 2.454 2.513-.659.43.256c1.16.689 2.493 1.053 3.864 1.053 4.411 0 8-3.589 8-8s-3.589-8-8-8z" />
                </svg>
                <span>+880 1700-000000</span>
              </a>
              <div className="text-stone-400 pt-1">
                ⏱️ 10:00 AM — 10:00 PM (Everyday)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} {t.brandName} Heritage Sarees. All rights reserved. Handcrafted in Bangladesh.
          </div>
          <div className="flex items-center gap-6">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Steadfast Logistics</span>
            <span>·</span>
            <span>100% Authentic Handloom</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
