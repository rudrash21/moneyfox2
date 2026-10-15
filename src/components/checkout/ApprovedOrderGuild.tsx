import React from 'react';
import { CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView } from '../../types';

interface ApprovedOrderGuildProps {
  onNavigate: (screen: ScreenView) => void;
  onOpenTaxInvoice: () => void;
  onOpenMemberDashboard: () => void;
}

export const ApprovedOrderGuild: React.FC<ApprovedOrderGuildProps> = ({
  onNavigate,
  onOpenTaxInvoice,
  onOpenMemberDashboard,
}) => {
  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24">
      {/* Top Header / Breadcrumb strip */}
      <div className="border-b border-amberfox/15 bg-noir-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-luxury text-amberfox uppercase">
            <button
              onClick={() => onNavigate('products')}
              className="hover:underline text-parchment-400 cursor-pointer"
            >
              PRODUCTS
            </button>
            <span className="text-parchment-600">/</span>
            <span className="text-parchment-400">SHOPPING &amp; ACCOUNT ACCESS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-2">
            Welcome to the private guild.
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Approved state • Your merchandise order is confirmed and your membership is active.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Payment Approved Callout */}
        <div className="bg-noir-900 border-l-2 border-amberfox p-5 space-y-1">
          <div className="flex items-center space-x-2 text-amberfox font-serif text-sm font-semibold uppercase tracking-luxury">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Payment approved • ₹2,000</span>
          </div>
          <p className="text-xs text-parchment-300 font-light leading-relaxed">
            Manual review completed for UTR 429910488219. Order ORD-MFX-99412 is approved. Membership activation is separate from network placement.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Merchandise Confirmed & Membership */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                  MERCHANDISE CONFIRMED
                </span>
                <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Order ORD-MFX-99412
                </h2>
              </div>

              {/* Item Details */}
              <div className="flex flex-col sm:flex-row gap-6 pb-6 hairline-border-b">
                <div className="w-full sm:w-36 aspect-square bg-[#080706] hairline-border overflow-hidden shrink-0">
                  <img
                    src={BRAND_ASSETS.noirTeeImage}
                    alt="Noir Tee"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-parchment-400 uppercase">NOIR EDITION • 280 GSM</span>
                  <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100 mt-0.5">
                    Signature Heavyweight Tee
                  </h3>
                  <p className="text-xs font-mono text-parchment-400 mt-1">Size L (Large) • Quantity 1</p>
                  <p className="text-sm font-mono text-amberfox font-semibold mt-2">
                    ₹2,000 • Inclusive of 12% GST
                  </p>
                </div>
              </div>

              {/* Documents & Identifiers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                      <th className="py-2">Document</th>
                      <th className="py-2">Reference</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amberfox/10 text-[11px]">
                    <tr>
                      <td className="py-3 text-parchment-200">Order</td>
                      <td className="py-3 text-parchment-100 font-semibold">ORD-MFX-99412</td>
                      <td className="py-3 text-right text-emerald-400">Approved</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-parchment-200">Invoice</td>
                      <td className="py-3 text-parchment-100 font-semibold">INV-20251024-8891</td>
                      <td className="py-3 text-right text-amberfox-gold">Available</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-parchment-200">Member</td>
                      <td className="py-3 text-parchment-100 font-semibold">mf10492</td>
                      <td className="py-3 text-right text-emerald-400">Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={onOpenTaxInvoice}
                  className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury flex items-center cursor-pointer shadow-amber-glow"
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>VIEW TAX INVOICE</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </button>
                <button
                  onClick={() => onNavigate('member-terminal')}
                  className="hairline-border px-6 py-3 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox cursor-pointer flex items-center"
                >
                  <span>SHOP ORDERS</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Membership mf10492 Card */}
            <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Membership mf10492
                </h3>
                <span className="bg-emerald-950/80 text-emerald-400 text-xs font-mono px-3 py-1 hairline-border border-emerald-500/30">
                  Active • Vikramaditya S.
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs text-parchment-400">
                <p>Sponsor: Rahul Sharma • mf10001</p>
                <p className="font-light leading-relaxed">
                  Placement: awaiting open-slot review. Membership activation does not guarantee a network position or a commission.
                </p>
              </div>

              <div className="p-4 bg-noir-950 hairline-border space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-luxury text-amberfox font-semibold block">
                  Your next steps
                </span>
                <p className="text-xs text-parchment-300 font-light leading-relaxed">
                  Visit your member dashboard, review your profile and payout details, and follow your order as it moves to dispatch.
                </p>
              </div>

              <div>
                <button
                  onClick={onOpenMemberDashboard}
                  className="btn-gold-sheen text-noir-950 px-8 py-4 text-xs font-bold uppercase tracking-luxury flex items-center shadow-amber-glow cursor-pointer"
                >
                  <span>OPEN MEMBER DASHBOARD</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Accounting & Delivery Dossier */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Accounting Box */}
            <div className="bg-noir-900 hairline-border p-6 space-y-6">
              <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                Order accounting
              </h3>

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

              <p className="text-[11px] font-mono text-parchment-400 leading-relaxed font-light">
                Maharashtra • State code 27 • Intra-state supply • GST 12%.
              </p>
            </div>

            {/* Delivery Dossier Box */}
            <div className="bg-noir-900 hairline-border p-6 space-y-4 font-mono text-xs">
              <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                Delivery dossier
              </h3>

              <div>
                <span className="text-amberfox text-[11px] font-bold block uppercase tracking-luxury">
                  VIKRAMADITYA S.
                </span>
                <p className="text-parchment-300 mt-1 leading-relaxed text-[11px]">
                  Apt 14B, Oberoi Sky City, Western Express Hwy, Borivali East, Mumbai, Maharashtra - 400066.
                </p>
                <p className="text-parchment-400 mt-1">+91 98201 44810</p>
              </div>

              <div className="pt-2">
                <span className="inline-block bg-amber-950/60 text-amberfox-soft text-[10px] tracking-luxury uppercase px-2.5 py-1 hairline-border border-amberfox/30">
                  Preparing for dispatch
                </span>
              </div>

              <p className="text-[11px] text-parchment-400 leading-relaxed font-light pt-1">
                BlueDart Apex Secure Air • Dispatch within 48–72 hours following approval. Tracking details follow by email when available.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Income Disclosure */}
        <div className="border-l-2 border-amberfox bg-noir-900 p-4">
          <h4 className="font-serif text-xs text-amberfox font-semibold uppercase tracking-luxury mb-0.5">
            Income disclosure
          </h4>
          <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
            Commissions depend on complete, validated levels and product distribution. Earnings and placement are not guaranteed; there is no assured income.
          </p>
        </div>
      </div>
    </div>
  );
};
