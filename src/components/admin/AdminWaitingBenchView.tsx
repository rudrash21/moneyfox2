import React, { useState } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface BenchMember {
  id: string;
  memberId: string;
  name: string;
  email: string;
  sponsorId: string;
  sponsorName: string;
  paymentStatus: 'Paid' | 'Verification pending';
  joinDate: string;
  daysWaiting: number;
  productOrdered: string;
  utrNumber: string;
}

export const AdminWaitingBenchView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'eligible' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const [benchMembers, setBenchMembers] = useState<BenchMember[]>([
    {
      id: 'b-1',
      memberId: 'mf10540',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@network.in',
      sponsorId: 'mf10492',
      sponsorName: 'Vikramaditya S.',
      paymentStatus: 'Paid',
      joinDate: '12 Sep 2025',
      daysWaiting: 24, // 21+ days! Eligible for spillover!
      productOrdered: 'Noir Black Tee (L)',
      utrNumber: '429910443211',
    },
    {
      id: 'b-2',
      memberId: 'mf10541',
      name: 'Meera Nambiar',
      email: 'meera.n@network.in',
      sponsorId: 'mf10492',
      sponsorName: 'Vikramaditya S.',
      paymentStatus: 'Paid',
      joinDate: '14 Sep 2025',
      daysWaiting: 22, // 21+ days! Eligible for spillover!
      productOrdered: 'Ivory Chalk Tee (M)',
      utrNumber: '429910443219',
    },
    {
      id: 'b-3',
      memberId: 'mf10542',
      name: 'Devendra Joshi',
      email: 'dev.joshi@network.in',
      sponsorId: 'mf10510',
      sponsorName: 'Priya V.',
      paymentStatus: 'Paid',
      joinDate: '02 Oct 2025',
      daysWaiting: 12, // Under 21 days
      productOrdered: 'Noir Black Tee (XL)',
      utrNumber: '429910884120',
    },
    {
      id: 'b-4',
      memberId: 'mf10543',
      name: 'Kavita Sengupta',
      email: 'kavita.s@network.in',
      sponsorId: 'mf10511',
      sponsorName: 'Amit K.',
      paymentStatus: 'Paid',
      joinDate: '06 Oct 2025',
      daysWaiting: 8, // Under 21 days
      productOrdered: 'Ivory Chalk Tee (S)',
      utrNumber: '429910992314',
    },
    {
      id: 'b-5',
      memberId: 'mf10544',
      name: 'Tanmay Bhattacharya',
      email: 'tanmay.b@network.in',
      sponsorId: 'mf10510',
      sponsorName: 'Priya V.',
      paymentStatus: 'Paid',
      joinDate: '10 Sep 2025',
      daysWaiting: 26, // 21+ days!
      productOrdered: 'Noir Black Tee (M)',
      utrNumber: '429910114455',
    },
  ]);

  const filteredMembers = benchMembers.filter((m) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'eligible' && m.daysWaiting >= 21) ||
      (filter === 'recent' && m.daysWaiting < 21);

    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sponsorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sponsorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const eligibleCount = benchMembers.filter((m) => m.daysWaiting >= 21).length;

  const handlePlaceInTree = (member: BenchMember) => {
    setBenchMembers(benchMembers.filter((m) => m.id !== member.id));
    setActionNotice(
      `Placed ${member.name} (${member.memberId}) into Binary Tree under sponsor ${member.sponsorId}. Member placed successfully.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          OPERATIONS / NETWORK QUEUE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Waiting Bench Management
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Queue of verified paid members awaiting binary tree allocation • 21-day spillover policy engine.
        </p>
      </div>

      {/* Notice Banner */}
      {actionNotice && (
        <div className="bg-noir-900 border-l-2 border-emerald-400 p-4 flex items-center justify-between font-mono text-xs text-parchment-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-parchment-500 hover:text-parchment-200 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            TOTAL BENCH QUEUE
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{benchMembers.length}</div>
          <p className="text-[11px] font-mono text-parchment-400">All unplaced paid members</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block">
              21+ DAYS SPILLOVER ELIGIBLE
            </span>
            <span className="w-2 h-2 rounded-full bg-amberfox animate-ping" />
          </div>
          <div className="font-serif text-4xl text-amberfox font-bold">{eligibleCount}</div>
          <p className="text-[11px] font-mono text-parchment-400">Eligible for system spillover</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-emerald-400 block">
            PAID &amp; VERIFIED
          </span>
          <div className="font-serif text-4xl text-emerald-400 font-bold">100%</div>
          <p className="text-[11px] font-mono text-parchment-400">All UTRs reconciled in escrow</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            AVERAGE WAIT TIME
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">18.4 d</div>
          <p className="text-[11px] font-mono text-parchment-400">Prior to open placement</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-noir-900 hairline-border p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 hairline-border-b">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              All Members ({benchMembers.length})
            </button>
            <button
              onClick={() => setFilter('eligible')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'eligible'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              21+ Days Eligible ({eligibleCount})
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'recent'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox'
              }`}
            >
              Recent (&lt;21 Days)
            </button>
          </div>

          <div className="relative w-full md:w-72 font-mono text-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member ID, name, sponsor..."
              className="w-full bg-noir-950 hairline-border pl-8 pr-3 py-2 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
            <Search className="w-3.5 h-3.5 text-parchment-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-3">Member Details</th>
                <th className="py-3">Original Sponsor</th>
                <th className="py-3">Days Waiting</th>
                <th className="py-3">Eligibility State</th>
                <th className="py-3">Garment / UTR</th>
                <th className="py-3 text-right">Placement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-xs">
              {filteredMembers.map((member) => {
                const isSpilloverReady = member.daysWaiting >= 21;

                return (
                  <tr key={member.id} className="hover:bg-noir-950/60 transition-colors">
                    <td className="py-4">
                      <p className="font-serif text-sm font-semibold text-parchment-100">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-amberfox-gold mt-0.5">{member.memberId}</p>
                      <p className="text-[10px] text-parchment-500">{member.email}</p>
                    </td>

                    <td className="py-4">
                      <p className="text-parchment-200">{member.sponsorName}</p>
                      <p className="text-[10px] text-parchment-400">{member.sponsorId}</p>
                    </td>

                    <td className="py-4">
                      <span className="font-bold text-parchment-100">{member.daysWaiting} days</span>
                      <p className="text-[10px] text-parchment-500">Joined: {member.joinDate}</p>
                    </td>

                    <td className="py-4">
                      {isSpilloverReady ? (
                        <span className="inline-block px-2.5 py-1 bg-amberfox/15 text-amberfox border border-amberfox/40 text-[10px] uppercase font-bold tracking-luxury shadow-amber-glow">
                          ⚡ 21+ Days Eligible
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-noir-950 hairline-border text-parchment-400 text-[10px] uppercase font-mono">
                          {21 - member.daysWaiting} days till spillover
                        </span>
                      )}
                    </td>

                    <td className="py-4">
                      <p className="text-[11px] text-parchment-300">{member.productOrdered}</p>
                      <p className="text-[10px] text-amberfox-gold">UTR: {member.utrNumber}</p>
                    </td>

                    <td className="py-4 text-right">
                      <button
                        onClick={() => handlePlaceInTree(member)}
                        className="btn-gold-sheen text-noir-950 font-bold uppercase tracking-wider text-[11px] px-3.5 py-1.5 cursor-pointer shadow-amber-glow"
                      >
                        Place in Tree →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
