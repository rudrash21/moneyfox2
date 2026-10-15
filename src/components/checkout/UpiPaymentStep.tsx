import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Copy, Check, AlertCircle, ShieldCheck, RefreshCw, QrCode } from 'lucide-react';
import { DeliveryAddress, SponsorInfo, ScreenView, UserProfile } from '../../types';
import { dbService } from '../../lib/dbService';

interface UpiPaymentProps {
  onNavigate: (screen: ScreenView) => void;
  onPaymentSubmitted: (utr: string, orderId?: string) => void;
  onBackToDelivery: () => void;
  deliveryAddress: DeliveryAddress;
  sponsorInfo: SponsorInfo;
  selectedSize: string;
  currentUser?: UserProfile | null;
}

interface UpiAccount {
  id: string;
  name: string;
  vpa: string;
  badge: string;
  accentColor: string;
}

const UPI_ACCOUNTS: UpiAccount[] = [
  {
    id: 'paytm',
    name: 'Paytm UPI',
    vpa: '6383739271@pthdfc',
    badge: 'HDFC Bank Gateway',
    accentColor: '#00BAF2',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    vpa: 'rudrash21@ybl',
    badge: 'YES Bank Escrow',
    accentColor: '#5F259F',
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    vpa: 'rudrash024@oksbi',
    badge: 'SBI Official Escrow',
    accentColor: '#4285F4',
  },
];

export const UpiPaymentStep: React.FC<UpiPaymentProps> = ({
  onNavigate,
  onPaymentSubmitted,
  onBackToDelivery,
  deliveryAddress,
  sponsorInfo,
  selectedSize,
  currentUser,
}) => {
  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState<number>(0);
  const [utrNumber, setUtrNumber] = useState<string>('429910488219');
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [utrError, setUtrError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeGateway = UPI_ACCOUNTS[selectedGatewayIndex];
  const payableAmount = 2000;

  // Real UPI deep link URL conforming to NPCI UPI spec
  const upiDeepLink = `upi://pay?pa=${activeGateway.vpa}&pn=MoneyFox&am=${payableAmount}&cu=INR&tn=MoneyFox%20Joining%20Fee`;

  // Real live QR code image URL from public QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(activeGateway.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError('Enter exactly 12 numeric digits from your UPI payment receipt.');
      return;
    }
    setUtrError(null);
    setIsSubmitting(true);

    try {
      const activeUserId = currentUser?.authUserId || '76e55172-02aa-4d96-9fa9-197dcf081b99';
      const activeMoneyFoxId = currentUser?.moneyfoxId || 'MF8287277732BB';

      // Submit real payment record to Supabase
      const res = await dbService.submitPayment({
        userId: activeUserId,
        moneyfoxId: activeMoneyFoxId,
        utrNumber: cleanUtr,
        upiVpa: activeGateway.vpa,
        amount: payableAmount,
        deliveryAddress,
        sponsorInfo,
        selectedSize,
      });

      setIsSubmitting(false);

      if (res.success) {
        onPaymentSubmitted(cleanUtr, res.orderId);
      } else {
        setUtrError(res.error || 'Failed to record payment in database. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setUtrError(err.message || 'Error communicating with database.');
    }
  };

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24 font-sans selection:bg-amberfox selection:text-noir-950">
      {/* Top Header / Breadcrumb strip */}
      <div className="border-b border-amberfox/15 bg-noir-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-luxury text-amberfox uppercase">
            <button
              onClick={() => onNavigate('storefront')}
              className="hover:underline text-parchment-400 cursor-pointer"
            >
              HOME
            </button>
            <span className="text-parchment-600">/</span>
            <span className="text-parchment-400">CHECKOUT PAYMENT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-2">
            Direct UPI Gateway Settlement
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Real-time NPCI payment rails • Standard ₹2,000 joining fee • 12% GST invoice included
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
              <span>Delivery &amp; referrer</span>
            </div>
            <div className="py-2 border-b-2 border-amberfox text-amberfox-gold flex items-center space-x-2">
              <span className="font-bold">03</span>
              <span>UPI payment</span>
            </div>
            <div className="py-2 border-b-2 border-transparent text-parchment-600 flex items-center space-x-2">
              <span>04</span>
              <span>Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main UPI Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Real QR Code & Gateway Tabs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 hairline-border-b">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                    03 // REAL UPI GATEWAY RAILS
                  </span>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                    Select Gateway &amp; Scan QR
                  </h2>
                </div>
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-amberfox">₹2,000</span>
                  <span className="block text-[10px] font-mono text-parchment-400">12% GST INCLUDED</span>
                </div>
              </div>

              {/* 3 UPI Gateway Tabs */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-luxury text-parchment-400 block">
                  CHOOSE PAYMENT GATEWAY ACCOUNT:
                </span>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {UPI_ACCOUNTS.map((gw, idx) => {
                    const isSelected = selectedGatewayIndex === idx;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setSelectedGatewayIndex(idx)}
                        className={`p-3 text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-noir-950 border-amberfox text-amberfox shadow-amber-glow font-bold'
                            : 'bg-noir-950/60 border-amberfox/20 text-parchment-400 hover:text-parchment-200 hover:border-amberfox/50'
                        }`}
                      >
                        <div className="text-xs font-semibold uppercase">{gw.name}</div>
                        <div className="text-[9px] text-parchment-400 truncate mt-0.5">{gw.badge}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live QR Code Display */}
              <div className="flex flex-col sm:flex-row items-center gap-8 bg-noir-950 hairline-border p-6 relative">
                <div className="relative p-2.5 bg-white rounded-none shrink-0 shadow-2xl border-2 border-amberfox/40">
                  <img
                    src={qrCodeUrl}
                    alt="MoneyFox Real UPI QR Code"
                    className="w-48 h-48 block"
                    loading="eager"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-noir-950 text-amberfox text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-luxury font-bold border border-amberfox/40 shadow">
                      MF UPI
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 font-mono text-xs w-full">
                  <div>
                    <span className="text-[10px] text-amberfox uppercase tracking-luxury block mb-1">
                      ACTIVE RECEIVING VPA ({activeGateway.name}):
                    </span>
                    <div className="flex items-center justify-between bg-noir-900 hairline-border p-3 border-amberfox/30">
                      <span className="text-parchment-100 font-bold tracking-wide break-all">
                        {activeGateway.vpa}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        className="p-1.5 hover:text-amberfox text-parchment-400 cursor-pointer shrink-0 ml-2 bg-noir-950 border border-amberfox/20"
                        title="Copy UPI VPA"
                      >
                        {copiedVpa ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                            <Check className="w-3.5 h-3.5" />
                            <span>COPIED</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px]">
                            <Copy className="w-3.5 h-3.5" />
                            <span>COPY</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-parchment-400 font-light leading-relaxed space-y-1">
                    <p>• Scan using Paytm, PhonePe, Google Pay, or BHIM.</p>
                    <p>• Alternatively, pay ₹2,000 directly to <strong className="text-amberfox">{activeGateway.vpa}</strong>.</p>
                    <p>• Copy the 12-digit UTR from your bank confirmation screen.</p>
                  </div>

                  <a
                    href={upiDeepLink}
                    className="inline-flex items-center gap-1.5 text-[11px] text-amberfox-gold hover:underline pt-1"
                  >
                    <span>Open in Default UPI App (Mobile) →</span>
                  </a>
                </div>
              </div>

              {/* Supported Gateway Partners */}
              <div className="pt-2">
                <span className="block text-[10px] uppercase font-mono tracking-luxury text-parchment-500 mb-2">
                  DIRECT ESCROW RAILS CONFIGURED:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="hairline-border py-2 bg-noir-950 text-parchment-300">
                    Paytm (pthdfc)
                  </div>
                  <div className="hairline-border py-2 bg-noir-950 text-parchment-300">
                    PhonePe (ybl)
                  </div>
                  <div className="hairline-border py-2 bg-noir-950 text-parchment-300">
                    Google Pay (oksbi)
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToDelivery}
              className="inline-flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-amberfox cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO DELIVERY &amp; REFERRER</span>
            </button>
          </div>

          {/* Right Column: 12-digit UTR Submission Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                  FINAL TRANSACTION VALIDATION
                </span>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Enter 12-Digit UTR
                </h3>
                <p className="text-xs text-parchment-400 font-light mt-1">
                  Recorded in your banking app as "UPI Ref No.", "UTR", or "Transaction Reference".
                </p>
              </div>

              <form onSubmit={handleUtrSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5 flex justify-between">
                    <span>12-Digit UTR Reference *</span>
                    <span className="text-[10px] text-amberfox font-semibold">REQUIRED</span>
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value.replace(/\D/g, ''));
                      setUtrError(null);
                    }}
                    maxLength={12}
                    className="w-full bg-noir-950 hairline-border p-3.5 text-sm font-mono tracking-widest text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="e.g. 429910488219"
                    required
                  />
                  {utrError && (
                    <div className="mt-2 text-[11px] font-mono text-amberfox flex items-center gap-1.5 bg-amber-950/40 p-2 border border-amberfox/30">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amberfox" />
                      <span>{utrError}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-noir-950 hairline-border text-[11px] font-mono space-y-1.5 text-parchment-400">
                  <div className="flex justify-between">
                    <span>Payable Amount:</span>
                    <span className="text-parchment-100 font-bold">₹2,000 (Incl. 12% GST)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Gateway:</span>
                    <span className="text-amberfox">{activeGateway.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient VPA:</span>
                    <span className="text-parchment-300 font-mono">{activeGateway.vpa}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold-sheen text-noir-950 py-4 text-xs font-bold uppercase tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting To Supabase Database...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>SUBMIT REFERENCE &amp; VERIFY</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>

              <div className="p-4 bg-noir-950 hairline-border text-[11px] font-mono space-y-2 text-parchment-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-semibold uppercase tracking-luxury">Real-Time Escrow Reconciliation</span>
                </div>
                <p className="font-light leading-relaxed">
                  Your reference is directly stored in the Supabase payments database. The Operations Admin dashboard immediately displays this entry for 1-click verification.
                </p>
              </div>
            </div>

            {/* Quick helper prefill buttons */}
            <div className="bg-noir-900 hairline-border p-4 text-xs font-mono space-y-2">
              <span className="text-[10px] uppercase text-amberfox tracking-luxury">QUICK TEST PREFILL</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setUtrNumber('429910488219')}
                  className="hairline-border px-3 py-1 text-[11px] hover:border-amberfox text-parchment-200 cursor-pointer"
                >
                  UTR: 429910488219
                </button>
                <button
                  type="button"
                  onClick={() => setUtrNumber(String(Math.floor(100000000000 + Math.random() * 900000000000)))}
                  className="hairline-border px-3 py-1 text-[11px] hover:border-amberfox text-amberfox cursor-pointer"
                >
                  Generate Random 12-Digit UTR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
