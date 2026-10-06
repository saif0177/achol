import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../../types';

interface WhatsAppButtonProps {
  language: Language;
  prefilledMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  language,
  prefilledMessage = 'Hello Aanchol, I would like to inquire about authentic handloom sarees.'
}) => {
  const whatsappNumber = '8801700000000'; // Bangladeshi WhatsApp business number
  const encodedMsg = encodeURIComponent(prefilledMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          {language === 'bn' ? 'হোয়াটসঅ্যাপে সাহায্য' : 'Chat on WhatsApp'}
        </span>
      </a>
    </div>
  );
};
