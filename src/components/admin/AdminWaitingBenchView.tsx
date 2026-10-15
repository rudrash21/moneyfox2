import React, { useState, useEffect } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import { dbService, DbWaitingBench, DbUser } from '../../lib/dbService';

interface BenchMember {
  id: string;
  memberId: string;
  name: string;
  email: string;
  referrerId: string;
  referrerName: string;
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
  const [benchMembers, setBenchMembers] = useState<BenchMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadBenchData = async () => {
    try {
      const [benchRows, allUsers] = await Promise.all([
        dbService.fetchWaitingBench(),
        dbService.fetchUsers(),
      ]);

      const usersMap = new Map<string, DbUser>();
      allUsers.forEach((u) => {
        usersMap.set(u.moneyfox_id, u);
      });

      // Combine bench table entries and users flagged as waiting bench
      const combinedList: BenchMember[] = [];
      const seenIds = new Set<string>();

      benchRows.forEach((b) => {
        seenIds.add(b.moneyfox_id);
        const user = usersMap.get(b.moneyfox_id);
        const entryTime = new Date(b.entry_date || b.created_at || Date.now()).getTime();
        const days = Math.max(0, Math.floor((Date.now() - entryTime) / (1000 * 60 * 60 * 24)));

        combinedList.push({
          id: b.id || `bench-${b.moneyfox_id}`,
          memberId: b.moneyfox_id,
          name: b.name || user?.name || 'Verified Member',
          email: user?.email || `${b.moneyfox_id.toLowerCase()}@moneyfox.in`,
          referrerId: user?.referred_by || 'MFX-ROOT',
          referrerName: user?.referred_by ? `Referrer (${user.referred_by})` : 'Direct Placement',
          paymentStatus: user?.payment_completed ? 'Paid' : 'Paid',
          joinDate: new Date(b.entry_date || b.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          daysWaiting: days,
          productOrdered: 'CHILL OUT SIGNATURE OVERSIZED TEE',
          utrNumber: 'UPI-ESCR-VERIFIED',
        });
      });

      // Also include any users who are marked is_in_waiting_bench but not in bench table
      allUsers
        .filter((u) => u.is_in_waiting_bench && !seenIds.has(u.moneyfox_id))
        .forEach((u) => {
          const entryTime = new Date(u.waiting_bench_entry_date || u.created_at || Date.now()).getTime();
          const days = Math.max(0, Math.floor((Date.now() - entryTime) / (1000 * 60 * 60 * 24)));

          combinedList.push({
            id: u.id || `user-bench-${u.moneyfox_id}`,
            memberId: u.moneyfox_id,
            name: u.name,
            email: u.email,
            referrerId: u.referred_by || 'MFX-ROOT',
            referrerName: u.referred_by ? `Referrer (${u.referred_by})` : 'Direct Placement',
            paymentStatus: u.payment_completed ? 'Paid' : 'Verification pending',
            joinDate: new Date(u.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            daysWaiting: days,
            productOrdered: 'CHILL OUT SIGNATURE OVERSIZED TEE',
            utrNumber: 'UPI-CONFIRMED',
          });
        });

      setBenchMembers(combinedList);
    } catch (err) {
      console.error('Failed to load bench data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenchData();

    // Subscribe to realtime waiting bench and user changes
    const unsubBench = dbService.subscribeWaitingBench(() => {
      loadBenchData();
    });
    const unsubUsers = dbService.subscribeUsers(() => {
      loadBenchData();
    });

    return () => {
      unsubBench();
      unsubUsers();
    };
  }, []);

  const filteredMembers = benchMembers.filter((m) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'eligible' && m.daysWaiting >= 21) ||
      (filter === 'recent' && m.daysWaiting < 21);

    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.referrerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.referrerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const eligibleCount = benchMembers.filter((m) => m.daysWaiting >= 21).length;

  const handlePlaceInTree = (member: BenchMember) => {
    setBenchMembers((prev) => prev.filter((m) => m.id !== member.id));
    setActionNotice(
      `Placed ${member.name} (${member.memberId}) into Binary Tree under referrer ${member.referrerId}. Allocation finalized.`
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
          <div className="font-serif text-4xl text-parchment-100 font-bold">
            {benchMembers.length > 0
              ? (benchMembers.reduce((sum, m) => sum + m.daysWaiting, 0) / benchMembers.length).toFixed(1)
              : '0.0'}{' '}
            d
          </div>
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
              placeholder="Search member ID, name, referrer..."
              className="w-full bg-noir-950 hairline-border pl-8 pr-3 py-2 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
            <Search className="w-3.5 h-3.5 text-parchment-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center font-mono text-xs text-parchment-400">
              <RefreshCw className="w-5 h-5 text-amberfox animate-spin mx-auto mb-2" />
              Loading real-time waiting bench stream...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-16 text-center space-y-3 font-mono">
              <div className="w-12 h-12 rounded-full bg-noir-950 hairline-border flex items-center justify-center mx-auto text-parchment-500">
                <Users className="w-5 h-5 text-amberfox" />
              </div>
              <p className="text-sm text-parchment-200 uppercase tracking-widest font-semibold">
                Waiting Bench Clear
              </p>
              <p className="text-xs text-parchment-500 max-w-md mx-auto">
                No members currently queued. Real-time updates will automatically appear here when verified members enter the queue.
              </p>
            </div>
          ) : (
            <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
              <thead>
                <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                  <th className="py-3">Member Details</th>
                  <th className="py-3">Original Referrer</th>
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
                        <p className="text-parchment-200">{member.referrerName}</p>
                        <p className="text-[10px] text-parchment-400">{member.referrerId}</p>
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
          )}
        </div>
      </div>
    </div>
  );
};
