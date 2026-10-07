import React from 'react';
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
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
        aria-label="WhatsApp Contact"
        title={language === 'bn' ? 'সরাসরি যোগাযোগ করুন' : 'Direct Assistance'}
      >
        {/* Recognizable WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.507 14.307l-.009.075c-.244-.122-1.45-.716-1.676-.798-.225-.082-.389-.122-.553.123-.164.244-.637.798-.78 1.002-.144.205-.287.225-.531.102-.244-.122-1.031-.38-1.964-1.212-.725-.647-1.216-1.446-1.359-1.691-.143-.245-.015-.378.107-.5.11-.11.244-.287.367-.43.122-.144.164-.245.245-.409.082-.164.041-.307-.02-.43-.062-.123-.553-1.332-.757-1.823-.2-.48-.403-.415-.553-.423l-.471-.01c-.164 0-.43.061-.655.307-.225.245-.86.84-.86 2.05 0 1.208.88 2.373 1.003 2.536.123.164 1.733 2.646 4.2 3.71 1.64.708 2.285.772 3.103.65.91-.136 1.794-.733 2.049-1.442.256-.708.256-1.316.179-1.442-.077-.126-.282-.205-.526-.327zM12 21.804c-1.8 0-3.567-.482-5.116-1.393l-.367-.218-3.805 1 1.016-3.708-.239-.38A9.774 9.774 0 0 1 2.2 12c0-5.404 4.396-9.8 9.8-9.8 2.617 0 5.078 1.02 6.929 2.871A9.739 9.739 0 0 1 21.8 12c0 5.404-4.396 9.804-9.8 9.804zm0-17.804c-4.411 0-8 3.589-8 8 0 1.411.368 2.784 1.066 3.992l.256.444-.672 2.454 2.513-.659.43.256c1.16.689 2.493 1.053 3.864 1.053 4.411 0 8-3.589 8-8s-3.589-8-8-8z" />
        </svg>
      </a>
    </div>
  );
};
