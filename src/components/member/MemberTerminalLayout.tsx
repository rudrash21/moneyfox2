import React, { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Calculator,
  Share2,
  Wallet,
  ShoppingBag,
  Shield,
  LifeBuoy,
  ArrowLeft,
  LogOut,
  Shirt,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { BRAND_ASSETS, CURRENT_USER, INITIAL_ORDERS } from '../../data/mockData';
import { MemberTab, ScreenView, OrderRecord, UserProfile } from '../../types';
import { ShopOrdersView } from './ShopOrdersView';
import { OrderTrackingDashboardView } from './OrderTrackingDashboardView';
import { OrderDetailTrackingView } from './OrderDetailTrackingView';
import { NetworkPVView } from './NetworkPVView';
import { BinaryTreeView } from './BinaryTreeView';
import { RewardsCalculatorView } from './RewardsCalculatorView';
import { PayoutsEscrowView } from './PayoutsEscrowView';
import { AccountSecurityView } from './AccountSecurityView';
import { SupportReturnsView } from './SupportReturnsView';

interface MemberTerminalLayoutProps {
  onNavigate: (screen: ScreenView) => void;
  onOpenInvoice: (order?: OrderRecord) => void;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
}

export const MemberTerminalLayout: React.FC<MemberTerminalLayoutProps> = ({
  onNavigate,
  onOpenInvoice,
  currentUser,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<MemberTab>('order-tracking');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord>(INITIAL_ORDERS[0]);

  const memberName = currentUser?.fullName || CURRENT_USER.name;
  const memberId = currentUser?.moneyfoxId || 'mf10492';

  const navItems: { id: MemberTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'order-tracking',
      label: 'Order Tracking',
      icon: <Truck className="w-4 h-4" />,
      badge: `${INITIAL_ORDERS.length} Active`,
    },
    { id: 'shop-orders', label: 'Shop Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'binary-tree', label: 'Binary Tree', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'network-pv', label: 'Network PV', icon: <Share2 className="w-4 h-4" /> },
    { id: 'payouts', label: 'Payouts', icon: <Wallet className="w-4 h-4" /> },
    { id: 'account-security', label: 'Account & security', icon: <Shield className="w-4 h-4" /> },
    { id: 'support-returns', label: 'Support & returns', icon: <LifeBuoy className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-amberfox/15 bg-noir-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('storefront')}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <img src={BRAND_ASSETS.logoCrest} alt="MF Logo" className="h-8 w-auto" />
            <span className="font-serif tracking-luxury font-bold text-sm text-parchment-100">
              MONEYFOX
            </span>
          </button>
          <span className="text-amberfox/40 font-mono text-xs">|</span>
          <span className="font-mono text-xs uppercase tracking-luxury text-parchment-400">
            MEMBER TERMINAL / {memberId}
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <span className="font-mono text-xs text-parchment-200 hidden md:inline">{memberName}</span>
          <button
            onClick={() => {
              if (onSignOut) onSignOut();
              else onNavigate('storefront');
            }}
            className="text-xs font-mono text-parchment-400 hover:text-amberfox flex items-center gap-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-noir-950 md:border-r border-b md:border-b-0 border-amberfox/15 p-4 flex flex-col justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-luxury text-amberfox font-semibold block px-3 py-2">
              AFFILIATE COMMAND
            </span>
            <nav className="space-y-1 mt-2">
              {navItems.map((item) => {
                const isActive =
                  activeTab === item.id || (activeTab === 'order-detail' && item.id === 'order-tracking');
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-noir-900 border-l-2 border-amberfox text-amberfox font-semibold'
                        : 'text-parchment-400 hover:text-parchment-100 hover:bg-noir-900/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={isActive ? 'text-amberfox' : 'text-parchment-500'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] bg-amberfox/15 text-amberfox px-1.5 py-0.5 border border-amberfox/30 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Member Card at bottom of sidebar */}
          <div className="mt-8 pt-6 border-t border-amberfox/15 space-y-4 font-mono text-xs">
            <div className="p-3 bg-noir-900 hairline-border space-y-1">
              <p className="font-semibold text-parchment-100">{memberName}</p>
              <p className="text-[10px] text-parchment-400">{memberId} • Member</p>
            </div>

            <button
              onClick={() => onNavigate('storefront')}
              className="w-full rounded-lg border border-noir-800 hover:border-amberfox/40 py-2 text-center text-xs font-medium uppercase tracking-wider text-parchment-300 hover:text-amberfox transition-colors cursor-pointer"
            >
              Return to Shop
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'order-tracking' && (
            <OrderTrackingDashboardView
              onSelectOrderDetail={(ord) => {
                setSelectedOrder(ord);
                setActiveTab('order-detail');
              }}
              onOpenInvoice={(ord) => onOpenInvoice(ord)}
              onOpenConcierge={() => setActiveTab('support-returns')}
            />
          )}

          {activeTab === 'order-detail' && (
            <OrderDetailTrackingView
              order={selectedOrder}
              onBackToOrders={() => setActiveTab('order-tracking')}
              onOpenInvoice={() => onOpenInvoice(selectedOrder)}
              onOpenConcierge={() => setActiveTab('support-returns')}
            />
          )}

          {activeTab === 'shop-orders' && (
            <ShopOrdersView
              onSelectOrderTimeline={(ord) => {
                setSelectedOrder(ord);
                setActiveTab('order-detail');
              }}
              onOpenInvoice={(ord) => onOpenInvoice(ord)}
            />
          )}

          {activeTab === 'network-pv' && (
            <NetworkPVView onOpenBinaryTree={() => setActiveTab('binary-tree')} />
          )}

          {activeTab === 'binary-tree' && (
            <BinaryTreeView onBackToPV={() => setActiveTab('network-pv')} />
          )}

          {activeTab === 'calculator' && (
            <RewardsCalculatorView onNavigateToPV={() => setActiveTab('network-pv')} />
          )}

          {activeTab === 'overview' && (
            <RewardsCalculatorView onNavigateToPV={() => setActiveTab('network-pv')} />
          )}

          {activeTab === 'payouts' && <PayoutsEscrowView />}

          {activeTab === 'account-security' && <AccountSecurityView />}

          {activeTab === 'support-returns' && <SupportReturnsView />}
        </main>
      </div>
    </div>
  );
};
