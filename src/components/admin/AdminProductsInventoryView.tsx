import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Package, RefreshCw, Plus, X, Layers, ShieldCheck } from 'lucide-react';
import { dbService, DbProduct } from '../../lib/dbService';

export const AdminProductsInventoryView: React.FC = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(10);
  const [reason, setReason] = useState<string>('Restock received');
  const [auditNote, setAuditNote] = useState<string>('Counted additional garments into available stock.');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductSeries, setNewProductSeries] = useState('Cyber Streetwear Series · 002');
  const [newProductPrice, setNewProductPrice] = useState(2000);
  const [newProductColor, setNewProductColor] = useState('Obsidian Black');
  const [newStockS, setNewStockS] = useState(20);
  const [newStockM, setNewStockM] = useState(25);
  const [newStockL, setNewStockL] = useState(30);
  const [newStockXL, setNewStockXL] = useState(15);
  const [newProductStatus, setNewProductStatus] = useState<'Published' | 'Draft'>('Published');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const data = await dbService.fetchProducts();
      if (isMounted) {
        setProducts(data);
        if (data.length > 0 && !selectedProductId) {
          setSelectedProductId(data[0].id || data[0].sku);
        }
        setLoading(false);
      }
    };
    load();

    const unsubscribe = dbService.subscribeProducts((updated) => {
      if (isMounted) {
        setProducts(updated);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId || p.sku === selectedProductId) ||
    products[0] || {
      id: 'mock-1',
      sku: 'MF-240CB',
      name: 'MoneyFox "Chill Out" Cyber Bear Heavyweight Tee',
      series: 'Cyber Streetwear Series · 001',
      price: 2000,
      size_s_stock: 18,
      size_m_stock: 22,
      size_l_stock: 30,
      size_xl_stock: 15,
      status: 'Published' as const,
      is_active: true,
      category: 'apparel',
    };

  const getStockForSize = (size: 'S' | 'M' | 'L' | 'XL') => {
    if (!selectedProduct) return 0;
    if (size === 'S') return selectedProduct.size_s_stock || 0;
    if (size === 'M') return selectedProduct.size_m_stock || 0;
    if (size === 'L') return selectedProduct.size_l_stock || 0;
    if (size === 'XL') return selectedProduct.size_xl_stock || 0;
    return 0;
  };

  const currentAvailable = getStockForSize(selectedSize);
  const newAvailable = Math.max(0, currentAvailable + adjustmentValue);

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSaving(true);
    setSaveError(null);

    const res = await dbService.adjustProductStock({
      sku: selectedProduct.sku,
      size: selectedSize,
      adjustment: adjustmentValue,
      reason,
      note: auditNote,
      operatorEmail: 'admin@moneyfox.co.in',
    });

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setAdjustmentValue(0);
      setTimeout(() => setSaveSuccess(false), 3500);
      // Refresh list
      const fresh = await dbService.fetchProducts();
      setProducts(fresh);
    } else {
      setSaveError(res.error || 'Failed to update stock');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const slug = newProductSku.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const res = await dbService.addProduct({
      name: newProductName,
      sku: newProductSku.toUpperCase(),
      slug,
      series: newProductSeries,
      price: newProductPrice,
      taxable_price: Math.round((newProductPrice / 1.12) * 100) / 100,
      gst_percentage: 12,
      color: newProductColor,
      size_s_stock: Number(newStockS),
      size_m_stock: Number(newStockM),
      size_l_stock: Number(newStockL),
      size_xl_stock: Number(newStockXL),
      status: newProductStatus,
      is_active: true,
      category: 'apparel',
      sizes: ['S', 'M', 'L', 'XL'],
      available_sizes: ['S', 'M', 'L', 'XL'],
      description: `${newProductName} in luxury 240 GSM combed cotton. Direct Selling Registered.`,
      specs: 'Direct Selling Registered · Binary Tree Node · HSN 6109',
    });

    setIsAdding(false);
    if (res.success) {
      setIsAddModalOpen(false);
      setNewProductName('');
      setNewProductSku('');
      const fresh = await dbService.fetchProducts();
      setProducts(fresh);
      if (res.data?.id) setSelectedProductId(res.data.id);
    } else {
      alert(`Error creating product: ${res.error}`);
    }
  };

  const handleToggleStatus = async (prod: DbProduct) => {
    const nextStatus = prod.status === 'Published' ? 'Draft' : 'Published';
    await dbService.updateProduct(prod.id, { status: nextStatus });
    const fresh = await dbService.fetchProducts();
    setProducts(fresh);
  };

  const publishedCount = products.filter((p) => p.status === 'Published').length;
  const lowStockCount = products.filter(
    (p) =>
      p.status === 'Low stock' ||
      (p.size_s_stock + p.size_m_stock + p.size_l_stock + p.size_xl_stock) <= 5
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
            BACK OFFICE / OPERATIONS
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
            Products &amp; Inventory
          </h1>
          <p className="text-xs text-parchment-400 font-light mt-1">
            Merchandise catalogue / Size-level stock / Reasoned adjustments &amp; Supabase realtime audit log.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 btn-gold-sheen text-noir-950 px-4 py-2.5 text-xs font-bold uppercase tracking-luxury cursor-pointer shadow-amber-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            CATALOGUE ITEMS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{products.length}</div>
          <p className="text-[11px] font-mono text-parchment-400">Luxury Streetwear Vault</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            ACTIVE / PUBLISHED
          </span>
          <div className="font-serif text-4xl text-emerald-400 font-bold">{publishedCount}</div>
          <p className="text-[11px] font-mono text-emerald-400">Live in Member Shop • ₹2,000</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            LOW-STOCK ALERT
          </span>
          <div className="font-serif text-4xl text-amber-400 font-bold">{lowStockCount}</div>
          <p className="text-[11px] font-mono text-amber-400">Units ≤ 5 threshold</p>
        </div>
      </div>

      {/* 2-Column: Product Register & Stock Adjust Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Register Table */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                Product Register
              </h2>
              {loading && (
                <div className="flex items-center gap-1.5 text-amberfox font-mono text-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing Supabase...</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
                <thead>
                  <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                    <th className="py-2.5">Product / SKU</th>
                    <th className="py-2.5">Price / Tax</th>
                    <th className="py-2.5">Sizes (S / M / L / XL)</th>
                    <th className="py-2.5 text-right">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amberfox/10 text-[11px]">
                  {products.map((prod) => {
                    const isSelected = selectedProduct.sku === prod.sku;
                    return (
                      <tr
                        key={prod.sku}
                        onClick={() => setSelectedProductId(prod.id || prod.sku)}
                        className={`hover:bg-noir-950/80 cursor-pointer transition-colors ${
                          isSelected ? 'bg-noir-950/90 border-l-2 border-amberfox' : ''
                        }`}
                      >
                        <td className="py-3.5 pr-2">
                          <p className="font-semibold text-parchment-100 line-clamp-1">{prod.name}</p>
                          <span className="text-[10px] text-amberfox font-mono">{prod.sku}</span>
                        </td>
                        <td className="py-3.5 text-parchment-200">
                          ₹{prod.price?.toLocaleString()}
                          <span className="block text-[10px] text-parchment-500">GST 12%</span>
                        </td>
                        <td className="py-3.5 text-parchment-300">
                          S {prod.size_s_stock || 0} • M {prod.size_m_stock || 0} • L{' '}
                          <span className={(prod.size_l_stock || 0) <= 5 ? 'text-amberfox font-bold' : ''}>
                            {prod.size_l_stock || 0}
                          </span>{' '}
                          • XL {prod.size_xl_stock || 0}
                        </td>
                        <td className="py-3.5 text-right space-y-1">
                          <span
                            className={`inline-block px-1.5 py-0.5 text-[10px] uppercase font-mono hairline-border ${
                              prod.status === 'Published'
                                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
                                : prod.status === 'Low stock'
                                ? 'text-amber-400 border-amber-500/30 bg-amber-950/30'
                                : 'text-parchment-500 border-parchment-500/30'
                            }`}
                          >
                            {prod.status}
                          </span>
                          <div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(prod);
                              }}
                              className="text-[9px] text-parchment-400 hover:text-amberfox uppercase underline tracking-wider"
                            >
                              Toggle State
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] font-mono text-parchment-500">
              Select any garment from the register above to inspect size allocation and adjust live inventory in the right panel.
            </p>
          </div>

          {/* Size Inventory Sub-Table for Currently Selected Product */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
                  SIZE-LEVEL BREAKDOWN
                </span>
                <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                  {selectedProduct.name}
                </h3>
              </div>
              <span className="font-mono text-xs text-parchment-400 px-2 py-1 bg-noir-950 hairline-border">
                {selectedProduct.sku}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
                <thead>
                  <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                    <th className="py-2">Size</th>
                    <th className="py-2">Available Stock</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amberfox/10 text-[11px]">
                  {(['S', 'M', 'L', 'XL'] as const).map((sz) => {
                    const count = getStockForSize(sz);
                    const isSelected = selectedSize === sz;
                    return (
                      <tr
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`hover:bg-noir-950/80 cursor-pointer ${
                          isSelected ? 'bg-noir-950/90 text-amberfox-gold' : ''
                        }`}
                      >
                        <td className="py-3 font-bold text-parchment-100">{sz}</td>
                        <td className="py-3 text-amberfox font-semibold">{count} units</td>
                        <td className="py-3">
                          {count === 0 ? (
                            <span className="text-red-400">Sold out</span>
                          ) : count <= 5 ? (
                            <span className="text-amber-400">Low stock</span>
                          ) : (
                            <span className="text-emerald-400">Optimal</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {isSelected ? (
                            <span className="text-amberfox-gold font-bold">Selected</span>
                          ) : (
                            <span className="text-parchment-400 hover:text-amberfox">Adjust</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Open Stock Drawer / Adjust Stock */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6 sticky top-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
              LIVE STOCK MANIPULATION DRAWER
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Adjust Stock
            </h3>
            <div className="mt-2 inline-flex items-center gap-2 bg-noir-950 text-amberfox font-mono text-[10px] uppercase px-3 py-1 hairline-border">
              <span>{selectedProduct.sku}</span>
              <span>•</span>
              <span>Size {selectedSize}</span>
              <span>•</span>
              <span>{selectedProduct.status}</span>
            </div>
          </div>

          <form onSubmit={handleSaveStock} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                Current Available ({selectedSize})
              </label>
              <input
                type="text"
                readOnly
                value={`${currentAvailable} units in vault`}
                className="w-full bg-noir-950 hairline-border p-3 text-parchment-300 opacity-90 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Stock Delta (+/-)
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
                  Resulting Stock
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
                Adjustment Reason *
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
                <option value="VIP consignment">VIP consignment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                Audit Note / Reason Log *
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
              <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Immutable Audit Record
              </span>
              <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                Updates live Supabase inventory immediately. Every stock modification is permanently recorded in the <code>public.inventory_adjustments</code> log table.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-950/80 hairline-border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Stock updated in Supabase &amp; inventory audit record recorded.</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 bg-red-950/80 hairline-border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer shadow-amber-glow disabled:opacity-50"
              >
                {isSaving ? 'SAVING TO SUPABASE...' : 'SAVE STOCK'}
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentValue(0)}
                className="hairline-border px-4 py-3 text-xs uppercase tracking-wider text-parchment-400 hover:text-parchment-100 cursor-pointer"
              >
                RESET
              </button>
            </div>
          </form>

          {/* Audit Info Box */}
          <div className="pt-4 border-t border-amberfox/15 font-mono text-[10px] text-parchment-500 space-y-1">
            <span className="uppercase text-parchment-400 font-semibold block">OPERATOR TELEMETRY</span>
            <p>Authorized Admin: Apex Operations (admin@moneyfox.co.in)</p>
            <p>Database: https://qxwqemlsxjvdpnxjkezr.supabase.co</p>
            <p>Target: {selectedProduct.sku} • Size {selectedSize} • Delta {adjustmentValue >= 0 ? `+${adjustmentValue}` : adjustmentValue}</p>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-noir-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-900 hairline-border max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amberfox/20 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
                  NEW LUXURY CATALOGUE ITEM
                </span>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Add Product
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-parchment-400 hover:text-parchment-100 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MoneyFox 'Cyber Wolf' 240 GSM Heavyweight Tee"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MF-240CW"
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1">
                    Colorway / Accent
                  </label>
                  <input
                    type="text"
                    value={newProductColor}
                    onChange={(e) => setNewProductColor(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1">
                    Status
                  </label>
                  <select
                    value={newProductStatus}
                    onChange={(e) => setNewProductStatus(e.target.value as any)}
                    className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                  >
                    <option value="Published">Published (Live in Shop)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-2">
                  Initial Size Inventory Allocation
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <span className="block text-[10px] text-parchment-400 mb-1">Size S</span>
                    <input
                      type="number"
                      value={newStockS}
                      onChange={(e) => setNewStockS(Number(e.target.value))}
                      className="w-full bg-noir-950 hairline-border p-2 text-parchment-100"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-parchment-400 mb-1">Size M</span>
                    <input
                      type="number"
                      value={newStockM}
                      onChange={(e) => setNewStockM(Number(e.target.value))}
                      className="w-full bg-noir-950 hairline-border p-2 text-parchment-100"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-parchment-400 mb-1">Size L</span>
                    <input
                      type="number"
                      value={newStockL}
                      onChange={(e) => setNewStockL(Number(e.target.value))}
                      className="w-full bg-noir-950 hairline-border p-2 text-parchment-100"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-parchment-400 mb-1">Size XL</span>
                    <input
                      type="number"
                      value={newStockXL}
                      onChange={(e) => setNewStockXL(Number(e.target.value))}
                      className="w-full bg-noir-950 hairline-border p-2 text-parchment-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amberfox/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="hairline-border px-4 py-2.5 text-xs uppercase tracking-wider text-parchment-400 hover:text-parchment-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="btn-gold-sheen text-noir-950 px-6 py-2.5 text-xs font-bold uppercase tracking-luxury cursor-pointer shadow-amber-glow disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
