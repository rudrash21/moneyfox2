import { Product, OrderRecord, DownlineMember, WithdrawalRequest, SupportTicket, InventoryItem, LedgerEvent } from '../types';

export const BRAND_ASSETS = {
  logoCrest: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAadL8OxoryjohvYdXrAp69K5pD_WP1RPReDfjy1v1w9OVIJ9VDOMkCdQgDyjeq2bWtlfTJO_UamDy_tJBakVup5ZgyMqdkAkGhuxGW16tgovg5pOgP2OzkXMs5s_xLyDlK_sVNdrqCL6BvOFdoTNAvWF6OUMLYYcC5InMjKPrS89_Z0SsVvHe7MTe367GgH4F5iXl-gJrmLuVnEP8JsvTyfzXXd8NGhggElVgcjHmNkVgm62OTv5TOnI_HHTHvxLNb',
  sealEmblem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuu6orbWvYY34X1a6XyiO5UPGx45YyyE8Tni5hXlPce0qVmNaH-7kFEZiXjsnfLqR0Lu0kTLOCwIc5GU_C1shgcG1JypOZgIuzLBCPxQ_Hbdka1RSveHUjz305tcKJNFI59D-v2FwGNjRh1U7vT7uMYckvkpziW8bjLe9ZWSbbpv32FpvBR8hiScIxfDeA94LVCLiHWY5BuRYGA8J1NTUjteR0kt21d1_bA7kmAxOiRx67yRxLnhI0AMJT3QkRzdbx',
  noirTeeImage: 'https://lh3.googleusercontent.com/aida/AEtjO1VGfBJoZw_usnZ8POP8VxeNth_gFuTB-wyMyj91PydnB2EohCGbDiK3pX803hSOrP94dmUsY4mkobh_IjI_ZSnvYzc_0ZX4SMnXN596lAFg3tuV4FbOanJShWgS7O6U0J53OSf7eLB-MZ-qaZvfF716F9TMa9nAi8AI5_2dH7UVEeGbUAZ8Qn_2nKDhrJKMZBIt6v2eCDL70AGcO96mTgWki0X4aTxCCa6ZRcZUwgi0BMW1ghuGF3SgrQ',
  ivoryTeeImage: 'https://lh3.googleusercontent.com/aida/AEtjO1VL0P7cvKg1TVrsx-Xq9aaA8YKHSUu9mJgiMpkFSca1KQMY94UH5IIl4BVOnl4JqhII-h8cupDjrOQNcer8exaHG2cbqgvb-dlxL5a0G6_XgeYBzmqx417XsqyC15gGbZ2izolMRRjnIs123mdb8N9oexNQ7M22Ut9TFh7Pw6divq4dhVwAGvRvLZVMUsbRiiCdJItJnNbRrfcUtUzhgsMYUTDtolQkyzPrKzp2m8WYbjN4cywureLf',
};

export const INITIAL_PRODUCTS: Product[] = [];


export const CURRENT_USER = {
  memberId: 'mf10492',
  name: 'Vikramaditya S.',
  email: 'vikram.s@matrixguild.in',
  mobile: '+91 98201 44810',
  membershipStatus: 'Active membership',
  role: 'Member',
  sponsor: {
    name: 'Apex Admin',
    id: 'mf00000',
    status: 'System Root',
  },
  deliveryAddress: {
    fullName: 'Vikramaditya S.',
    mobile: '+91 98201 44810',
    email: 'vikram.s@matrixguild.in',
    apartment: '',
    street: '',
    city: '',
    pinCode: '',
    state: '',
    country: 'India',
    isBillingSame: true,
  },
  upiPayout: {
    holderName: 'Vikramaditya S.',
    upiId: 'vikram.s@upi',
    isVerified: true,
  },
  networkStats: {
    leftPV: 0,
    rightPV: 0,
    leftMembers: 0,
    rightMembers: 0,
    waitingBench: 0,
    referralLink: 'moneyfox.luxury/join?ref=mf10492',
  },
  wallet: {
    availableBalance: 0,
    escrowBalance: 0,
  },
};

export const INITIAL_ORDERS: OrderRecord[] = [];

export const INITIAL_DOWNLINE: DownlineMember[] = [];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_LEDGER_EVENTS: LedgerEvent[] = [];

export const NINE_LEVEL_SCHEDULE = [
  { level: 1, nodes: 2, cumulativeMembers: 2, levelReward: 300, cumulativeRewards: 300 },
  { level: 2, nodes: 4, cumulativeMembers: 6, levelReward: 600, cumulativeRewards: 900 },
  { level: 3, nodes: 8, cumulativeMembers: 14, levelReward: 1200, cumulativeRewards: 2100 },
  { level: 4, nodes: 16, cumulativeMembers: 30, levelReward: 2400, cumulativeRewards: 4500 },
  { level: 5, nodes: 32, cumulativeMembers: 62, levelReward: 4800, cumulativeRewards: 9300 },
  { level: 6, nodes: 64, cumulativeMembers: 126, levelReward: 9600, cumulativeRewards: 18900 },
  { level: 7, nodes: 128, cumulativeMembers: 254, levelReward: 19200, cumulativeRewards: 38100 },
  { level: 8, nodes: 256, cumulativeMembers: 510, levelReward: 38400, cumulativeRewards: 76500 },
  { level: 9, nodes: 512, cumulativeMembers: 1022, levelReward: 76800, cumulativeRewards: 153300 },
];
