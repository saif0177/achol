import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, Eye } from 'lucide-react';

export interface ImageUploadBrowserProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  allowPresets?: boolean;
  className?: string;
}

export const PRESET_HERITAGE_IMAGES = [
  { label: 'Dhakai Jamdani Crimson', url: '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg' },
  { label: 'Royal Muslin Ivory', url: '/src/assets/images/product_muslin_royal_ivory_1791268715553.jpg' },
  { label: 'Tangail Taat Peacock Cotton', url: '/src/assets/images/product_tangail_taat_cotton_1791268738764.jpg' },
  { label: 'Rajshahi Pure Mulberry Silk', url: '/src/assets/images/product_rajshahi_silk_emerald_1791268751191.jpg' },
  { label: 'Loom Artisan Craft Heritage', url: '/src/assets/images/hero_jamdani_craft_1791268697306.jpg' },
  { label: 'Festive Promo Banner', url: '/src/assets/images/fabrilife_style_promo_banner_1791274654342.jpg' },
  { label: 'Customer Saree Review Photo', url: '/src/assets/images/customer_saree_review_photo_1791274673553.jpg' }
];

export const ImageUploadBrowser: React.FC<ImageUploadBrowserProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Enter image URL or browse...',
  allowPresets = true,
  className = ''
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB for data URL safety in localStorage)
    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image is larger than 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPreviewError(false);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    // Reset input value so same file can be re-selected if desired
    e.target.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Main input for URL / Data */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setPreviewError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full text-xs py-2 pl-8 pr-8 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
          />
          <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-rose-500 transition"
              title="Clear image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/80 rounded-lg transition active:scale-95 shadow-xs"
            title="Browse image from your device"
          >
            <Upload className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Browse Image</span>
          </button>

          {allowPresets && (
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg transition"
              title="Pick from gallery presets"
            >
              <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Presets</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Pickers Dropdown / Modal */}
      {showPresets && allowPresets && (
        <div className="p-3 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Authentic Saree Image Presets
            </span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_HERITAGE_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`group text-left p-1 rounded-lg border text-xs transition flex flex-col items-center ${
                  value === preset.url
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 ring-1 ring-amber-600'
                    : 'border-stone-200 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800'
                }`}
              >
                <div className="w-full h-16 rounded overflow-hidden bg-stone-100 dark:bg-stone-900 mb-1">
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <span className="text-[10px] text-stone-700 dark:text-stone-300 font-medium truncate w-full text-center">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visual Live Preview */}
      {value && (
        <div className="relative inline-flex items-center gap-2 p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850">
          <div className="w-14 h-14 rounded-md overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shrink-0">
            {!previewError ? (
              <img
                src={value}
                alt="Selected preview"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-[9px] p-1 text-center">
                <ImageIcon className="w-4 h-4 mb-0.5 text-stone-300" />
                Preview Unavailable
              </div>
            )}
          </div>
          <div className="pr-2 min-w-0 flex-1">
            <span className="text-[11px] font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Image Selected
            </span>
            <p className="text-[10px] text-stone-400 truncate max-w-[220px]">
              {value.startsWith('data:') ? 'Local image uploaded (Data URL)' : value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
