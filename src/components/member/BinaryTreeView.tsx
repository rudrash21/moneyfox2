import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  AlertTriangle,
  GitBranch,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { NineLevelBinaryTree } from '../public/NineLevelBinaryTree';
import { TreeDropdownSelector } from './TreeDropdownSelector';
import { userTreeStore, UserTreeInstance } from '../../data/userTreeStore';

interface BinaryTreeProps {
  onBackToPV: () => void;
}

export const BinaryTreeView: React.FC<BinaryTreeProps> = ({ onBackToPV }) => {
  const [placementNotice, setPlacementNotice] = useState<string | null>(null);
  const [trees, setTrees] = useState<UserTreeInstance[]>(userTreeStore.getTrees());
  const [activeIndex, setActiveIndex] = useState<number>(userTreeStore.getActiveTreeIndex());

  useEffect(() => {
    const unsubscribe = userTreeStore.subscribe(() => {
      setTrees(userTreeStore.getTrees());
      setActiveIndex(userTreeStore.getActiveTreeIndex());
    });
    return unsubscribe;
  }, []);

  const activeTree = trees[activeIndex] || trees[0];

  const handlePlaceMember = (name: string, branch: 'Left' | 'Right') => {
    setPlacementNotice(`${name} placed into ${branch} Child branch of ${activeTree.title}. Placement activated.`);
    setTimeout(() => setPlacementNotice(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Navigation */}
      <div>
        <button
          onClick={onBackToPV}
          className="inline-flex items-center space-x-2 text-xs font-mono text-parchment-400 hover:text-amberfox mb-3 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO REFERRALS &amp; TEAM</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
              AFFILIATE COMMAND / VISUAL TOPOLOGY
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1 font-bold">
              Binary Placement Tree
            </h1>
            <p className="text-xs text-parchment-400 font-mono mt-1">
              Multi-Matrix Network System for Vikramaditya S. • ID: {activeTree.referralCode}
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-noir-900 border border-amberfox/20 rounded-xl px-4 py-2.5 text-xs font-mono shrink-0">
            <span className="flex items-center gap-1.5 text-amberfox-gold">
              <span className="w-2.5 h-2.5 bg-amberfox rounded-full shadow-[0_0_8px_rgba(245,138,46,0.6)]" />
              <span>Paid &amp; Placed</span>
            </span>
            <span className="flex items-center gap-1.5 text-parchment-400">
              <span className="w-2.5 h-2.5 border border-amberfox/40 rounded-full" />
              <span>Available Slot</span>
            </span>
          </div>
        </div>
      </div>

      {/* Placement Notice Alert */}
      {placementNotice && (
        <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-between rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{placementNotice}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Tree Synced
          </span>
        </div>
      )}

      {/* ================= SIMPLE MULTI-TREE DROPBOX SELECTOR ================= */}
      <TreeDropdownSelector />

      {/* ================= ACTIVE TREE VISUAL CANVAS ================= */}
      {activeTree.isUnlocked ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                LIVE VISUAL MATRIX
              </span>
              <span className="text-parchment-300">
                Viewing: <strong className="text-amberfox">{activeTree.title}</strong> ({activeTree.referralCode})
              </span>
            </div>
            <span className="text-parchment-400 text-[11px] hidden sm:inline">
              9-Level Orthogonal Vector Engine
            </span>
          </div>

          <NineLevelBinaryTree
            hideHeader={true}
            isDashboard={true}
            customRootNode={activeTree.rootNode}
          />
        </div>
      ) : (
        /* LOCKED TREE OVERLAY STATE */
        <div className="bg-noir-900/90 border border-amberfox/30 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,138,46,0.2)]">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full inline-block">
              LOCKED MATRIX · {activeTree.title}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-parchment-100">
              Tree #2 Activation Pending
            </h3>
            <p className="text-xs sm:text-sm text-parchment-300 font-light leading-relaxed">
              {activeTree.lockReason ||
                "This matrix will unlock once Tree #1 completes Level 1 (2 direct members placed) and the ₹300 milestone reward has been credited."}
            </p>
          </div>

          {/* Quick Unlock Requirements summary */}
          <div className="max-w-lg mx-auto bg-noir-950 border border-amberfox/20 rounded-xl p-4 text-left font-mono text-xs space-y-2.5">
            <div className="text-[10px] uppercase font-bold text-amberfox">Unlock Checklist:</div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">1. Repeat ₹2,000 Purchase</span>
              <span className="text-emerald-400 font-bold">ORD-MFX-99488 ✓</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">2. Admin Payment Approval</span>
              <span className={activeTree.unlockRequirements.adminApproved ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                {activeTree.unlockRequirements.adminApproved ? 'Approved ✓' : 'Pending Approval ⏳'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">3. Tree #1 Level 1 Completed (2/2)</span>
              <span className={activeTree.unlockRequirements.tree1Level1Completed ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                {activeTree.unlockRequirements.tree1Level1Completed ? 'Complete (2/2) ✓' : 'Incomplete ⏳'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">4. ₹300 Milestone Reward Earned</span>
              <span className={activeTree.unlockRequirements.tree1Rewarded300 ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                {activeTree.unlockRequirements.tree1Rewarded300 ? 'Credited to Wallet ✓' : 'Pending ⏳'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => userTreeStore.setActiveTreeIndex(0)}
              className="btn-gold-sheen text-noir-950 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-amber-glow cursor-pointer inline-flex items-center gap-2"
            >
              <span>Switch to Active Tree #1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= WAITING BENCH & 21-DAY SPILLOVER MECHANISM ================= */}
      <div className="bg-noir-900/95 border border-amberfox/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amberfox/15 font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase text-amberfox tracking-luxury font-bold block">
              WAITING BENCH &amp; 21-DAY SPILLOVER MECHANISM
            </span>
            <p className="text-[11px] text-parchment-400 font-light mt-0.5">
              Placement targets active matrix: <strong className="text-amberfox">{activeTree.title}</strong> ({activeTree.referralCode}).
              Members not placed within 21 days automatically spill over.
            </p>
          </div>
          <span className="text-[10px] px-3 py-1.5 bg-noir-950 border border-amberfox/30 text-amberfox font-semibold rounded-lg shrink-0">
            Target: {activeTree.title}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Member 1 on Bench */}
          <div className="p-5 bg-noir-950 border border-amberfox/20 rounded-xl space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-parchment-100 font-mono text-sm">Vikram Mehta • mf10524</p>
                <span className="text-[10px] text-parchment-400 font-mono">Paid • Order verified • Verified UPI</span>
              </div>
              <span className="text-amberfox-gold text-[10px] uppercase px-2 py-0.5 border border-amberfox/40 bg-amberfox/10 rounded font-mono font-bold">
                Ready for Slot
              </span>
            </div>

            {/* 21-Day Timer Tracker */}
            <div className="space-y-1.5 pt-2 border-t border-amberfox/10">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-parchment-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amberfox" />
                  <span>Spillover Timer:</span>
                </span>
                <span className="text-amberfox font-bold">18 of 21 Days Elapsed (3 Days Left)</span>
              </div>
              <div className="w-full bg-noir-800 h-2 overflow-hidden rounded-full border border-amberfox/20">
                <div className="bg-amberfox h-full rounded-full transition-all duration-300" style={{ width: `${(18 / 21) * 100}%` }} />
              </div>
            </div>

            {/* Placement Actions */}
            <div className="flex gap-2 pt-1 font-mono">
              <button
                type="button"
                onClick={() => handlePlaceMember('Vikram Mehta', 'Left')}
                className="flex-1 py-2 border border-amberfox/30 rounded-lg text-[10px] uppercase font-bold text-parchment-200 hover:border-amberfox hover:text-amberfox hover:bg-amberfox/10 transition-colors cursor-pointer text-center"
              >
                Place Left Branch
              </button>
              <button
                type="button"
                onClick={() => handlePlaceMember('Vikram Mehta', 'Right')}
                className="flex-1 py-2 border border-amberfox/30 rounded-lg text-[10px] uppercase font-bold text-parchment-200 hover:border-amberfox hover:text-amberfox hover:bg-amberfox/10 transition-colors cursor-pointer text-center"
              >
                Place Right Branch
              </button>
            </div>
          </div>

          {/* Member 2 on Bench */}
          <div className="p-5 bg-noir-950 border border-amberfox/20 rounded-xl space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-parchment-100 font-mono text-sm">Sneha Roy • mf10525</p>
                <span className="text-[10px] text-parchment-400 font-mono">Paid • Order verified • Verified UPI</span>
              </div>
              <span className="text-amberfox-gold text-[10px] uppercase px-2 py-0.5 border border-amberfox/40 bg-amberfox/10 rounded font-mono font-bold">
                Ready for Slot
              </span>
            </div>

            {/* 21-Day Timer Tracker */}
            <div className="space-y-1.5 pt-2 border-t border-amberfox/10">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-parchment-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amberfox" />
                  <span>Spillover Timer:</span>
                </span>
                <span className="text-amberfox font-bold">6 of 21 Days Elapsed (15 Days Left)</span>
              </div>
              <div className="w-full bg-noir-800 h-2 overflow-hidden rounded-full border border-amberfox/20">
                <div className="bg-amberfox h-full rounded-full transition-all duration-300" style={{ width: `${(6 / 21) * 100}%` }} />
              </div>
            </div>

            {/* Placement Actions */}
            <div className="flex gap-2 pt-1 font-mono">
              <button
                type="button"
                onClick={() => handlePlaceMember('Sneha Roy', 'Left')}
                className="flex-1 py-2 border border-amberfox/30 rounded-lg text-[10px] uppercase font-bold text-parchment-200 hover:border-amberfox hover:text-amberfox hover:bg-amberfox/10 transition-colors cursor-pointer text-center"
              >
                Place Left Branch
              </button>
              <button
                type="button"
                onClick={() => handlePlaceMember('Sneha Roy', 'Right')}
                className="flex-1 py-2 border border-amberfox/30 rounded-lg text-[10px] uppercase font-bold text-parchment-200 hover:border-amberfox hover:text-amberfox hover:bg-amberfox/10 transition-colors cursor-pointer text-center"
              >
                Place Right Branch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
