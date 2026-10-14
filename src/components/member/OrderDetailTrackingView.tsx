import React from 'react';
import { ArrowLeft, CheckCircle2, Circle, Clock, ExternalLink, HelpCircle } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { OrderRecord } from '../../types';

interface OrderDetailTrackingProps {
  order: OrderRecord;
  onBackToOrders: () => void;
  onOpenInvoice: () => void;
  onOpenConcierge: () => void;
}

export const OrderDetailTrackingView: React.FC<OrderDetailTrackingProps> = ({
  order,
  onBackToOrders,
  onOpenInvoice,
  onOpenConcierge,
}) => {
  const steps = [
    { title: 'Payment approved', desc: '24 Oct 2025 • Manual verification completed', status: 'completed' },
    { title: 'Preparing your garment', desc: 'Packing and fulfilment preparation completed', status: 'completed' },
    { title: 'Dispatched', desc: 'BlueDart Apex Secure Air • Courier handoff', status: 'completed' },
    { title: 'In transit', desc: 'Current shipment stage • Carrier update awaited', status: 'current' },
    { title: 'Out for delivery', desc: 'Awaiting carrier confirmation', status: 'pending' },
    { title: 'Delivered', desc: 'Not yet delivered • Confirmation pending', status: 'pending' },
  ];

  return (
    <div className="space-y-8">
      {/* Back button & Title */}
      <div>
        <button
          onClick={onBackToOrders}
          className="inline-flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-amberfox mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO SHOP ORDERS</span>
        </button>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Your Noir edition, en route.
        </h1>
        <p className="text-xs text-parchment-400 font-mono mt-1">
          {order.orderId} / {order.date} / Vikramaditya S. • mf10492
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipment Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 hairline-border-b">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block mb-0.5">
                  BLUE DART APEX SECURE AIR
                </span>
                <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Shipment timeline
                </h2>
              </div>
              <span className="inline-block bg-amber-950/60 text-amberfox-gold text-xs font-mono px-3 py-1 hairline-border border-amberfox/40">
                In transit
              </span>
            </div>

            {/* Vertical Stepper */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-amberfox/20">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start space-x-4">
                  <div className="absolute -left-6 mt-0.5">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-amberfox bg-noir-900" />
                    ) : step.status === 'current' ? (
                      <div className="w-4 h-4 rounded-full border-2 border-amberfox bg-amberfox flex items-center justify-center animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4 text-parchment-600 bg-noir-900" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`font-serif text-sm uppercase tracking-wider ${
                        step.status === 'completed' || step.status === 'current'
                          ? 'text-parchment-100'
                          : 'text-parchment-600'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs font-mono text-parchment-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking Reference Note */}
            <div className="border-l-2 border-amberfox bg-noir-950 p-4 font-mono text-xs space-y-1">
              <span className="text-amberfox font-semibold uppercase tracking-luxury block text-[10px]">
                Tracking reference
              </span>
              <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                Carrier tracking credentials are not shown. Use the tracking details supplied with your dispatch email when available.
              </p>
            </div>
          </div>

          {/* Order Assistance Box */}
          <div className="bg-noir-900 hairline-border p-6 space-y-4">
            <h3 className="font-serif text-lg uppercase tracking-wider text-parchment-100">
              Order assistance
            </h3>
            <p className="text-xs text-parchment-300 font-light leading-relaxed">
              Need help with delivery? Contact <span className="text-amberfox-gold font-mono">support@moneyfox.luxury</span> and quote {order.orderId}.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenConcierge}
                className="btn-gold-sheen text-noir-950 px-5 py-2.5 text-xs font-bold uppercase tracking-luxury cursor-pointer"
              >
                GET ORDER ASSISTANCE
              </button>
              <button
                onClick={onOpenInvoice}
                className="hairline-border px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox flex items-center gap-1 cursor-pointer"
              >
                <span>VIEW INVOICE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Merchandise & Ship to */}
        <div className="lg:col-span-5 space-y-6">
          {/* Merchandise Box */}
          <div className="bg-noir-900 hairline-border p-6 space-y-6">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Merchandise
            </h3>

            <div className="flex gap-4 items-center pb-4 hairline-border-b">
              <img
                src={BRAND_ASSETS.noirTeeImage}
                alt="Noir Tee"
                className="w-16 h-16 object-cover hairline-border bg-noir-850"
              />
              <div>
                <span className="text-[10px] font-mono text-parchment-400 uppercase">NOIR EDITION • 280 GSM</span>
                <h4 className="font-serif text-sm uppercase text-parchment-100">Signature Heavyweight Tee</h4>
                <p className="text-xs font-mono text-parchment-400">Size L (Large) • Quantity 1</p>
                <p className="text-xs font-mono text-amberfox font-semibold mt-1">₹2,000 • Inclusive of 12% GST</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono divide-y divide-amberfox/10">
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
          </div>

          {/* Ship To Box */}
          <div className="bg-noir-900 hairline-border p-6 space-y-3 font-mono text-xs">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Ship to
            </h3>
            <span className="text-amberfox uppercase font-bold text-[11px] block">
              VIKRAMADITYA S.
            </span>
            <p className="text-parchment-300 leading-relaxed text-[11px]">
              Apt 14B, Oberoi Sky City, Western Express Hwy, Borivali East, Mumbai, Maharashtra - 400066.
            </p>
            <p className="text-parchment-400">+91 98201 44810</p>
          </div>

          {/* Returns Box */}
          <div className="bg-noir-900 hairline-border p-6 space-y-3 font-mono text-xs">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Returns
            </h3>
            <div>
              <span className="inline-block bg-noir-950 text-amberfox-gold text-[10px] tracking-luxury uppercase px-2 py-0.5 hairline-border">
                Delivery confirmation pending
              </span>
            </div>
            <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
              The published seven-day return statement is the basis for requesting a review. Delivery has not yet been confirmed, so a return window is not displayed.
            </p>
            <button
              onClick={onOpenConcierge}
              className="hairline-border px-4 py-2 text-xs uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox cursor-pointer"
            >
              ASK ABOUT A RETURN
            </button>
            <p className="text-[10px] text-parchment-600 font-light">
              A request is reviewed by support; it is not a refund guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
