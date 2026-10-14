import React, { useState } from 'react';
import { Copy, Share2, GitBranch, Search, Check, ExternalLink } from 'lucide-react';
import { INITIAL_DOWNLINE } from '../../data/mockData';

interface NetworkPVProps {
  onOpenBinaryTree: () => void;
}

export const NetworkPVView: React.FC<NetworkPVProps> = ({ onOpenBinaryTree }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const referralLink = 'moneyfox.luxury/join?ref=mf10492';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredMembers = INITIAL_DOWNLINE.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sponsorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'placed' && m.placement.includes('Placed')) ||
      (filterType === 'bench' && m.placement.includes('bench'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Referrals &amp; Network Team
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Follow direct member orders, team balance, and referral network placement.
        </p>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold">
            LEFT TEAM ORDERS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">15 Orders</div>
          <p className="text-[11px] font-mono text-parchment-400">15 paid &amp; placed members</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold">
            RIGHT TEAM ORDERS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">15 Orders</div>
          <p className="text-[11px] font-mono text-parchment-400">15 paid &amp; placed members</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold">
            REFERRAL BENCH
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">2</div>
          <p className="text-[11px] font-mono text-parchment-400">1 paid • 1 awaiting payment</p>
        </div>
      </div>

      {/* Referral Link & Contribution Balance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Direct Referral Info */}
        <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Direct referral information
          </h2>
          <span className="font-mono text-xs uppercase tracking-luxury text-amberfox-gold block">
            YOUR MEMBER ID / MF10492
          </span>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
              Referral address
            </label>
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopyLink}
              className="btn-gold-sheen text-noir-950 px-5 py-2.5 text-xs font-bold uppercase tracking-luxury flex items-center gap-1.5 cursor-pointer shadow-amber-glow"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'COPIED' : 'COPY REFERRAL LINK'}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="hairline-border px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE LINK</span>
            </button>
          </div>

          <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
            The link is a static share-preview. Referrals do not guarantee placement or earnings.
          </p>

          <div className="pt-3 border-t border-amberfox/15 font-mono text-xs space-y-1">
            <span className="text-[10px] uppercase text-amberfox tracking-luxury">SPONSOR RECORD</span>
            <p className="text-parchment-200">Rahul Sharma • mf10001 • Verified sponsor</p>
          </div>
        </div>

        {/* Contribution Balance */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              Contribution balance
            </h3>
            <span className="bg-noir-950 text-[10px] uppercase tracking-luxury px-2 py-0.5 hairline-border text-amberfox-gold font-mono">
              Balanced • 30 members
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-noir-950 hairline-border">
              <span className="text-[10px] font-mono text-parchment-400 uppercase">LEFT</span>
              <div className="font-serif text-2xl font-bold text-amberfox">15 Orders</div>
            </div>
            <div className="p-3 bg-noir-950 hairline-border">
              <span className="text-[10px] font-mono text-parchment-400 uppercase">RIGHT</span>
              <div className="font-serif text-2xl font-bold text-amberfox">15 Orders</div>
            </div>
          </div>

          {/* Symmetrical Dual Bar */}
          <div className="w-full flex h-2 bg-noir-950 overflow-hidden">
            <div className="w-1/2 bg-amberfox" />
            <div className="w-1/2 bg-amberfox-bright" />
          </div>

          <p className="text-[11px] font-light text-parchment-400 leading-relaxed">
            Each verified garment order activates a member in the network team. Bench orders are placed following verification.
          </p>

          <p className="text-[11px] font-mono text-amberfox-soft leading-relaxed">
            Commissions are disbursed strictly in INR upon verified order distributions and completed tree levels.
          </p>
        </div>
      </div>

      {/* Searchable Downline Ledger */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
            Searchable downline ledger
          </h2>
          <button
            onClick={onOpenBinaryTree}
            className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-amberfox hover:border-amberfox hover:bg-noir-950 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>VIEW BINARY TREE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Member search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, member ID or sponsor..."
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Payment / placement
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            >
              <option value="all">All members</option>
              <option value="placed">Placed only</option>
              <option value="bench">Waiting bench only</option>
            </select>
          </div>
        </div>

        {/* Downline Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Member</th>
                <th className="py-2.5">Sponsor</th>
                <th className="py-2.5">Payment</th>
                <th className="py-2.5">Placement</th>
                <th className="py-2.5 text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-noir-950/60">
                  <td className="py-3">
                    <p className="font-semibold text-parchment-100">{m.name} • {m.memberId}</p>
                  </td>
                  <td className="py-3 text-parchment-400">{m.sponsorId}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] uppercase ${
                        m.paymentStatus === 'Paid'
                          ? 'text-emerald-400'
                          : m.paymentStatus === 'Pending'
                          ? 'text-amberfox'
                          : 'text-parchment-600'
                      }`}
                    >
                      {m.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 text-parchment-300">{m.placement}</td>
                  <td className="py-3 text-right">
                    <span className={m.contributionPV > 0 ? 'text-amberfox-gold font-semibold' : 'text-parchment-600'}>
                      {m.contributionPV > 0 ? '1 Order' : '0 Orders'} {m.placement.includes('bench') && m.contributionPV > 0 ? '• unplaced' : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-[11px] font-mono text-parchment-600 flex justify-between items-center">
          <p>Showing {filteredMembers.length} of 32 associated members • Page 1 of 7</p>
          <div className="space-x-2">
            <span className="opacity-40">Previous</span>
            <span className="text-amberfox cursor-pointer hover:underline">Next →</span>
          </div>
        </div>
      </div>

      {/* Bottom Compliance Notice */}
      <div className="border-l-2 border-amberfox bg-noir-900 p-4">
        <h4 className="font-serif text-xs text-amberfox font-semibold uppercase tracking-luxury mb-0.5">
          Eligibility and level completion
        </h4>
        <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
          Commissions depend on complete, validated levels and product distribution. Earnings and placement are not guaranteed; there is no assured income.
        </p>
      </div>
    </div>
  );
};
