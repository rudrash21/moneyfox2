import React, { useState } from 'react';
import { Paperclip, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { INITIAL_SUPPORT_TICKETS } from '../../data/mockData';
import { SupportTicket } from '../../types';

export const SupportReturnsView: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [order, setOrder] = useState<string>('ORD-MFX-99412 · Noir L · ₹2,000');
  const [category, setCategory] = useState<string>('Return enquiry');
  const [issue, setIssue] = useState<string>('Size / fit question');
  const [description, setDescription] = useState<string>(
    'I would like to discuss the fit of my Noir edition, size L. Please advise how to submit a return request once delivery is confirmed.'
  );
  const [confirmedCheck, setConfirmedCheck] = useState<boolean>(true);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(true);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('HELP-10492-03');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `HELP-10492-0${tickets.length + 1}`;
    const newTicket: SupportTicket = {
      id: newId,
      date: 'Today',
      orderId: 'ORD-MFX-99412',
      category,
      issue,
      description,
      status: 'Submitted',
    };
    setTickets([newTicket, ...tickets]);
    setLastSubmittedId(newId);
    setHasSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Your concierge desk
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Ask about an order, a return, a payment review or a membership question.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create a Request Form */}
        <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
              ORDER-BASED ASSISTANCE
            </span>
            <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
              Create a request
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                Order
              </label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
              >
                <option value="ORD-MFX-99412 · Noir L · ₹2,000">ORD-MFX-99412 • Noir L • ₹2,000</option>
                <option value="ORD-MFX-99180 · Ivory M · ₹2,000">ORD-MFX-99180 • Ivory M • ₹2,000</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                >
                  <option value="Return enquiry">Return enquiry</option>
                  <option value="Delivery question">Delivery question</option>
                  <option value="Invoice access">Invoice access</option>
                  <option value="Payment verification">Payment verification</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Issue
                </label>
                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                >
                  <option value="Size / fit question">Size / fit question</option>
                  <option value="Transit delay">Transit delay</option>
                  <option value="GST tax credit">GST tax credit</option>
                  <option value="Garment query">Garment query</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                Describe your request
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                required
              />
            </div>

            {/* File upload drag/drop mock */}
            <div className="border border-dashed border-amberfox/30 bg-noir-950 p-6 text-center space-y-1 font-mono text-xs">
              <Paperclip className="w-5 h-5 mx-auto text-amberfox" />
              <p className="text-parchment-200">Attach photos or a receipt • Browse files</p>
              <p className="text-[10px] text-parchment-600">Remove sensitive banking details before attaching.</p>
            </div>

            <div>
              <label className="flex items-start space-x-2.5 text-xs font-mono text-parchment-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedCheck}
                  onChange={(e) => setConfirmedCheck(e.target.checked)}
                  className="mt-0.5 rounded-none bg-noir-950 border-amberfox/40 text-amberfox focus:ring-0"
                  required
                />
                <span className="text-[11px] leading-relaxed">
                  I understand this request will be reviewed and is not an approval or refund confirmation.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-gold-sheen text-noir-950 px-6 py-3.5 text-xs font-bold uppercase tracking-luxury cursor-pointer"
            >
              SUBMIT REQUEST
            </button>
          </form>
        </div>

        {/* Right Column: Policies & Submitted Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Returns clarity box */}
          <div className="bg-noir-900 hairline-border p-6 space-y-4">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Returns, with clarity
            </h3>
            <span className="inline-block bg-noir-950 text-amberfox-gold text-[10px] font-mono uppercase tracking-luxury px-2 py-0.5 hairline-border">
              Seven-day return statement
            </span>
            <p className="text-xs text-parchment-300 font-light leading-relaxed">
              The existing seven-day return statement is the context for a return review. Ask the concierge about your specific order and delivery status.
            </p>
            <p className="text-[11px] font-mono text-parchment-400">
              No additional exceptions, guaranteed refunds or binding terms are introduced here.
            </p>
            <div className="pt-2 border-t border-amberfox/15 font-mono text-xs space-y-1">
              <span className="text-[10px] uppercase text-amberfox tracking-luxury">CONTACT THE DESK</span>
              <p className="text-amberfox-gold">support@moneyfox.luxury</p>
              <p className="text-[10px] text-parchment-600">
                Quote your order or request reference. Never send your password or UPI PIN.
              </p>
            </div>
          </div>

          {/* Submitted Confirmation State (Matching screenshot) */}
          {hasSubmitted && (
            <div className="bg-noir-900 hairline-border p-6 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
                VISIBLE SUCCESS STATE
              </span>
              <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                Submitted confirmation
              </h3>

              <div className="border-l-2 border-emerald-500 bg-noir-950 p-4 space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request received • {lastSubmittedId}</span>
                </div>
                <p className="text-[11px] text-parchment-300 font-light leading-relaxed">
                  Your return enquiry for ORD-MFX-99412 is submitted. The concierge will review the details; no return or refund has been approved.
                </p>
              </div>

              <button
                type="button"
                className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox cursor-pointer"
              >
                VIEW REQUEST
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Request History Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Request history
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Request</th>
                <th className="py-2.5">Order</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-noir-950/60">
                  <td className="py-3">
                    <p className="font-semibold text-parchment-100">{t.id}</p>
                    <span className="text-[10px] text-parchment-400">{t.date}</span>
                  </td>
                  <td className="py-3 text-parchment-300">{t.orderId}</td>
                  <td className="py-3 text-parchment-200">{t.category}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] uppercase ${
                        t.status === 'Resolved'
                          ? 'text-emerald-400'
                          : t.status === 'Open'
                          ? 'text-amberfox'
                          : 'text-amberfox-gold'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-amberfox-gold hover:underline cursor-pointer">
                      {t.status === 'Open' ? 'Add evidence' : t.status === 'Resolved' ? 'View conversation' : 'View request'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
