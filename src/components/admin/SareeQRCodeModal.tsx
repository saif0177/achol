import React, { useState, useEffect } from 'react';
import { X, Download, Printer, QrCode, Tag, Sparkles, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import { Product, Language } from '../../types';

interface SareeQRCodeModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SareeQRCodeModal: React.FC<SareeQRCodeModalProps> = ({
  product,
  isOpen,
  onClose,
  language
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!product) return;

    const payload = JSON.stringify({
      code: product.code,
      name: product.nameEn,
      price: product.price,
      sareeType: product.sareeType,
      url: `https://aanchol.com.bd/product/${product.code.toLowerCase()}`
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#451a03',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [product]);

  if (!isOpen || !product) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.download = `Aanchol-Saree-${product.code}-QR.png`;
    a.href = qrDataUrl;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-base font-bold">Artisan Saree QR Tag</h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Body */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-block p-4 bg-amber-50/60 rounded-3xl border border-amber-200 shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${product.code}`}
                className="w-48 h-48 mx-auto bg-white p-2 rounded-2xl shadow-sm border border-stone-200"
              />
            ) : (
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-stone-300 animate-pulse" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 bg-amber-900 text-amber-50 font-mono font-bold text-sm rounded-full inline-block">
              {product.code}
            </span>
            <h4 className="font-serif text-lg font-bold text-stone-900 pt-1">
              {language === 'bn' ? product.nameBn : product.nameEn}
            </h4>
            <p className="text-xs text-stone-500 font-medium">
              {product.sareeType} • ৳{product.price.toLocaleString()}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs text-stone-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-stone-500">Fabric:</span>
              <span className="font-bold text-stone-800">{product.fabric}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-stone-500">Total Variants:</span>
              <span className="font-bold text-stone-800">{product.variants.length} colors</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-stone-500">Loom Origin:</span>
              <span className="font-bold text-stone-800">Rupganj & Demra, BD</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tag</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
