import React, { useState } from 'react';
import { MapPin, Search, Check, Navigation } from 'lucide-react';
import { Language } from '../../types';

interface MapLocationPickerProps {
  language: Language;
  onSelectCoordinates: (lat: number, lng: number, landmarkDesc: string) => void;
  onClose: () => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  language,
  onSelectCoordinates,
  onClose
}) => {
  // Common delivery hubs in Dhaka and Bangladesh
  const presetLocations = [
    { name: 'Dhanmondi, Dhaka', lat: 23.7461, lng: 90.3742 },
    { name: 'Gulshan 2, Dhaka', lat: 23.7925, lng: 90.4078 },
    { name: 'Uttara Sector 7, Dhaka', lat: 23.8759, lng: 90.3795 },
    { name: 'Mirpur 10, Dhaka', lat: 23.8069, lng: 90.3687 },
    { name: 'Mohammadpur, Dhaka', lat: 23.7571, lng: 90.3607 },
    { name: 'Agrabad, Chattogram', lat: 22.3259, lng: 91.8131 },
    { name: 'Zindabazar, Sylhet', lat: 24.8949, lng: 91.8687 },
    { name: 'Saheb Bazar, Rajshahi', lat: 24.3636, lng: 88.6241 }
  ];

  const [activeLoc, setActiveLoc] = useState(presetLocations[0]);
  const [customSearch, setCustomSearch] = useState('');
  const [pinOffset, setPinOffset] = useState({ x: 50, y: 50 }); // percentage

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinOffset({ x, y });
  };

  const handleConfirm = () => {
    onSelectCoordinates(
      activeLoc.lat + (pinOffset.y - 50) * 0.001,
      activeLoc.lng + (pinOffset.x - 50) * 0.001,
      `${activeLoc.name} (Pinpointed)`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 space-y-4 p-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-900">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                {language === 'bn' ? 'ম্যাপে ডেলিভারি পয়েন্ট নির্ধারণ' : 'Pinpoint Delivery Address'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'bn'
                  ? 'আপনার সঠিক বাড়ি বা গলির মোড়টি ম্যাপে ট্যাপ করে চিহ্নিত করুন'
                  : 'Tap on the interactive map to position your exact doorstep'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Location Buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 block">
            {language === 'bn' ? 'জনপ্রিয় এলাকা নির্বাচন করুন' : 'Select Hub Area'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presetLocations.slice(0, 5).map((loc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveLoc(loc);
                  setPinOffset({ x: 50, y: 50 });
                }}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  activeLoc.name === loc.name
                    ? 'bg-amber-900 border-amber-900 text-white font-medium'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Visual Mockup Canvas */}
        <div
          onClick={handleMapClick}
          className="relative w-full h-56 rounded-xl overflow-hidden border border-stone-300 cursor-crosshair bg-stone-100 select-none"
          title="Click to drop pin"
        >
          {/* Simulated stylized street grid background */}
          <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#a8a29e" strokeWidth="0.8" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Main road lines */}
            <path d="M 0 60 Q 150 120 400 90" stroke="#78716c" strokeWidth="6" fill="none" />
            <path d="M 120 0 Q 180 140 220 250" stroke="#78716c" strokeWidth="5" fill="none" />
            <path d="M 280 20 L 320 220" stroke="#d97706" strokeWidth="4" fill="none" opacity="0.6" />
          </svg>

          {/* Area Label Tag */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-stone-800 shadow-sm border border-stone-200">
            📍 {activeLoc.name}
          </div>

          {/* Pinpoint Indicator */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-none"
            style={{ left: `${pinOffset.x}%`, top: `${pinOffset.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-amber-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Exact Delivery Doorstep
              </div>
              <MapPin className="w-8 h-8 text-amber-900 fill-amber-500 drop-shadow-md" />
            </div>
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] text-stone-500 bg-white/80 px-2 py-0.5 rounded">
            Click anywhere on map to reposition pin
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'bn' ? 'এই লোকেশন সংরক্ষণ করুন' : 'Confirm Pin Location'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
