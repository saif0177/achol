import React, { useState, useEffect } from 'react';
import {
  Upload,
  Clock,
  Image as ImageIcon,
  Check,
  Calendar,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Save,
  Palette,
  Tag,
  Eye,
  Info
} from 'lucide-react';

export type AdminFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'switch'
  | 'checkbox'
  | 'image'
  | 'countdown_timer'
  | 'datetime'
  | 'color'
  | 'tags';

export interface AdminFieldOption {
  value: string;
  labelEn: string;
  labelBn?: string;
}

export interface AdminFieldSchema {
  name: string;
  labelEn: string;
  labelBn?: string;
  type: AdminFieldType;
  placeholder?: string;
  required?: boolean;
  options?: AdminFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  helperText?: string;
  gridCols?: 1 | 2;
  defaultValue?: any;
  dependsOn?: {
    field: string;
    value: any;
  };
  sampleImages?: { label: string; url: string }[];
}

export interface AdminFormSection {
  id: string;
  titleEn: string;
  titleBn?: string;
  descriptionEn?: string;
  icon?: any;
  fields: AdminFieldSchema[];
}

export interface AdminFormSchema {
  id: string;
  titleEn: string;
  titleBn?: string;
  descriptionEn?: string;
  sections: AdminFormSection[];
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface AdminFormBuilderProps {
  schema: AdminFormSchema;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  language?: 'en' | 'bn';
}

export const AdminFormBuilder: React.FC<AdminFormBuilderProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  language = 'en'
}) => {
  // Initialize form state
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = { ...initialValues };
    schema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (data[field.name] === undefined) {
          data[field.name] =
            field.defaultValue !== undefined
              ? field.defaultValue
              : field.type === 'switch' || field.type === 'checkbox'
              ? false
              : field.type === 'number'
              ? 0
              : '';
        }
      });
    });
    return data;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Synchronize when initialValues changes
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  // Field change handler
  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Image file upload handler
  const handleImageFileUpload = (fieldName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleFieldChange(fieldName, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Form submit handler with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    schema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        // Skip check if dependency not satisfied
        if (field.dependsOn) {
          if (formData[field.dependsOn.field] !== field.dependsOn.value) {
            return;
          }
        }

        if (field.required) {
          const val = formData[field.name];
          if (val === undefined || val === null || val === '') {
            newErrors[field.name] = `${field.labelEn} is required`;
          }
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schema.sections.map((section) => {
        const SectionIcon = section.icon;

        return (
          <div
            key={section.id}
            className="bg-white dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-4 shadow-2xs"
          >
            {/* Section Header */}
            {(section.titleEn || section.descriptionEn) && (
              <div className="border-b border-stone-100 dark:border-stone-700/60 pb-3">
                <div className="flex items-center gap-2">
                  {SectionIcon && (
                    <SectionIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                  )}
                  <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                    {language === 'bn' ? section.titleBn || section.titleEn : section.titleEn}
                  </h4>
                </div>
                {section.descriptionEn && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {section.descriptionEn}
                  </p>
                )}
              </div>
            )}

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => {
                // Dependency check
                if (field.dependsOn) {
                  if (formData[field.dependsOn.field] !== field.dependsOn.value) {
                    return null;
                  }
                }

                const value = formData[field.name];
                const colSpanClass = field.gridCols === 2 ? 'sm:col-span-2' : 'sm:col-span-1';
                const hasError = Boolean(errors[field.name]);

                return (
                  <div key={field.name} className={`${colSpanClass} space-y-1.5`}>
                    {/* Label */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-200 flex items-center gap-1">
                        <span>
                          {language === 'bn' ? field.labelBn || field.labelEn : field.labelEn}
                        </span>
                        {field.required && <span className="text-rose-600">*</span>}
                      </label>
                      {field.helperText && (
                        <span className="text-[10px] text-stone-400 dark:text-stone-500">
                          {field.helperText}
                        </span>
                      )}
                    </div>

                    {/* Field input switch based on type */}
                    {/* 1. TEXT */}
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={value ?? ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 text-xs border rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                          hasError
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-stone-200 dark:border-stone-700 focus:border-amber-700 focus:ring-amber-700'
                        }`}
                      />
                    )}

                    {/* 2. TEXTAREA */}
                    {field.type === 'textarea' && (
                      <textarea
                        rows={field.rows || 3}
                        value={value ?? ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 text-xs border rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                          hasError
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-stone-200 dark:border-stone-700 focus:border-amber-700 focus:ring-amber-700'
                        }`}
                      />
                    )}

                    {/* 3. NUMBER */}
                    {field.type === 'number' && (
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        value={value ?? ''}
                        onChange={(e) =>
                          handleFieldChange(
                            field.name,
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 text-xs font-mono font-bold border rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                          hasError
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-stone-200 dark:border-stone-700 focus:border-amber-700 focus:ring-amber-700'
                        }`}
                      />
                    )}

                    {/* 4. SELECT */}
                    {field.type === 'select' && (
                      <select
                        value={value ?? ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={`w-full px-3 py-2 text-xs border rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                          hasError
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-stone-200 dark:border-stone-700 focus:border-amber-700 focus:ring-amber-700'
                        }`}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {language === 'bn' ? opt.labelBn || opt.labelEn : opt.labelEn}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* 5. SWITCH / CHECKBOX */}
                    {(field.type === 'switch' || field.type === 'checkbox') && (
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 cursor-pointer hover:bg-stone-100/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                          className="w-4 h-4 rounded text-amber-900 focus:ring-amber-800 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                          {field.placeholder ||
                            (value ? 'Active / Enabled' : 'Disabled')}
                        </span>
                      </label>
                    )}

                    {/* 6. IMAGE (URL + Presets + File Upload + Live Preview) */}
                    {field.type === 'image' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={value ?? ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            placeholder="Enter image URL or select from below..."
                            className="flex-1 px-3 py-2 text-xs border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white focus:outline-none focus:border-amber-700"
                          />

                          <label className="px-3 py-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-600 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFileUpload(field.name, file);
                              }}
                            />
                          </label>
                        </div>

                        {/* Preset Quick Images if provided */}
                        {field.sampleImages && field.sampleImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {field.sampleImages.map((sample, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleFieldChange(field.name, sample.url)}
                                className={`text-[10px] px-2 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
                                  value === sample.url
                                    ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-600 text-amber-950 dark:text-amber-300 font-bold'
                                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-400'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                <span>{sample.label}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Live Image Preview */}
                        {value && (
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 group">
                            <img
                              src={value}
                              alt="Form Preview"
                              className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono backdrop-blur-xs">
                              Live Preview
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 7. COUNTDOWN TIMER & PRESETS */}
                    {(field.type === 'countdown_timer' || field.type === 'datetime') && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="datetime-local"
                            value={
                              value
                                ? new Date(new Date(value).getTime() - new Date().getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .slice(0, 16)
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value) {
                                const iso = new Date(e.target.value).toISOString();
                                handleFieldChange(field.name, iso);
                              }
                            }}
                            className="flex-1 px-3 py-2 text-xs border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white font-mono"
                          />
                        </div>

                        {/* Quick Duration Buttons (e.g. +12h, +24h, +48h, +72h, +7 days) */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-stone-400 self-center mr-1">
                            Quick Presets:
                          </span>
                          {[
                            { label: '+12h', hours: 12 },
                            { label: '+24h (1 Day)', hours: 24 },
                            { label: '+48h (2 Days)', hours: 48 },
                            { label: '+72h (3 Days)', hours: 72 },
                            { label: '+7 Days', hours: 168 }
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                const newDate = new Date(
                                  Date.now() + preset.hours * 60 * 60 * 1000
                                ).toISOString();
                                handleFieldChange(field.name, newDate);
                              }}
                              className="px-2 py-1 text-[10px] bg-stone-100 dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-stone-700 dark:text-stone-200 rounded-lg border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>

                        {/* Live Countdown Display Box */}
                        {value && (
                          <div className="p-2.5 rounded-xl bg-stone-950 text-amber-300 border border-amber-500/30 flex items-center justify-between text-xs font-mono shadow-xs">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              <span className="text-[11px] font-sans font-bold text-white">
                                Live Countdown:
                              </span>
                            </div>
                            <span className="font-bold tracking-wider">
                              {(() => {
                                const diff = Math.max(
                                  0,
                                  new Date(value).getTime() - Date.now()
                                );
                                const hrs = Math.floor(diff / (1000 * 60 * 60));
                                const mins = Math.floor(
                                  (diff % (1000 * 60 * 60)) / (1000 * 60)
                                );
                                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                                return `${hrs}h ${mins}m ${secs}s remaining`;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 8. COLOR PICKER */}
                    {field.type === 'color' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={value || '#991B1B'}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          className="w-9 h-9 rounded-xl border border-stone-300 dark:border-stone-700 p-0.5 cursor-pointer bg-white"
                        />
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder="#991B1B"
                          className="flex-1 px-3 py-2 text-xs font-mono uppercase border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white"
                        />
                      </div>
                    )}

                    {/* 9. TAGS */}
                    {field.type === 'tags' && (
                      <input
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : value ?? ''}
                        onChange={(e) =>
                          handleFieldChange(
                            field.name,
                            e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="Comma separated: jamdani, wedding, red"
                        className="w-full px-3 py-2 text-xs border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50/50 dark:bg-stone-900/50 dark:text-white"
                      />
                    )}

                    {/* Error message */}
                    {hasError && (
                      <span className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors[field.name]}</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {schema.cancelButtonText || 'Cancel'}
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
        >
          <Save className="w-4 h-4 text-amber-300" />
          <span>{schema.submitButtonText || 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
};
