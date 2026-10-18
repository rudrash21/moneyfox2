import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, ShieldAlert, RefreshCw } from 'lucide-react';
import { AdminTab, OrderRecord } from '../../types';
import { dbService, DbPayment, DbWaitingBench, DbUser } from '../../lib/dbService';

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
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [benchMembers, setBenchMembers] = useState<DbWaitingBench[]>([]);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedPayments, fetchedOrders, fetchedBench, fetchedUsers] = await Promise.all([
        dbService.fetchPayments(),
        dbService.fetchOrders(),
        dbService.fetchWaitingBench(),
        dbService.fetchUsers(),
      ]);
      setPayments(fetchedPayments || []);
      setOrders(fetchedOrders || []);
      setBenchMembers(fetchedBench || []);
      setUsers(fetchedUsers || []);
    } catch (err) {
      console.error('Error loading admin overview data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubPay = dbService.subscribePayments(() => loadData());
    const unsubUsers = dbService.subscribeUsers(() => loadData());
    return () => {
      unsubPay();
      unsubUsers();
    };
  }, []);

  const approvedPayments = payments.filter((p) => p.status === 'verified');
  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const rejectedPayments = payments.filter((p) => p.status === 'rejected');

  const totalSubmissions = payments.length;
  const approvedCount = approvedPayments.length;
  const pendingCount = pendingPayments.length;
  const rejectedCount = rejectedPayments.length;

  const approvedPercent = totalSubmissions > 0 ? ((approvedCount / totalSubmissions) * 100).toFixed(1) : '0.0';
  const pendingPercent = totalSubmissions > 0 ? ((pendingCount / totalSubmissions) * 100).toFixed(1) : '0.0';
  const rejectedPercent = totalSubmissions > 0 ? ((rejectedCount / totalSubmissions) * 100).toFixed(1) : '0.0';

  const approvedGross = approvedCount * 2000;
  const pendingGross = pendingCount * 2000;

  // Build 7-day trailing histogram from actual orders/payments
  const trailing7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const count = orders.filter((o) => {
      const oDate = new Date(o.date);
      return !isNaN(oDate.getTime()) && oDate.toDateString() === d.toDateString();
    }).length;
    return {
      date: dayLabel,
      count,
      isToday: i === 6,
    };
  });

  const maxChartCount = Math.max(1, ...trailing7Days.map((d) => d.count));
  const chartDays = trailing7Days.map((d) => ({
    ...d,
    height: d.count > 0 ? `${Math.round((d.count / maxChartCount) * 85 + 10)}%` : '4%',
  }));

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
            BACK OFFICE / OPERATIONS
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
            Operations at a glance
          </h1>
          <p className="text-xs text-parchment-400 font-light mt-1">
            {todayFormatted} • Live operational overview • Manual review and guarded actions.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="self-start sm:self-auto hairline-border px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox flex items-center gap-2 cursor-pointer transition-colors"
          title="Refresh live data"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amberfox ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            APPROVED ORDERS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{approvedCount}</div>
          <p className="text-[11px] font-mono text-parchment-400">
            ₹{approvedGross.toLocaleString('en-IN')} gross • Includes GST
          </p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            VERIFICATION QUEUE
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">{pendingCount}</div>
          <p className="text-[11px] font-mono text-parchment-400">
            ₹{pendingGross.toLocaleString('en-IN')} submitted • Not approved
          </p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            PAYOUT REQUESTS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">0</div>
          <p className="text-[11px] font-mono text-parchment-400">₹0 held in escrow</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            WAITING BENCH
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{benchMembers.length}</div>
          <p className="text-[11px] font-mono text-parchment-400">
            {benchMembers.length} awaiting binary tree placement
          </p>
        </div>
      </div>

      {/* 2-Column: Volume Histogram & Verification Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Approved Order Volume Histogram */}
        <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
              7-DAY TRAILING ACTIVITY / UNITS
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
            {approvedCount} approved units in total • ₹2,000 each, inclusive of 12% GST.
          </p>
        </div>

        {/* Verification Outcomes */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 space-y-4 font-mono text-xs">
          <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
            Verification outcomes
          </h3>

          <div className="divide-y divide-amberfox/10 text-[11px]">
            <div className="flex justify-between py-2.5">
              <span className="text-parchment-300">Approved</span>
              <span className="text-parchment-100 font-semibold">{approvedCount}</span>
              <span className="text-emerald-400">{approvedPercent}%</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-parchment-300">Pending</span>
              <span className="text-amberfox font-semibold">{pendingCount}</span>
              <span className="text-amberfox">{pendingPercent}%</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-parchment-300">Rejected</span>
              <span className="text-parchment-100 font-semibold">{rejectedCount}</span>
              <span className="text-red-400">{rejectedPercent}%</span>
            </div>
          </div>

          <p className="text-[10px] text-parchment-600">
            {totalSubmissions} submissions • Pending references are excluded from approved order volume.
          </p>

          <button
            onClick={onOpenPaymentModal}
            className="btn-gold-sheen text-noir-950 px-5 py-2.5 text-xs font-bold uppercase tracking-luxury w-full flex items-center justify-center cursor-pointer shadow-amber-glow"
          >
            <span>OPEN PAYMENT QUEUE</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Actionable Queues Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Actionable queues
          </h3>
          <span className="font-mono text-xs text-amberfox">
            {pendingPayments.length} pending action{pendingPayments.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Queue</th>
                <th className="py-2.5">Reference / User</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-parchment-500">
                    No pending items requiring review. All payment and verification queues are clear.
                  </td>
                </tr>
              ) : (
                pendingPayments.slice(0, 5).map((p) => (
                  <tr key={p.id || p.order_id} className="hover:bg-noir-950/60">
                    <td className="py-3 text-parchment-200">Payment review</td>
                    <td className="py-3 text-amberfox-gold font-semibold">
                      {p.order_id} • {p.moneyfox_id}
                    </td>
                    <td className="py-3 text-amberfox">UTR: {p.transaction_id || 'Submitted'}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={onOpenPaymentModal}
                        className="text-amberfox hover:underline font-semibold cursor-pointer"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
          PLACEMENT QUEUE / {benchMembers.length} MEMBERS
        </span>
        <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Bench readiness
        </h3>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-parchment-300">Paid • Ready for placement review</span>
              <span className="text-amberfox font-semibold">{benchMembers.length}</span>
            </div>
            <div className="w-full bg-noir-950 h-2 overflow-hidden">
              <div
                className="bg-amberfox h-full transition-all duration-300"
                style={{ width: benchMembers.length > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-parchment-400 font-light leading-relaxed pt-2">
          Payment approval makes a record ready for review; it does not guarantee a placement. Open-slot and eligibility checks remain separate decisions.
        </p>

        <button
          onClick={() => onSwitchTab('waiting')}
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
