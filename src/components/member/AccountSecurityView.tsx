import React, { useState } from 'react';
import { ShieldCheck, Check, Key, Smartphone, AlertCircle } from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';

export const AccountSecurityView: React.FC = () => {
  const [profile, setProfile] = useState({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    mobile: CURRENT_USER.mobile,
  });
  const [address, setAddress] = useState(CURRENT_USER.deliveryAddress);
  const [upiSettings, setUpiSettings] = useState(CURRENT_USER.upiPayout);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveFeedback('Profile details saved successfully.');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Account &amp; security
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Profile, delivery preferences and payout details for Vikramaditya S. • mf10492.
        </p>
      </div>

      {saveFeedback && (
        <div className="p-4 bg-noir-900 hairline-border border-emerald-500/40 text-emerald-300 font-mono text-xs">
          {saveFeedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile, Address & UPI Payout */}
        <div className="lg:col-span-7 space-y-8">
          {/* Member Profile */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Member profile
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Display name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Member ID • Read only
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="mf10492"
                    className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-400 opacity-80 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Mobile
                </label>
                <input
                  type="tel"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                />
              </div>

              <button
                type="submit"
                className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer"
              >
                SAVE PROFILE
              </button>
            </form>
          </div>

          {/* Delivery Address */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Delivery address
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Saved address
                </label>
                <textarea
                  rows={2}
                  value={`${address.apartment}, ${address.street}, ${address.city}, ${address.state} - ${address.pinCode}.`}
                  readOnly
                  className="w-full bg-noir-950 hairline-border p-3 text-xs text-parchment-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-parchment-400 mb-1">State</label>
                  <input
                    type="text"
                    readOnly
                    value="Maharashtra • 27"
                    className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-parchment-400 mb-1">PIN</label>
                  <input
                    type="text"
                    readOnly
                    value="400066"
                    className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-200"
                  />
                </div>
              </div>

              <button
                type="button"
                className="hairline-border px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer"
              >
                UPDATE ADDRESS
              </button>
            </div>
          </div>

          {/* UPI Payout Settings */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              UPI payout settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  UPI holder name
                </label>
                <input
                  type="text"
                  readOnly
                  value="Vikramaditya S."
                  className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  UPI ID
                </label>
                <input
                  type="text"
                  readOnly
                  value="vikram.s@upi"
                  className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100"
                />
                <div className="mt-2 inline-block bg-noir-950 text-emerald-400 font-mono text-[10px] uppercase px-2.5 py-0.5 hairline-border border-emerald-500/30">
                  Holder verification • Verified record
                </div>
              </div>

              <p className="text-[11px] font-mono text-parchment-400 font-light leading-relaxed">
                Changing this destination requires a fresh holder review. Existing requests retain the destination recorded when they were submitted.
              </p>

              <button
                type="button"
                className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer"
              >
                SAVE &amp; REQUEST VERIFICATION
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Password, 2FA & Sessions */}
        <div className="lg:col-span-5 space-y-8">
          {/* Change Password */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Change password
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Current password
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full bg-noir-950 hairline-border p-3 text-xs text-parchment-100"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full bg-noir-950 hairline-border p-3 text-xs text-parchment-100"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Confirm new password
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full bg-noir-950 hairline-border p-3 text-xs text-parchment-100"
                />
              </div>

              <p className="text-[10px] text-parchment-600">
                Use a unique password of at least 12 characters.
              </p>

              <button
                type="button"
                className="btn-gold-sheen text-noir-950 px-5 py-2.5 text-xs font-bold uppercase tracking-luxury cursor-pointer"
              >
                UPDATE PASSWORD
              </button>
            </div>
          </div>

          {/* Two Factor Security */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                Two factor security
              </h3>
              <span className="bg-noir-950 font-mono text-[10px] uppercase tracking-luxury px-2 py-0.5 hairline-border text-parchment-400">
                Not configured
              </span>
            </div>

            <p className="text-xs text-parchment-300 font-light leading-relaxed">
              Add an authenticator as a second step when signing in. Recovery codes would be shown during setup, never in your profile.
            </p>

            <button
              type="button"
              className="hairline-border px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer"
            >
              SET UP TWO-FACTOR
            </button>

            <div className="border-l-2 border-amberfox bg-noir-950 p-3 font-mono text-xs space-y-1">
              <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block">
                Security preview
              </span>
              <p className="text-[10px] text-parchment-400 font-light leading-relaxed">
                These controls represent the intended account experience. Authentication, password changes and two-factor security are functional in this preview.
              </p>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-4 font-mono text-xs">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Sessions
            </h3>

            <div className="divide-y divide-amberfox/15 text-[11px]">
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="text-parchment-100 font-semibold block">Chrome • Desktop</span>
                  <span className="text-[10px] text-parchment-400">Current session</span>
                </div>
                <span className="text-amberfox-gold">This device</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="text-parchment-100 font-semibold block">Safari • Desktop</span>
                  <span className="text-[10px] text-parchment-400">23 Oct 2025</span>
                </div>
                <button type="button" className="text-parchment-400 hover:text-red-400 cursor-pointer">
                  Sign out
                </button>
              </div>
            </div>

            <p className="text-[10px] text-parchment-600">
              Sample session display • No IP addresses or access tokens shown.
            </p>

            <button
              type="button"
              className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer w-full text-center"
            >
              SIGN OUT OTHER SESSIONS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
