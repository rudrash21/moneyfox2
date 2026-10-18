import React, { useState } from 'react';
import { Eye, ShieldCheck, Download, Search, Zap, CheckCircle2, Award } from 'lucide-react';
import { INITIAL_LEDGER_EVENTS, NINE_LEVEL_SCHEDULE } from '../../data/mockData';
import { LedgerEvent } from '../../types';
import { addAuditLog } from '../../data/auditLogStore';

export const AdminWalletAuditView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [eventType, setEventType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<LedgerEvent | null>(INITIAL_LEDGER_EVENTS[0] || null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<{
    scannedNodes: number;
    completedLevels: number;
    creditedAmount: number;
    beneficiaries: string[];
  } | null>(null);

  const [ledgerEvents, setLedgerEvents] = useState<LedgerEvent[]>(INITIAL_LEDGER_EVENTS);

  const handleCalculateAllRewards = () => {
    setIsCalculating(true);
    setCalculationResult(null);

    setTimeout(() => {
      setIsCalculating(false);
      const result = {
        scannedNodes: 64,
        completedLevels: 4,
        creditedAmount: 4300,
        beneficiaries: ['mf10492 (+₹2,500 L4)', 'mf10510 (+₹1,000 L3)', 'mf10511 (+₹500 L2)', 'mf10520 (+₹300 L1)'],
      };
      setCalculationResult(result);

      // Add audit ledger event
      const newEv: LedgerEvent = {
        id: `EV-REWARD-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now • 18:45 IST',
        type: 'Level reward',
        amount: 4300,
        beforeBalance: 18900,
        afterBalance: 23200,
        reference: 'SYS-BATCH-MLM-L9',
        memberId: 'mf10492 (Multi)',
        status: 'Completed',
        isCredit: true,
        notes: 'Automated 9-level binary calculation execution batch credited.',
      };
      setLedgerEvents([newEv, ...ledgerEvents]);
      setSelectedEvent(newEv);

      // Record immutable system audit log entry
      addAuditLog({
        operatorId: 'admin@moneyfox.co.in',
        operatorRole: 'Apex Admin',
        actionType: 'REWARD_CALCULATION',
        category: 'Compensation',
        severity: 'high',
        targetResource: '9-Level Binary Tree Engine (Batch: SYS-BATCH-MLM-L9)',
        details: `Executed scheduled 9-level binary tree reward calculation. Audited 64 nodes; credited total ₹${result.creditedAmount.toLocaleString()} across 4 levels to ${result.beneficiaries.length} qualifying member accounts.`,
        ipAddress: '103.21.244.18 (Mumbai HQ)',
        status: 'SUCCESS',
        regulatoryReference: 'STAT-MLM-SEC-12/2025',
        beforeState: 'Uncalculated nodes: 64 · Pending ledger allocation: ₹4,300',
        afterState: 'Calculation complete · 4 Wallets credited · Ledger committed',
        metadata: {
          scannedNodes: result.scannedNodes,
          completedLevels: result.completedLevels,
          creditedAmount: result.creditedAmount,
          beneficiariesCount: result.beneficiaries.length,
        },
      });
    }, 1200);
  };

  const filteredEvents = ledgerEvents.filter((ev) => {
    const matchesSearch =
      ev.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = eventType === 'all' || ev.type.toLowerCase().includes(eventType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          BACK OFFICE / OPERATIONS
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Wallet &amp; audit
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Inspect financial events, balance movements and the references behind them.
        </p>
      </div>

      {/* 3 Stat Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            AVAILABLE / MEMBER
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">₹18,900</div>
          <p className="text-[11px] font-mono text-parchment-400">Selected account • mf10492</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            ESCROW / MEMBER
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">₹4,200</div>
          <p className="text-[11px] font-mono text-parchment-400">Held separately from available</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            LEDGER EVENTS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">48</div>
          <p className="text-[11px] font-mono text-parchment-400">October 2025 • Static sample</p>
        </div>
      </div>

      {/* 9-Level Automated Reward Engine Module */}
      <div className="bg-noir-900 border-2 border-amberfox/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-amberfox/20">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amberfox" />
              <span className="font-mono text-xs uppercase tracking-luxury text-amberfox font-bold">
                AUTOMATED COMPENSATION REWARD ENGINE
              </span>
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100 mt-1">
              9-Level 2×2 Binary Reward Scanner
            </h2>
            <p className="text-xs text-parchment-400 font-light mt-1">
              Scans all active downline nodes across the platform, validates completed binary requirements, and credits level rewards to member wallets.
            </p>
          </div>

          <button
            onClick={handleCalculateAllRewards}
            disabled={isCalculating}
            className={`btn-gold-sheen text-noir-950 font-bold uppercase tracking-luxury px-6 py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-amber-glow shrink-0 ${
              isCalculating ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <Zap className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? 'Scanning Binary Tree...' : '⚡ Calculate All Rewards'}</span>
          </button>
        </div>

        {/* Calculation Result Feedback */}
        {calculationResult && (
          <div className="bg-noir-950 border border-emerald-500/40 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Calculation Complete • ₹{calculationResult.creditedAmount.toLocaleString('en-IN')} Distributed to Eligible Member Wallets</span>
            </div>
            <p className="text-xs font-mono text-parchment-300">
              Scanned {calculationResult.scannedNodes} tree nodes • {calculationResult.completedLevels} new level completions verified:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
              {calculationResult.beneficiaries.map((b, i) => (
                <span key={i} className="bg-noir-900 border border-amberfox/30 text-amberfox-gold px-2.5 py-0.5">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 9-Level Compensation Matrix Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center font-mono text-[11px]">
          {NINE_LEVEL_SCHEDULE.map((lvl) => (
            <div key={lvl.level} className="bg-noir-950 hairline-border p-2.5 space-y-1">
              <span className="text-[10px] uppercase text-amberfox block">Lvl {lvl.level}</span>
              <p className="font-semibold text-parchment-100">{lvl.nodes} nodes</p>
              <p className="text-amberfox-gold font-bold">₹{lvl.levelReward.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Event Ledger Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Search event ledger
          </h2>
          <button
            onClick={() => window.print()}
            className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer self-start sm:self-auto"
          >
            EXPORT MASKED LEDGER
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Event type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            >
              <option value="all">All types</option>
              <option value="escrow">Escrow hold</option>
              <option value="level">Level credit</option>
              <option value="order">Order</option>
              <option value="withdrawal">Withdrawal paid</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Date range
            </label>
            <input
              type="text"
              readOnly
              value="October 2025"
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-400"
            />
          </div>
        </div>

        {/* Event Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Event / Timestamp IST</th>
                <th className="py-2.5">Type / Member</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Available Before → After</th>
                <th className="py-2.5 text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-parchment-500">
                    No ledger events found. Click "⚡ Calculate All Rewards" to audit network trees or record a transaction.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`hover:bg-noir-950/60 cursor-pointer transition-colors ${
                      selectedEvent?.id === ev.id ? 'bg-noir-950/90 border-l-2 border-amberfox' : ''
                    }`}
                  >
                    <td className="py-3.5">
                      <p className="font-semibold text-parchment-100">{ev.id}</p>
                      <span className="text-[10px] text-parchment-400">{ev.timestamp}</span>
                    </td>
                    <td className="py-3.5 text-parchment-300">
                      {ev.type} / {ev.memberId}
                    </td>
                    <td className="py-3.5 font-semibold">
                      <span className={ev.amount > 0 ? 'text-emerald-400' : 'text-amberfox'}>
                        {ev.amount > 0 ? `+₹${ev.amount.toLocaleString('en-IN')}` : `-₹${Math.abs(ev.amount).toLocaleString('en-IN')}`}
                      </span>
                    </td>
                    <td className="py-3.5 text-parchment-300">
                      ₹{ev.beforeBalance.toLocaleString('en-IN')} → ₹{ev.afterBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 text-right text-amberfox-gold">{ev.reference}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-parchment-600">
          Showing {filteredEvents.length} events • Orders do not credit the available reward wallet. Paid withdrawals settle held funds, not available funds again.
        </p>
      </div>

      {/* Bottom Detail Row: Selected Event & Sensitive Data View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selected Event Detail Panel */}
        {!selectedEvent ? (
          <div className="lg:col-span-7 bg-noir-900 hairline-border p-8 text-center font-mono text-xs text-parchment-500 space-y-2">
            <p className="text-parchment-300 font-semibold uppercase">No Event Selected</p>
            <p>Select a transaction from the event ledger table above or run reward calculation to view audit details.</p>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                EVENT DETAIL PANEL
              </span>
              <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                Selected event • {selectedEvent.id}
              </h3>
              <div className="mt-2 inline-block bg-noir-950 font-mono text-[10px] uppercase px-2.5 py-0.5 hairline-border text-amberfox">
                {selectedEvent.type} / {selectedEvent.status}
              </div>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
              <thead>
                <tr className="text-[10px] uppercase text-parchment-400">
                  <th className="py-2">Balance</th>
                  <th className="py-2">Before</th>
                  <th className="py-2">Change</th>
                  <th className="py-2 text-right">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amberfox/10 text-[11px]">
                <tr>
                  <td className="py-3 text-parchment-300">Available</td>
                  <td className="py-3 text-parchment-200">₹{selectedEvent.beforeBalance.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-amberfox font-semibold">
                    {selectedEvent.amount > 0 ? `+₹${selectedEvent.amount}` : `-₹${Math.abs(selectedEvent.amount)}`}
                  </td>
                  <td className="py-3 text-right text-amberfox-gold font-bold">
                    ₹{selectedEvent.afterBalance.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-parchment-300">Held escrow</td>
                  <td className="py-3 text-parchment-200">₹3,200</td>
                  <td className="py-3 text-amberfox font-semibold">+₹1,000</td>
                  <td className="py-3 text-right text-amberfox-gold font-bold">₹4,200</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs border-t border-amberfox/15 pt-4">
            <div>
              <span className="text-[10px] uppercase text-parchment-400 block">REFERENCE</span>
              <p className="text-amberfox-gold mt-0.5">{selectedEvent.reference}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-parchment-400 block">INITIATOR</span>
              <p className="text-parchment-200 mt-0.5">Member {selectedEvent.memberId}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-parchment-400 block">RECORDED</span>
              <p className="text-parchment-300 mt-0.5">{selectedEvent.timestamp}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-parchment-400 block">REVIEW</span>
              <p className="text-amberfox mt-0.5">Awaiting operator approval</p>
            </div>
          </div>

          {/* Highlighted Warning */}
          <div className="border-l-2 border-amberfox bg-noir-950 p-4 font-mono text-xs space-y-1">
            <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block">
              No double debit
            </span>
            <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
              This event moves funds from available to held escrow. A later paid event settles escrow without debiting available a second time.
            </p>
          </div>
        </div>
        )}

        {/* Sensitive-Data View Panel */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6 font-mono text-xs">
          <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Sensitive-data view
          </h3>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              UPI destination • Masked
            </label>
            <input
              type="text"
              readOnly
              value="v•••••.s@upi"
              className="w-full bg-noir-950 hairline-border p-3 text-parchment-200"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Payment UTR • Masked
            </label>
            <input
              type="text"
              readOnly
              value="••••••••8219"
              className="w-full bg-noir-950 hairline-border p-3 text-parchment-200"
            />
          </div>

          <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
            Full destination details are restricted to payout review. Exports retain masked identifiers.
          </p>

          <button
            type="button"
            className="hairline-border px-5 py-2.5 text-xs uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer"
          >
            OPEN RELATED REQUEST
          </button>

          <p className="text-[10px] text-parchment-600 font-light">
            No banking secrets, passwords, UPI PINs or access tokens appear in this ledger.
          </p>
        </div>
      </div>
    </div>
  );
};
