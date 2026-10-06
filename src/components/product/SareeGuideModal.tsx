import React from 'react';
import { X, Ruler, CheckCircle2, Sparkles, Scissors, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';

interface SareeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SareeGuideModal: React.FC<SareeGuideModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif text-base font-bold">
                {language === 'bn' ? 'শাড়ির মাপ ও বহর নির্দেশিকা' : 'Saree Measurement & Drape Guide'}
              </h3>
              <p className="text-[11px] text-stone-300">
                {language === 'bn' ? 'ঐতিহ্যবাহী ১২ হাত শাড়ির সম্পূর্ণ পরিমাপ' : 'Standard 12-Haat authentic dimensions'}
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

        {/* Visual Measurement Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          
          {/* Visual Saree Anatomy Diagram */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="text-[11px] font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>{language === 'bn' ? 'শাড়ির কাঠামো ও অংশসমূহ' : 'Saree Anatomy & Dimensions'}</span>
            </div>

            {/* Simulated Saree Schematic */}
            <div className="relative w-full h-24 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 rounded-lg p-2.5 text-white flex items-center justify-between shadow-inner select-none">
              {/* Blouse Piece Part */}
              <div className="w-1/5 h-full border-r border-dashed border-amber-300/80 flex flex-col items-center justify-center text-center pr-1">
                <Scissors className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
                <span className="text-[9px] font-bold">ব্লাউজ পিস</span>
                <span className="text-[8px] text-amber-200">০.৮ মিটার</span>
              </div>
              {/* Body Part */}
              <div className="flex-1 h-full flex flex-col items-center justify-center text-center px-2">
                <span className="text-[10px] font-bold">মূল জমিন (Body & Pleats)</span>
                <span className="text-[9px] text-amber-200">৫.৫ মিটার / ১২ হাত (৭-৯টি নিখুঁত কুঁচি)</span>
              </div>
              {/* Anchol Part */}
              <div className="w-1/4 h-full border-l border-amber-300/60 flex flex-col items-center justify-center text-center pl-1 bg-amber-950/40 rounded-r">
                <span className="text-[10px] font-bold text-amber-300">ভারী আঁচল</span>
                <span className="text-[8px] text-amber-200">১ মিটার জরি কাজ</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-1">
              <span>মোট দৈর্ঘ্য: ৬.৩ মিটার (শাড়ি + ব্লাউজ পিস)</span>
              <span>বহর (Width): ৪৬-৪৮ ইঞ্চি</span>
            </div>
          </div>

          {/* Dimension Details Table */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
              {language === 'bn' ? 'পরিমাপের বিবরণ' : 'Detailed Specifications'}
            </h4>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
              <div className="p-2.5 flex justify-between items-center bg-stone-50/50">
                <span className="font-medium text-stone-700">শাড়ির দৈর্ঘ্য (Length)</span>
                <span className="font-mono font-bold text-stone-900">১২ হাত (৫.৫ মিটার)</span>
              </div>
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-medium text-stone-700">শাড়ির বহর (Width)</span>
                <span className="font-mono font-bold text-stone-900">৪৬ ইঞ্চি (ফ্লোর টাচ ফল)</span>
              </div>
              <div className="p-2.5 flex justify-between items-center bg-stone-50/50">
                <span className="font-medium text-stone-700">ব্লাউজ পিস (Blouse Piece)</span>
                <span className="font-mono font-bold text-stone-900">রানিং ৮০ সেমি (০.৮ মি.)</span>
              </div>
              <div className="p-2.5 flex justify-between items-center">
                <span className="font-medium text-stone-700">উপযোগী উচ্চতা (Height Fit)</span>
                <span className="font-mono font-bold text-emerald-700">৪ ফুট ১০ ইঞ্চি — ৫ ফুট ৯ ইঞ্চি</span>
              </div>
            </div>
          </div>

          {/* Weaver Assurance */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-950 leading-relaxed">
              {language === 'bn'
                ? 'আমাদের প্রতিটি শাড়ি রূপগঞ্জ, ডেমরা ও টাঙ্গাইলের ঐতিহ্যবাহী কাঠের পিটলুমে নিখুঁত মাপে বোনা হয়। শাড়ি পরার সময় মেঝের সাথে নিখুঁত সমতা বজায় থাকবে।'
                : 'Each saree is handwoven on authentic wooden pitlooms in Rupganj and Tangail with verified proportions to ensure an effortless drape for any height.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
