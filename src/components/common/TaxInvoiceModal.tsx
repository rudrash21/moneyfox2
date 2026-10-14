import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  invoiceId?: string;
  date?: string;
  customerName?: string;
  customerAddress?: string;
  amount?: number;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({
  isOpen,
  onClose,
  orderId = 'ORD-MFX-99412',
  invoiceId = 'INV-20251024-8891',
  date = '24 Oct 2025',
  customerName = 'Vikramaditya S.',
  customerAddress = 'Apt 14B, Oberoi Sky City, Western Express Hwy, Borivali East, Mumbai, Maharashtra - 400066',
  amount = 2000,
}) => {
  if (!isOpen) return null;

  const basePrice = 1785.71;
  const cgst = 107.14;
  const sgst = 107.14;

  return (
    <div className="fixed inset-0 z-50 bg-noir-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-noir-900 hairline-border text-parchment-100 max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-parchment-400 hover:text-amberfox transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Invoice Branding */}
        <div className="flex items-start justify-between pb-6 hairline-border-b">
          <div className="flex items-center space-x-3">
            <img src={BRAND_ASSETS.sealEmblem} alt="MoneyFox Seal" className="h-10 w-auto" />
            <div>
              <h2 className="font-serif text-lg tracking-luxury font-bold">MONEYFOX LUXURY APPAREL LLP</h2>
              <p className="text-[11px] font-mono text-parchment-400">GSTIN: 27AABCM8921F1ZX • State Code: 27</p>
              <p className="text-[10px] text-parchment-600">Level 9, Platina, BKC, Mumbai, Maharashtra 400051</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-amberfox/20 text-amberfox-gold text-[10px] tracking-luxury uppercase px-2 py-0.5 hairline-border font-mono">
              TAX INVOICE
            </span>
            <p className="text-xs font-mono mt-1 text-parchment-200">{invoiceId}</p>
            <p className="text-[11px] font-mono text-parchment-400">Date: {date}</p>
          </div>
        </div>

        {/* Bill To & Dispatch Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 hairline-border-b text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-amberfox tracking-luxury">CONSIGNEE / BUYER:</span>
            <p className="font-semibold text-parchment-100 mt-0.5">{customerName}</p>
            <p className="text-parchment-400 leading-relaxed text-[11px]">{customerAddress}</p>
            <p className="text-parchment-400 text-[11px]">State: Maharashtra (Code 27)</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] uppercase text-amberfox tracking-luxury">TRANSACTION PROVENANCE:</span>
            <p className="text-parchment-200 mt-0.5">Order Ref: {orderId}</p>
            <p className="text-parchment-400">Payment: Verified UPI Escrow</p>
            <p className="text-parchment-400">UTR: 429910488219</p>
            <p className="text-emerald-400 flex items-center sm:justify-end gap-1 mt-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Statutory Tax Paid
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-4">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-amberfox/20 text-[10px] text-parchment-400 uppercase tracking-luxury">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">HSN</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Taxable</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              <tr>
                <td className="py-3">
                  <p className="font-serif text-sm font-semibold text-parchment-100">Signature Heavyweight Tee (Noir)</p>
                  <span className="text-[10px] text-parchment-400">280 GSM Compact Ringspun Cotton • Size L</span>
                </td>
                <td className="py-3 text-center text-parchment-400">61091000</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">₹{basePrice.toFixed(2)}</td>
                <td className="py-3 text-right text-amberfox font-semibold">₹{basePrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Computation Summary */}
        <div className="pt-3 pb-6 hairline-border-t hairline-border-b grid grid-cols-2 text-xs font-mono">
          <div className="text-[11px] text-parchment-400 space-y-1">
            <p>HSN Code: 6109 (Articles of Apparel)</p>
            <p>Delivery: BlueDart Apex Secure Air (Included)</p>
            <p>Intra-State Supply (Maharashtra → Maharashtra)</p>
          </div>
          <div className="space-y-1.5 text-right">
            <div className="flex justify-between">
              <span className="text-parchment-400">Taxable Value:</span>
              <span>₹{basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-parchment-400">Central GST (CGST @ 6%):</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-parchment-400">State GST (SGST @ 6%):</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amberfox/20 font-serif text-sm font-bold text-amberfox">
              <span>Invoice Total (INR):</span>
              <span>₹{amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-parchment-600 font-mono text-center sm:text-left">
            This is a computer-generated tax invoice. No signature required under Rule 46 of CGST Rules, 2017.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="hairline-border px-3 py-1.5 text-xs text-parchment-200 hover:text-amberfox flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="btn-gold-sheen text-noir-950 px-4 py-1.5 text-xs font-bold uppercase tracking-luxury cursor-pointer"
            >
              Close Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
