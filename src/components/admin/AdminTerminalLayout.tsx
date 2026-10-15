import React, { useState } from 'react';
import {
  BarChart3,
  GitBranch,
  CreditCard,
  Wallet,
  Package,
  FileSpreadsheet,
  Users,
  Clock,
  LogOut,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { AdminTab, ScreenView, UserProfile } from '../../types';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminTreeManagementView } from './AdminTreeManagementView';
import { AdminWaitingBenchView } from './AdminWaitingBenchView';
import { AdminPaymentsApprovalView } from './AdminPaymentsApprovalView';
import { AdminWithdrawalsView } from './AdminWithdrawalsView';
import { AdminProductsInventoryView } from './AdminProductsInventoryView';
import { AdminWalletAuditView } from './AdminWalletAuditView';
import { AdminMemberManagementView } from './AdminMemberManagementView';
import { AdminAuditLogView } from './AdminAuditLogView';
import { AdminPaymentQueueModal } from './AdminPaymentQueueModal';

interface AdminTerminalLayoutProps {
  onNavigate: (screen: ScreenView) => void;
  onPaymentApprovedNotification: () => void;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
}

export const AdminTerminalLayout: React.FC<AdminTerminalLayoutProps> = ({
  onNavigate,
  onPaymentApprovedNotification,
  currentUser,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [modalMode, setModalMode] = useState<'payment' | 'payout' | null>(null);

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'analytics', label: '1. Analytics & Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trees', label: '2. Tree Management', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'waiting', label: '3. Waiting Bench', icon: <Clock className="w-4 h-4" />, badge: '3 Spillover' },
    { id: 'users', label: '4. All Users Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'payments', label: '5. Payments Approval', icon: <CreditCard className="w-4 h-4" />, badge: '3 Pending' },
    { id: 'withdrawals', label: '6. Withdrawals Payouts', icon: <Wallet className="w-4 h-4" /> },
    { id: 'products', label: '7. Products & Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'wallet', label: '8. Reward Engine & Audit', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'audit-log', label: '9. System Audit Log', icon: <ShieldAlert className="w-4 h-4" />, badge: 'Accountability' },
  ];

  // Helper to normalize tab aliases
  const isTabActive = (tabId: AdminTab) => {
    if (activeTab === tabId) return true;
    if (tabId === 'trees' && activeTab === 'trees-placements') return true;
    if (tabId === 'payments' && activeTab === 'pending-payments') return true;
    if (tabId === 'withdrawals' && activeTab === 'withdrawals-escrow') return true;
    if (tabId === 'products' && activeTab === 'products-inventory') return true;
    if (tabId === 'wallet' && activeTab === 'wallet-audit') return true;
    if (tabId === 'users' && activeTab === 'member-management') return true;
    return false;
  };

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-amberfox/15 bg-noir-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30 font-mono text-xs">
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
          <span className="text-amberfox/40">|</span>
          <span className="uppercase tracking-luxury text-parchment-400">
            Search MoneyFox ID, Name, UTR, Referrer...
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => onNavigate('member-terminal')}
            className="py-1 px-3.5 rounded-full bg-noir-900/90 text-parchment-200 border border-amberfox/40 hover:border-amberfox hover:text-amberfox text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,138,46,0.25)]"
            title="Switch to Member Terminal"
          >
            <Users className="w-3.5 h-3.5 text-amberfox" />
            <span>Member Desk</span>
          </button>
          <span className="hidden sm:inline-block bg-amber-950/60 text-amberfox-gold text-[10px] uppercase px-2.5 py-1 hairline-border border-amberfox/40">
            Operations role
          </span>
          <span className="text-parchment-200 font-semibold hidden md:inline">
            {currentUser?.fullName || 'Apex Admin'}
          </span>
          <button
            onClick={() => {
              if (onSignOut) onSignOut();
              else onNavigate('admin-login');
            }}
            className="text-parchment-400 hover:text-amberfox flex items-center gap-1 cursor-pointer"
            title="Lock & Exit to Admin Login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-noir-950 md:border-r border-b md:border-b-0 border-amberfox/15 p-4 flex flex-col justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-luxury text-amberfox font-semibold block px-3 py-2">
              SYSTEM COMMAND
            </span>
            <nav className="space-y-1 mt-2">
              {navItems.map((item) => {
                const isActive = isTabActive(item.id);
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
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] bg-amberfox/15 text-amberfox px-1.5 py-0.5 border border-amberfox/30 font-semibold whitespace-nowrap ml-1">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin Operator Badge at bottom */}
          <div className="mt-8 pt-6 border-t border-amberfox/15 space-y-4 font-mono text-xs">
            <div className="p-3 bg-noir-900 hairline-border space-y-1">
              <p className="font-semibold text-parchment-100">Apex Admin</p>
              <p className="text-[10px] text-parchment-400">ROLE • OPERATIONS</p>
              <div className="pt-1">
                <span className="inline-block bg-noir-950 text-amberfox text-[9px] uppercase px-2 py-0.5 hairline-border border-amberfox/30">
                  Guarded actions
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('member-terminal')}
              className="w-full rounded-lg border border-amberfox/40 bg-gradient-to-r from-noir-900 via-amber-950/20 to-noir-900 hover:border-amberfox hover:bg-amberfox/15 py-2.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-parchment-200 hover:text-amberfox transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,138,46,0.2)]"
            >
              <Users className="w-3.5 h-3.5 text-amberfox" />
              <span>View Member Desk</span>
            </button>

            <button
              onClick={() => {
                if (onSignOut) onSignOut();
                else onNavigate('admin-login');
              }}
              className="w-full rounded-lg border border-noir-800 hover:border-amberfox/40 py-2 text-center text-xs font-medium uppercase tracking-wider text-parchment-300 hover:text-amberfox transition-colors cursor-pointer"
            >
              Lock &amp; Sign Out
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'analytics' && (
            <AdminOverviewView
              onSwitchTab={(t) => setActiveTab(t)}
              onOpenPaymentModal={() => setActiveTab('payments')}
              onOpenPayoutModal={() => setActiveTab('withdrawals')}
              onOpenStockModal={() => setActiveTab('products')}
            />
          )}

          {(activeTab === 'trees' || activeTab === 'trees-placements') && (
            <AdminTreeManagementView />
          )}

          {activeTab === 'waiting' && <AdminWaitingBenchView />}

          {(activeTab === 'users' || activeTab === 'member-management') && (
            <AdminMemberManagementView />
          )}

          {(activeTab === 'payments' || activeTab === 'pending-payments') && (
            <AdminPaymentsApprovalView
              onPaymentApprovedNotification={onPaymentApprovedNotification}
            />
          )}

          {(activeTab === 'withdrawals' || activeTab === 'withdrawals-escrow') && (
            <AdminWithdrawalsView />
          )}

          {(activeTab === 'products' || activeTab === 'products-inventory') && (
            <AdminProductsInventoryView />
          )}

          {(activeTab === 'wallet' || activeTab === 'wallet-audit') && (
            <AdminWalletAuditView />
          )}

          {activeTab === 'audit-log' && (
            <AdminAuditLogView />
          )}
        </main>
      </div>

      {/* Modal for guarded decision */}
      <AdminPaymentQueueModal
        isOpen={modalMode !== null}
        mode={modalMode || 'payment'}
        onClose={() => setModalMode(null)}
        onApproveSuccess={() => {
          onPaymentApprovedNotification();
        }}
      />
    </div>
  );
};
