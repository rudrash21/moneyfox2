import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminOverviewProps {
  onSwitchTab: (tab: AdminTab) => void;
  onOpenPaymentModal: () => void;
  onOpenPayoutModal: () => void;
  onOpenStockModal: () => void;
}

export const AdminOverviewView: React.FC<AdminOverviewProps> = ({
  onSwitchTab,
  onOpenPaymentModal,
  onOpenPayoutModal,
  onOpenStockModal,
}) => {
  const chartDays = [
    { date: '18 Oct', count: 12, height: '45%' },
    { date: '19 Oct', count: 14, height: '52%' },
    { date: '20 Oct', count: 18, height: '68%' },
    { date: '21 Oct', count: 15, height: '58%' },
    { date: '22 Oct', count: 22, height: '82%' },
    { date: '23 Oct', count: 19, height: '72%' },
    { date: '24 Oct', count: 24, height: '95%', isToday: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          BACK OFFICE / OPERATIONS
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Operations at a glance
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          24 October 2025 • Sample operational snapshot • Manual review and guarded actions.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            APPROVED ORDERS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">124</div>
          <p className="text-[11px] font-mono text-parchment-400">₹2,48,000 gross • Includes GST</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            VERIFICATION QUEUE
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">3</div>
          <p className="text-[11px] font-mono text-parchment-400">₹6,000 submitted • Not approved</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            PAYOUT REQUESTS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">2</div>
          <p className="text-[11px] font-mono text-parchment-400">₹4,200 held in escrow</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            WAITING BENCH
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">18</div>
          <p className="text-[11px] font-mono text-parchment-400">12 paid • 6 awaiting payment</p>
        </div>
      </div>

      {/* 2-Column: Volume Histogram & Outcomes / Economies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Approved Order Volume Histogram */}
        <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
              18–24 OCTOBER / UNITS
            </span>
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Approved order volume
            </h2>
          </div>

          {/* Histogram Bar Display */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-amberfox/15">
            {chartDays.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-parchment-400">{d.count}</span>
                <div
                  style={{ height: d.height }}
                  className={`w-full max-w-[48px] transition-all ${
                    d.isToday ? 'bg-amberfox shadow-amber-glow' : 'bg-noir-700 hover:bg-noir-600'
                  }`}
                />
                <span className="text-[10px] font-mono text-parchment-400 whitespace-nowrap">{d.date}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-mono text-parchment-400">
            124 approved units in the period • ₹2,000 each, inclusive of 12% GST.
          </p>
        </div>

        {/* Verification Outcomes & Economies */}
        <div className="lg:col-span-5 space-y-8">
          {/* Outcomes */}
          <div className="bg-noir-900 hairline-border p-6 space-y-4 font-mono text-xs">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Verification outcomes
            </h3>

            <div className="divide-y divide-amberfox/10 text-[11px]">
              <div className="flex justify-between py-2.5">
                <span className="text-parchment-300">Approved</span>
                <span className="text-parchment-100 font-semibold">124</span>
                <span className="text-emerald-400">93.2%</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-parchment-300">Pending</span>
                <span className="text-amberfox font-semibold">3</span>
                <span className="text-amberfox">2.3%</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-parchment-300">Rejected</span>
                <span className="text-parchment-100 font-semibold">6</span>
                <span className="text-red-400">4.5%</span>
              </div>
            </div>

            <p className="text-[10px] text-parchment-600">
              133 submissions • Pending references are excluded from approved order volume.
            </p>

            <button
              onClick={onOpenPaymentModal}
              className="btn-gold-sheen text-noir-950 px-5 py-2.5 text-xs font-bold uppercase tracking-luxury w-full flex items-center justify-center cursor-pointer shadow-amber-glow"
            >
              <span>OPEN PAYMENT QUEUE</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Economies Box */}
          <div className="bg-noir-900 hairline-border p-6 space-y-3 font-mono text-xs">
            <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              ₹2,000 order economies
            </h3>

            <div className="space-y-1.5 text-parchment-300 pt-2">
              <div className="flex justify-between">
                <span>Taxable value</span>
                <span>₹1,785.71</span>
              </div>
              <div className="flex justify-between">
                <span>GST • 12%</span>
                <span>₹214.29</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-amberfox/20 font-serif text-2xl font-bold text-amberfox">
                <span>Total</span>
                <span>₹2,000</span>
              </div>
            </div>

            <p className="text-[10px] text-parchment-600 leading-relaxed font-light pt-2">
              Taxable merchandise value is not profit. Product costs and operating expenses are not represented.
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Queues Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Actionable queues
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Queue</th>
                <th className="py-2.5">Reference</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              <tr className="hover:bg-noir-950/60">
                <td className="py-3 text-parchment-200">Payment review</td>
                <td className="py-3 text-amberfox-gold font-semibold">ORD-MFX-99412</td>
                <td className="py-3 text-amberfox">UTR submitted</td>
                <td className="py-3 text-right">
                  <button
                    onClick={onOpenPaymentModal}
                    className="text-amberfox hover:underline font-semibold cursor-pointer"
                  >
                    Review →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-noir-950/60">
                <td className="py-3 text-parchment-200">Payout review</td>
                <td className="py-3 text-parchment-100">WD-10492-007</td>
                <td className="py-3 text-parchment-300">₹3,200 held</td>
                <td className="py-3 text-right">
                  <button
                    onClick={onOpenPayoutModal}
                    className="text-amberfox hover:underline font-semibold cursor-pointer"
                  >
                    Inspect →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-noir-950/60">
                <td className="py-3 text-parchment-200">Placement review</td>
                <td className="py-3 text-parchment-100">mf10524</td>
                <td className="py-3 text-parchment-300">Paid • Bench</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onSwitchTab('trees-placements')}
                    className="text-amberfox hover:underline font-semibold cursor-pointer"
                  >
                    Open tree →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-noir-950/60">
                <td className="py-3 text-parchment-200">Low inventory</td>
                <td className="py-3 text-parchment-100">MF-280N-L</td>
                <td className="py-3 text-red-400">4 units remain</td>
                <td className="py-3 text-right">
                  <button
                    onClick={onOpenStockModal}
                    className="text-amberfox hover:underline font-semibold cursor-pointer"
                  >
                    Adjust stock →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-parchment-600">
          Operations role: review records and prepare decisions. Confirmation and reason are required for sensitive actions.
        </p>
      </div>

      {/* Bench Readiness */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-4 font-mono text-xs">
        <span className="text-[10px] uppercase tracking-luxury text-amberfox-gold block">
          PLACEMENT QUEUE / 18 MEMBERS
        </span>
        <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Bench readiness
        </h3>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-parchment-300">Paid • Ready for placement review</span>
              <span className="text-amberfox font-semibold">12</span>
            </div>
            <div className="w-full bg-noir-950 h-2 overflow-hidden">
              <div className="bg-amberfox h-full w-[66%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-parchment-400">Awaiting payment approval</span>
              <span className="text-parchment-400">6</span>
            </div>
            <div className="w-full bg-noir-950 h-2 overflow-hidden">
              <div className="bg-noir-700 h-full w-[33%]" />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-parchment-400 font-light leading-relaxed pt-2">
          Payment approval makes a record ready for review; it does not guarantee a placement. Open-slot and eligibility checks remain separate decisions.
        </p>

        <button
          onClick={() => onSwitchTab('trees-placements')}
          className="hairline-border px-5 py-2.5 text-xs uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox cursor-pointer"
        >
          OPEN GLOBAL WAITING BENCH →
        </button>
      </div>

      {/* Accountability & System Audit Log Card */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amberfox/15 pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-amberfox-gold block">
              GOVERNANCE &amp; STATUTORY COMPLIANCE
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100 mt-0.5">
              System Audit Ledger
            </h3>
          </div>
          <span className="px-2 py-0.5 border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 text-[10px] uppercase">
            IMMUTABLE TRAIL · ACTIVE
          </span>
        </div>

        <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
          Every privileged intervention—including manual UPI payment reconciliations, member account suspensions, permanent user purges, and automated 9-level binary tree reward batches—is sealed with an immutable SHA-256 cryptographic digest for statutory audit retention.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onSwitchTab('audit-log')}
            className="btn-gold-sheen text-noir-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            INSPECT FULL AUDIT LOG →
          </button>
        </div>
      </div>
    </div>
  );
};
