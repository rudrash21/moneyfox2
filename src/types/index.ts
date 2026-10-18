export type ScreenView =
  | 'storefront'
  | 'products'
  | 'product-detail'
  | 'cart-review'
  | 'delivery-sponsor'
  | 'delivery-referrer'
  | 'upi-payment'
  | 'verification-pending'
  | 'approved-guild'
  | 'login'
  | 'admin-login'
  | 'password-recovery'
  | 'member-terminal'
  | 'admin-terminal'
  | 'states-gallery';

export type MemberTab =
  | 'overview'
  | 'shop-orders'
  | 'order-tracking'
  | 'order-detail'
  | 'network-pv'
  | 'binary-tree'
  | 'payouts'
  | 'account-security'
  | 'support-returns';

export type AdminTab =
  | 'analytics'
  | 'trees'
  | 'waiting'
  | 'users'
  | 'payments'
  | 'withdrawals'
  | 'products'
  | 'wallet'
  | 'audit-log'
  | 'trees-placements'
  | 'pending-payments'
  | 'withdrawals-escrow'
  | 'products-inventory'
  | 'wallet-audit'
  | 'member-management';

export type AuditActionType =
  | 'PAYMENT_APPROVAL'
  | 'PAYMENT_REJECTION'
  | 'USER_DELETION'
  | 'USER_SUSPENSION'
  | 'USER_ACTIVATION'
  | 'REWARD_CALCULATION'
  | 'WITHDRAWAL_PAYOUT'
  | 'WITHDRAWAL_REJECTION'
  | 'TREE_PLACEMENT'
  | 'BENCH_SPILLOVER'
  | 'INVENTORY_RESTOCK'
  | 'SECURITY_OVERRIDE';

export type AuditCategory =
  | 'Financial'
  | 'Security & Users'
  | 'Compensation'
  | 'Network'
  | 'Inventory';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  operatorId: string;
  operatorRole: string;
  actionType: AuditActionType;
  category: AuditCategory;
  severity: AuditSeverity;
  targetResource: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FLAGGED' | 'REVERTED';
  hashDigest: string;
  metadata?: Record<string, string | number>;
  beforeState?: string;
  afterState?: string;
  regulatoryReference?: string;
}

export interface ProductAngleViews {
  front: string;
  back: string;
  left: string;
  right: string;
  top?: string;
  bottom?: string;
  sheet?: string;
}

export interface Product {
  id: string;
  name: string;
  series: string;
  lot: string;
  gsm: number;
  price: number;
  taxablePrice: number;
  gstAmount: number;
  image: string;
  thumbnails: string[];
  description: string;
  details: string[];
  specs: string;
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  availableSizes: ('S' | 'M' | 'L' | 'XL')[];
  color?: string;
  editionTag?: string;
  angles?: ProductAngleViews;
}

export interface CartItem {
  product: Product;
  size: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  mobile: string;
  email: string;
  apartment: string;
  street: string;
  city: string;
  pinCode: string;
  state: string;
  country: string;
  isBillingSame: boolean;
}

export interface ReferrerInfo {
  sponsorId: string;
  sponsorName: string;
  isValid: boolean;
  joinBenchInstead: boolean;
  referrerId?: string;
  referrerName?: string;
}

export type SponsorInfo = ReferrerInfo;

export interface OrderRecord {
  orderId: string;
  date: string;
  productName: string;
  size: string;
  quantity: number;
  total: number;
  taxableValue?: number;
  gstAmount?: number;
  shipmentStatus: 'Preparing' | 'In transit' | 'Delivered' | 'Verification pending';
  invoiceId?: string;
  utrNumber?: string;
  deliveryAddress: DeliveryAddress;
  carrier: string;
  stage?: number; // 1 to 6
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  dispatchHub?: string;
  currentLocation?: string;
  timeline?: {
    status: string;
    date: string;
    description: string;
    completed: boolean;
  }[];
}

export interface DownlineMember {
  id: string;
  name: string;
  memberId: string;
  sponsorId: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending';
  placement: 'Placed · left' | 'Placed · right' | 'Waiting bench' | 'Placed in Tree' | 'Unplaced' | string;
  contributionPV: number;
  date?: string;
  joinedDate?: string;
  tier?: number;
  accountStatus?: 'Active' | 'Pending activation' | 'Restricted';
}

export interface WithdrawalRequest {
  id: string;
  date: string;
  amount: number;
  destinationUpi: string;
  holderName: string;
  status: 'Requested' | 'Processing' | 'Paid' | 'Failed';
  auditReason?: string;
}

export interface SupportTicket {
  id: string;
  date: string;
  orderId: string;
  category: string;
  issue: string;
  description: string;
  evidenceName?: string;
  status: 'Submitted' | 'Open' | 'Resolved';
}

export interface InventoryItem {
  sku: string;
  name: string;
  size: 'S' | 'M' | 'L' | 'XL';
  available: number;
  reserved: number;
  status: 'Published' | 'Low stock' | 'Draft' | 'Unavailable';
}

export interface LedgerEvent {
  id: string;
  timestamp: string;
  type: string;
  memberId: string;
  amount: number;
  beforeBalance: number;
  afterBalance: number;
  reference: string;
  status: string;
  isCredit: boolean;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin';
  moneyfoxId: string;
  referralCode: string;
  referredBy?: string | null;
  walletBalance: number;
  currentLevel: number;
  paymentCompleted: boolean;
  authUserId: string;
}
