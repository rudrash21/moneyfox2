import { AdminAuditLogEntry, AuditActionType, AuditCategory, AuditSeverity } from '../types';

// Helper to generate realistic SHA-256 style tamper-evident hashes
const generateHash = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs(hash * 31 + 1337).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs(hash * 97 + 4242).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs(hash * 13 + 9999).toString(16).padStart(8, '0');
  return `0x${hexPart1}${hexPart2}${hexPart3}${hexPart4}`.toLowerCase();
};

export const INITIAL_AUDIT_LOGS: AdminAuditLogEntry[] = [
  {
    id: 'AUD-2026-0891',
    timestamp: 'Today · 15:42 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'REWARD_CALCULATION',
    category: 'Compensation',
    severity: 'high',
    targetResource: '9-Level Binary Tree Engine (Batch: SYS-BATCH-MLM-L9)',
    details: 'Triggered batch calculation for active 2×2 binary trees. Scanned 64 nodes; credited ₹4,300 across 4 levels (L1: ₹300, L2: ₹500, L3: ₹1,000, L4: ₹2,500) to 4 member wallets.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0891-REWARD_CALCULATION-4300'),
    regulatoryReference: 'STAT-MLM-SEC-12/2025',
    beforeState: 'Pending batch queue: 64 nodes · Escrow unallocated: ₹4,300',
    afterState: 'Ledger batch EV-REWARD-4300 committed · Wallets credited successfully',
    metadata: {
      scannedNodes: 64,
      completedLevels: 4,
      creditedTotal: 4300,
      beneficiariesCount: 4,
    },
  },
  {
    id: 'AUD-2026-0890',
    timestamp: 'Today · 14:18 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'PAYMENT_APPROVAL',
    category: 'Financial',
    severity: 'medium',
    targetResource: 'Order ORD-MFX-99412 · Vikramaditya S. (mf10492)',
    details: 'Reconciled 12-digit UPI UTR 429910488219 for ₹2,000 against merchant escrow. Activated account, generated GST Tax Invoice MFX-GST-2025-00892, and queued member for binary placement.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0890-PAYMENT_APPROVAL-99412'),
    regulatoryReference: 'GST-SEC-31-CGST-ACT',
    beforeState: 'Payment status: PENDING_VERIFICATION · Guild Access: LOCKED',
    afterState: 'Payment status: APPROVED · Guild Access: ACTIVE · Invoice Generated',
    metadata: {
      orderId: 'ORD-MFX-99412',
      amount: 2000,
      utr: '429910488219',
      memberId: 'mf10492',
    },
  },
  {
    id: 'AUD-2026-0889',
    timestamp: 'Today · 13:05 IST',
    operatorId: 'compliance@moneyfox.luxury',
    operatorRole: 'Compliance Officer',
    actionType: 'USER_DELETION',
    category: 'Security & Users',
    severity: 'critical',
    targetResource: 'Member Account mf10099 (SpamBot-Cluster-09)',
    details: 'Permanently purged fraudulent registration cluster account mf10099 following automated bot detection and invalid KYC failure. Binary tree node pruned with zero orphan downline impact.',
    ipAddress: '49.36.128.44 (Delhi Node)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0889-USER_DELETION-mf10099'),
    regulatoryReference: 'KYC-AML-PMLA-RULE-9',
    beforeState: 'Account: RESTRICTED · Status: Flagged suspicious automated signups',
    afterState: 'Account: DELETED_PURGED · Node: DE-INDEXED · Downline: NULL',
    metadata: {
      deletedMemberId: 'mf10099',
      reason: 'Automated script attack without verifiable KYC or GST payment',
      authorizedBy: 'Apex Chief Compliance Officer',
    },
  },
  {
    id: 'AUD-2026-0888',
    timestamp: 'Today · 11:22 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'USER_SUSPENSION',
    category: 'Security & Users',
    severity: 'high',
    targetResource: 'Member Account mf10530 (Neha D.)',
    details: 'Applied guarded administrative suspension on account mf10530 due to duplicate bank account details detected on 3 distinct registered downlines. Wallet withdrawals locked pending identity affidavit.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0888-USER_SUSPENSION-mf10530'),
    regulatoryReference: 'FRAUD-PREV-DIR-2025-04',
    beforeState: 'Account status: Active · Payouts: UNRESTRICTED',
    afterState: 'Account status: RESTRICTED · Payouts: FROZEN · Reason: Duplicate bank details',
    metadata: {
      memberId: 'mf10530',
      reason: 'Duplicate identification / Bank holder mismatch',
    },
  },
  {
    id: 'AUD-2026-0887',
    timestamp: 'Yesterday · 17:50 IST',
    operatorId: 'finance@moneyfox.luxury',
    operatorRole: 'Finance Desk',
    actionType: 'WITHDRAWAL_PAYOUT',
    category: 'Financial',
    severity: 'medium',
    targetResource: 'Withdrawal Req WD-10492-008 · ₹1,000 to vikram@okaxis',
    details: 'Disbursed ₹1,000 from member wallet escrow via ICICI Direct UPI Banking gateway (Bank Ref: CMS992104882). Debited member available balance from ₹19,900 to ₹18,900.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0887-WITHDRAWAL_PAYOUT-WD10492'),
    regulatoryReference: 'NPCI-UPI-DISBURSEMENT-2025',
    beforeState: 'Status: Requested · Wallet Balance: ₹19,900',
    afterState: 'Status: Paid · Wallet Balance: ₹18,900 · Payout Ref: CMS992104882',
    metadata: {
      withdrawalId: 'WD-10492-008',
      amount: 1000,
      destinationUpi: 'vikram@okaxis',
      bankRef: 'CMS992104882',
    },
  },
  {
    id: 'AUD-2026-0886',
    timestamp: 'Yesterday · 16:15 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'TREE_PLACEMENT',
    category: 'Network',
    severity: 'medium',
    targetResource: 'Binary Node #4 · Priya V. (mf10510)',
    details: 'Manual tree placement supervisor confirmed direct downline position: Assigned Priya V. to LEFT CHILD slot of referrer Vikramaditya S. (mf10492). Binary link sealed.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0886-TREE_PLACEMENT-mf10510'),
    regulatoryReference: 'MLM-MATRIX-TOPOLOGY-2025',
    beforeState: 'Member: Waiting Bench · Slot: UNASSIGNED',
    afterState: 'Member: Active Node · Parent: mf10492 · Branch: LEFT',
    metadata: {
      memberId: 'mf10510',
      parentSponsorId: 'mf10492',
      branch: 'Left Child',
    },
  },
  {
    id: 'AUD-2026-0885',
    timestamp: 'Yesterday · 14:02 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'BENCH_SPILLOVER',
    category: 'Network',
    severity: 'low',
    targetResource: 'Waiting Bench Queue · Vikram Mehta (mf10524)',
    details: 'Initiated 21-day spillover clock extension for member mf10524 upon verified referrer request. Remaining bench allocation window updated to 21 active days.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0885-BENCH_SPILLOVER-mf10524'),
    regulatoryReference: 'SPILLOVER-PROTOCOL-RULE-7',
    beforeState: 'Bench timer: 18 days elapsed · Remaining: 3 days',
    afterState: 'Bench timer: Reset to 21 days · Auto-spillover scheduled',
    metadata: {
      memberId: 'mf10524',
      spilloverDays: 21,
    },
  },
  {
    id: 'AUD-2026-0884',
    timestamp: '23 Oct · 18:30 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'PAYMENT_REJECTION',
    category: 'Financial',
    severity: 'high',
    targetResource: 'Order ORD-MFX-99388 · Suspicious UTR 429900000000',
    details: 'Rejected payment reconciliation claim. Bank API confirmed zero credit matching transaction ID 429900000000. Notified user and placed order in Flagged state.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'FLAGGED',
    hashDigest: generateHash('AUD-2026-0884-PAYMENT_REJECTION-99388'),
    regulatoryReference: 'NPCI-DISPUTE-FRAUD-RPT',
    beforeState: 'Status: Pending Verification',
    afterState: 'Status: REJECTED_FRAUD_FLAGGED · User warned',
    metadata: {
      orderId: 'ORD-MFX-99388',
      submittedUtr: '429900000000',
      reason: 'Zero credit on bank ledger',
    },
  },
  {
    id: 'AUD-2026-0883',
    timestamp: '23 Oct · 11:10 IST',
    operatorId: 'admin@moneyfox.co.in',
    operatorRole: 'Apex Admin',
    actionType: 'INVENTORY_RESTOCK',
    category: 'Inventory',
    severity: 'low',
    targetResource: 'SKU MF-280N-L · Signature Noir (Size L)',
    details: 'Restocked physical product warehouse inventory: +25 units added following batch inspection certificate QC-240-MUM-9912. Status updated from Low Stock to Published.',
    ipAddress: '103.21.244.18 (Mumbai HQ)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0883-INVENTORY_RESTOCK-MF280NL'),
    regulatoryReference: 'QC-TEXTILE-STANDARD-IS-1989',
    beforeState: 'Available units: 4 · Status: Low stock',
    afterState: 'Available units: 29 · Status: Published',
    metadata: {
      sku: 'MF-280N-L',
      addedUnits: 25,
      newTotal: 29,
    },
  },
  {
    id: 'AUD-2026-0882',
    timestamp: '22 Oct · 16:45 IST',
    operatorId: 'compliance@moneyfox.luxury',
    operatorRole: 'Compliance Officer',
    actionType: 'USER_ACTIVATION',
    category: 'Security & Users',
    severity: 'medium',
    targetResource: 'Member Account mf10521 (Sneha Roy)',
    details: 'Completed enhanced statutory identity verification following manual Aadhaar/PAN validation. Removed temporary onboarding hold; network earning capabilities enabled.',
    ipAddress: '49.36.128.44 (Delhi Node)',
    status: 'SUCCESS',
    hashDigest: generateHash('AUD-2026-0882-USER_ACTIVATION-mf10521'),
    regulatoryReference: 'KYC-COMPLIANCE-OK-2025',
    beforeState: 'Account: Pending activation',
    afterState: 'Account: Active · Verified',
    metadata: {
      memberId: 'mf10521',
      kycStatus: 'Verified Manual Review',
    },
  },
];

// Reactive in-memory state store
let auditLogs: AdminAuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
const listeners: Set<(logs: AdminAuditLogEntry[]) => void> = new Set();

export const getAuditLogs = (): AdminAuditLogEntry[] => {
  return auditLogs;
};

export const addAuditLog = (
  entry: Omit<AdminAuditLogEntry, 'id' | 'timestamp' | 'hashDigest'> & {
    id?: string;
    timestamp?: string;
    hashDigest?: string;
  }
): AdminAuditLogEntry => {
  const count = auditLogs.length + 1;
  const id = entry.id || `AUD-2026-${String(890 + count).padStart(4, '0')}`;
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const timestamp = entry.timestamp || `Just now · ${timeString} IST`;
  const rawContent = `${id}-${entry.actionType}-${entry.targetResource}-${Date.now()}`;
  const hashDigest = entry.hashDigest || generateHash(rawContent);

  const fullEntry: AdminAuditLogEntry = {
    ...entry,
    id,
    timestamp,
    hashDigest,
  };

  auditLogs = [fullEntry, ...auditLogs];
  notifyListeners();
  return fullEntry;
};

export const subscribeAuditLogs = (callback: (logs: AdminAuditLogEntry[]) => void): (() => void) => {
  listeners.add(callback);
  callback(auditLogs);
  return () => {
    listeners.delete(callback);
  };
};

const notifyListeners = () => {
  listeners.forEach((callback) => callback(auditLogs));
};

export const resetAuditLogs = () => {
  auditLogs = [...INITIAL_AUDIT_LOGS];
  notifyListeners();
};
