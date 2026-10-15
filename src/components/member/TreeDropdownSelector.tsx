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
} from 'lucide-react';
import { userTreeStore, UserTreeInstance } from '../../data/userTreeStore';

export const TreeDropdownSelector: React.FC = () => {
  const [trees, setTrees] = useState<UserTreeInstance[]>(userTreeStore.getTrees());
  const [activeIndex, setActiveIndex] = useState<number>(userTreeStore.getActiveTreeIndex());
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showTester, setShowTester] = useState<boolean>(false);

  useEffect(() => {
    const unsub = userTreeStore.subscribe(() => {
      setTrees(userTreeStore.getTrees());
      setActiveIndex(userTreeStore.getActiveTreeIndex());
    });
    return unsub;
  }, []);

  const activeTree = trees[activeIndex] || trees[0];

  const handleSelectTree = (idx: number) => {
    setActiveIndex(idx);
    userTreeStore.setActiveTreeIndex(idx);
  };

  const handleCopy = (link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const tree2 = trees[1];
  const t2Reqs = tree2?.unlockRequirements;

  return (
    <div className="bg-noir-900/95 border border-amberfox/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* ================= SIMPLE DROPDOWN SELECTOR ("DROPBOX") ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Dropdown Box */}
        <div className="flex items-center space-x-3.5 flex-1">
          <div className="w-10 h-10 rounded-xl bg-amberfox/15 border border-amberfox/40 flex items-center justify-center shrink-0 shadow-amber-glow">
            <GitBranch className="w-5 h-5 text-amberfox" />
          </div>
          <div className="flex-1 max-w-xl">
            <label htmlFor="tree-dropbox" className="text-[10px] font-mono uppercase tracking-widest text-parchment-400 block font-bold mb-1">
              SELECT TREE MATRIX (DROPBOX):
            </label>
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

        {/* Right: Active Referral Link Box with 1-Click Copy */}
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
      </div>

      {/* Quick 1-Click Buttons for Trees 1, 2, 3, 4 */}
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
        </div>

        <button
          onClick={() => setShowTester(!showTester)}
          className="text-[11px] text-amberfox hover:underline cursor-pointer flex items-center gap-1 ml-auto"
        >
          <Sliders className="w-3 h-3" />
          <span>{showTester ? 'Hide Rule Controls' : 'Test Unlock Rules'}</span>
        </button>
      </div>

      {/* ================= TREE #2 UNLOCK CRITERIA CHECKLIST (When Tree 2 is Locked) ================= */}
      {activeIndex === 1 && !tree2.isUnlocked && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 sm:p-5 space-y-3 font-mono text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-amber-300 font-bold uppercase">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Tree #2 Unlock Condition:</span>
          </div>
          <p className="text-[11px] text-parchment-300 font-light leading-relaxed">
            Per protocol, Tree #2 activates after an approved repeat purchase of ₹2,000+ <strong>AND</strong> once Tree #1 completes Level 1 (2 direct members placed) with the ₹300 milestone reward rewarded.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
            <div className={`p-2.5 rounded-lg border ${t2Reqs?.adminApproved ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-noir-950 border-amberfox/20 text-parchment-400'}`}>
              <div className="font-bold">1. ₹2,000 Purchase Approval</div>
              <div className="text-[10px] mt-0.5">{t2Reqs?.adminApproved ? 'Admin Approved ✓' : 'Pending Approval ⏳'}</div>
            </div>
            <div className={`p-2.5 rounded-lg border ${t2Reqs?.tree1Level1Completed ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-noir-950 border-amberfox/20 text-parchment-400'}`}>
              <div className="font-bold">2. Tree #1 Level 1 Complete</div>
              <div className="text-[10px] mt-0.5">{t2Reqs?.tree1Level1Completed ? '2/2 Placed (Complete) ✓' : 'Incomplete ⏳'}</div>
            </div>
            <div className={`p-2.5 rounded-lg border ${t2Reqs?.tree1Rewarded300 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-noir-950 border-amberfox/20 text-parchment-400'}`}>
              <div className="font-bold">3. ₹300 Reward Credited</div>
              <div className="text-[10px] mt-0.5">{t2Reqs?.tree1Rewarded300 ? '₹300 Credited ✓' : 'Pending ⏳'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TESTER DRAWER ================= */}
      {showTester && (
        <div className="bg-noir-950 border border-amberfox/30 rounded-xl p-4 space-y-2.5 font-mono text-xs">
          <div className="text-amberfox font-bold uppercase tracking-wider text-[11px]">
            Test Rule States (Immediate Preview):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => userTreeStore.toggleTree2AdminApproval()}
              className="p-2 bg-noir-900 border border-amberfox/25 hover:border-amberfox rounded text-left cursor-pointer"
            >
              <div className="text-[9px] text-parchment-400 uppercase">Tree 2 Admin Approval</div>
              <div className="text-xs font-bold text-amberfox mt-0.5">
                {tree2.unlockRequirements.adminApproved ? 'Approved ✓' : 'Pending ⏳'}
              </div>
            </button>
            <button
              onClick={() => userTreeStore.toggleTree1Level1Completion()}
              className="p-2 bg-noir-900 border border-amberfox/25 hover:border-amberfox rounded text-left cursor-pointer"
            >
              <div className="text-[9px] text-parchment-400 uppercase">Tree 1 Level 1 (2/2)</div>
              <div className="text-xs font-bold text-amberfox mt-0.5">
                {tree2.unlockRequirements.tree1Level1Completed ? '2 / 2 Placed ✓' : '1 / 2 Incomplete ⏳'}
              </div>
            </button>
            <button
              onClick={() => userTreeStore.toggleTree1Rewarded300()}
              className="p-2 bg-noir-900 border border-amberfox/25 hover:border-amberfox rounded text-left cursor-pointer"
            >
              <div className="text-[9px] text-parchment-400 uppercase">₹300 Level 1 Reward</div>
              <div className="text-xs font-bold text-amberfox mt-0.5">
                {tree2.unlockRequirements.tree1Rewarded300 ? '₹300 Rewarded ✓' : 'Pending ⏳'}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
