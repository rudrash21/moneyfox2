import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ScreenView } from '../../types';

interface StatesGalleryProps {
  onNavigate: (screen: ScreenView) => void;
}

export const StatesGalleryView: React.FC<StatesGalleryProps> = ({ onNavigate }) => {
  const [activeSheet, setActiveSheet] = useState<'checkout' | 'admin' | 'member'>('checkout');

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
            <span className="text-parchment-400">DESIGN SYSTEM STATES COMPOSITION</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-2">
            Editable State Compositions
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Visual review of all field feedbacks, edge cases, admin guarded states and member lifecycle conditions.
          </p>

          {/* Sheet Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-6 font-mono text-xs">
            <button
              onClick={() => setActiveSheet('checkout')}
              className={`px-4 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeSheet === 'checkout'
                  ? 'bg-amberfox text-noir-950 font-bold'
                  : 'hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              1. Access &amp; Checkout States (12 tiles)
            </button>
            <button
              onClick={() => setActiveSheet('admin')}
              className={`px-4 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeSheet === 'admin'
                  ? 'bg-amberfox text-noir-950 font-bold'
                  : 'hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              2. Admin Guarded States (9 tiles)
            </button>
            <button
              onClick={() => setActiveSheet('member')}
              className={`px-4 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeSheet === 'member'
                  ? 'bg-amberfox text-noir-950 font-bold'
                  : 'hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              3. Member Lifecycle &amp; Payout States (15 tiles)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* SHEET 1: Access & Checkout States */}
        {activeSheet === 'checkout' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Access &amp; checkout states
            </h2>
            <p className="text-xs font-mono text-parchment-400">
              Field feedback, access recovery and payment exceptions / Companion to the shopping journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              {/* Tile 1 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  DELIVERY / REQUIRED &amp; INVALID
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Complete required details</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value=""
                    placeholder="Enter your full name"
                    className="w-full bg-noir-950 border border-amberfox/60 p-2 text-xs"
                    readOnly
                  />
                  <p className="text-[10px] text-amberfox">Full name is required.</p>
                  <input
                    type="text"
                    value="4000"
                    className="w-full bg-noir-950 border border-amberfox/60 p-2 text-xs"
                    readOnly
                  />
                  <p className="text-[10px] text-amberfox">Enter a valid 6-digit PIN code.</p>
                </div>
              </div>

              {/* Tile 2 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  REFERRER / NO MATCH
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Referrer not found</h4>
                <input
                  type="text"
                  value="mf99999"
                  className="w-full bg-noir-950 hairline-border p-2 text-xs"
                  readOnly
                />
                <p className="text-[11px] text-parchment-400">We could not find an active referrer with this code or ID.</p>
                <div className="border-l-2 border-amberfox bg-noir-950 p-2.5 space-y-1">
                  <span className="text-amberfox text-[10px] font-bold block">Prefer to continue?</span>
                  <p className="text-[10px] text-parchment-400">
                    Choose the waiting bench instead. Placement depends on review and open slots.
                  </p>
                </div>
                <button className="btn-gold-sheen text-noir-950 px-3 py-1.5 text-[10px] font-bold uppercase">
                  JOIN WAITING BENCH
                </button>
              </div>

              {/* Tile 3 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  REGISTRATION / EXISTING ACCOUNT
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Email already registered</h4>
                <input
                  type="text"
                  value="vikram.s@matrixguild.in"
                  className="w-full bg-noir-950 hairline-border p-2 text-xs"
                  readOnly
                />
                <p className="text-[11px] text-parchment-400">
                  This email is already associated with an account. Sign in to your existing account or recover access.
                </p>
                <div className="flex gap-2">
                  <button className="btn-gold-sheen text-noir-950 px-3 py-1.5 text-[10px] font-bold uppercase">
                    SIGN IN
                  </button>
                  <button className="hairline-border px-3 py-1.5 text-[10px] uppercase">RECOVER ACCESS</button>
                </div>
              </div>

              {/* Tile 4 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">LOGIN / ERROR</span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Credentials not recognised</h4>
                <input
                  type="text"
                  value="mf10492"
                  className="w-full bg-noir-950 hairline-border p-2 text-xs"
                  readOnly
                />
                <input
                  type="password"
                  value="wrongpassword"
                  className="w-full bg-noir-950 hairline-border p-2 text-xs"
                  readOnly
                />
                <p className="text-[10px] text-amberfox">The ID/email and password combination is incorrect.</p>
                <div className="flex gap-2">
                  <button className="btn-gold-sheen text-noir-950 px-3 py-1.5 text-[10px] font-bold uppercase">
                    TRY SIGNING IN
                  </button>
                  <button className="hairline-border px-3 py-1.5 text-[10px] uppercase">FORGOT PASSWORD?</button>
                </div>
              </div>

              {/* Tile 5 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  PRODUCT / OUT OF STOCK
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">XL is unavailable</h4>
                <div className="p-2 bg-noir-950 hairline-border line-through opacity-70">XL • Unavailable</div>
                <p className="text-[11px] text-parchment-400">Choose S, M or L to continue.</p>
                <div className="flex gap-2">
                  <span className="hairline-border px-3 py-1">S</span>
                  <span className="hairline-border px-3 py-1">M</span>
                  <span className="bg-amberfox text-noir-950 font-bold px-3 py-1">L</span>
                </div>
              </div>

              {/* Tile 6 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  PAYMENT / DUPLICATE UTR
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Reference already submitted</h4>
                <input
                  type="text"
                  value="429910488219"
                  className="w-full bg-noir-950 hairline-border p-2 text-xs text-amberfox"
                  readOnly
                />
                <div className="border-l-2 border-amberfox bg-noir-950 p-2.5 space-y-1">
                  <span className="text-amberfox text-[10px] font-bold block">Do not pay or submit again</span>
                  <p className="text-[10px] text-parchment-400">
                    This reference has already been recorded. Check existing order status.
                  </p>
                </div>
                <button className="btn-gold-sheen text-noir-950 px-3 py-1.5 text-[10px] font-bold uppercase">
                  VIEW ORDER STATUS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHEET 2: Admin Guarded States */}
        {activeSheet === 'admin' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Admin guarded states
            </h2>
            <p className="text-xs font-mono text-parchment-400">
              Explicit confirmation, reason capture and review outcomes / Operations role • Apex Admin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              {/* Tile 1: Approve payment */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  PAYMENT / CONFIRM APPROVAL
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Approve this payment?</h4>
                <p className="text-parchment-300">ORD-MFX-99412 • mf10492 • ₹2,000</p>
                <input
                  type="text"
                  value="429910488219"
                  readOnly
                  className="w-full bg-noir-950 hairline-border p-2 text-xs"
                />
                <div className="border-l-2 border-amberfox bg-noir-950 p-2.5">
                  <span className="text-amberfox font-bold text-[10px] block">Approval is not placement</span>
                  <p className="text-[10px] text-parchment-400">
                    Approval confirms merchandise order and activates membership. Network placement is separate.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-gold-sheen text-noir-950 px-3 py-1 text-[10px] font-bold uppercase">
                    CONFIRM APPROVAL
                  </button>
                  <button className="hairline-border px-3 py-1 text-[10px] uppercase">CANCEL</button>
                </div>
              </div>

              {/* Tile 2: Slot already occupied */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  PLACEMENT / CONFLICT
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Slot is already occupied</h4>
                <div className="inline-block bg-noir-950 px-2 py-0.5 text-[10px] text-red-400 hairline-border">
                  Conflict • No change applied
                </div>
                <p className="text-parchment-300">Target mf10510 • Right slot</p>
                <div className="border-l-2 border-amberfox bg-noir-950 p-2.5">
                  <span className="text-amberfox font-bold text-[10px] block">Refresh before choosing again</span>
                  <p className="text-[10px] text-parchment-400">
                    Another member now occupies this slot. The candidate stays on the waiting bench.
                  </p>
                </div>
                <button className="btn-gold-sheen text-noir-950 px-3 py-1 text-[10px] font-bold uppercase">
                  REFRESH TREE
                </button>
              </div>

              {/* Tile 3: Stock edit saved */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  INVENTORY / SAVED
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Stock edit saved</h4>
                <div className="inline-block bg-noir-950 px-2 py-0.5 text-[10px] text-emerald-400 hairline-border">
                  Adjustment recorded
                </div>
                <p className="text-parchment-300">MF-280N-L • Signature Noir • L</p>
                <div className="flex justify-between p-2 bg-noir-950 hairline-border text-[11px]">
                  <span>Before: 4</span>
                  <span className="text-amberfox">Delta: +10</span>
                  <span className="text-emerald-400">After: 14 units</span>
                </div>
                <p className="text-[10px] text-parchment-500">
                  Apex Admin • 24 Oct 2025 • 14:40 IST • Restock received
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SHEET 3: Member Lifecycle States */}
        {activeSheet === 'member' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Member states &amp; lifecycle
            </h2>
            <p className="text-xs font-mono text-parchment-400">
              Activation, orders, referrals, placement and withdrawals / Distinct escrow, paid and retry outcomes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              {/* Tile 1 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  MEMBERSHIP / MANUAL REVIEW
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Activation is pending</h4>
                <div className="inline-block bg-noir-950 text-amberfox px-2 py-0.5 text-[10px] hairline-border">
                  Not yet active
                </div>
                <p className="text-parchment-300">Vikramaditya S. • mf10492</p>
                <div className="border-l-2 border-amberfox bg-noir-950 p-2.5">
                  <span className="text-amberfox font-bold text-[10px] block">Payment review in progress</span>
                  <p className="text-[10px] text-parchment-400">
                    ORD-MFX-99412 • ₹2,000. Your submitted UTR is being reviewed.
                  </p>
                </div>
                <button className="btn-gold-sheen text-noir-950 px-3 py-1.5 text-[10px] font-bold uppercase">
                  VIEW PAYMENT STATUS
                </button>
              </div>

              {/* Tile 2 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  PAYOUT / AMOUNT TOO LOW
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Below the minimum</h4>
                <input
                  type="text"
                  value="₹300"
                  readOnly
                  className="w-full bg-noir-950 hairline-border p-2 text-xs"
                />
                <p className="text-[11px] text-amberfox">Minimum withdrawal is ₹500.</p>
                <p className="text-[10px] text-parchment-400">Available: ₹18,900</p>
                <button className="hairline-border px-3 py-1.5 text-[10px] uppercase">SET AMOUNT TO ₹500</button>
              </div>

              {/* Tile 3 */}
              <div className="bg-noir-900 hairline-border p-6 space-y-3">
                <span className="text-[10px] text-amberfox tracking-luxury uppercase block">
                  PAYOUT / DISBURSEMENT REVIEW
                </span>
                <h4 className="font-serif text-lg uppercase text-parchment-100">Processing</h4>
                <div className="font-serif text-2xl font-bold text-amberfox">₹3,200 held</div>
                <p className="text-parchment-300">WD-10492-007 • v•••••.s@upi</p>
                <div className="border-l-2 border-amberfox bg-noir-950 p-2.5">
                  <span className="text-amberfox font-bold text-[10px] block">Disbursement under review</span>
                  <p className="text-[10px] text-parchment-400">
                    The amount remains in escrow until a paid or failed outcome is recorded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
