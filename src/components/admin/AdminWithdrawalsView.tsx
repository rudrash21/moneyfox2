import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { INITIAL_WITHDRAWALS } from '../../data/mockData';
import { WithdrawalRequest } from '../../types';
import { addAuditLog } from '../../data/auditLogStore';

export const AdminWithdrawalsView: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filtered = withdrawals.filter((w) => {
    const isPending = w.status === 'Requested' || w.status === 'Processing';
    const isPaid = w.status === 'Paid';
    const isFailed = w.status === 'Failed';

    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && isPending) ||
      (filter === 'paid' && isPaid) ||
      (filter === 'failed' && isFailed);

    const matchesSearch =
      w.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.destinationUpi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingTotal = withdrawals
    .filter((w) => w.status === 'Requested' || w.status === 'Processing')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleMarkPaid = (item: WithdrawalRequest) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === item.id ? { ...w, status: 'Paid' as const } : w))
    );
    setActionNotice(`Marked withdrawal of ₹${item.amount} to ${item.destinationUpi} as PAID via banking rails.`);

    addAuditLog({
      operatorId: 'finance@moneyfox.luxury',
      operatorRole: 'Finance Desk',
      actionType: 'WITHDRAWAL_PAYOUT',
      category: 'Financial',
      severity: 'medium',
      targetResource: `Withdrawal Request ${item.id} · ₹${item.amount.toLocaleString()} to ${item.destinationUpi}`,
      details: `Approved and disbursed ₹${item.amount.toLocaleString()} UPI payout to account holder ${item.holderName} (${item.destinationUpi}). Funds debited from wallet escrow.`,
      ipAddress: '103.21.244.18 (Mumbai HQ)',
      status: 'SUCCESS',
      regulatoryReference: 'NPCI-UPI-DISBURSEMENT-2025',
      beforeState: `Withdrawal ${item.id}: Requested · Escrow held`,
      afterState: `Withdrawal ${item.id}: Paid · Disbursed via NPCI bank rail`,
      metadata: {
        withdrawalId: item.id,
        amount: item.amount,
        destinationUpi: item.destinationUpi,
        holderName: item.holderName,
      },
    });
  };

  const handleReject = (item: WithdrawalRequest) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === item.id ? { ...w, status: 'Failed' as const } : w))
    );
    setActionNotice(`Rejected payout for ${item.destinationUpi}. ₹${item.amount} refunded back to member wallet.`);

    addAuditLog({
      operatorId: 'finance@moneyfox.luxury',
      operatorRole: 'Finance Desk',
      actionType: 'WITHDRAWAL_REJECTION',
      category: 'Financial',
      severity: 'high',
      targetResource: `Withdrawal Request ${item.id} · ₹${item.amount.toLocaleString()} to ${item.destinationUpi}`,
      details: `Rejected payout request for ${item.holderName} (${item.destinationUpi}). Payout failed compliance or banking account check. Escrow funds refunded to wallet.`,
      ipAddress: '103.21.244.18 (Mumbai HQ)',
      status: 'FLAGGED',
      regulatoryReference: 'NPCI-UPI-FAIL-RETURN',
      beforeState: `Withdrawal ${item.id}: Requested`,
      afterState: `Withdrawal ${item.id}: Failed · Balance Refunded`,
      metadata: {
        withdrawalId: item.id,
        amount: item.amount,
        destinationUpi: item.destinationUpi,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          BACK OFFICE / PAYOUT SETTLEMENT
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Withdrawals Management
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Member wallet payout requests queue • UPI 2.0 direct transfers and escrow settlement ledger.
        </p>
      </div>

      {/* Notice Banner */}
      {actionNotice && (
        <div className="bg-noir-900 border-l-2 border-emerald-400 p-4 flex items-center justify-between font-mono text-xs text-parchment-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-parchment-500 hover:text-parchment-200 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block">
            ESCROW HELD PAYOUTS
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">₹{pendingTotal}</div>
          <p className="text-[11px] font-mono text-parchment-400">Awaiting bank batch transfer</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-emerald-400 block">
            TOTAL DISBURSED
          </span>
          <div className="font-serif text-4xl text-emerald-400 font-bold">₹38,200</div>
          <p className="text-[11px] font-mono text-parchment-400">100% compliant peer bonuses</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            PROCESSING TIME
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">1–2 hrs</div>
          <p className="text-[11px] font-mono text-parchment-400">Direct NPCI IMPS/UPI Rails</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            PENDING REQUESTS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">
            {withdrawals.filter((w) => w.status === 'Requested' || w.status === 'Processing').length}
          </div>
          <p className="text-[11px] font-mono text-parchment-400">Queue count</p>
        </div>
      </div>

      {/* Filter and Table Toolbar */}
      <div className="bg-noir-900 hairline-border p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 hairline-border-b">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              All Requests ({withdrawals.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'pending'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              Pending Settlement
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'paid'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              Settled &amp; Paid
            </button>
          </div>

          <div className="relative w-full md:w-72 font-mono text-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member, UPI ID, reference..."
              className="w-full bg-noir-950 hairline-border pl-8 pr-3 py-2 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
            <Search className="w-3.5 h-3.5 text-parchment-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-3">Reference / Date</th>
                <th className="py-3">Member Name</th>
                <th className="py-3">Recipient UPI VPA</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Disbursement Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-xs">
              {filtered.map((w) => {
                const isPending = w.status === 'Requested' || w.status === 'Processing';
                const isPaid = w.status === 'Paid';

                return (
                  <tr key={w.id} className="hover:bg-noir-950/60 transition-colors">
                    <td className="py-4">
                      <p className="font-semibold text-parchment-100">{w.id}</p>
                      <p className="text-[10px] text-parchment-500">{w.date}</p>
                    </td>

                    <td className="py-4">
                      <span className="text-amberfox-gold font-bold">{w.holderName}</span>
                    </td>

                    <td className="py-4">
                      <p className="text-parchment-200">{w.destinationUpi}</p>
                      <span className="text-[9px] text-emerald-400">Verified Holder</span>
                    </td>

                    <td className="py-4">
                      <span className="font-serif text-base font-bold text-amberfox">₹{w.amount}</span>
                    </td>

                    <td className="py-4">
                      {isPaid ? (
                        <span className="inline-block px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-mono">
                          ✓ Settled &amp; Paid
                        </span>
                      ) : isPending ? (
                        <span className="inline-block px-2 py-0.5 bg-amberfox/15 text-amberfox border border-amberfox/30 text-[10px] uppercase font-mono animate-pulse">
                          ● {w.status}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-red-950/80 text-red-400 border border-red-500/30 text-[10px] uppercase font-mono">
                          ✕ Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleReject(w)}
                            className="hairline-border px-3 py-1.5 text-[11px] font-mono uppercase text-red-400 hover:border-red-400 cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleMarkPaid(w)}
                            className="btn-gold-sheen text-noir-950 font-bold uppercase tracking-wider text-[11px] px-3.5 py-1.5 cursor-pointer shadow-amber-glow"
                          >
                            Mark as Paid
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-parchment-500 font-mono">
                          Settlement Finalized
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
