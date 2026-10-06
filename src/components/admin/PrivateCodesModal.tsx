import React, { useState } from 'react';
import { X, Plus, KeyRound, Check, Trash2, Tag, ShieldAlert } from 'lucide-react';
import { PrivatePriceCode, Product, Language } from '../../types';
import { store } from '../../services/store';

interface PrivateCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  language: Language;
}

export const PrivateCodesModal: React.FC<PrivateCodesModalProps> = ({
  isOpen,
  onClose,
  products,
  language
}) => {
  const [codes, setCodes] = useState<PrivatePriceCode[]>(store.getAllPrivateCodesAdmin());
  const [showForm, setShowForm] = useState(false);

  // New code form state
  const [codeStr, setCodeStr] = useState('');
  const [targetProduct, setTargetProduct] = useState('');
  const [specialPrice, setSpecialPrice] = useState(10000);
  const [targetPhone, setTargetPhone] = useState('');
  const [isOneTime, setIsOneTime] = useState(false);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeStr.trim()) return;

    const newCode: PrivatePriceCode = {
      id: `code-${Date.now()}`,
      code: codeStr.trim().toUpperCase(),
      targetProductId: targetProduct || undefined,
      specialPrice: Number(specialPrice),
      targetPhone: targetPhone.trim() || undefined,
      isOneTime,
      used: false,
      isActive: true,
      note: note.trim()
    };

    store.savePrivateCode(newCode);
    setCodes(store.getAllPrivateCodesAdmin());
    setShowForm(false);
    setCodeStr('');
    setTargetProduct('');
    setTargetPhone('');
    setNote('');
  };

  const handleDeleteCode = (id: string) => {
    store.deletePrivateCode(id);
    setCodes(store.getAllPrivateCodesAdmin());
  };

  const handleToggleActive = (code: PrivatePriceCode) => {
    const updated = { ...code, isActive: !code.isActive };
    store.savePrivateCode(updated);
    setCodes(store.getAllPrivateCodesAdmin());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-none sm:rounded-2xl shadow-2xl z-10 overflow-hidden my-auto max-h-screen sm:max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-900" />
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Special Private Negotiated Price Codes
              </h2>
              <p className="text-[11px] text-stone-500">
                Secret codes for negotiated custom pricing via WhatsApp or phone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-stone-600">
              Active codes ({codes.filter((c) => c.isActive).length})
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Private Code</span>
            </button>
          </div>

          {/* Creation Form */}
          {showForm && (
            <form
              onSubmit={handleCreateCode}
              className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-3 text-xs"
            >
              <h3 className="font-semibold text-stone-900">
                Create Negotiated Price Code
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Secret Code *</label>
                  <input
                    type="text"
                    required
                    value={codeStr}
                    onChange={(e) => setCodeStr(e.target.value)}
                    placeholder="e.g. VIP75 or SPECIAL10"
                    className="w-full px-3 py-2 uppercase font-mono bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">
                    Special Negotiated Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={specialPrice}
                    onChange={(e) => setSpecialPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 mb-1">
                    Target Saree (Optional: restricts code to specific saree)
                  </label>
                  <select
                    value={targetProduct}
                    onChange={(e) => setTargetProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="">Any Saree / General Order</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.nameEn} (Regular: ৳{p.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">
                    Customer Phone Restriction (Optional)
                  </label>
                  <input
                    type="tel"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 font-mono bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Admin Notes</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Negotiated with Mrs. Rahman on WhatsApp"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    className="w-4 h-4 text-amber-900 accent-amber-900"
                  />
                  <span>One-time use only</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-900 text-white rounded-lg font-semibold"
                >
                  Save Secret Code
                </button>
              </div>
            </form>
          )}

          {/* Codes List */}
          <div className="space-y-3">
            {codes.map((c) => {
              const targetP = products.find((p) => p.id === c.targetProductId);
              return (
                <div
                  key={c.id}
                  className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        → ৳{c.specialPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeleteCode(c.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-stone-600 space-y-0.5">
                    {targetP ? (
                      <div>
                        Target Saree: <span className="font-semibold">{targetP.nameEn} (#{targetP.code})</span>
                      </div>
                    ) : (
                      <div>Target: All Sarees</div>
                    )}
                    {c.targetPhone && <div>Restricted to Phone: {c.targetPhone}</div>}
                    {c.note && <div className="text-stone-400 italic">Note: {c.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
