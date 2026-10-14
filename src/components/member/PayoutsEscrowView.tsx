import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { INITIAL_WITHDRAWALS, CURRENT_USER } from '../../data/mockData';
import { WithdrawalRequest } from '../../types';

export const PayoutsEscrowView: React.FC = () => {
  const [availableBalance, setAvailableBalance] = useState<number>(18900);
  const [requestedAmount, setRequestedAmount] = useState<string>('5000');
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const handleQuickChip = (amount: number) => {
    setRequestedAmount(amount.toString());
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(requestedAmount, 10);
    if (isNaN(num) || num < 500) {
      setSubmissionFeedback('Minimum withdrawal is ₹500.');
      return;
    }
    if (num > availableBalance) {
      setSubmissionFeedback('Insufficient available balance. Amount exceeds ₹18,900.');
      return;
    }

    const newReq: WithdrawalRequest = {
      id: `WD-10492-00${withdrawals.length + 6}`,
      date: 'Today',
      amount: num,
      destinationUpi: 'v•••••.s@upi',
      holderName: CURRENT_USER.name,
      status: 'Requested',
    };

    setWithdrawals([newReq, ...withdrawals]);
    setAvailableBalance(availableBalance - num);
    setSubmissionFeedback(`Withdrawal request for ₹${num.toLocaleString('en-IN')} submitted and placed in escrow review.`);
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesStatus = selectedStatus === 'all' || w.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = w.id.toLowerCase().includes(searchTerm.toLowerCase()) || w.date.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Payouts &amp; escrow
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Request a withdrawal, then follow its review and disbursement status.
        </p>
      </div>

      {/* Top Gold Balance Banner */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-2 border-t-2 border-t-amberfox">
        <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold">
          AVAILABLE TO REQUEST / INR
        </span>
        <div className="font-serif text-4xl sm:text-5xl font-bold text-amberfox">
          ₹{availableBalance.toLocaleString('en-IN')}
        </div>
        <p className="text-xs font-mono text-parchment-400 font-light">
          Minimum withdrawal ₹500 • Available balance excludes funds already held for requests.
        </p>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Request Form */}
        <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Request withdrawal
          </h2>

          <form onSubmit={handleRequestSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                Amount to request (INR)
              </label>
              <input
                type="number"
                value={requestedAmount}
                onChange={(e) => {
                  setRequestedAmount(e.target.value);
                  setSubmissionFeedback(null);
                }}
                className="w-full bg-noir-950 hairline-border p-3 text-sm font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                min={500}
                max={availableBalance}
              />
              <p className="text-[11px] font-mono text-parchment-600 mt-1">
                Minimum ₹500 • Maximum currently available ₹{availableBalance.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => handleQuickChip(1000)}
                className="hairline-border px-3.5 py-1.5 bg-noir-950 text-parchment-200 hover:border-amberfox cursor-pointer"
              >
                ₹1,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickChip(5000)}
                className="hairline-border px-3.5 py-1.5 bg-noir-950 text-parchment-200 hover:border-amberfox cursor-pointer"
              >
                ₹5,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickChip(availableBalance)}
                className="hairline-border px-3.5 py-1.5 bg-noir-950 text-amberfox-gold hover:border-amberfox cursor-pointer"
              >
                MAX
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                Destination UPI ID
              </label>
              <input
                type="text"
                readOnly
                value="vikram.s@upi"
                className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100"
              />
              <div className="mt-2 inline-block bg-noir-950 text-emerald-400 font-mono text-[10px] uppercase px-2 py-0.5 hairline-border border-emerald-500/30">
                UPI holder • Verified record
              </div>
              <p className="text-[10px] font-mono text-parchment-600 mt-1">
                Holder: Vikramaditya S. • Verification shown as a sample stored status; no live UPI validation takes place.
              </p>
            </div>

            {/* Escrow Disclaimer Box */}
            <div className="border-l-2 border-amberfox bg-noir-950 p-4 font-mono text-xs space-y-1">
              <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block">
                Escrow, not a completed payment
              </span>
              <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                Once accepted, your request amount is held outside your available balance while review and disbursement proceed. Only a Paid status indicates a recorded disbursement.
              </p>
            </div>

            {submissionFeedback && (
              <div className="p-3 bg-noir-950 hairline-border border-amberfox/50 font-mono text-xs text-amberfox-gold">
                {submissionFeedback}
              </div>
            )}

            <button
              type="submit"
              className="btn-gold-sheen text-noir-950 px-6 py-3.5 text-xs font-bold uppercase tracking-luxury w-full flex items-center justify-center cursor-pointer shadow-amber-glow"
            >
              SUBMIT WITHDRAWAL REQUEST
            </button>
          </form>
        </div>

        {/* Right Column: How requests move */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
            How requests move
          </h3>

          <div className="font-mono text-xs uppercase tracking-luxury text-amberfox font-semibold pb-2 border-b border-amberfox/15">
            REQUESTED → PROCESSING → PAID
          </div>

          <div className="space-y-4 text-xs font-light text-parchment-300">
            <p>
              <strong className="font-semibold text-parchment-100 font-mono">Requested:</strong> received and held for review.
            </p>
            <p>
              <strong className="font-semibold text-parchment-100 font-mono">Processing:</strong> disbursement is being reviewed; not yet paid.
            </p>
            <p>
              <strong className="font-semibold text-parchment-100 font-mono">Paid:</strong> a completed disbursement is recorded.
            </p>
            <p>
              <strong className="font-semibold text-parchment-100 font-mono">Failed:</strong> inspect whether funds remain held before retrying. Do not create a duplicate request.
            </p>
          </div>

          <div className="pt-4 border-t border-amberfox/15 text-[11px] font-mono text-parchment-600 leading-relaxed font-light">
            Commissions depend on complete, validated levels and product distribution. Earnings and placement are not guaranteed; there is no assured income.
          </div>
        </div>
      </div>

      {/* Withdrawal History Ledger Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Withdrawal history
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Filter status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            >
              <option value="all">All statuses</option>
              <option value="requested">Requested</option>
              <option value="processing">Processing</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Request reference or date..."
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Request / Date</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Destination</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Next Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {filteredWithdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-noir-950/60">
                  <td className="py-3">
                    <p className="font-semibold text-parchment-100">{w.id}</p>
                    <span className="text-[10px] text-parchment-400">{w.date}</span>
                  </td>
                  <td className="py-3 font-semibold text-amberfox">₹{w.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-parchment-300">{w.destinationUpi}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] uppercase ${
                        w.status === 'Paid'
                          ? 'text-emerald-400'
                          : w.status === 'Processing'
                          ? 'text-amberfox-gold'
                          : w.status === 'Requested'
                          ? 'text-amberfox'
                          : 'text-red-400'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-amberfox-gold hover:underline cursor-pointer">
                      {w.status === 'Processing' ? `₹${w.amount} held` : w.status === 'Failed' ? 'Review held funds' : 'View record'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-parchment-600">
          Balances and history are populated static examples. Submitting a request updates local escrow simulations.
        </p>
      </div>
    </div>
  );
};
