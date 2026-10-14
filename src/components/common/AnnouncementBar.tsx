import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside className="bg-noir-900 border-b border-amberfox/20 text-xs text-parchment-400 py-2.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between tracking-luxury font-medium text-[10.5px] uppercase">
        <div className="hidden md:flex items-center space-x-2 text-amberfox">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amberfox animate-pulse" />
          <span>AUTUMN / WINTER 240 GSM DROP LIVE</span>
        </div>
        <div className="text-center w-full md:w-auto font-serif tracking-luxury text-parchment-200">
          FREE EXPEDITED AIR COURIER PAN-INDIA • 100% COMPLIANT GST INVOICE WITH EVERY GARMENT
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-parchment-400">
          <span className="hidden lg:inline">CURRENCY: INR (₹)</span>
          <span className="hidden lg:inline text-amberfox/40">|</span>
          <span className="text-emerald-400 font-mono text-[9px] uppercase">SECURE ESCROW 256-BIT</span>
        </div>
      </div>
    </aside>
  );
};
