import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Trash2, Edit3, ShoppingBag } from 'lucide-react';
import { BRAND_ASSETS, INITIAL_PRODUCTS } from '../../data/mockData';
import { ScreenView } from '../../types';

interface CartOrderReviewProps {
  onNavigate: (screen: ScreenView) => void;
  onProceedToDelivery: () => void;
  selectedSize: 'S' | 'M' | 'L' | 'XL';
  onUpdateSize: (size: 'S' | 'M' | 'L' | 'XL') => void;
  selectedEdition?: 'noir' | 'ivory';
  selectedProductId?: string;
}

export const CartOrderReview: React.FC<CartOrderReviewProps> = ({
  onNavigate,
  onProceedToDelivery,
  selectedSize,
  onUpdateSize,
  selectedEdition = 'noir',
  selectedProductId,
}) => {
  const [isEditingSize, setIsEditingSize] = useState<boolean>(false);
  const [isEmptyCart, setIsEmptyCart] = useState<boolean>(false);

  const product = INITIAL_PRODUCTS.find((p) => p.id === selectedProductId) || INITIAL_PRODUCTS[0];
  const garmentImage = product.angles?.front || product.image;
  const editionLabel = `${product.series.toUpperCase()} • ${product.gsm} GSM`;
  const editionTitle = product.name;

  if (isEmptyCart) {
    return (
      <div className="bg-noir-950 text-parchment-100 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full hairline-border flex items-center justify-center mx-auto text-amberfox">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <span className="font-mono text-xs uppercase tracking-luxury text-amberfox">0 items</span>
          <h2 className="font-serif text-3xl uppercase tracking-wider">No garment selected.</h2>
          <p className="text-xs text-parchment-400 max-w-md mx-auto">
            Explore the collection and choose your size before beginning checkout. No order or payment has been created.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('product-detail')}
              className="btn-gold-sheen text-noir-950 font-bold uppercase tracking-luxury px-6 py-3 text-xs"
            >
              Explore the Collection →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-parchment-400">SHOPPING &amp; ACCOUNT ACCESS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-2">
            Your order, considered.
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Review your garment and membership unit before continuing.
          </p>
        </div>
      </div>

      {/* 4-Step Checkout Progress Bar */}
      <div className="border-b border-amberfox/15 bg-noir-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono uppercase tracking-luxury">
            <div className="py-2 border-b-2 border-amberfox text-amberfox-gold flex items-center space-x-2">
              <span className="font-bold">01</span>
              <span>Order review</span>
            </div>
            <div className="py-2 border-b-2 border-transparent text-parchment-600 flex items-center space-x-2">
              <span>02</span>
              <span>Delivery &amp; sponsor</span>
            </div>
            <div className="py-2 border-b-2 border-transparent text-parchment-600 flex items-center space-x-2">
              <span>03</span>
              <span>UPI payment</span>
            </div>
            <div className="py-2 border-b-2 border-transparent text-parchment-600 flex items-center space-x-2">
              <span>04</span>
              <span>Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Merchandise Review */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-noir-900 hairline-border p-6 sm:p-8">
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                ONE MEMBERSHIP UNIT
              </span>
              <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100 mb-6">
                Merchandise review
              </h2>

              {/* Item Card */}
              <div className="flex flex-col sm:flex-row gap-6 pb-6 hairline-border-b">
                <div className="w-full sm:w-40 aspect-square bg-[#080706] hairline-border overflow-hidden shrink-0">
                  <img
                    src={garmentImage}
                    alt={editionTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold">
                      {editionLabel}
                    </span>
                    <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100 mt-1">
                      {editionTitle}
                    </h3>
                    <p className="text-xs font-mono text-parchment-400 mt-1">
                      Size {selectedSize} ({selectedSize === 'S' ? 'Small' : selectedSize === 'M' ? 'Medium' : selectedSize === 'L' ? 'Large' : 'XL'}) • Quantity 1
                    </p>
                    <p className="font-serif text-lg text-amberfox font-semibold mt-3">
                      ₹2,000 <span className="text-xs font-mono text-parchment-400 font-normal">• Inclusive of 12% GST</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <button
                      onClick={() => setIsEditingSize(!isEditingSize)}
                      className="hairline-border px-3 py-1.5 text-xs font-mono uppercase tracking-wider hover:border-amberfox hover:text-amberfox cursor-pointer"
                    >
                      EDIT SIZE • {selectedSize}
                    </button>
                    <span className="hairline-border px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-parchment-400">
                      QUANTITY • 1
                    </span>
                    <button
                      onClick={() => setIsEmptyCart(true)}
                      className="hairline-border px-3 py-1.5 text-xs font-mono uppercase tracking-wider hover:text-red-400 cursor-pointer"
                    >
                      REMOVE
                    </button>
                  </div>

                  {isEditingSize && (
                    <div className="pt-3 flex gap-2">
                      {(['S', 'M', 'L'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            onUpdateSize(s);
                            setIsEditingSize(false);
                          }}
                          className={`px-3 py-1 text-xs font-mono ${
                            selectedSize === s
                              ? 'bg-amberfox text-noir-950 font-bold'
                              : 'hairline-border hover:border-amberfox'
                          }`}
                        >
                          Size {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[11px] font-mono text-parchment-400 mt-4">
                This checkout is limited to one membership unit. Your selected garment is {product.name}, size {selectedSize}, quantity 1.
              </p>
            </div>

            {/* Included with your order Box */}
            <div className="bg-noir-900 hairline-border p-6 space-y-4">
              <h3 className="font-serif text-lg uppercase tracking-wider text-parchment-100">
                Included with your order
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block mb-1">
                    DELIVERY
                  </span>
                  <p className="text-parchment-200">Complimentary express courier</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block mb-1">
                    MEMBERSHIP
                  </span>
                  <p className="text-parchment-200">Activated after manual payment approval</p>
                </div>
              </div>
            </div>

            {/* Statutory Qualification Notice */}
            <div className="border-l-2 border-amberfox bg-noir-900 p-4 space-y-1">
              <h4 className="font-serif text-xs text-amberfox font-semibold uppercase tracking-luxury">
                Qualification is conditional
              </h4>
              <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
                100 PV is a points measure, not a cash value. Commissions depend on complete, validated levels and product distribution. Earnings and placement are not guaranteed; there is no assured income.
              </p>
            </div>

            <div>
              <button
                onClick={() => onNavigate('storefront')}
                className="inline-flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-amberfox cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>CONTINUE SHOPPING</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Trigger */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-noir-900 hairline-border p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                  Order summary
                </h3>
                <span className="bg-noir-950 font-mono text-[10px] uppercase tracking-luxury px-2 py-0.5 hairline-border text-parchment-400">
                  Noir {selectedSize} • Qty 1
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono divide-y divide-amberfox/10">
                <div className="flex justify-between pt-2">
                  <span className="text-parchment-400">Taxable value</span>
                  <span className="text-parchment-100">₹1,785.71</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-parchment-400">GST • 12%</span>
                  <span className="text-parchment-100">₹214.29</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-parchment-400">Delivery</span>
                  <span className="text-emerald-400">Complimentary</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="font-serif text-lg uppercase tracking-wider text-parchment-100 font-semibold">Total</span>
                  <span className="font-serif text-3xl font-bold text-amberfox">₹2,000</span>
                </div>
              </div>

              <button
                onClick={onProceedToDelivery}
                className="w-full btn-gold-sheen text-noir-950 py-4 text-xs font-bold uppercase tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer"
              >
                <span>CONTINUE TO DELIVERY</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
                The next step collects your delivery details and sponsor preference. No payment is taken on this screen.
              </p>
            </div>

            {/* Need a hand box */}
            <div className="bg-noir-900 hairline-border p-6 space-y-2">
              <h4 className="font-serif text-sm uppercase tracking-wider text-parchment-100">
                Need a hand?
              </h4>
              <p className="text-xs text-parchment-400 font-light leading-relaxed">
                Questions about fit or your order? Reach our concierge at{' '}
                <span className="text-amberfox-gold font-mono">support@moneyfox.luxury</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
