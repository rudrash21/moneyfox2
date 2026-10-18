import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Copy,
  Check,
  ChevronDown,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  Plus,
} from 'lucide-react';
import { userTreeStore, UserTreeInstance } from '../../data/userTreeStore';

export const TreeDropdownSelector: React.FC = () => {
  const [trees, setTrees] = useState<UserTreeInstance[]>(userTreeStore.getTrees());
  const [activeIndex, setActiveIndex] = useState<number>(userTreeStore.getActiveTreeIndex());
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showTester, setShowTester] = useState<boolean>(false);
  const [newTreeNotice, setNewTreeNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = userTreeStore.subscribe(() => {
      setTrees(userTreeStore.getTrees());
      setActiveIndex(userTreeStore.getActiveTreeIndex());
    });
    return unsub;
  }, []);

  const activeTree = trees[activeIndex] || trees[0];
  const reqs = activeTree?.unlockRequirements;
  const beforeTreeNum = reqs?.previousTreeNumber || Math.max(1, activeTree.treeNumber - 1);

  const handleSelectTree = (idx: number) => {
    setActiveIndex(idx);
    userTreeStore.setActiveTreeIndex(idx);
  };

  const handleCopy = (link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleStartNewTree = () => {
    const check = userTreeStore.canStartNewTree();
    if (!check.allowed) {
      setNewTreeNotice(check.reason || 'Complete Level 1 before unlocking the next tree.');
      setTimeout(() => setNewTreeNotice(null), 5000);
      return;
    }
    const created = userTreeStore.startNewTree();
    setNewTreeNotice(`Tree #${created.treeNumber} successfully initiated!`);
    setTimeout(() => setNewTreeNotice(null), 4000);
  };

  const checkNext = userTreeStore.canStartNewTree();
  const canStartNext = checkNext.allowed;
  const nextTreeNumber = (trees[trees.length - 1]?.treeNumber || 1) + 1;

  return (
    <div className="bg-noir-900/95 border border-amberfox/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Toast Notice */}
      {newTreeNotice && (
        <div className="bg-amberfox/15 border border-amberfox text-amberfox font-mono text-xs px-4 py-2.5 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amberfox shrink-0" />
            <span className="font-bold">{newTreeNotice}</span>
          </div>
          <span className="text-[10px] text-parchment-400">Multi-Tree Protocol</span>
        </div>
      )}

      {/* ================= SIMPLE DROPDOWN SELECTOR ("DROPBOX") ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Dropdown Box */}
        <div className="flex items-center space-x-3.5 flex-1">
          <div className="w-10 h-10 rounded-xl bg-amberfox/15 border border-amberfox/40 flex items-center justify-center shrink-0 shadow-amber-glow">
            <GitBranch className="w-5 h-5 text-amberfox" />
          </div>
          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tree-dropbox" className="text-[10px] font-mono uppercase tracking-widest text-parchment-400 block font-bold">
                SELECT TREE MATRIX (DROPBOX):
              </label>
              <span className="text-[9px] font-mono text-amberfox/90 uppercase font-semibold">
                {trees.length} {trees.length === 1 ? 'Tree' : 'Trees'} in Portfolio
              </span>
            </div>
            <div className="relative">
              <select
                id="tree-dropbox"
                value={activeIndex}
                onChange={(e) => handleSelectTree(Number(e.target.value))}
                className="w-full bg-noir-950 border-2 border-amberfox/50 hover:border-amberfox text-parchment-100 font-mono text-xs sm:text-sm font-bold rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-amberfox cursor-pointer shadow-xl transition-colors"
              >
                {trees.map((t, idx) => (
                  <option key={t.id} value={idx} className="bg-noir-950 text-parchment-100 py-2">
                    Tree #{t.treeNumber} · {t.title} ({t.referralCode}) — {t.isUnlocked ? 'Active Unlocked' : 'Locked'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-amberfox absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Active Referral Link Box with 1-Click Copy & Start New Tree CTA */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="flex items-center gap-3 bg-noir-950 border border-amberfox/25 rounded-xl p-3 shrink-0 justify-between sm:justify-start">
            <div className="font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-parchment-400 font-semibold">
                  Tree #{activeTree.treeNumber} Code:
                </span>
                {activeTree.isUnlocked ? (
                  <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                    Active
                  </span>
                ) : (
                  <span className="text-[8px] bg-amber-950 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                    Locked
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-amberfox tracking-wider mt-0.5">
                {activeTree.referralCode}
              </div>
            </div>

            <button
              onClick={() => handleCopy(activeTree.referralLink)}
              className="btn-gold-sheen text-noir-950 px-3.5 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-amber-glow"
              title="Copy this tree's dedicated referral link"
            >
              {copiedLink === activeTree.referralLink ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Start New Tree Button (Only displayed when next tree is eligible to be unlocked) */}
          {canStartNext && (
            <button
              onClick={handleStartNewTree}
              className="px-3.5 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amberfox hover:text-parchment-100 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shrink-0"
              title="Start another binary tree matrix"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Start Tree #{nextTreeNumber}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick 1-Click Buttons for Trees */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amberfox/15 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase text-parchment-500 mr-1 hidden sm:inline">Quick Switch:</span>
          {trees.map((t, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTree(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amberfox text-noir-950 border-amberfox shadow-amber-glow'
                    : 'bg-noir-950 border-amberfox/20 text-parchment-300 hover:border-amberfox hover:text-amberfox'
                }`}
              >
                {t.isUnlocked ? (
                  <Unlock className={`w-3 h-3 ${isSelected ? 'text-noir-950' : 'text-emerald-400'}`} />
                ) : (
                  <Lock className={`w-3 h-3 ${isSelected ? 'text-noir-950' : 'text-amber-500'}`} />
                )}
                <span>Tree #{t.treeNumber}</span>
              </button>
            );
          })}

          {/* Quick Switch Add Button (Only displayed when current tree is unlocked and level 1 is completed) */}
          {canStartNext && (
            <button
              onClick={handleStartNewTree}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-noir-950 border border-dashed border-amberfox/40 text-amberfox hover:bg-amberfox/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Add another tree"
            >
              <Plus className="w-3 h-3" />
              <span>Add #{nextTreeNumber}</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowTester(!showTester)}
          className="text-[11px] text-amberfox hover:underline cursor-pointer flex items-center gap-1 ml-auto"
        >
          <Sliders className="w-3 h-3" />
          <span>{showTester ? 'Hide Rule Controls' : 'Test Unlock Rules'}</span>
        </button>
      </div>

      {/* ================= DYNAMIC UNLOCK CRITERIA CHECKLIST (When selected tree is Locked) ================= */}
      {!activeTree.isUnlocked && activeTree.treeNumber > 1 && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 sm:p-5 space-y-3 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold uppercase">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Tree #{activeTree.treeNumber} Unlock Conditions (Before Tree: Tree #{beforeTreeNum}):</span>
            </div>
            <span className="text-[10px] text-amberfox/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
              Multi-Tree Protocol
            </span>
          </div>
          <p className="text-[11px] text-parchment-300 font-light leading-relaxed">
            Per protocol, Tree #{activeTree.treeNumber} unlocks when you make <strong>another purchase over ₹2,000</strong> AND the before tree (<strong>Tree #{beforeTreeNum}</strong>) has completed its <strong>2 direct referrals</strong> (Left &amp; Right child) and <strong>Level 1</strong> has been completed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
            <div className={`p-2.5 rounded-lg border ${reqs?.adminApproved ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-noir-950 border-amberfox/20 text-parchment-400'}`}>
              <div className="font-bold">1. Purchase Over ₹2,000</div>
              <div className="text-[10px] mt-0.5">
                {reqs?.adminApproved ? 'Admin Approved (₹2,000+) ✓' : 'Pending Purchase / Approval ⏳'}
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border ${reqs?.previousTreeDirectReferralsCompleted ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-noir-950 border-amberfox/20 text-parchment-400'}`}>
              <div className="font-bold">2. Tree #{beforeTreeNum} 2 Direct Referrals</div>
              <div className="text-[10px] mt-0.5">
                {reqs?.previousTreeDirectReferralsCompleted
                  ? '2/2 Direct Members Completed ✓'
                  : `${reqs?.previousTreeDirectReferralsCount || 0}/2 Direct Members ⏳`}
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border ${reqs?.previousTreeLevel1Completed ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-noir-950 border-amberfox/20 text-parchment-400'}`}>
              <div className="font-bold">3. Tree #{beforeTreeNum} Level 1 Completed</div>
              <div className="text-[10px] mt-0.5">
                {reqs?.previousTreeLevel1Completed ? 'Level 1 Complete ✓' : 'Level 1 Incomplete ⏳'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TESTER DRAWER ================= */}
      {showTester && (
        <div className="bg-noir-950 border border-amberfox/30 rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="text-amberfox font-bold uppercase tracking-wider text-[11px]">
              Rule Testing Controls · Active: Tree #{activeTree.treeNumber} (Before Tree: Tree #{beforeTreeNum})
            </div>
            <span className="text-[9px] text-parchment-400">Click buttons to toggle state instantly</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => userTreeStore.toggleTreePurchaseApproval(activeTree.treeNumber)}
              className="p-2.5 bg-noir-900 border border-amberfox/25 hover:border-amberfox rounded text-left cursor-pointer transition-colors"
            >
              <div className="text-[9px] text-parchment-400 uppercase">Tree #{activeTree.treeNumber} Purchase Over ₹2,000</div>
              <div className="text-xs font-bold text-amberfox mt-0.5">
                {reqs?.adminApproved ? 'Approved (₹2,000+) ✓' : 'Pending Approval ⏳'}
              </div>
            </button>
            <button
              onClick={() => userTreeStore.toggleTreeDirectReferrals(beforeTreeNum)}
              className="p-2.5 bg-noir-900 border border-amberfox/25 hover:border-amberfox rounded text-left cursor-pointer transition-colors"
            >
              <div className="text-[9px] text-parchment-400 uppercase">Tree #{beforeTreeNum} 2 Direct Referrals</div>
              <div className="text-xs font-bold text-amberfox mt-0.5">
                {reqs?.previousTreeDirectReferralsCompleted ? '2 / 2 Directs Done ✓' : '1 / 2 Incomplete ⏳'}
              </div>
            </button>
            <button
              onClick={() => userTreeStore.toggleTreeLevel1Completion(beforeTreeNum)}
              className="p-2.5 bg-noir-900 border border-amberfox/25 hover:border-amberfox rounded text-left cursor-pointer transition-colors"
            >
              <div className="text-[9px] text-parchment-400 uppercase">Tree #{beforeTreeNum} Level 1 Status</div>
              <div className="text-xs font-bold text-amberfox mt-0.5">
                {reqs?.previousTreeLevel1Completed ? 'Level 1 Completed ✓' : 'Incomplete ⏳'}
              </div>
            </button>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-amberfox/15 text-[10px]">
            <span className="text-parchment-400">
              Users can start as many trees as they want. Every next tree requires: Repeat purchase &gt; ₹2,000 + Before tree 2 direct referrals &amp; Level 1 complete.
            </span>
            {canStartNext && (
              <button
                onClick={handleStartNewTree}
                className="text-amberfox hover:underline font-bold shrink-0 ml-2 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Instantiate Tree #{trees.length + 1}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

