import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { NINE_LEVEL_SCHEDULE } from '../../data/mockData';

interface RewardsCalculatorProps {
  onNavigateToPV: () => void;
}

export const RewardsCalculatorView: React.FC<RewardsCalculatorProps> = ({ onNavigateToPV }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(4);

  const currentLevelData = NINE_LEVEL_SCHEDULE.find((l) => l.level === selectedLevel) || NINE_LEVEL_SCHEDULE[3];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          The nine-level schedule
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Explore rewards for completed, validated levels. This is a scenario, not an earnings forecast.
        </p>
      </div>

      {/* Scenario Box */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
            CALCULATOR / SELECTED LEVEL {selectedLevel}
          </span>
          <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Completed-level scenario
          </h2>
        </div>

        {/* Level Buttons 1 through 9 */}
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {NINE_LEVEL_SCHEDULE.map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() => setSelectedLevel(item.level)}
              className={`py-3 text-center font-mono text-xs uppercase hairline-border transition-all cursor-pointer ${
                selectedLevel === item.level
                  ? 'border-amberfox bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 text-parchment-300 hover:border-amberfox/50 hover:text-amberfox'
              }`}
            >
              {item.level}
            </button>
          ))}
        </div>

        {/* 4 Interactive Dynamic Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-noir-950 hairline-border p-5 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
              LEVEL NODES
            </span>
            <div className="font-serif text-3xl font-bold text-parchment-100">{currentLevelData.nodes}</div>
            <p className="text-[11px] font-mono text-parchment-400">Level {selectedLevel} fully complete</p>
          </div>

          <div className="bg-noir-950 hairline-border p-5 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
              CUMULATIVE MEMBERS
            </span>
            <div className="font-serif text-3xl font-bold text-parchment-100">{currentLevelData.cumulativeMembers}</div>
            <p className="text-[11px] font-mono text-parchment-400">
              {NINE_LEVEL_SCHEDULE.slice(0, selectedLevel)
                .map((x) => x.nodes)
                .join(' + ')}
            </p>
          </div>

          <div className="bg-noir-950 hairline-border p-5 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
              CURRENT LEVEL REWARD
            </span>
            <div className="font-serif text-3xl font-bold text-amberfox">₹{currentLevelData.levelReward.toLocaleString('en-IN')}</div>
            <p className="text-[11px] font-mono text-parchment-400">Complete validated level {selectedLevel}</p>
          </div>

          <div className="bg-noir-950 hairline-border p-5 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
              CUMULATIVE REWARDS
            </span>
            <div className="font-serif text-3xl font-bold text-amberfox">₹{currentLevelData.cumulativeRewards.toLocaleString('en-IN')}</div>
            <p className="text-[11px] font-mono text-parchment-400">Levels 1 through {selectedLevel}</p>
          </div>
        </div>

        <div className="pt-2">
          <span className="inline-block bg-noir-950 font-mono text-[10px] uppercase tracking-luxury px-3 py-1 hairline-border text-parchment-300">
            Selected completed level • {selectedLevel}
          </span>
        </div>
      </div>

      {/* Level Reward Ledger Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Level reward ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Level</th>
                <th className="py-2.5">Nodes</th>
                <th className="py-2.5">Cumulative members</th>
                <th className="py-2.5">Level reward</th>
                <th className="py-2.5 text-right">Cumulative rewards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {NINE_LEVEL_SCHEDULE.map((row) => (
                <tr
                  key={row.level}
                  onClick={() => setSelectedLevel(row.level)}
                  className={`hover:bg-noir-950/60 cursor-pointer transition-colors ${
                    selectedLevel === row.level ? 'bg-noir-950/90 border-l-2 border-amberfox' : ''
                  }`}
                >
                  <td className="py-3 font-semibold text-parchment-100">{row.level}</td>
                  <td className="py-3 text-parchment-300">{row.nodes}</td>
                  <td className="py-3 text-parchment-300">{row.cumulativeMembers}</td>
                  <td className="py-3 text-parchment-200">₹{row.levelReward.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right font-semibold text-amberfox">
                    ₹{row.cumulativeRewards.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-parchment-600">
          Amounts in INR • All node counts exclude the root member. Partial levels do not unlock the listed level reward.
        </p>
      </div>

      {/* Bottom 2 Split Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-l-2 border-amberfox bg-noir-900 p-6 space-y-2">
          <h4 className="font-serif text-xs text-amberfox font-semibold uppercase tracking-luxury">
            No assured income
          </h4>
          <p className="text-xs text-parchment-400 leading-relaxed font-light">
            Commissions depend on complete, validated levels and product distribution. Earnings and placement are not guaranteed; there is no assured income.
          </p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-3">
          <h4 className="font-serif text-lg uppercase tracking-wider text-parchment-100">
            From schedule to ledger
          </h4>
          <p className="text-xs text-parchment-400 font-light leading-relaxed">
            Actual credits are shown in your wallet after eligibility review. PV points are distinct from INR and do not represent a cash balance.
          </p>
          <button
            onClick={onNavigateToPV}
            className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-amberfox hover:border-amberfox flex items-center gap-1 cursor-pointer"
          >
            <span>VIEW NETWORK PV</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
