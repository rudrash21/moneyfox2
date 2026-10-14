import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, ExternalLink, Check, Sparkles, ShieldCheck, Eye } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/mockData';
import { ScreenView, Product } from '../../types';

interface ProductDetailProps {
  onNavigate: (screen: ScreenView) => void;
  onAddToCartAndProceed: (productId: string, size: 'S' | 'M' | 'L' | 'XL') => void;
  initialProductId?: string;
  selectedProductId?: string;
  onSelectProduct?: (productId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailProps> = ({
  onNavigate,
  onAddToCartAndProceed,
  initialProductId,
  selectedProductId,
  onSelectProduct,
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedProductId || initialProductId || 'chill-black');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');
  const [activeAngle, setActiveAngle] = useState<'front' | 'back' | 'left' | 'right'>('front');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProductId) {
      setCurrentId(selectedProductId);
    }
  }, [selectedProductId]);

  const product: Product = INITIAL_PRODUCTS.find((p) => p.id === currentId) || INITIAL_PRODUCTS[0];

  const handleSwitchProduct = (id: string) => {
    setCurrentId(id);
    setActiveAngle('front');
    if (onSelectProduct) {
      onSelectProduct(id);
    }
  };

  const angleOptions: { id: 'front' | 'back' | 'left' | 'right'; label: string; src: string }[] = [
    { id: 'front', label: 'FRONT', src: product.angles?.front || product.image },
    { id: 'back', label: 'BACK', src: product.angles?.back || product.image },
    { id: 'left', label: 'LEFT SIDE', src: product.angles?.left || product.image },
    { id: 'right', label: 'RIGHT SIDE', src: product.angles?.right || product.image },
  ];

  const currentDisplayImage =
    angleOptions.find((a) => a.id === activeAngle)?.src || product.angles?.front || product.image;

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24">
      {/* Top Header / Breadcrumb strip */}
      <div className="border-b border-amberfox/15 bg-noir-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-luxury text-amberfox uppercase">
            <button
              onClick={() => onNavigate('storefront')}
              className="hover:underline text-parchment-400 cursor-pointer"
            >
              ATELIER
            </button>
            <span className="text-parchment-600">/</span>
            <button
              onClick={() => onNavigate('products')}
              className="hover:underline text-amberfox font-semibold cursor-pointer"
            >
              PRODUCTS
            </button>
            <span className="text-parchment-600">/</span>
            <span className="text-parchment-300 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-2">
            {product.name}
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            {product.series} • {product.lot}
          </p>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center space-x-2 text-xs font-mono text-amberfox hover:underline cursor-pointer transition-colors font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← RETURN TO ALL PRODUCTS</span>
          </button>
          <span className="text-parchment-600 font-mono text-xs">•</span>
          <button
            onClick={() => onNavigate('storefront')}
            className="text-xs font-mono text-parchment-400 hover:text-amberfox cursor-pointer transition-colors"
          >
            HOME STOREFRONT
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Big Multi-Angle Showcase */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image Container (Clean without overlays) */}
            <div className="relative bg-white border-2 border-amberfox/30 rounded-2xl overflow-hidden aspect-square sm:aspect-[4/3] flex items-center justify-center shadow-2xl p-4">
              <img
                src={currentDisplayImage}
                alt={`${product.name} - ${activeAngle} view`}
                className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnail Gallery Row (4 angles only: Front, Back, Left, Right) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {angleOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveAngle(opt.id)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-1 ${
                    activeAngle === opt.id
                      ? 'border-amberfox ring-2 ring-amberfox/50 scale-102'
                      : 'border-noir-800 hover:border-amberfox/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={opt.src} alt={opt.label} className="w-full h-full object-contain" />
                  <span className="absolute bottom-0.5 inset-x-0 text-[8px] sm:text-[9px] font-mono uppercase text-center font-bold bg-noir-950/90 text-amberfox py-0.5 truncate px-0.5">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details, Sizes & Checkout */}
          <div className="lg:col-span-5 space-y-6">
            {/* Product Overview Card */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-luxury text-amberfox">
                <Sparkles className="w-3.5 h-3.5 text-amberfox" />
                <span>{product.series}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-parchment-100">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-amberfox-gold font-medium font-mono">
                {product.color} • {product.lot}
              </p>
              <p className="text-xs text-parchment-300 leading-relaxed font-light pt-2">
                {product.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="pt-4 border-t border-amberfox/20 flex items-baseline justify-between">
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-amberfox font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-xs font-mono text-parchment-400 block mt-0.5">
                  Tax Invoiced (HSN 6109 • 12% GST Included)
                </span>
              </div>
              <span className="px-3 py-1 bg-amberfox/15 border border-amberfox text-amberfox font-mono text-xs font-bold rounded-lg uppercase">
                Direct Selling Drop
              </span>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-parchment-400 uppercase tracking-luxury">
                  SELECT SIZE • <strong className="text-amberfox font-bold">{selectedSize} SELECTED</strong>
                </span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-amberfox hover:underline inline-flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Size guide</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {(['S', 'M', 'L', 'XL'] as const).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-center font-mono text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-amberfox bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                          : 'bg-noir-900 border-amberfox/20 hover:border-amberfox/60 text-parchment-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Collapsible Size Guide */}
              {showSizeGuide && (
                <div className="p-3 bg-noir-900 border border-amberfox/25 rounded-xl text-[11px] font-mono space-y-1 text-parchment-300">
                  <div className="text-amberfox font-bold">Standard Indian Drop-Shoulder Spec:</div>
                  <div className="flex justify-between"><span>S (38):</span><span>Chest 40" • Length 28"</span></div>
                  <div className="flex justify-between"><span>M (40):</span><span>Chest 42" • Length 29"</span></div>
                  <div className="flex justify-between text-amberfox font-bold"><span>L (42 - Popular):</span><span>Chest 44" • Length 30"</span></div>
                  <div className="flex justify-between"><span>XL (44):</span><span>Chest 46" • Length 31"</span></div>
                </div>
              )}
            </div>

            {/* Main Purchase CTA */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onAddToCartAndProceed(currentId, selectedSize)}
                className="w-full btn-gold-sheen text-noir-950 py-4 text-xs sm:text-sm uppercase font-bold tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer rounded-xl"
              >
                <span>ACQUIRE {product.editionTag?.toUpperCase()} ({selectedSize}) — ₹2,000</span>
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </button>
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-noir-900 text-parchment-400 font-mono text-[10px] border border-amberfox/20 rounded-md uppercase tracking-luxury">
                  Qualifies for 9-Level Binary Tree Node &amp; ₹1,53,300 Matrix Potential
                </span>
              </div>
            </div>

            {/* Product Key Points */}
            <div className="bg-noir-900 border border-amberfox/25 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="font-serif text-sm uppercase text-parchment-100 tracking-wider font-bold">
                Tailoring &amp; Specifications
              </h3>
              <ul className="text-xs text-parchment-300 space-y-2 font-light">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-amberfox shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery & Statutory Guarantee */}
            <div className="border border-amberfox/25 bg-noir-900/60 rounded-2xl p-4 space-y-2 text-xs font-light text-parchment-400">
              <div className="flex items-center space-x-2 text-amberfox font-semibold font-mono text-[11px] uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Complimentary Insured Delivery Across India</span>
              </div>
              <p className="leading-relaxed">
                Dispatched in luxury protective packaging within 48–72 hours following order verification. Complete statutory GST tax invoice generated automatically upon placement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Streetwear Catalog Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-amberfox/20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-amberfox font-mono text-xs uppercase tracking-luxury mb-3 px-3 py-1 bg-amberfox/10 border border-amberfox/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amberfox" />
            <span>THE OFFICIAL ATELIER COLLECTION • 240 GSM HEAVYWEIGHT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif uppercase tracking-wider text-parchment-100 font-bold">
            All Qualifying Streetwear Drops
          </h2>
          <p className="text-xs sm:text-sm text-parchment-300 mt-3 font-light leading-relaxed">
            Every garment purchase above <strong className="text-amberfox">₹2,000</strong> qualifies you in the binary tree and activates commission eligibility. Click any edition below to inspect its 4 camera angles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {INITIAL_PRODUCTS.map((prod) => {
            const isCurrentlyInspected = prod.id === currentId;
            const displayImage = prod.angles?.front || prod.image;

            return (
              <div
                key={prod.id}
                className={`bg-noir-900/90 border rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group relative overflow-hidden ${
                  isCurrentlyInspected
                    ? 'border-amberfox ring-2 ring-amberfox/40 shadow-[0_0_30px_rgba(245,138,46,0.2)]'
                    : 'border-amberfox/25 hover:border-amberfox/60 hover:shadow-[0_0_30px_rgba(245,138,46,0.15)]'
                }`}
              >
                {/* Card Top Pill & GSM Tag */}
                <div className="flex items-center justify-between pb-3 text-xs font-mono">
                  <span className="text-amberfox font-bold uppercase tracking-wider text-[11px]">
                    {prod.editionTag}
                  </span>
                  <span className="px-2 py-0.5 bg-amberfox/15 text-amberfox border border-amberfox/30 text-[10px] font-bold rounded uppercase">
                    240 GSM
                  </span>
                </div>

                {/* Clean Product Stage Box */}
                <div
                  onClick={() => {
                    handleSwitchProduct(prod.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative bg-white rounded-xl aspect-square p-3 flex items-center justify-center cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden shadow-inner"
                >
                  <img
                    src={displayImage}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain transition-all duration-300"
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-noir-950/85 text-parchment-200 px-2 py-0.5 font-mono text-[9px] uppercase rounded border border-amberfox/20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3 h-3 text-amberfox" />
                    <span>Inspect 4 Angles</span>
                  </div>
                </div>

                {/* Product Metadata & Price */}
                <div className="pt-4 space-y-3">
                  <div>
                    <h3
                      onClick={() => {
                        handleSwitchProduct(prod.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-serif text-lg sm:text-xl text-parchment-100 font-bold uppercase hover:text-amberfox transition-colors cursor-pointer line-clamp-1"
                    >
                      {prod.name.replace('MoneyFox ', '')}
                    </h3>
                    <p className="text-xs text-amberfox-gold font-mono mt-0.5">
                      {prod.color}
                    </p>
                    <p className="text-xs text-parchment-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Features Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-parchment-300">
                    <span className="px-2 py-0.5 bg-noir-950 border border-amberfox/15 rounded">
                      ✓ Commission Qualified
                    </span>
                    <span className="px-2 py-0.5 bg-noir-950 border border-amberfox/15 rounded">
                      ✓ Free Express Shipping
                    </span>
                    <span className="px-2 py-0.5 bg-noir-950 border border-amberfox/15 rounded">
                      ✓ 12% GST Invoice
                    </span>
                  </div>

                  {/* Price and Action Row */}
                  <div className="pt-3 border-t border-amberfox/15 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-2xl font-bold text-amberfox">₹{prod.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-mono text-parchment-400 block">
                        Inclusive of GST
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleSwitchProduct(prod.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-3 py-2 border text-xs font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer ${
                          isCurrentlyInspected
                            ? 'border-amberfox bg-amberfox/15 text-amberfox'
                            : 'border-amberfox/40 hover:border-amberfox text-parchment-200 hover:text-amberfox'
                        }`}
                      >
                        {isCurrentlyInspected ? 'Inspecting' : 'Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCartAndProceed(prod.id, selectedSize)}
                        className="btn-gold-sheen text-noir-950 px-3.5 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-lg shadow-amber-glow cursor-pointer flex items-center gap-1"
                      >
                        <span>Acquire</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
