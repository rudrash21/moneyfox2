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
import { UserProfile } from '../../types';
import { dbService } from '../../lib/dbService';

interface BinaryTreeProps {
  onBackToPV: () => void;
  onNavigateTab?: (tab: string) => void;
  currentUser?: UserProfile | null;
}

export const BinaryTreeView: React.FC<BinaryTreeProps> = ({ onBackToPV, onNavigateTab, currentUser }) => {
  const [trees, setTrees] = useState<UserTreeInstance[]>(userTreeStore.getTrees());
  const [activeIndex, setActiveIndex] = useState<number>(userTreeStore.getActiveTreeIndex());

  useEffect(() => {
    const syncUser = async () => {
      const dbUsers = await dbService.fetchUsers();
      if (currentUser) {
        userTreeStore.setUser(currentUser, dbUsers);
      }
    };
    syncUser();

    const unsubscribe = userTreeStore.subscribe(() => {
      setTrees(userTreeStore.getTrees());
      setActiveIndex(userTreeStore.getActiveTreeIndex());
    });
    const unsubUsers = dbService.subscribeUsers(async () => {
      const dbUsers = await dbService.fetchUsers();
      if (currentUser) {
        userTreeStore.setUser(currentUser, dbUsers);
      }
    });

    return () => {
      unsubscribe();
      unsubUsers();
    };
  }, [currentUser]);

  const activeTree = trees[activeIndex] || trees[0];

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
              Multi-Matrix Network System for {currentUser?.fullName || activeTree.rootNode.name || 'Member'} • ID: {activeTree.referralCode}
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
              Tree #{activeTree.treeNumber} Activation Pending
            </h3>
            <p className="text-xs sm:text-sm text-parchment-300 font-light leading-relaxed">
              {activeTree.lockReason ||
                `This matrix will unlock once you complete another purchase over ₹2,000 AND your before tree (Tree #${activeTree.unlockRequirements?.previousTreeNumber || activeTree.treeNumber - 1}) completes its 2 direct referrals and Level 1.`}
            </p>
          </div>

          {/* Quick Unlock Requirements summary */}
          <div className="max-w-lg mx-auto bg-noir-950 border border-amberfox/20 rounded-xl p-4 text-left font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amberfox">
              <span>Unlock Checklist (Before Tree: Tree #{activeTree.unlockRequirements?.previousTreeNumber || activeTree.treeNumber - 1}):</span>
              <span className="text-parchment-400 font-normal">Multi-Tree Protocol</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">1. Repeat Purchase Over ₹2,000</span>
              <span className={activeTree.unlockRequirements.adminApproved ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                {activeTree.unlockRequirements.adminApproved
                  ? `${activeTree.unlockRequirements.qualifyingOrderId} (Approved ✓)`
                  : 'Pending Approval ⏳'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">
                2. Tree #{activeTree.unlockRequirements?.previousTreeNumber || activeTree.treeNumber - 1} 2 Direct Referrals
              </span>
              <span className={activeTree.unlockRequirements.previousTreeDirectReferralsCompleted ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                {activeTree.unlockRequirements.previousTreeDirectReferralsCompleted
                  ? 'Complete (2/2) ✓'
                  : `${activeTree.unlockRequirements.previousTreeDirectReferralsCount || 0}/2 Referrals ⏳`}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-parchment-300">
                3. Tree #{activeTree.unlockRequirements?.previousTreeNumber || activeTree.treeNumber - 1} Level 1 Completed
              </span>
              <span className={activeTree.unlockRequirements.previousTreeLevel1Completed ? 'text-emerald-400 font-bold' : 'text-amber-500'}>
                {activeTree.unlockRequirements.previousTreeLevel1Completed ? 'Complete (2/2 Placed) ✓' : 'Incomplete ⏳'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => userTreeStore.setActiveTreeIndex(Math.max(0, (activeTree.unlockRequirements?.previousTreeNumber || activeTree.treeNumber - 1) - 1))}
              className="btn-gold-sheen text-noir-950 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-amber-glow cursor-pointer inline-flex items-center gap-2"
            >
              <span>Switch to Tree #{activeTree.unlockRequirements?.previousTreeNumber || activeTree.treeNumber - 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab?.('shop-orders')}
              className="bg-noir-950 border border-amberfox/40 hover:border-amberfox text-amberfox px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 transition-colors"
            >
              <span>Make ₹2,000 Purchase</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
