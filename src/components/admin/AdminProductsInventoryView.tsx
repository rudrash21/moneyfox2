import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { INITIAL_INVENTORY } from '../../data/mockData';
import { InventoryItem } from '../../types';

export const AdminProductsInventoryView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [selectedSku, setSelectedSku] = useState<string>('MF-280N-L');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(10);
  const [reason, setReason] = useState<string>('Restock received');
  const [auditNote, setAuditNote] = useState<string>(
    'Counted 10 additional Noir L garments into available stock.'
  );
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const currentItem = inventory.find((i) => i.sku === selectedSku) || inventory[2];
  const newAvailable = currentItem.available + adjustmentValue;

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    setInventory(
      inventory.map((item) =>
        item.sku === selectedSku
          ? {
              ...item,
              available: newAvailable,
              status: newAvailable > 5 ? 'Published' : 'Low stock',
            }
          : item
      )
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          BACK OFFICE / OPERATIONS
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Products &amp; inventory
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Merchandise catalogue / Size-level stock / Reasoned adjustments and audit records.
        </p>
      </div>

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            CATALOGUE
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">3</div>
          <p className="text-[11px] font-mono text-parchment-400">Noir / White / Guild</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            PUBLISHED
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">2</div>
          <p className="text-[11px] font-mono text-emerald-400">₹2,000 • GST 12%</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            LOW-STOCK SKU
          </span>
          <div className="font-serif text-4xl text-red-400 font-bold">1</div>
          <p className="text-[11px] font-mono text-amberfox-gold">Noir L • {currentItem.available} available</p>
        </div>
      </div>

      {/* 2-Column: Product Register & Stock Adjust Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Register Table */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Product register
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
                <thead>
                  <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                    <th className="py-2.5">Product / SKU</th>
                    <th className="py-2.5">Price / Tax</th>
                    <th className="py-2.5">Size Inventory</th>
                    <th className="py-2.5 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amberfox/10 text-[11px]">
                  <tr className="hover:bg-noir-950/60">
                    <td className="py-3.5">
                      <p className="font-semibold text-parchment-100">Signature Noir</p>
                      <span className="text-[10px] text-parchment-400">MF-280N</span>
                    </td>
                    <td className="py-3.5 text-parchment-200">₹2,000 • GST 12%</td>
                    <td className="py-3.5 text-parchment-300">
                      S 18 • M 22 • <span className="text-amberfox font-semibold">L 4</span> • XL 0
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase text-amberfox hairline-border border-amberfox/30">
                        Published / Low stock
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-noir-950/60">
                    <td className="py-3.5">
                      <p className="font-semibold text-parchment-100">Precision White</p>
                      <span className="text-[10px] text-parchment-400">MF-280W</span>
                    </td>
                    <td className="py-3.5 text-parchment-200">₹2,000 • GST 12%</td>
                    <td className="py-3.5 text-parchment-300">S 16 • M 24 • L 18 • XL 12</td>
                    <td className="py-3.5 text-right">
                      <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase text-emerald-400 hairline-border border-emerald-500/30">
                        Published
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-noir-950/60">
                    <td className="py-3.5">
                      <p className="font-semibold text-parchment-100">Guild limited drop</p>
                      <span className="text-[10px] text-parchment-400">MF-280G</span>
                    </td>
                    <td className="py-3.5 text-parchment-200">₹2,000 • GST 12%</td>
                    <td className="py-3.5 text-parchment-400">S 8 • M 10 • L 6 • XL 0</td>
                    <td className="py-3.5 text-right">
                      <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase text-parchment-500 hairline-border">
                        Draft
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] font-mono text-parchment-600">
              Inventory values are units, not PV. Draft products are not listed for purchase.
            </p>

            <button
              type="button"
              className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer"
            >
              ADD PRODUCT
            </button>
          </div>

          {/* Size Inventory · Noir Sub-Table */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Size inventory • Noir
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
                <thead>
                  <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                    <th className="py-2">SKU</th>
                    <th className="py-2">Size</th>
                    <th className="py-2">Available</th>
                    <th className="py-2">Reserved</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amberfox/10 text-[11px]">
                  {inventory.slice(0, 4).map((item) => (
                    <tr
                      key={item.sku}
                      onClick={() => setSelectedSku(item.sku)}
                      className={`hover:bg-noir-950/60 cursor-pointer ${
                        selectedSku === item.sku ? 'bg-noir-950/90' : ''
                      }`}
                    >
                      <td className="py-3 text-parchment-200">{item.sku}</td>
                      <td className="py-3 font-semibold text-parchment-100">{item.size}</td>
                      <td className="py-3 text-amberfox font-semibold">{item.available}</td>
                      <td className="py-3 text-parchment-400">{item.reserved}</td>
                      <td className="py-3 text-right">
                        {selectedSku === item.sku ? (
                          <span className="text-amberfox-gold font-semibold">Selected</span>
                        ) : item.size === 'XL' ? (
                          <span className="text-parchment-600">Unavailable</span>
                        ) : (
                          <span className="text-parchment-300 hover:text-amberfox">Adjust</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Open Stock Drawer / Adjust Stock */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
              OPEN STOCK DRAWER / {currentItem.sku}
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Adjust stock
            </h3>
            <div className="mt-2 inline-block bg-noir-950 text-amberfox font-mono text-[10px] uppercase px-2.5 py-0.5 hairline-border">
              {currentItem.status} • Noir {currentItem.size}
            </div>
          </div>

          <form onSubmit={handleSaveStock} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                Current available
              </label>
              <input
                type="text"
                readOnly
                value={`${currentItem.available} units • Read only`}
                className="w-full bg-noir-950 hairline-border p-3 text-parchment-300 opacity-90 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Adjustment
                </label>
                <input
                  type="number"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(parseInt(e.target.value) || 0)}
                  className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  New available
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${newAvailable} units`}
                  className="w-full bg-noir-950 hairline-border p-3 text-amberfox-gold font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
              >
                <option value="Restock received">Restock received</option>
                <option value="Damage replacement">Damage replacement</option>
                <option value="Inventory reconciliation">Inventory reconciliation</option>
                <option value="Manual allocation">Manual allocation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                Audit note *
              </label>
              <textarea
                rows={3}
                value={auditNote}
                onChange={(e) => setAuditNote(e.target.value)}
                className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                required
              />
            </div>

            {/* Warning block */}
            <div className="border-l-2 border-amberfox bg-noir-950 p-4 space-y-1">
              <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block">
                Review before saving
              </span>
              <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                This updates available inventory only. Price remains ₹2,000 including 12% GST. A reason and operator record are required.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-950/80 hairline-border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Stock edit saved. Operator record recorded.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer shadow-amber-glow"
              >
                SAVE STOCK
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentValue(0)}
                className="hairline-border px-4 py-3 text-xs uppercase tracking-wider text-parchment-400 hover:text-parchment-100 cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </form>

          {/* Audit Info Box */}
          <div className="pt-4 border-t border-amberfox/15 font-mono text-[10px] text-parchment-500 space-y-1">
            <span className="uppercase text-parchment-400 font-semibold block">AUDIT INFORMATION</span>
            <p>Operator: Apex Admin • Operations role</p>
            <p>24 Oct 2025 • 14:40 IST</p>
            <p>Before {currentItem.available} → After {newAvailable} • Delta +{adjustmentValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
