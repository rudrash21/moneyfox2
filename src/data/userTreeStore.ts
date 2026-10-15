import { BinaryNodeData } from '../components/public/NineLevelBinaryTree';
import { addAuditLog } from './auditLogStore';

export interface TreeUnlockRequirements {
  qualifyingPurchaseDone: boolean;
  qualifyingOrderAmount: number;
  qualifyingOrderId: string;
  adminApproved: boolean;
  adminApprovalDate?: string;
  tree1Level1Completed: boolean;
  tree1Level1Count: number; // e.g. 2 / 2
  tree1Rewarded300: boolean;
}

export interface UserTreeInstance {
  id: string; // 'tree-1', 'tree-2', 'tree-3', 'tree-4'
  treeNumber: number;
  title: string;
  badge: string;
  referralCode: string;
  referralLink: string;
  isUnlocked: boolean;
  unlockRequirements: TreeUnlockRequirements;
  lockReason?: string;
  stats: {
    totalNodes: number;
    leftMembers: number;
    rightMembers: number;
    leftPV: number;
    rightPV: number;
    currentDepth: number;
    totalEarned: number;
    cyclePotential: number;
  };
  rootNode: BinaryNodeData;
}

// Deterministically generate complete 9-level binary tree hierarchy for any tree number
export const buildTreeHierarchyForNumber = (treeNum: number): BinaryNodeData => {
  const firstNamesPools: Record<number, string[]> = {
    1: [
      'Vikramaditya', 'Priya', 'Amit', 'Karan', 'Sneha', 'Rohit', 'Ananya',
      'Arjun', 'Meera', 'Dev', 'Riya', 'Kabir', 'Tanvi', 'Aditya', 'Pooja',
      'Sanjay', 'Neha', 'Rohan', 'Divya', 'Varun', 'Kavita', 'Naveen', 'Simran'
    ],
    2: [
      'Deepak', 'Pooja', 'Kavita', 'Naveen', 'Simran', 'Kiran', 'Alok',
      'Ishaan', 'Tara', 'Manoj', 'Zoya', 'Nikhil', 'Shreya', 'Kabir', 'Tanvi'
    ],
    3: [
      'Alok', 'Ishaan', 'Tara', 'Manoj', 'Zoya', 'Nikhil', 'Shreya',
      'Dev', 'Riya', 'Arjun', 'Meera', 'Karan', 'Sneha', 'Rohit', 'Ananya'
    ],
    4: [
      'Shreya', 'Arjun', 'Meera', 'Dev', 'Riya', 'Kabir', 'Tanvi',
      'Priya', 'Amit', 'Karan', 'Sneha', 'Rohit', 'Deepak', 'Pooja', 'Kiran'
    ],
  };

  const pool = firstNamesPools[treeNum] || firstNamesPools[1];
  const lastInitials = ['S.', 'V.', 'K.', 'M.', 'R.', 'P.', 'D.', 'T.', 'B.', 'G.', 'N.', 'J.', 'A.'];
  
  let codeBase = 10492 + (treeNum - 1) * 70;
  let codeCounter = codeBase;

  const createNode = (
    depth: number,
    tag: string,
    isLeft: boolean,
    parentCode?: string,
    parentName?: string,
    branchSide: 'left' | 'right' = 'left'
  ): BinaryNodeData => {
    const fnIndex = (codeCounter + depth * 3 + treeNum) % pool.length;
    const lnIndex = (codeCounter * 5 + depth + treeNum) % lastInitials.length;
    const name = `${pool[fnIndex]} ${lastInitials[lnIndex]}`;
    const code = `mf${codeCounter++}`;
    const basePV = Math.max(25, Math.round(1500 / Math.pow(1.8, depth)));

    const node: BinaryNodeData = {
      id: `${code}-T${treeNum}`,
      name,
      code,
      tag,
      depth,
      levelTier: Math.max(1, 10 - depth),
      parentCode,
      parentName,
      branchSide,
      leftPV: isLeft ? basePV : Math.round(basePV * 1.1),
      rightPV: isLeft ? Math.round(basePV * 1.05) : basePV,
    };

    if (depth < 9) {
      node.left = createNode(
        depth + 1,
        depth === 0 ? `T${treeNum} LEFT` : `L${depth + 1}L`,
        true,
        code,
        name,
        depth === 0 ? 'left' : branchSide
      );
      node.right = createNode(
        depth + 1,
        depth === 0 ? `T${treeNum} RIGHT` : `L${depth + 1}R`,
        false,
        code,
        name,
        depth === 0 ? 'right' : branchSide
      );
    }

    return node;
  };

  const rootCode = treeNum === 1 ? 'mf10492' : `mf10492-T${treeNum}`;
  const rootName = treeNum === 1 ? 'VIKRAMADITYA S.' : `VIKRAMADITYA S. (T${treeNum})`;
  const rootTag = `TREE #${treeNum} ROOT`;

  const root = createNode(0, rootTag, true);
  root.id = rootCode;
  root.name = rootName;
  root.code = rootCode;
  root.tag = rootTag;
  root.leftPV = 1500;
  root.rightPV = 1500;

  // Custom distinct top children for realism
  if (treeNum === 1) {
    if (root.left) {
      root.left.name = 'PRIYA V.';
      root.left.code = 'mf10510';
      root.left.tag = 'LEFT CHILD';
    }
    if (root.right) {
      root.right.name = 'AMIT K.';
      root.right.code = 'mf10511';
      root.right.tag = 'RIGHT CHILD';
    }
  } else if (treeNum === 2) {
    if (root.left) {
      root.left.name = 'DEEPAK S.';
      root.left.code = 'mf10580';
      root.left.tag = 'T2 LEFT CHILD';
    }
    if (root.right) {
      root.right.name = 'POOJA R.';
      root.right.code = 'mf10581';
      root.right.tag = 'T2 RIGHT CHILD';
    }
  } else if (treeNum === 3) {
    if (root.left) {
      root.left.name = 'ALOK K.';
      root.left.code = 'mf10620';
      root.left.tag = 'T3 LEFT CHILD';
    }
    if (root.right) {
      root.right.name = 'ISHAAN B.';
      root.right.code = 'mf10621';
      root.right.tag = 'T3 RIGHT CHILD';
    }
  } else if (treeNum === 4) {
    if (root.left) {
      root.left.name = 'SHREYA N.';
      root.left.code = 'mf10650';
      root.left.tag = 'T4 LEFT CHILD';
    }
    if (root.right) {
      root.right.name = 'ARJUN V.';
      root.right.code = 'mf10651';
      root.right.tag = 'T4 RIGHT CHILD';
    }
  }

  return root;
};

class UserTreeStore {
  private activeTreeIndex: number = 0; // 0=Tree 1, 1=Tree 2, 2=Tree 3, 3=Tree 4
  private listeners: Set<() => void> = new Set();

  // Multi-tree qualifying purchase & admin approval states
  private tree1Level1Completed: boolean = true;
  private tree1Rewarded300: boolean = true;
  private tree1AdminApproved: boolean = true;

  private tree2Purchased: boolean = true;
  private tree2AdminApproved: boolean = true;

  private tree3Purchased: boolean = true;
  private tree3AdminApproved: boolean = true;

  private tree4Purchased: boolean = true;
  private tree4AdminApproved: boolean = true;

  private trees: UserTreeInstance[] = [];

  constructor() {
    this.recomputeTrees();
  }

  private recomputeTrees() {
    // Tree 1: Unlocked on ₹2000 purchase + Admin approval
    const tree1Unlocked = this.tree1AdminApproved;

    // Tree 2: Unlocked when Tree 1 Level 1 is completed (2/2) & ₹300 rewarded & Admin approved
    const tree2Unlocked =
      this.tree2Purchased &&
      this.tree2AdminApproved &&
      this.tree1Level1Completed &&
      this.tree1Rewarded300;

    // Tree 3 & 4 unlocked and accessible when active
    const tree3Unlocked = this.tree3Purchased && this.tree3AdminApproved;
    const tree4Unlocked = this.tree4Purchased && this.tree4AdminApproved;

    this.trees = [
      {
        id: 'tree-1',
        treeNumber: 1,
        title: 'Tree #1 · Primary Matrix',
        badge: 'Active · Level 1 Complete (₹300 Rewarded)',
        referralCode: 'mf10492',
        referralLink: 'moneyfox.luxury/join?ref=mf10492',
        isUnlocked: tree1Unlocked,
        unlockRequirements: {
          qualifyingPurchaseDone: true,
          qualifyingOrderAmount: 2000,
          qualifyingOrderId: 'ORD-MFX-99412',
          adminApproved: this.tree1AdminApproved,
          adminApprovalDate: '24 Oct 2025 · 14:18 IST',
          tree1Level1Completed: this.tree1Level1Completed,
          tree1Level1Count: this.tree1Level1Completed ? 2 : 1,
          tree1Rewarded300: this.tree1Rewarded300,
        },
        stats: {
          totalNodes: 31,
          leftMembers: 15,
          rightMembers: 15,
          leftPV: 1500,
          rightPV: 1500,
          currentDepth: 3,
          totalEarned: 1800,
          cyclePotential: 153300,
        },
        rootNode: buildTreeHierarchyForNumber(1),
      },
      {
        id: 'tree-2',
        treeNumber: 2,
        title: 'Tree #2 · Secondary Matrix',
        badge: tree2Unlocked
          ? 'Active · Secondary Referral Code Unlocked'
          : 'Locked · Complete Tree 1 L1 & Earn ₹300',
        referralCode: 'mf10492-T2',
        referralLink: 'moneyfox.luxury/join?ref=mf10492-T2',
        isUnlocked: tree2Unlocked,
        lockReason: !this.tree1Level1Completed
          ? 'Complete Tree #1 Level 1 (2 direct members on Left & Right child) to unlock.'
          : !this.tree1Rewarded300
          ? 'Tree #1 ₹300 Level 1 reward must be earned before Tree #2 can be unlocked.'
          : undefined,
        unlockRequirements: {
          qualifyingPurchaseDone: this.tree2Purchased,
          qualifyingOrderAmount: 2000,
          qualifyingOrderId: 'ORD-MFX-99488',
          adminApproved: this.tree2AdminApproved,
          adminApprovalDate: 'Today · 10:15 IST',
          tree1Level1Completed: this.tree1Level1Completed,
          tree1Level1Count: this.tree1Level1Completed ? 2 : 1,
          tree1Rewarded300: this.tree1Rewarded300,
        },
        stats: {
          totalNodes: tree2Unlocked ? 7 : 0,
          leftMembers: tree2Unlocked ? 3 : 0,
          rightMembers: tree2Unlocked ? 3 : 0,
          leftPV: tree2Unlocked ? 350 : 0,
          rightPV: tree2Unlocked ? 350 : 0,
          currentDepth: tree2Unlocked ? 2 : 0,
          totalEarned: 0,
          cyclePotential: 153300,
        },
        rootNode: buildTreeHierarchyForNumber(2),
      },
      {
        id: 'tree-3',
        treeNumber: 3,
        title: 'Tree #3 · Tertiary Matrix',
        badge: tree3Unlocked ? 'Active · Tertiary Referral Code Unlocked' : 'Pending Activation',
        referralCode: 'mf10492-T3',
        referralLink: 'moneyfox.luxury/join?ref=mf10492-T3',
        isUnlocked: tree3Unlocked,
        unlockRequirements: {
          qualifyingPurchaseDone: this.tree3Purchased,
          qualifyingOrderAmount: 2000,
          qualifyingOrderId: 'ORD-MFX-99520',
          adminApproved: this.tree3AdminApproved,
          adminApprovalDate: 'Today · 10:20 IST',
          tree1Level1Completed: true,
          tree1Level1Count: 2,
          tree1Rewarded300: true,
        },
        stats: {
          totalNodes: 5,
          leftMembers: 2,
          rightMembers: 2,
          leftPV: 200,
          rightPV: 200,
          currentDepth: 2,
          totalEarned: 0,
          cyclePotential: 153300,
        },
        rootNode: buildTreeHierarchyForNumber(3),
      },
      {
        id: 'tree-4',
        treeNumber: 4,
        title: 'Tree #4 · Quaternary Matrix',
        badge: tree4Unlocked ? 'Active · Quaternary Referral Code Unlocked' : 'Pending Activation',
        referralCode: 'mf10492-T4',
        referralLink: 'moneyfox.luxury/join?ref=mf10492-T4',
        isUnlocked: tree4Unlocked,
        unlockRequirements: {
          qualifyingPurchaseDone: this.tree4Purchased,
          qualifyingOrderAmount: 2000,
          qualifyingOrderId: 'ORD-MFX-99540',
          adminApproved: this.tree4AdminApproved,
          adminApprovalDate: 'Today · 10:25 IST',
          tree1Level1Completed: true,
          tree1Level1Count: 2,
          tree1Rewarded300: true,
        },
        stats: {
          totalNodes: 3,
          leftMembers: 1,
          rightMembers: 1,
          leftPV: 100,
          rightPV: 100,
          currentDepth: 1,
          totalEarned: 0,
          cyclePotential: 153300,
        },
        rootNode: buildTreeHierarchyForNumber(4),
      },
    ];
  }

  public getTrees(): UserTreeInstance[] {
    return this.trees;
  }

  public getActiveTree(): UserTreeInstance {
    return this.trees[this.activeTreeIndex] || this.trees[0];
  }

  public getActiveTreeIndex(): number {
    return this.activeTreeIndex;
  }

  public setActiveTreeIndex(index: number) {
    if (index >= 0 && index < this.trees.length) {
      this.activeTreeIndex = index;
      this.notify();
    }
  }

  public approveTreePayment(treeNumber: 1 | 2 | 3 | 4 = 2) {
    if (treeNumber === 1) this.tree1AdminApproved = true;
    if (treeNumber === 2) this.tree2AdminApproved = true;
    if (treeNumber === 3) this.tree3AdminApproved = true;
    if (treeNumber === 4) this.tree4AdminApproved = true;
    this.recomputeTrees();
    this.notify();
  }

  public toggleTree1Level1Completion() {
    this.tree1Level1Completed = !this.tree1Level1Completed;
    this.recomputeTrees();
    this.notify();
  }

  public toggleTree1Rewarded300() {
    this.tree1Rewarded300 = !this.tree1Rewarded300;
    this.recomputeTrees();
    this.notify();
  }

  public toggleTree2AdminApproval() {
    this.tree2AdminApproved = !this.tree2AdminApproved;
    this.recomputeTrees();
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('TreeStore notification error:', err);
      }
    });
  }
}

export const userTreeStore = new UserTreeStore();
