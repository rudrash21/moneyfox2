import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PaymentQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveSuccess: () => void;
  mode?: 'payment' | 'payout';
}

export const AdminPaymentQueueModal: React.FC<PaymentQueueModalProps> = ({
  isOpen,
  onClose,
  onApproveSuccess,
  mode = 'payment',
}) => {
  const [actionTab, setActionTab] = useState<'approve' | 'reject'>('approve');
  const [manualReviewChecked, setManualReviewChecked] = useState<boolean>(true);
  const [rejectReason, setRejectReason] = useState<string>('Reference could not be matched');
  const [rejectNote, setRejectNote] = useState<string>(
    'Please provide a readable payment receipt showing the 12-digit UTR and amount.'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-noir-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-noir-900 hairline-border text-parchment-100 max-w-xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-parchment-400 hover:text-amberfox transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'payment' ? (
          <>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                PAYMENT / GUARDED DECISION
              </span>
              <div className="flex gap-2 border-b border-amberfox/20 pb-2">
                <button
                  type="button"
                  onClick={() => setActionTab('approve')}
                  className={`text-xs font-mono uppercase tracking-wider py-1 px-3 ${
                    actionTab === 'approve' ? 'bg-amberfox text-noir-950 font-bold' : 'text-parchment-400'
                  }`}
                >
                  Approve payment
                </button>
                <button
                  type="button"
                  onClick={() => setActionTab('reject')}
                  className={`text-xs font-mono uppercase tracking-wider py-1 px-3 ${
                    actionTab === 'reject' ? 'bg-red-900/60 text-red-300 font-bold' : 'text-parchment-400'
                  }`}
                >
                  Reject with reason
                </button>
              </div>
            </div>

            {actionTab === 'approve' ? (
              <div className="space-y-5 font-mono text-xs">
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Approve this payment?
                </h3>
                <p className="text-parchment-300">ORD-MFX-99412 • mf10492 • ₹2,000</p>

                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
                    UTR reviewed
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="429910488219"
                    className="w-full bg-noir-950 hairline-border p-3 text-amberfox font-semibold"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2.5 text-parchment-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manualReviewChecked}
                      onChange={(e) => setManualReviewChecked(e.target.checked)}
                      className="rounded-none bg-noir-950 border-amberfox/40 text-amberfox"
                    />
                    <span>Amount and receipt reviewed manually</span>
                  </label>
                </div>

                <div className="border-l-2 border-amberfox bg-noir-950 p-4 space-y-1">
                  <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block">
                    Approval is not placement
                  </span>
                  <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                    Approval confirms the merchandise order and activates membership. Network placement is reviewed separately.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onApproveSuccess();
                      onClose();
                    }}
                    className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer shadow-amber-glow"
                  >
                    CONFIRM APPROVAL
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="hairline-border px-4 py-3 text-xs uppercase tracking-wider text-parchment-300 hover:text-parchment-100 cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 font-mono text-xs">
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                  Reject with a reason
                </h3>
                <p className="text-parchment-300">ORD-MFX-99412 • ₹2,000</p>

                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
                    Reason *
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                  >
                    <option value="Reference could not be matched">Reference could not be matched</option>
                    <option value="Underpaid amount">Underpaid amount</option>
                    <option value="Duplicate UTR submission">Duplicate UTR submission</option>
                    <option value="Invalid screenshot">Invalid screenshot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
                    Member-facing note *
                  </label>
                  <textarea
                    rows={3}
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 text-parchment-100 focus:outline-none focus:border-amberfox"
                  />
                </div>

                <p className="text-[11px] text-parchment-400 font-light">
                  The member remains pending activation and receives corrective next steps.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-800 hover:bg-red-700 text-white px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer"
                  >
                    CONFIRM REJECTION
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="hairline-border px-4 py-3 text-xs uppercase tracking-wider text-parchment-300 hover:text-parchment-100 cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Payout Modal Mode */
          <div className="space-y-5 font-mono text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                PAYOUT / CONFIRMATION
              </span>
              <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                Confirm paid disbursement
              </h3>
            </div>

            <div className="font-serif text-3xl font-bold text-amberfox">₹3,200</div>
            <p className="text-parchment-300">WD-10492-007 • mf10492</p>
            <p className="text-parchment-400">Destination: v•••••.s@upi</p>

            <div className="border border-dashed border-amberfox/30 bg-noir-950 p-4 text-center">
              <span className="text-parchment-300 text-[11px]">Attach completed disbursement receipt...</span>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-parchment-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-none bg-noir-950 border-amberfox/40 text-amberfox" />
                <span>I reviewed external evidence of completion</span>
              </label>
            </div>

            <div className="border-l-2 border-amberfox bg-noir-950 p-4 space-y-1">
              <span className="text-amberfox font-semibold uppercase tracking-luxury text-[10px] block">
                Only record an actual paid outcome
              </span>
              <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                Confirmation would settle held escrow once. This design does not transfer money.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury cursor-pointer shadow-amber-glow"
              >
                CONFIRM PAID RECORD
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hairline-border px-4 py-3 text-xs uppercase tracking-wider text-parchment-300 cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
