import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { DeliveryAddress, SponsorInfo, ScreenView } from '../../types';

interface DeliveryAndSponsorProps {
  onNavigate: (screen: ScreenView) => void;
  onProceedToPayment: (address: DeliveryAddress, sponsor: SponsorInfo) => void;
  onBackToReview: () => void;
  selectedSize: string;
}

export const DeliveryAndSponsor: React.FC<DeliveryAndSponsorProps> = ({
  onNavigate,
  onProceedToPayment,
  onBackToReview,
  selectedSize,
}) => {
  const [form, setForm] = useState<DeliveryAddress>({
    fullName: 'Vikramaditya S.',
    mobile: '+91 98201 44810',
    email: 'vikram.s@matrixguild.in',
    apartment: 'Apt 14B, Oberoi Sky City',
    street: 'Western Express Hwy, Borivali East',
    city: 'Mumbai',
    pinCode: '400066',
    state: 'Maharashtra · 27',
    country: 'India',
    isBillingSame: true,
  });

  const [sponsorId, setSponsorId] = useState<string>('mf10001');
  const [isSponsorVerified, setIsSponsorVerified] = useState<boolean>(true);
  const [joinWaitingBench, setJoinWaitingBench] = useState<boolean>(false);
  const [sponsorError, setSponsorError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleVerifySponsor = () => {
    if (!sponsorId.trim()) {
      setSponsorError('Please enter a referrer ID or referral code.');
      setIsSponsorVerified(false);
      return;
    }
    if (sponsorId.trim().toLowerCase() === 'mf10001' || sponsorId.trim().toLowerCase() === 'mf10492') {
      setIsSponsorVerified(true);
      setSponsorError(null);
      setJoinWaitingBench(false);
    } else {
      setIsSponsorVerified(false);
      setSponsorError('We could not find an active referrer with this code or ID. Choose the waiting bench instead.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!form.pinCode.trim() || form.pinCode.trim().length !== 6) errors.pinCode = 'Enter a valid 6-digit PIN code.';
    if (!form.mobile.trim()) errors.mobile = 'Mobile number is required.';
    if (!form.email.trim()) errors.email = 'Email address is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onProceedToPayment(form, {
      sponsorId: joinWaitingBench ? 'BENCH' : sponsorId,
      sponsorName: joinWaitingBench ? 'Waiting Bench' : 'Rahul Sharma',
      isValid: isSponsorVerified || joinWaitingBench,
      joinBenchInstead: joinWaitingBench,
    });
  };

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
            Delivery &amp; association
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Choose where your Noir edition goes, and how you enter the network.
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
            <div className="py-2 border-b-2 border-amberfox text-amberfox-gold flex items-center space-x-2">
              <span className="font-bold">02</span>
              <span>Delivery &amp; referrer</span>
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

      {/* Main Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Consignee & Referrer Preferences */}
            <div className="lg:col-span-8 space-y-8">
              {/* Consignee Section */}
              <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                    01 // CONSIGNEE
                  </span>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                    Delivery address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      Full name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                      required
                    />
                    {formErrors.fullName && (
                      <span className="text-[10px] font-mono text-amberfox mt-1 block">{formErrors.fullName}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      Mobile number *
                    </label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Apartment / building *
                  </label>
                  <input
                    type="text"
                    value={form.apartment}
                    onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                    className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Street / locality *
                  </label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      PIN code *
                    </label>
                    <input
                      type="text"
                      value={form.pinCode}
                      onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                      maxLength={6}
                      required
                    />
                    {formErrors.pinCode && (
                      <span className="text-[10px] font-mono text-amberfox mt-1 block">{formErrors.pinCode}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      State *
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    >
                      <option value="Maharashtra · 27">Maharashtra · Code 27</option>
                      <option value="Karnataka · 29">Karnataka · Code 29</option>
                      <option value="Delhi · 07">Delhi · Code 07</option>
                      <option value="Tamil Nadu · 33">Tamil Nadu · Code 33</option>
                      <option value="Gujarat · 24">Gujarat · Code 24</option>
                      <option value="Telangana · 36">Telangana · Code 36</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value="India"
                      disabled
                      className="w-full bg-noir-900 hairline-border p-3 text-xs font-mono text-parchment-400 opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-2 text-xs font-mono text-parchment-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isBillingSame}
                      onChange={(e) => setForm({ ...form, isBillingSame: e.target.checked })}
                      className="rounded-none bg-noir-950 border-amberfox/40 text-amberfox focus:ring-0"
                    />
                    <span>Billing address is the same as delivery address</span>
                  </label>
                </div>
              </div>

              {/* Referrer Association Section */}
              <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                    02 // MEMBERSHIP ASSOCIATION
                  </span>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                    Referrer preference
                  </h2>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Referral Code / Referrer ID
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      disabled={joinWaitingBench}
                      value={sponsorId}
                      onChange={(e) => {
                        setSponsorId(e.target.value);
                        setIsSponsorVerified(false);
                      }}
                      className={`flex-1 bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox ${
                        joinWaitingBench ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter referral code or referrer ID (e.g. mf10001)"
                    />
                    <button
                      type="button"
                      disabled={joinWaitingBench}
                      onClick={handleVerifySponsor}
                      className="hairline-border px-5 py-3 text-xs font-mono uppercase tracking-wider hover:border-amberfox hover:text-amberfox text-parchment-200 cursor-pointer disabled:opacity-40"
                    >
                      VERIFY REFERRER
                    </button>
                  </div>

                  {/* Verification Outcome */}
                  {isSponsorVerified && !joinWaitingBench && (
                    <div className="mt-4 p-4 bg-noir-950 hairline-border border-emerald-500/30 text-xs font-mono space-y-1">
                      <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Referrer verified • Rahul Sharma</span>
                      </div>
                      <p className="text-[11px] text-parchment-400 font-light">
                        {sponsorId} • Active member. This identifies your referrer; it does not confirm a placement.
                      </p>
                    </div>
                  )}

                  {sponsorError && !joinWaitingBench && (
                    <div className="mt-4 p-4 bg-noir-950 hairline-border border-amberfox/40 text-xs font-mono space-y-2">
                      <div className="text-amberfox font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Referrer not found</span>
                      </div>
                      <p className="text-[11px] text-parchment-400 font-light">{sponsorError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setJoinWaitingBench(true);
                          setSponsorError(null);
                        }}
                        className="btn-gold-sheen text-noir-950 text-[10px] font-bold uppercase tracking-luxury px-3 py-1.5"
                      >
                        Join Waiting Bench
                      </button>
                    </div>
                  )}
                </div>

                {/* Waiting bench alternative radio */}
                <div className="pt-2 border-t border-amberfox/15">
                  <label className="flex items-start space-x-3 text-xs font-mono text-parchment-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={joinWaitingBench}
                      onChange={(e) => {
                        setJoinWaitingBench(e.target.checked);
                        if (e.target.checked) {
                          setSponsorError(null);
                        }
                      }}
                      className="mt-0.5 rounded-none bg-noir-950 border-amberfox/40 text-amberfox focus:ring-0"
                    />
                    <div>
                      <span className="font-semibold text-parchment-100">Join the waiting bench instead</span>
                      <p className="text-[11px] text-parchment-400 font-light mt-0.5">
                        No referrer? Continue with a bench preference. Assignment depends on review and open slots; placement is not guaranteed.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onBackToReview}
                  className="inline-flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-amberfox cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO ORDER REVIEW</span>
                </button>
              </div>
            </div>

            {/* Right Column: Order Recap & Place of Supply */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-noir-900 hairline-border p-6 space-y-6">
                <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                  Your order
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
                    <p className="text-xs font-mono text-parchment-400">Size {selectedSize} • Quantity 1</p>
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

                <button
                  type="submit"
                  className="w-full btn-gold-sheen text-noir-950 py-4 text-xs font-bold uppercase tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer"
                >
                  <span>CONTINUE TO UPI PAYMENT</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {/* Place of supply box */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm uppercase text-parchment-100">Place of supply</h4>
                  <span className="bg-noir-950 text-[10px] uppercase tracking-luxury px-2 py-0.5 hairline-border text-amberfox-gold">
                    {form.state}
                  </span>
                </div>
                <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
                  Intra-state supply • 12% GST total. Taxable value ₹1,785.71 + GST ₹214.29 = ₹2,000.
                </p>
                <p className="text-[10px] text-parchment-600 leading-relaxed font-light">
                  GST total is shown as the controlling value to avoid rounding differences between the two 6% components.
                </p>
              </div>

              {/* Before you continue disclosure */}
              <div className="border-l-2 border-amberfox bg-noir-900 p-4 space-y-1">
                <h4 className="font-serif text-xs text-amberfox font-semibold uppercase tracking-luxury">
                  Before you continue
                </h4>
                <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
                  Commissions depend on complete, validated levels and product distribution. Earnings and placement are not guaranteed; there is no assured income.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
