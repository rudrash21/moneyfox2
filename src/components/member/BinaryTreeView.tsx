import React, { useState } from 'react';
import { ArrowLeft, User, UserCheck, PlusCircle, CheckCircle2, Clock, GitBranch } from 'lucide-react';

interface BinaryTreeProps {
  onBackToPV: () => void;
}

export const BinaryTreeView: React.FC<BinaryTreeProps> = ({ onBackToPV }) => {
  const [placementNotice, setPlacementNotice] = useState<string | null>(null);

  const handlePlaceMember = (name: string, branch: 'Left' | 'Right') => {
    setPlacementNotice(`${name} placed into ${branch} Child branch. 100 PV accredited.`);
    setTimeout(() => setPlacementNotice(null), 4000);
  };
  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={onBackToPV}
          className="inline-flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-amberfox mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO NETWORK PV</span>
        </button>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / VISUAL TOPOLOGY
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Binary Placement Tree
        </h1>
        <p className="text-xs text-parchment-400 font-mono mt-1">
          Visual dual-branch topology for Vikramaditya S. • mf10492
        </p>
      </div>

      <div className="bg-noir-900 hairline-border p-6 sm:p-10 space-y-8">
        {/* Tree Header / Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 hairline-border-b text-xs font-mono">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-amberfox-gold">
              <span className="w-2.5 h-2.5 bg-amberfox rounded-full" />
              <span>Paid &amp; Placed (100 PV)</span>
            </span>
            <span className="flex items-center gap-1.5 text-parchment-400">
              <span className="w-2.5 h-2.5 border border-amberfox/40 rounded-full" />
              <span>Available Slot</span>
            </span>
          </div>
          <div className="text-parchment-400">
            Current Depth: <strong className="text-amberfox">Level 3</strong> (15 Left / 15 Right)
          </div>
        </div>

        {/* Tree Visual Flow */}
        <div className="py-6 flex flex-col items-center">
          {/* Level 0: Root Node (Current User) */}
          <div className="flex flex-col items-center relative">
            <div className="w-48 p-4 bg-noir-950 hairline-border border-amberfox text-center shadow-amber-glow z-10">
              <div className="text-[10px] font-mono text-amberfox uppercase tracking-luxury">ROOT MEMBER</div>
              <h4 className="font-serif text-sm font-semibold text-parchment-100 mt-1">Vikramaditya S.</h4>
              <p className="text-xs font-mono text-amberfox-gold mt-0.5">mf10492</p>
              <div className="mt-2 pt-2 border-t border-amberfox/20 flex justify-between text-[10px] font-mono text-parchment-400">
                <span>L: 1,500 PV</span>
                <span>R: 1,500 PV</span>
              </div>
            </div>
            {/* Trunk Line */}
            <div className="w-0.5 h-8 bg-amberfox/40" />
            <div className="w-80 h-0.5 bg-amberfox/40" />
          </div>

          {/* Level 1: Left and Right Nodes */}
          <div className="w-full max-w-2xl flex justify-between pt-8 relative">
            {/* Left Node: Priya V. */}
            <div className="flex flex-col items-center w-1/2">
              <div className="w-44 p-3 bg-noir-950 hairline-border text-center hover:border-amberfox transition-colors">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-luxury">LEFT BRANCH</span>
                <h5 className="font-serif text-xs font-semibold text-parchment-100 mt-0.5">Priya V.</h5>
                <p className="text-[11px] font-mono text-amberfox-gold">mf10510</p>
                <div className="mt-1 pt-1 border-t border-amberfox/10 text-[10px] font-mono text-parchment-400">
                  100 PV • Placed
                </div>
              </div>
              <div className="w-0.5 h-6 bg-amberfox/30" />
              <div className="w-36 h-0.5 bg-amberfox/30" />
              {/* Children of Priya */}
              <div className="w-full flex justify-between pt-4">
                <div className="w-28 p-2 bg-noir-950 hairline-border text-center text-[10px] font-mono">
                  <span className="text-parchment-300 font-semibold block">Karan S.</span>
                  <span className="text-amberfox">mf10512</span>
                </div>
                <div className="w-28 p-2 bg-noir-950 hairline-border border-dashed text-center text-[10px] font-mono text-parchment-600">
                  Open Slot
                </div>
              </div>
            </div>

            {/* Right Node: Amit K. */}
            <div className="flex flex-col items-center w-1/2">
              <div className="w-44 p-3 bg-noir-950 hairline-border text-center hover:border-amberfox transition-colors">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-luxury">RIGHT BRANCH</span>
                <h5 className="font-serif text-xs font-semibold text-parchment-100 mt-0.5">Amit K.</h5>
                <p className="text-[11px] font-mono text-amberfox-gold">mf10511</p>
                <div className="mt-1 pt-1 border-t border-amberfox/10 text-[10px] font-mono text-parchment-400">
                  100 PV • Placed
                </div>
              </div>
              <div className="w-0.5 h-6 bg-amberfox/30" />
              <div className="w-36 h-0.5 bg-amberfox/30" />
              {/* Children of Amit */}
              <div className="w-full flex justify-between pt-4">
                <div className="w-28 p-2 bg-noir-950 hairline-border border-dashed text-center text-[10px] font-mono text-parchment-600">
                  Open Slot
                </div>
                <div className="w-28 p-2 bg-noir-950 hairline-border border-dashed text-center text-[10px] font-mono text-parchment-600">
                  Open Slot
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Action Feedback */}
        {placementNotice && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{placementNotice}</span>
            </div>
            <span className="text-[10px] uppercase">Tree Synced</span>
          </div>
        )}

        {/* Bench Members Awaiting Slot Assignment with 21-Day Spillover Mechanism */}
        <div className="pt-6 border-t border-amberfox/15 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-amberfox tracking-luxury font-semibold block">
                WAITING BENCH &amp; 21-DAY SPILLOVER MECHANISM
              </span>
              <p className="text-[11px] text-parchment-400 font-light mt-0.5">
                Referrals made after direct 2 slots are filled enter your waiting bench. If not placed within 21 days, they spill over automatically.
              </p>
            </div>
            <span className="text-[10px] px-2 py-1 bg-noir-950 hairline-border border-amberfox/30 text-amberfox font-semibold shrink-0">
              2 Direct Slots Filled • 2 on Bench
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Member 1 on Bench */}
            <div className="p-4 bg-noir-950 hairline-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-parchment-100">Vikram Mehta • mf10524</p>
                  <span className="text-[10px] text-parchment-400">Paid • 100 PV accredited • Verified UPI</span>
                </div>
                <span className="text-amberfox-gold text-[10px] uppercase px-2 py-0.5 hairline-border border-amberfox/40 bg-amberfox/10">
                  Ready for Slot
                </span>
              </div>

              {/* 21-Day Timer Tracker */}
              <div className="space-y-1 pt-1 border-t border-amberfox/10">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-parchment-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amberfox" />
                    <span>Spillover Timer:</span>
                  </span>
                  <span className="text-amberfox font-bold">18 of 21 Days Elapsed (3 Days Left)</span>
                </div>
                <div className="w-full bg-noir-800 h-1.5 overflow-hidden hairline-border">
                  <div className="bg-amberfox h-full" style={{ width: `${(18 / 21) * 100}%` }} />
                </div>
              </div>

              {/* Placement Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePlaceMember('Vikram Mehta', 'Left')}
                  className="flex-1 py-1.5 hairline-border text-[10px] uppercase text-parchment-200 hover:border-amberfox hover:text-amberfox transition-colors cursor-pointer text-center"
                >
                  Place Left Branch
                </button>
                <button
                  type="button"
                  onClick={() => handlePlaceMember('Vikram Mehta', 'Right')}
                  className="flex-1 py-1.5 hairline-border text-[10px] uppercase text-parchment-200 hover:border-amberfox hover:text-amberfox transition-colors cursor-pointer text-center"
                >
                  Place Right Branch
                </button>
              </div>
            </div>

            {/* Member 2 on Bench */}
            <div className="p-4 bg-noir-950 hairline-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-parchment-100">Sneha Roy • mf10525</p>
                  <span className="text-[10px] text-parchment-400">Paid • 100 PV accredited • Verified UPI</span>
                </div>
                <span className="text-amberfox-gold text-[10px] uppercase px-2 py-0.5 hairline-border border-amberfox/40 bg-amberfox/10">
                  Ready for Slot
                </span>
              </div>

              {/* 21-Day Timer Tracker */}
              <div className="space-y-1 pt-1 border-t border-amberfox/10">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-parchment-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amberfox" />
                    <span>Spillover Timer:</span>
                  </span>
                  <span className="text-amberfox font-bold">6 of 21 Days Elapsed (15 Days Left)</span>
                </div>
                <div className="w-full bg-noir-800 h-1.5 overflow-hidden hairline-border">
                  <div className="bg-amberfox h-full" style={{ width: `${(6 / 21) * 100}%` }} />
                </div>
              </div>

              {/* Placement Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePlaceMember('Sneha Roy', 'Left')}
                  className="flex-1 py-1.5 hairline-border text-[10px] uppercase text-parchment-200 hover:border-amberfox hover:text-amberfox transition-colors cursor-pointer text-center"
                >
                  Place Left Branch
                </button>
                <button
                  type="button"
                  onClick={() => handlePlaceMember('Sneha Roy', 'Right')}
                  className="flex-1 py-1.5 hairline-border text-[10px] uppercase text-parchment-200 hover:border-amberfox hover:text-amberfox transition-colors cursor-pointer text-center"
                >
                  Place Right Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
