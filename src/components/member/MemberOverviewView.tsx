import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Truck,
  ShoppingBag,
  Share2,
  Wallet,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Package,
} from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';
import { userTreeStore } from '../../data/userTreeStore';
import { MemberTab, OrderRecord, UserProfile } from '../../types';
import { dbService } from '../../lib/dbService';

interface MemberOverviewViewProps {
  currentUser?: UserProfile | null;
  onNavigateTab: (tab: MemberTab) => void;
  onSelectOrder: (order: OrderRecord) => void;
  onReturnToShop: () => void;
}

export const MemberOverviewView: React.FC<MemberOverviewViewProps> = ({
  currentUser,
  onNavigateTab,
  onSelectOrder,
  onReturnToShop,
}) => {
  const memberName = currentUser?.fullName || CURRENT_USER.name;
  const memberId = currentUser?.moneyfoxId || 'mf10492';
  const trees = userTreeStore.getTrees();
  const unlockedTrees = trees.filter((t) => t.isUnlocked);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const list = await dbService.fetchOrders();
      setOrders(list);
    };
    loadOrders();

    const unsub = dbService.subscribeOrders(() => {
      loadOrders();
    });
    return () => unsub();
  }, []);

  const activeOrders = orders.filter((o) => o.shipmentStatus !== 'Delivered');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Luxury Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-noir-900 via-noir-950 to-noir-900 border border-amberfox/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amberfox/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amberfox/15 text-amberfox border border-amberfox/30">
                <ShieldCheck className="w-3 h-3 text-amberfox" />
                Verified Guild Member
              </span>
              <span className="font-mono text-xs text-parchment-400">ID: {memberId}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl text-parchment-100 font-bold tracking-tight">
              Welcome back, <span className="text-amberfox-gold">{memberName}</span>
            </h1>
            <p className="text-sm text-parchment-400 max-w-xl font-light leading-relaxed">
              Manage your personal atelier orders, active binary tree structures, referral commissions, and escrow disbursements from your central terminal.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={() => onNavigateTab('binary-tree')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amberfox hover:bg-amberfox-hover text-noir-950 font-bold text-xs uppercase tracking-wider transition-all shadow-amber-glow cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>Explore Trees</span>
            </button>
            <button
              onClick={onReturnToShop}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-amberfox/30 hover:border-amberfox text-parchment-200 hover:text-parchment-100 font-medium text-xs uppercase tracking-wider bg-noir-900/60 hover:bg-noir-900 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amberfox" />
              <span>Shop Collection</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI High-Level Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Multi-Tree Status */}
        <div
          onClick={() => onNavigateTab('binary-tree')}
          className="group relative bg-noir-900/80 hover:bg-noir-900 border border-amberfox/20 hover:border-amberfox/50 rounded-xl p-5 transition-all cursor-pointer hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400">
              Binary Trees
            </span>
            <div className="w-8 h-8 rounded-lg bg-amberfox/10 flex items-center justify-center text-amberfox group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-parchment-100">
              {unlockedTrees.length}
            </span>
            <span className="text-xs text-parchment-400 font-mono">/ {trees.length} Active</span>
          </div>
          <p className="text-xs text-amberfox font-medium mt-1">
            {unlockedTrees.length > 1 ? `${unlockedTrees.length} Trees Activated` : 'Tree 1 Active'}
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-parchment-400 group-hover:text-amberfox transition-colors">
            <span>Switch & inspect</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div
          onClick={() => onNavigateTab('order-tracking')}
          className="group relative bg-noir-900/80 hover:bg-noir-900 border border-amberfox/20 hover:border-amberfox/50 rounded-xl p-5 transition-all cursor-pointer hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400">
              Active Shipments
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-parchment-100">
              {activeOrders.length}
            </span>
            <span className="text-xs text-parchment-400 font-mono">In Pipeline</span>
          </div>
          <p className="text-xs text-blue-400 font-medium mt-1">
            {activeOrders[0]?.carrier || 'Bluedart Express'} Tracking
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-parchment-400 group-hover:text-blue-400 transition-colors">
            <span>Track milestone steps</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Referral Network PV */}
        <div
          onClick={() => onNavigateTab('network-pv')}
          className="group relative bg-noir-900/80 hover:bg-noir-900 border border-amberfox/20 hover:border-amberfox/50 rounded-xl p-5 transition-all cursor-pointer hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400">
              Personal Team PV
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-parchment-100">1,240</span>
            <span className="text-xs text-emerald-400 font-mono">+180 this cycle</span>
          </div>
          <p className="text-xs text-parchment-400 font-medium mt-1">Dual-leg balance: 62% L / 38% R</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-parchment-400 group-hover:text-emerald-400 transition-colors">
            <span>Team genealogy</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Escrow & Payouts */}
        <div
          onClick={() => onNavigateTab('payouts')}
          className="group relative bg-noir-900/80 hover:bg-noir-900 border border-amberfox/20 hover:border-amberfox/50 rounded-xl p-5 transition-all cursor-pointer hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-parchment-400">
              Available Escrow
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amberfox-gold group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-parchment-100">₹8,450</span>
            <span className="text-xs text-parchment-400 font-mono">INR</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-1">Settlement Ready</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-parchment-400 group-hover:text-amberfox-gold transition-colors">
            <span>Instant bank withdrawal</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Trees Summary & Orders Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Multi-Tree Summary */}
        <div className="rounded-xl border border-noir-800 bg-noir-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-noir-800">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amberfox" />
              <h2 className="font-serif text-lg font-bold text-parchment-100 uppercase tracking-wide">
                Your Binary Trees
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('binary-tree')}
              className="text-xs text-amberfox hover:text-amberfox-gold font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trees.map((tree) => (
              <div
                key={tree.id}
                onClick={() => onNavigateTab('binary-tree')}
                className={`flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer ${
                  tree.isUnlocked
                    ? 'bg-noir-950/60 border-amberfox/20 hover:border-amberfox/50 hover:bg-noir-950'
                    : 'bg-noir-950/30 border-noir-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      tree.isUnlocked
                        ? 'bg-amberfox/15 text-amberfox border border-amberfox/30'
                        : 'bg-noir-800 text-parchment-400 border border-noir-700'
                    }`}
                  >
                    T{tree.treeNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-parchment-100">{tree.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-noir-800 text-parchment-300">
                        {tree.badge}
                      </span>
                    </div>
                    <p className="text-xs text-parchment-400 font-mono mt-0.5">
                      Code: <span className="text-amberfox font-semibold">{tree.referralCode}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {tree.isUnlocked ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-noir-900 text-parchment-400 border border-noir-700">
                      ₹2,000 Unlock Req
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-amberfox/5 border border-amberfox/15 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amberfox shrink-0" />
            <p className="text-xs text-parchment-300 leading-relaxed">
              Purchasing ₹2,000 worth of products unlocks a new binary tree and generates an exclusive referral code upon admin approval.
            </p>
          </div>
        </div>

        {/* Right: Active Order Tracking Snapshot */}
        <div className="rounded-xl border border-noir-800 bg-noir-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-noir-800">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amberfox" />
              <h2 className="font-serif text-lg font-bold text-parchment-100 uppercase tracking-wide">
                Recent Orders & Shipments
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('order-tracking')}
              className="text-xs text-amberfox hover:text-amberfox-gold font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Track All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="py-8 text-center font-mono space-y-2 bg-noir-950/40 rounded-lg p-4 border border-noir-800">
                <Package className="w-6 h-6 mx-auto text-parchment-500" />
                <p className="text-xs text-parchment-300 font-semibold uppercase">No active orders yet</p>
                <p className="text-[11px] text-parchment-500">
                  Select and acquire luxury pieces from the storefront to activate delivery tracking.
                </p>
              </div>
            ) : (
              orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.orderId}
                  onClick={() => {
                    onSelectOrder(ord);
                    onNavigateTab('order-detail');
                  }}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-noir-950/60 border border-noir-800 hover:border-amberfox/40 hover:bg-noir-950 transition-all cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-parchment-100 group-hover:text-amberfox transition-colors">
                        {ord.orderId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-noir-800 text-parchment-300 border border-noir-700">
                        {ord.shipmentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-parchment-400">
                      {ord.productName} • ₹{(ord.total || 2000).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-parchment-400 block">{ord.date}</span>
                    <span className="text-[11px] text-amberfox font-mono inline-flex items-center gap-0.5 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('shop-orders')}
              className="w-full py-2.5 rounded-lg border border-noir-800 hover:border-amberfox/30 text-xs text-center font-medium text-parchment-300 hover:text-amberfox bg-noir-950/40 hover:bg-noir-950 transition-colors cursor-pointer"
            >
              View Order History & Download Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
