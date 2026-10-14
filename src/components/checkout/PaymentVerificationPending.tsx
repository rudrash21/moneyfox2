import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView } from '../../types';

interface PaymentVerificationPendingProps {
  onNavigate: (screen: ScreenView) => void;
  onSimulateApprove: () => void;
  utrNumber: string;
}

export const PaymentVerificationPending: React.FC<PaymentVerificationPendingProps> = ({
  onNavigate,
  onSimulateApprove,
  utrNumber = '429910488219',
}) => {
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
            Received. Awaiting review.
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Your payment reference has been submitted for manual verification.
          </p>
        </div>
      </div>

      {/* 4-Step Checkout Progress Bar */}
      <div className="border-b border-amberfox/15 bg-noir-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono uppercase tracking-luxury">
            <div className="py-2 border-b-2 border-emerald-500/80 text-emerald-400 flex items-center space-x-2">
              <span>✓</span>
              <span>Order review</span>
            </div>
            <div className="py-2 border-b-2 border-emerald-500/80 text-emerald-400 flex items-center space-x-2">
              <span>✓</span>
              <span>Delivery &amp; sponsor</span>
            </div>
            <div className="py-2 border-b-2 border-emerald-500/80 text-emerald-400 flex items-center space-x-2">
              <span>✓</span>
              <span>UPI payment</span>
            </div>
            <div className="py-2 border-b-2 border-amberfox text-amberfox-gold flex items-center space-x-2">
              <span className="font-bold">04</span>
              <span>Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Verification in Progress & Stage Tracker */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                  PAYMENT SUBMITTED
                </span>
                <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Verification in progress
                </h2>
                <div className="mt-2 inline-flex items-center space-x-2 bg-amber-950/60 hairline-border border-amberfox/40 px-3 py-1 font-mono text-[11px] text-amberfox-gold">
                  <Clock className="w-3.5 h-3.5 text-amberfox" />
                  <span>Pending manual verification</span>
                </div>
              </div>

              {/* UTR Big Display */}
              <div className="py-2">
                <span className="font-serif text-3xl sm:text-4xl tracking-wider text-parchment-100">
                  UTR <span className="font-mono font-bold text-amberfox">{utrNumber}</span>
                </span>
                <p className="text-xs font-mono text-parchment-400 mt-1">
                  ₹2,000 • Order ORD-MFX-99412
                </p>
                <p className="text-xs font-mono text-parchment-400 mt-0.5">
                  Vikramaditya S. • vikram.s@matrixguild.in
                </p>
              </div>

              {/* Yellow Highlighted Do Not Pay Again Notice */}
              <div className="border-l-2 border-amberfox bg-noir-950 p-4 space-y-1">
                <h4 className="font-serif text-xs text-amberfox font-semibold uppercase tracking-luxury">
                  Please do not pay again
                </h4>
                <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                  This submission is not an approved payment or an instant placement. Keep your bank receipt and wait for the review outcome before taking another payment action.
                </p>
              </div>

              {/* Stage Progression Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                      <th className="py-2">Stage</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">What happens next</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amberfox/10 text-[11px]">
                    <tr>
                      <td className="py-3 text-parchment-200">Reference received</td>
                      <td className="py-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </td>
                      <td className="py-3 text-right text-amberfox-gold">12-digit UTR recorded</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-parchment-200">Manual review</td>
                      <td className="py-3 text-amberfox">Pending</td>
                      <td className="py-3 text-right text-parchment-400">Amount and reference checked</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-parchment-400">Order approval</td>
                      <td className="py-3 text-parchment-600">Not yet active</td>
                      <td className="py-3 text-right text-parchment-400">Invoice and membership follow approval</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-parchment-400">Placement review</td>
                      <td className="py-3 text-parchment-600">Not started</td>
                      <td className="py-3 text-right text-parchment-400">Open slots or waiting bench reviewed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* While we check box */}
            <div className="bg-noir-900 hairline-border p-6 space-y-4">
              <h3 className="font-serif text-lg uppercase tracking-wider text-parchment-100">
                While we check
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs font-light text-parchment-300">
                <li>Keep your payment receipt and order reference.</li>
                <li>Follow your order for an approved or rejected outcome.</li>
                <li>If details need correction, our team will tell you what to submit.</li>
              </ol>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('member-terminal')}
                  className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury flex items-center cursor-pointer"
                >
                  <span>VIEW ORDER STATUS</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => onNavigate('member-terminal')}
                  className="hairline-border px-6 py-3 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox cursor-pointer"
                >
                  CONTACT SUPPORT
                </button>
                {/* Instant Simulation Action */}
                <button
                  onClick={onSimulateApprove}
                  className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 px-4 py-3 text-xs font-mono uppercase tracking-wider hover:bg-emerald-900 cursor-pointer ml-auto"
                  title="Simulate Admin verification to see approved state"
                >
                  ⚡ [Simulate Admin Approval →]
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Submitted Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-noir-900 hairline-border p-6 space-y-6">
              <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                Submitted order
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

              <div className="pt-4 border-t border-amberfox/15 font-mono text-xs space-y-2">
                <span className="text-[10px] uppercase text-amberfox tracking-luxury">SPONSOR PREFERENCE</span>
                <p className="text-parchment-100 font-semibold">Rahul Sharma • mf10001</p>
                <div className="inline-block bg-noir-950 hairline-border px-2.5 py-1 text-[10px] text-parchment-400">
                  Membership awaiting approval
                </div>
              </div>
            </div>

            {/* Concierge Assistance */}
            <div className="bg-noir-900 hairline-border p-6 space-y-2 font-mono text-xs">
              <h4 className="font-serif text-sm uppercase tracking-wider text-parchment-100">
                Concierge assistance
              </h4>
              <p className="text-amberfox-gold">support@moneyfox.luxury</p>
              <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                Include ORD-MFX-99412 in your message. Never share your UPI PIN or banking password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
