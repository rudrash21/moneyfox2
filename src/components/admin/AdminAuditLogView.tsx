import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Trash2,
  Calculator,
  UserX,
  UserCheck,
  Wallet,
  Clock,
  GitBranch,
  Package,
  Eye,
  Copy,
  Check,
  PlusCircle,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { AdminAuditLogEntry, AuditActionType, AuditCategory, AuditSeverity } from '../../types';
import { getAuditLogs, addAuditLog, subscribeAuditLogs, resetAuditLogs } from '../../data/auditLogStore';

export const AdminAuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLogEntry[]>(getAuditLogs());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<AdminAuditLogEntry | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);

  // New simulated entry state
  const [simActionType, setSimActionType] = useState<AuditActionType>('PAYMENT_APPROVAL');
  const [simTarget, setSimTarget] = useState<string>('Order ORD-MFX-99520 · Karan Malhotra (mf10520)');
  const [simDetails, setSimDetails] = useState<string>('Reconciled UPI UTR 429910556677 for ₹2,000. Activated account and issued statutory GST Tax Invoice.');
  const [simSeverity, setSimSeverity] = useState<AuditSeverity>('medium');
  const [simOperator, setSimOperator] = useState<string>('admin@moneyfox.luxury');

  useEffect(() => {
    const unsubscribe = subscribeAuditLogs((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
    showToast('Cryptographic hash copied to clipboard');
  };

  // Quick Action Simulator triggers
  const handleSimulateQuickAction = (
    type: 'payment' | 'user_delete' | 'reward_calc' | 'payout'
  ) => {
    if (type === 'payment') {
      const orderNum = Math.floor(10000 + Math.random() * 90000);
      const utrNum = `429910${Math.floor(100000 + Math.random() * 900000)}`;
      addAuditLog({
        operatorId: 'admin@moneyfox.luxury',
        operatorRole: 'Apex Admin',
        actionType: 'PAYMENT_APPROVAL',
        category: 'Financial',
        severity: 'medium',
        targetResource: `Order ORD-MFX-${orderNum} · ₹2,000 (UTR: ${utrNum})`,
        details: `Approved payment reconciliation for ₹2,000. Activated new downline member account and enqueued for 2×2 binary tree placement.`,
        ipAddress: '103.21.244.18 (Mumbai HQ)',
        status: 'SUCCESS',
        regulatoryReference: 'GST-SEC-31-CGST-ACT',
        beforeState: 'Status: PENDING_VERIFICATION',
        afterState: 'Status: APPROVED · GST Invoice Generated',
        metadata: {
          orderId: `ORD-MFX-${orderNum}`,
          amount: 2000,
          utr: utrNum,
        },
      });
      showToast(`Logged Payment Approval for ORD-MFX-${orderNum} (₹2,000)`);
    } else if (type === 'user_delete') {
      const targetId = `mf105${Math.floor(30 + Math.random() * 60)}`;
      addAuditLog({
        operatorId: 'compliance@moneyfox.luxury',
        operatorRole: 'Compliance Officer',
        actionType: 'USER_DELETION',
        category: 'Security & Users',
        severity: 'critical',
        targetResource: `Member Account ${targetId} (Disputed Profile)`,
        details: `Permanently deleted member record ${targetId} following statutory verification refusal and duplicate bank credentials violation. Downline branches re-parented cleanly.`,
        ipAddress: '49.36.128.44 (Delhi Node)',
        status: 'SUCCESS',
        regulatoryReference: 'KYC-AML-PMLA-RULE-9',
        beforeState: 'Status: Flagged for compliance audit',
        afterState: 'Status: DELETED_PURGED · Node: DE-INDEXED',
        metadata: {
          deletedId: targetId,
          complianceOfficer: 'A. Singhania',
        },
      });
      showToast(`Logged User Deletion for ${targetId} (Account Purged)`);
    } else if (type === 'reward_calc') {
      const batchId = `SYS-BATCH-MLM-L9-${Math.floor(100 + Math.random() * 900)}`;
      const credited = 4300;
      addAuditLog({
        operatorId: 'admin@moneyfox.luxury',
        operatorRole: 'Apex Admin',
        actionType: 'REWARD_CALCULATION',
        category: 'Compensation',
        severity: 'high',
        targetResource: `9-Level Compensation Engine (${batchId})`,
        details: `Executed scheduled 9-Level Binary MLM compensation engine batch. Audited 64 nodes across 4 tiers; credited total ₹${credited.toLocaleString()} to 4 qualifying member wallets.`,
        ipAddress: '103.21.244.18 (Mumbai HQ)',
        status: 'SUCCESS',
        regulatoryReference: 'STAT-MLM-SEC-12/2025',
        beforeState: 'Uncalculated nodes: 64 · Pending ledger allocation: ₹4,300',
        afterState: 'Calculation complete · 4 Wallets credited · Ledger committed',
        metadata: {
          batchId,
          scannedNodes: 64,
          creditedAmount: credited,
          completedLevels: 4,
        },
      });
      showToast(`Logged 9-Level Reward Calculation Batch (${batchId})`);
    } else if (type === 'payout') {
      const wdId = `WD-10492-${Math.floor(100 + Math.random() * 900)}`;
      addAuditLog({
        operatorId: 'finance@moneyfox.luxury',
        operatorRole: 'Finance Desk',
        actionType: 'WITHDRAWAL_PAYOUT',
        category: 'Financial',
        severity: 'medium',
        targetResource: `Withdrawal ${wdId} · ₹1,500 to rahul@okhdfcbank`,
        details: `Approved and disbursed ₹1,500 direct UPI transfer from escrow wallet. Bank Reference Ref: CMS${Math.floor(100000000 + Math.random() * 900000000)}.`,
        ipAddress: '103.21.244.18 (Mumbai HQ)',
        status: 'SUCCESS',
        regulatoryReference: 'NPCI-UPI-DISBURSEMENT-2025',
        beforeState: 'Status: Requested · Held in Escrow',
        afterState: 'Status: Paid · Disbursed via NPCI banking rails',
        metadata: {
          withdrawalId: wdId,
          amount: 1500,
          destinationUpi: 'rahul@okhdfcbank',
        },
      });
      showToast(`Logged Withdrawal Payout for ${wdId} (₹1,500 Disbursed)`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cat: AuditCategory = 'Security & Users';
    if (simActionType.includes('PAYMENT') || simActionType.includes('WITHDRAWAL')) {
      cat = 'Financial';
    } else if (simActionType === 'REWARD_CALCULATION') {
      cat = 'Compensation';
    } else if (simActionType.includes('TREE') || simActionType.includes('BENCH')) {
      cat = 'Network';
    } else if (simActionType.includes('INVENTORY')) {
      cat = 'Inventory';
    }

    addAuditLog({
      operatorId: simOperator,
      operatorRole: simOperator.includes('compliance') ? 'Compliance Officer' : 'Apex Admin',
      actionType: simActionType,
      category: cat,
      severity: simSeverity,
      targetResource: simTarget,
      details: simDetails,
      ipAddress: '103.21.244.18 (Mumbai HQ)',
      status: 'SUCCESS',
      regulatoryReference: 'STAT-AUDIT-MANUAL-LOG',
      beforeState: 'Prior manual action state',
      afterState: 'Executed & committed to permanent audit ledger',
    });

    setShowSimulateModal(false);
    showToast(`Recorded new audit log action: ${simActionType}`);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `moneyfox_audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported full JSON audit trail with cryptographic hashes');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Operator', 'Role', 'ActionType', 'Category', 'Severity', 'TargetResource', 'Status', 'HashDigest'];
    const rows = logs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.operatorId,
      l.operatorRole,
      l.actionType,
      l.category,
      l.severity,
      `"${l.targetResource.replace(/"/g, '""')}"`,
      l.status,
      l.hashDigest,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `moneyfox_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Exported CSV compliance log');
  };

  // Filtered log items
  const filteredLogs = logs.filter((entry) => {
    const matchesSearch =
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.operatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.hashDigest.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || entry.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesAction =
      actionTypeFilter === 'all' ||
      entry.actionType.toLowerCase().includes(actionTypeFilter.toLowerCase());

    const matchesSeverity =
      severityFilter === 'all' || entry.severity.toLowerCase() === severityFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesAction && matchesSeverity;
  });

  // Calculate dynamic stats
  const totalActions = logs.length;
  const financialActions = logs.filter((l) => l.category === 'Financial').length;
  const criticalActions = logs.filter((l) => l.severity === 'critical' || l.severity === 'high').length;
  const compensationBatches = logs.filter((l) => l.actionType === 'REWARD_CALCULATION').length;

  const renderActionIcon = (type: AuditActionType) => {
    switch (type) {
      case 'PAYMENT_APPROVAL':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PAYMENT_REJECTION':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      case 'USER_DELETION':
        return <Trash2 className="w-3.5 h-3.5 text-rose-500" />;
      case 'USER_SUSPENSION':
        return <UserX className="w-3.5 h-3.5 text-amber-400" />;
      case 'USER_ACTIVATION':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'REWARD_CALCULATION':
        return <Calculator className="w-3.5 h-3.5 text-amberfox" />;
      case 'WITHDRAWAL_PAYOUT':
        return <Wallet className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TREE_PLACEMENT':
      case 'BENCH_SPILLOVER':
        return <GitBranch className="w-3.5 h-3.5 text-sky-400" />;
      case 'INVENTORY_RESTOCK':
        return <Package className="w-3.5 h-3.5 text-parchment-200" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-amberfox" />;
    }
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
      case 'high':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
      case 'medium':
        return 'text-sky-300 border-sky-500/40 bg-sky-950/30';
      case 'low':
      default:
        return 'text-parchment-400 border-amberfox/20 bg-noir-950';
    }
  };

  return (
    <div className="space-y-8 font-sans selection:bg-amberfox selection:text-noir-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10.5px] font-mono tracking-luxury text-amberfox uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONS / STATUTORY ACCOUNTABILITY & GOVERNANCE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1 flex items-center gap-3">
            <span>Admin Audit Log</span>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-amberfox/40 bg-noir-900 text-amberfox">
              TAMPER-EVIDENT LEDGER
            </span>
          </h1>
          <p className="text-xs text-parchment-400 font-light mt-1 max-w-3xl leading-relaxed">
            Cryptographically sealed trail tracking all privileged administrative interventions: payment approvals, account actions, user deletions, reward calculations, and financial settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="btn-gold-sheen text-noir-950 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-amber-glow cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Action</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="hairline-border border-amberfox/40 bg-noir-900 px-3 py-2 text-xs font-mono uppercase text-parchment-200 hover:text-amberfox hover:border-amberfox flex items-center gap-1.5 cursor-pointer"
            title="Download JSON audit file with cryptographic hashes"
          >
            <Download className="w-3.5 h-3.5 text-amberfox" />
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="hairline-border border-amberfox/40 bg-noir-900 px-3 py-2 text-xs font-mono uppercase text-parchment-200 hover:text-amberfox hover:border-amberfox flex items-center gap-1.5 cursor-pointer"
            title="Export compliance CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amberfox" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="bg-noir-900 border-l-2 border-amberfox p-4 flex items-center justify-between font-mono text-xs text-parchment-100 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-parchment-500 hover:text-parchment-200 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Core Accountability Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            RECORDED INTERVENTIONS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{totalActions}</div>
          <p className="text-[11px] font-mono text-parchment-400">Total guarded operations executed</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            FINANCIAL RECONCILIATIONS
          </span>
          <div className="font-serif text-4xl text-emerald-400 font-bold">{financialActions}</div>
          <p className="text-[11px] font-mono text-parchment-400">Payment approvals &amp; UPI payouts</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            CRITICAL / HIGH SEVERITY
          </span>
          <div className="font-serif text-4xl text-rose-400 font-bold">{criticalActions}</div>
          <p className="text-[11px] font-mono text-parchment-400">Deletions, suspensions, tree fixes</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            REWARD ENGINE BATCHES
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">{compensationBatches}</div>
          <p className="text-[11px] font-mono text-parchment-400">9-Level tree calculation runs</p>
        </div>
      </div>

      {/* Quick Interactive Simulation Banner */}
      <div className="bg-noir-900 hairline-border p-5 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amberfox/15 pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-amberfox" />
            <span className="text-[10.5px] uppercase font-bold text-amberfox tracking-luxury">
              QUICK AUDIT TEST BENCH (SIMULATE LIVE ADMIN ACTIONS)
            </span>
          </div>
          <span className="text-[10px] text-parchment-500">
            Click any action below to simulate live audit ledger entry
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={() => handleSimulateQuickAction('payment')}
            className="hairline-border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 px-3 py-2 text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>+ Approve Payment (₹2,000)</span>
          </button>

          <button
            onClick={() => handleSimulateQuickAction('user_delete')}
            className="hairline-border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 px-3 py-2 text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>+ Delete Disputed Member</span>
          </button>

          <button
            onClick={() => handleSimulateQuickAction('reward_calc')}
            className="hairline-border border-amberfox/50 bg-amberfox/10 hover:bg-amberfox/20 text-amberfox px-3 py-2 text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calculator className="w-3 h-3" />
            <span>+ Run 9-Level Reward Batch</span>
          </button>

          <button
            onClick={() => handleSimulateQuickAction('payout')}
            className="hairline-border border-sky-500/40 bg-sky-950/20 hover:bg-sky-950/40 text-sky-400 px-3 py-2 text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Wallet className="w-3 h-3" />
            <span>+ Disburse Payout (₹1,500)</span>
          </button>

          <button
            onClick={() => resetAuditLogs()}
            className="hairline-border border-amberfox/20 hover:border-amberfox/50 text-parchment-400 hover:text-parchment-200 px-3 py-2 text-[11px] uppercase tracking-wider flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
            title="Reset ledger to baseline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Logs</span>
          </button>
        </div>
      </div>

      {/* Main Filter & Ledger Directory */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        {/* Search & Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Search Audit Ledger
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Log ID, Target, UTR, Member, Hash, Operator..."
                className="w-full bg-noir-950 hairline-border p-2.5 pl-8 text-xs text-parchment-100 placeholder:text-parchment-600 focus:outline-none focus:border-amberfox"
              />
              <Search className="w-3.5 h-3.5 text-parchment-500 absolute left-2.5 top-3" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-parchment-500 hover:text-parchment-200 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox cursor-pointer"
            >
              <option value="all">All Categories ({logs.length})</option>
              <option value="Financial">Financial ({logs.filter((l) => l.category === 'Financial').length})</option>
              <option value="Security & Users">Security &amp; Users ({logs.filter((l) => l.category === 'Security & Users').length})</option>
              <option value="Compensation">Compensation ({logs.filter((l) => l.category === 'Compensation').length})</option>
              <option value="Network">Network ({logs.filter((l) => l.category === 'Network').length})</option>
              <option value="Inventory">Inventory ({logs.filter((l) => l.category === 'Inventory').length})</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Risk Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Action Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          <span className="text-[10px] uppercase tracking-luxury text-parchment-500 mr-1">
            ACTION TYPE:
          </span>
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'PAYMENT_APPROVAL', label: 'Payment Approvals' },
            { id: 'USER_DELETION', label: 'User Deletions' },
            { id: 'USER_SUSPENSION', label: 'Suspensions' },
            { id: 'REWARD_CALCULATION', label: 'Reward Calculations' },
            { id: 'WITHDRAWAL_PAYOUT', label: 'Withdrawal Payouts' },
            { id: 'TREE_PLACEMENT', label: 'Tree Placements' },
          ].map((item) => {
            const isSelected = actionTypeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActionTypeFilter(item.id)}
                className={`px-2.5 py-1 text-[10.5px] uppercase hairline-border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amberfox bg-amberfox text-noir-950 font-bold'
                    : 'bg-noir-950 text-parchment-400 hover:text-parchment-100 hover:border-amberfox/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-3 px-2">Log ID &amp; Time</th>
                <th className="py-3 px-2">Action / Category</th>
                <th className="py-3 px-2">Operator</th>
                <th className="py-3 px-2">Target &amp; Details</th>
                <th className="py-3 px-2">Integrity Hash</th>
                <th className="py-3 px-2 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-parchment-500 font-mono text-xs">
                    No administrative audit records match your current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => {
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="hover:bg-noir-950/70 transition-colors cursor-pointer group"
                    >
                      {/* ID & Time */}
                      <td className="py-3.5 px-2">
                        <span className="font-bold text-parchment-100 block group-hover:text-amberfox">
                          {entry.id}
                        </span>
                        <span className="text-[10px] text-parchment-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{entry.timestamp}</span>
                        </span>
                      </td>

                      {/* Action & Category */}
                      <td className="py-3.5 px-2">
                        <div className="flex items-center space-x-1.5">
                          {renderActionIcon(entry.actionType)}
                          <span className="font-semibold text-parchment-200">
                            {entry.actionType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9.5px] text-parchment-500">{entry.category}</span>
                          <span className="text-parchment-600">·</span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.2 border ${getSeverityBadge(
                              entry.severity
                            )}`}
                          >
                            {entry.severity}
                          </span>
                        </div>
                      </td>

                      {/* Operator */}
                      <td className="py-3.5 px-2">
                        <span className="text-parchment-200 font-medium block truncate max-w-[150px]">
                          {entry.operatorId}
                        </span>
                        <span className="text-[9.5px] text-amberfox font-mono block mt-0.5">
                          {entry.operatorRole}
                        </span>
                      </td>

                      {/* Target & Summary */}
                      <td className="py-3.5 px-2 max-w-xs sm:max-w-md">
                        <p className="font-semibold text-parchment-100 truncate">
                          {entry.targetResource}
                        </p>
                        <p className="text-[10px] text-parchment-400 line-clamp-1 mt-0.5 font-light">
                          {entry.details}
                        </p>
                      </td>

                      {/* Hash Digest */}
                      <td className="py-3.5 px-2">
                        <div className="flex items-center space-x-1">
                          <span className="font-mono text-[10px] text-parchment-400 bg-noir-950 px-1.5 py-0.5 border border-amberfox/20 max-w-[110px] truncate">
                            {entry.hashDigest}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyHash(entry.hashDigest);
                            }}
                            className="p-1 hover:text-amberfox text-parchment-500 cursor-pointer"
                            title="Copy SHA-256 seal"
                          >
                            {copiedHash === entry.hashDigest ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className="text-[9px] text-emerald-400 block mt-0.5">
                          SEALED · VERIFIED
                        </span>
                      </td>

                      {/* Inspect */}
                      <td className="py-3.5 px-2 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(entry);
                          }}
                          className="hairline-border px-2.5 py-1 text-[10px] uppercase text-amberfox hover:border-amberfox hover:bg-amberfox/10 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="pt-4 border-t border-amberfox/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10.5px] font-mono text-parchment-500">
          <div>
            Showing <strong className="text-parchment-200">{filteredLogs.length}</strong> of{' '}
            <strong className="text-parchment-200">{logs.length}</strong> total administrative audit records.
          </div>
          <div className="flex items-center space-x-2 text-amberfox">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>STATUTORY AUDIT RETENTION: 7 YEARS PAN-INDIA GST COMPLIANT</span>
          </div>
        </div>
      </div>

      {/* Forensic Audit Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-noir-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-900 hairline-border border-amberfox/40 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto font-mono text-xs shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-amberfox/20">
              <div>
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-luxury text-amberfox">
                  <span>AUDIT RECORD DOSSIER</span>
                  <span className="text-parchment-600">·</span>
                  <span className="text-emerald-400">IMMUTABLE BLOCK</span>
                </div>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100 mt-1">
                  {selectedEntry.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-parchment-400 hover:text-amberfox text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-noir-950 hairline-border">
              <div>
                <span className="text-[10px] uppercase text-parchment-500 block">ACTION TYPE</span>
                <span className="font-bold text-amberfox text-sm block mt-0.5">
                  {selectedEntry.actionType}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-parchment-500 block">TIMESTAMP</span>
                <span className="text-parchment-200 text-sm block mt-0.5">
                  {selectedEntry.timestamp}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-parchment-500 block">OPERATOR IDENTITY</span>
                <span className="text-parchment-200 block mt-0.5">{selectedEntry.operatorId}</span>
                <span className="text-[10px] text-amberfox-gold">{selectedEntry.operatorRole}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-parchment-500 block">IP GATEWAY &amp; NODE</span>
                <span className="text-parchment-200 block mt-0.5">{selectedEntry.ipAddress}</span>
              </div>
            </div>

            {/* Narrative Summary */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-luxury text-amberfox block font-semibold">
                TARGET RESOURCE &amp; CONTEXT
              </span>
              <p className="text-sm font-semibold text-parchment-100 bg-noir-950 p-3 hairline-border">
                {selectedEntry.targetResource}
              </p>
              <p className="text-xs text-parchment-300 leading-relaxed font-light bg-noir-950/50 p-3 hairline-border border-amberfox/10">
                {selectedEntry.details}
              </p>
            </div>

            {/* Before vs After State Diff */}
            {(selectedEntry.beforeState || selectedEntry.afterState) && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-luxury text-parchment-400 block font-semibold">
                  STATE MUTATION DELTA
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-red-950/20 hairline-border border-red-500/30 space-y-1">
                    <span className="text-red-400 text-[10px] uppercase font-bold block">
                      STATE BEFORE ACTION
                    </span>
                    <p className="text-parchment-300 font-light">
                      {selectedEntry.beforeState || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-950/20 hairline-border border-emerald-500/30 space-y-1">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block">
                      STATE AFTER ACTION
                    </span>
                    <p className="text-parchment-300 font-light">
                      {selectedEntry.afterState || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cryptographic Proof */}
            <div className="p-4 bg-noir-950 hairline-border border-amberfox/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-amberfox font-bold tracking-luxury">
                  CRYPTOGRAPHIC INTEGRITY DIGEST
                </span>
                <span className="text-[9.5px] uppercase text-emerald-400 font-mono">
                  SHA-256 VERIFIED SEALED
                </span>
              </div>
              <div className="flex items-center justify-between bg-noir-900 p-2 hairline-border text-[11px] text-parchment-300 break-all">
                <span>{selectedEntry.hashDigest}</span>
                <button
                  onClick={() => handleCopyHash(selectedEntry.hashDigest)}
                  className="p-1 hover:text-amberfox text-parchment-400 ml-2 cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {selectedEntry.regulatoryReference && (
                <div className="text-[10px] text-parchment-500 pt-1">
                  Statutory Reference Code: <strong className="text-parchment-300">{selectedEntry.regulatoryReference}</strong>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="hairline-border px-5 py-2 text-xs uppercase tracking-wider text-parchment-300 hover:text-amberfox hover:border-amberfox cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual / Custom Action Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-noir-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCustomSubmit}
            className="bg-noir-900 hairline-border border-amberfox max-w-lg w-full p-6 sm:p-8 space-y-5 font-mono text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-amberfox/20">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-amberfox font-semibold">
                  PRIVILEGED OPERATIONS
                </span>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100 mt-1">
                  Log Guarded Action
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="text-parchment-400 hover:text-amberfox text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-parchment-400 mb-1">
                Action Type *
              </label>
              <select
                value={simActionType}
                onChange={(e) => setSimActionType(e.target.value as AuditActionType)}
                className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox cursor-pointer"
              >
                <option value="PAYMENT_APPROVAL">PAYMENT_APPROVAL (UPI UTR Reconciliation)</option>
                <option value="PAYMENT_REJECTION">PAYMENT_REJECTION (Flag Fraud / Zero Credit)</option>
                <option value="USER_DELETION">USER_DELETION (Purge Fraudulent Member)</option>
                <option value="USER_SUSPENSION">USER_SUSPENSION (Administrative Lock)</option>
                <option value="USER_ACTIVATION">USER_ACTIVATION (KYC Identity Approval)</option>
                <option value="REWARD_CALCULATION">REWARD_CALCULATION (9-Level Binary Batch)</option>
                <option value="WITHDRAWAL_PAYOUT">WITHDRAWAL_PAYOUT (Disburse UPI Escrow)</option>
                <option value="TREE_PLACEMENT">TREE_PLACEMENT (Manual Slot Force Assignment)</option>
                <option value="BENCH_SPILLOVER">BENCH_SPILLOVER (21-Day Timer Clock Override)</option>
                <option value="INVENTORY_RESTOCK">INVENTORY_RESTOCK (Warehouse Inward Batch)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-parchment-400 mb-1">
                Target Resource / Entity *
              </label>
              <input
                type="text"
                required
                value={simTarget}
                onChange={(e) => setSimTarget(e.target.value)}
                placeholder="e.g. Member Account mf10530, Order ORD-MFX-99412"
                className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-parchment-400 mb-1">
                Audit Narrative &amp; Regulatory Rationale *
              </label>
              <textarea
                rows={3}
                required
                value={simDetails}
                onChange={(e) => setSimDetails(e.target.value)}
                placeholder="Describe why this administrative intervention was performed..."
                className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-parchment-400 mb-1">
                  Risk Severity
                </label>
                <select
                  value={simSeverity}
                  onChange={(e) => setSimSeverity(e.target.value as AuditSeverity)}
                  className="w-full bg-noir-950 hairline-border p-2 text-xs text-parchment-100 focus:outline-none focus:border-amberfox cursor-pointer"
                >
                  <option value="low">Low (Routine)</option>
                  <option value="medium">Medium (Financial/Placement)</option>
                  <option value="high">High (Engine/Suspension)</option>
                  <option value="critical">Critical (Purge/Deletion)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-parchment-400 mb-1">
                  Signing Operator
                </label>
                <select
                  value={simOperator}
                  onChange={(e) => setSimOperator(e.target.value)}
                  className="w-full bg-noir-950 hairline-border p-2 text-xs text-parchment-100 focus:outline-none focus:border-amberfox cursor-pointer"
                >
                  <option value="admin@moneyfox.luxury">Apex Admin</option>
                  <option value="compliance@moneyfox.luxury">Compliance Officer</option>
                  <option value="finance@moneyfox.luxury">Finance Desk</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="hairline-border px-4 py-2 text-xs uppercase tracking-wider text-parchment-300 hover:text-parchment-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold-sheen text-noir-950 px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Commit Audit Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
