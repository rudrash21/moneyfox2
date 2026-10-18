import { BinaryNodeData } from '../components/public/NineLevelBinaryTree';
import { addAuditLog } from './auditLogStore';
import { UserProfile } from '../types';
import { DbUser } from '../lib/dbService';

export interface TreeUnlockRequirements {
  qualifyingPurchaseDone: boolean;
  qualifyingOrderAmount: number;
  qualifyingOrderId: string;
  adminApproved: boolean;
  adminApprovalDate?: string;
  previousTreeNumber: number;
  previousTreeDirectReferralsCompleted: boolean;
  previousTreeDirectReferralsCount: number; // e.g. 2 / 2
  previousTreeLevel1Completed: boolean;
  tree1Level1Completed?: boolean;
  tree1Level1Count?: number;
  tree1Rewarded300?: boolean;
}

export interface UserTreeInstance {
  id: string; // 'tree-1', 'tree-2', 'tree-3', etc.
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

  const pool = firstNamesPools[treeNum] || firstNamesPools[((treeNum - 1) % 4) + 1] || firstNamesPools[1];
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
      root.left.tag = 'LEFT CHILD (DIRECT #1)';
    }
    if (root.right) {
      root.right.name = 'AMIT K.';
      root.right.code = 'mf10511';
      root.right.tag = 'RIGHT CHILD (DIRECT #2)';
    }
  } else if (treeNum === 2) {
    if (root.left) {
      root.left.name = 'DEEPAK S.';
      root.left.code = 'mf10580';
      root.left.tag = 'T2 LEFT CHILD (DIRECT #1)';
    }
    if (root.right) {
      root.right.name = 'POOJA R.';
      root.right.code = 'mf10581';
      root.right.tag = 'T2 RIGHT CHILD (DIRECT #2)';
    }
  } else if (treeNum === 3) {
    if (root.left) {
      root.left.name = 'ALOK K.';
      root.left.code = 'mf10620';
      root.left.tag = 'T3 LEFT CHILD (DIRECT #1)';
    }
    if (root.right) {
      root.right.name = 'ISHAAN B.';
      root.right.code = 'mf10621';
      root.right.tag = 'T3 RIGHT CHILD (DIRECT #2)';
    }
  } else if (treeNum === 4) {
    if (root.left) {
      root.left.name = 'SHREYA N.';
      root.left.code = 'mf10650';
      root.left.tag = 'T4 LEFT CHILD (DIRECT #1)';
    }
    if (root.right) {
      root.right.name = 'ARJUN V.';
      root.right.code = 'mf10651';
      root.right.tag = 'T4 RIGHT CHILD (DIRECT #2)';
    }
  } else {
    if (root.left) {
      root.left.name = `DIRECT 1 (T${treeNum})`;
      root.left.code = `mf${codeBase + 1}`;
      root.left.tag = `T${treeNum} LEFT CHILD`;
    }
    if (root.right) {
      root.right.name = `DIRECT 2 (T${treeNum})`;
      root.right.code = `mf${codeBase + 2}`;
      root.right.tag = `T${treeNum} RIGHT CHILD`;
    }
  }

  return root;
};

interface TreeInternalState {
  treeNumber: number;
  purchased: boolean;
  orderAmount: number;
  orderId: string;
  adminApproved: boolean;
  adminApprovalDate?: string;
  directReferralsCount: number; // 0, 1, or 2
  directReferralsCompleted: boolean;
  level1Completed: boolean;
  level1Rewarded300: boolean;
}

const TREE_ORDINALS = [
  '',
  'Primary Matrix',
  'Secondary Matrix',
  'Tertiary Matrix',
  'Quaternary Matrix',
  'Quinary Matrix',
  'Senary Matrix',
  'Septenary Matrix',
  'Octonary Matrix',
  'Novary Matrix',
  'Decary Matrix',
];

// Build a personalized binary tree for an authenticated user and their placed team
export const buildUserOwnTree = (
  user: UserProfile,
  allDbUsers: DbUser[] = [],
  treeNum: number = 1
): BinaryNodeData => {
  const userMoneyfoxId = user.moneyfoxId || 'MF-USER';
  const userFullName = (user.fullName || user.email?.split('@')[0] || 'Member').toUpperCase();
  const rootCode = treeNum === 1 ? userMoneyfoxId : `${userMoneyfoxId}-T${treeNum}`;
  const rootName = treeNum === 1 ? userFullName : `${userFullName} (T${treeNum})`;
  const rootTag = `TREE #${treeNum} ROOT`;

  // Find user's record in allDbUsers if present
  const dbUser = allDbUsers.find(
    (u) =>
      u.moneyfox_id === userMoneyfoxId ||
      (user.authUserId && u.auth_user_id === user.authUserId) ||
      (user.email && u.email?.toLowerCase() === user.email.toLowerCase())
  );

  const findChildren = (parentMemberId: string, parentRefCode?: string) => {
    const parentRecord = allDbUsers.find((u) => u.moneyfox_id === parentMemberId);

    let leftUser: DbUser | undefined = undefined;
    let rightUser: DbUser | undefined = undefined;

    if (parentRecord?.left_child_id) {
      leftUser = allDbUsers.find((u) => u.moneyfox_id === parentRecord.left_child_id);
    }
    if (parentRecord?.right_child_id) {
      rightUser = allDbUsers.find((u) => u.moneyfox_id === parentRecord.right_child_id);
    }

    const downlines = allDbUsers.filter(
      (u) =>
        u.moneyfox_id !== parentMemberId &&
        (u.parent_id === parentMemberId ||
          (u.referred_by && (u.referred_by === parentMemberId || (parentRefCode && u.referred_by === parentRefCode))))
    );

    for (const d of downlines) {
      if ((d as any).placement === 'left' && !leftUser) {
        leftUser = d;
      } else if ((d as any).placement === 'right' && !rightUser) {
        rightUser = d;
      }
    }

    const remaining = downlines.filter((d) => d !== leftUser && d !== rightUser);
    if (!leftUser && remaining.length > 0) {
      leftUser = remaining.shift();
    }
    if (!rightUser && remaining.length > 0) {
      rightUser = remaining.shift();
    }

    return { leftUser, rightUser };
  };

  const createAvailableSlot = (
    depth: number,
    branchSide: 'left' | 'right',
    parentCode: string,
    parentName: string
  ): BinaryNodeData => ({
    id: `slot-${parentCode}-${branchSide}-d${depth}`,
    name: 'AVAILABLE SLOT',
    code: 'AVAILABLE',
    tag: `${branchSide.toUpperCase()} SLOT`,
    depth,
    levelTier: Math.max(1, 10 - depth),
    parentCode,
    parentName,
    branchSide,
    isAvailableSlot: true,
    leftPV: 0,
    rightPV: 0,
  });

  const createMemberSubtree = (
    member: DbUser,
    depth: number,
    branchSide: 'left' | 'right',
    parentCode: string,
    parentName: string
  ): BinaryNodeData => {
    const memberName = (member.name || 'Team Member').toUpperCase();
    const memberCode = member.moneyfox_id;
    const tag = depth === 1 ? (branchSide === 'left' ? 'LEFT CHILD' : 'RIGHT CHILD') : `L${depth} ${branchSide.toUpperCase()}`;
    const levelTier = member.current_level || Math.max(1, 10 - depth);

    const { leftUser, rightUser } = findChildren(member.moneyfox_id, member.referral_code);

    let leftChild: BinaryNodeData | undefined = undefined;
    let rightChild: BinaryNodeData | undefined = undefined;

    if (depth < 8) {
      if (leftUser) {
        leftChild = createMemberSubtree(leftUser, depth + 1, 'left', memberCode, memberName);
      } else if (depth <= 2) {
        leftChild = createAvailableSlot(depth + 1, 'left', memberCode, memberName);
      }

      if (rightUser) {
        rightChild = createMemberSubtree(rightUser, depth + 1, 'right', memberCode, memberName);
      } else if (depth <= 2) {
        rightChild = createAvailableSlot(depth + 1, 'right', memberCode, memberName);
      }

      if (leftChild && !rightChild && depth < 8) {
        rightChild = createAvailableSlot(depth + 1, 'right', memberCode, memberName);
      } else if (!leftChild && rightChild && depth < 8) {
        leftChild = createAvailableSlot(depth + 1, 'left', memberCode, memberName);
      }
    }

    const calcPV = (node?: BinaryNodeData): number => {
      if (!node || node.isAvailableSlot) return 0;
      return 100 + (node.leftPV || 0) + (node.rightPV || 0);
    };

    return {
      id: `${memberCode}-T${treeNum}`,
      name: memberName,
      code: memberCode,
      tag,
      depth,
      levelTier,
      parentCode,
      parentName,
      branchSide,
      isAvailableSlot: false,
      leftPV: calcPV(leftChild),
      rightPV: calcPV(rightChild),
      left: leftChild,
      right: rightChild,
    };
  };

  const { leftUser, rightUser } = findChildren(userMoneyfoxId, user.referralCode || dbUser?.referral_code);

  let leftChild: BinaryNodeData | undefined = undefined;
  let rightChild: BinaryNodeData | undefined = undefined;

  if (leftUser) {
    leftChild = createMemberSubtree(leftUser, 1, 'left', rootCode, rootName);
  } else {
    leftChild = createAvailableSlot(1, 'left', rootCode, rootName);
  }

  if (rightUser) {
    rightChild = createMemberSubtree(rightUser, 1, 'right', rootCode, rootName);
  } else {
    rightChild = createAvailableSlot(1, 'right', rootCode, rootName);
  }

  const calcPV = (node?: BinaryNodeData): number => {
    if (!node || node.isAvailableSlot) return 0;
    return 100 + (node.leftPV || 0) + (node.rightPV || 0);
  };

  const rootNode: BinaryNodeData = {
    id: `${rootCode}-T${treeNum}`,
    name: rootName,
    code: rootCode,
    tag: rootTag,
    depth: 0,
    levelTier: user.currentLevel || 1,
    branchSide: 'left',
    leftPV: calcPV(leftChild),
    rightPV: calcPV(rightChild),
    left: leftChild,
    right: rightChild,
  };

  return rootNode;
};

class UserTreeStore {
  private activeTreeIndex: number = 0;
  private listeners: Set<() => void> = new Set();
  private currentUser: UserProfile | null = null;
  private dbUsers: DbUser[] = [];

  // Multi-tree internal states
  private treeStates: TreeInternalState[] = [
    {
      treeNumber: 1,
      purchased: true,
      orderAmount: 2000,
      orderId: 'ORD-MFX-99412',
      adminApproved: true,
      adminApprovalDate: 'Initial Registration',
      directReferralsCount: 0,
      directReferralsCompleted: false,
      level1Completed: false,
      level1Rewarded300: false,
    },
  ];

  private trees: UserTreeInstance[] = [];

  constructor() {
    this.recomputeTrees();
  }

  private ensureTreeState(treeNum: number): TreeInternalState {
    let state = this.treeStates.find((s) => s.treeNumber === treeNum);
    if (!state) {
      state = {
        treeNumber: treeNum,
        purchased: true,
        orderAmount: 2000,
        orderId: `ORD-MFX-${99450 + treeNum * 30}`,
        adminApproved: treeNum === 1,
        adminApprovalDate: treeNum === 1 ? 'Initial Registration' : undefined,
        directReferralsCount: 0,
        directReferralsCompleted: false,
        level1Completed: false,
        level1Rewarded300: false,
      };
      this.treeStates.push(state);
    }
    return state;
  }

  private recomputeTrees() {
    const computedTrees: UserTreeInstance[] = [];
    let currentTreeNum = 1;
    let allowNext = true;

    // Rule: Tree #(k+1) is ONLY computed and showed in dropbox if Tree #k Level 1 is completed
    while (allowNext && currentTreeNum <= 10) {
      const treeNum = currentTreeNum;
      const state = this.ensureTreeState(treeNum);
      const isFirst = treeNum === 1;
      const beforeTree = !isFirst ? computedTrees[computedTrees.length - 1] : null;

      // Build root node: real user structure when authenticated, or deterministic demo tree
      const rootNode = this.currentUser
        ? buildUserOwnTree(this.currentUser, this.dbUsers, treeNum)
        : buildTreeHierarchyForNumber(treeNum);

      // Check direct children (Level 1): Left and Right direct positions
      const hasLeftDirect = Boolean(rootNode.left && !rootNode.left.isAvailableSlot);
      const hasRightDirect = Boolean(rootNode.right && !rootNode.right.isAvailableSlot);
      const realL1Complete = hasLeftDirect && hasRightDirect;

      // Level 1 is completed if direct nodes are placed, or marked via rule tester
      const isL1Done = realL1Complete || Boolean(state.level1Completed);
      const directCount = (hasLeftDirect ? 1 : 0) + (hasRightDirect ? 1 : 0);

      // Synchronize state
      state.level1Completed = isL1Done;
      state.directReferralsCompleted = isL1Done;
      state.directReferralsCount = Math.max(state.directReferralsCount, directCount);

      // Evaluate unlocked status
      let isUnlocked = false;
      let lockReason: string | undefined = undefined;
      const hasPurchaseOver2000 = state.purchased && state.orderAmount >= 2000 && state.adminApproved;

      if (isFirst) {
        isUnlocked = this.currentUser
          ? (this.currentUser.paymentCompleted || state.adminApproved)
          : state.adminApproved;
        if (!isUnlocked) {
          lockReason = 'Initial ₹2,000 purchase awaiting administrative approval.';
        }
      } else if (beforeTree) {
        const beforeL1Done = Boolean(
          beforeTree.rootNode.left && !beforeTree.rootNode.left.isAvailableSlot &&
          beforeTree.rootNode.right && !beforeTree.rootNode.right.isAvailableSlot
        ) || beforeTree.unlockRequirements.previousTreeLevel1Completed;

        isUnlocked = hasPurchaseOver2000 && beforeL1Done;
        if (!isUnlocked) {
          if (!beforeL1Done) {
            lockReason = `Before Tree (Tree #${beforeTree.treeNumber}) must complete its Level 1 (2 direct referrals) before Tree #${treeNum} can unlock.`;
          } else if (!hasPurchaseOver2000) {
            lockReason = `Tree #${treeNum} requires another approved purchase over ₹2,000 to unlock.`;
          }
        }
      }

      const ordinal = TREE_ORDINALS[treeNum] || `Matrix #${treeNum}`;
      const title = `Tree #${treeNum} · ${ordinal}`;
      const userRefCode = this.currentUser
        ? (this.currentUser.referralCode || this.currentUser.moneyfoxId)
        : 'mf10492';
      const refCode = treeNum === 1 ? userRefCode : `${userRefCode}-T${treeNum}`;
      const hostOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://moneyfox.luxury';
      const refLink = `${hostOrigin}/join?ref=${refCode}`;

      let badge = isUnlocked
        ? (isL1Done ? `Active · Level 1 Complete (₹300 Rewarded)` : `Active · ${ordinal} Unlocked`)
        : `Locked · Complete Tree #${treeNum - 1} L1`;

      const unlockRequirements: TreeUnlockRequirements = {
        qualifyingPurchaseDone: state.purchased,
        qualifyingOrderAmount: state.orderAmount,
        qualifyingOrderId: state.orderId,
        adminApproved: state.adminApproved,
        adminApprovalDate: state.adminApprovalDate,
        previousTreeNumber: isFirst ? 1 : treeNum - 1,
        previousTreeDirectReferralsCompleted: isFirst ? isL1Done : Boolean(beforeTree?.unlockRequirements?.tree1Level1Completed),
        previousTreeDirectReferralsCount: directCount,
        previousTreeLevel1Completed: isFirst ? isL1Done : Boolean(beforeTree?.unlockRequirements?.tree1Level1Completed),
        tree1Level1Completed: isL1Done,
        tree1Level1Count: directCount,
        tree1Rewarded300: isL1Done,
      };

      const countRealNodes = (n?: BinaryNodeData): number => {
        if (!n || n.isAvailableSlot) return 0;
        return 1 + countRealNodes(n.left) + countRealNodes(n.right);
      };

      const realLeft = countRealNodes(rootNode.left);
      const realRight = countRealNodes(rootNode.right);
      const totalNodes = this.currentUser ? (1 + realLeft + realRight) : (isUnlocked ? Math.max(3, 31 - (treeNum - 1) * 8) : 0);

      computedTrees.push({
        id: `tree-${treeNum}`,
        treeNumber: treeNum,
        title,
        badge,
        referralCode: refCode,
        referralLink: refLink,
        isUnlocked,
        unlockRequirements,
        lockReason,
        stats: {
          totalNodes,
          leftMembers: this.currentUser ? realLeft : Math.floor(totalNodes / 2),
          rightMembers: this.currentUser ? realRight : Math.ceil(totalNodes / 2),
          leftPV: rootNode.leftPV || 0,
          rightPV: rootNode.rightPV || 0,
          currentDepth: isUnlocked ? (this.currentUser ? (realLeft > 0 || realRight > 0 ? 1 : 0) : Math.min(3, Math.max(1, 4 - treeNum))) : 0,
          totalEarned: isUnlocked && (realLeft >= 1 && realRight >= 1) ? 300 : 0,
          cyclePotential: 153300,
        },
        rootNode,
      });

      // STRICT RULE:
      // "when the tree 1 is unlocked tree 2 has been shown then same for the other also if not unlocked it should not to be displayed"
      // A tree can ONLY lead to the next tree being displayed if:
      // 1. This tree itself is UNLOCKED (isUnlocked === true)
      // 2. This tree's Level 1 is COMPLETED (isL1Done === true)
      // If this tree is locked or its Level 1 is incomplete, STOP! Next tree MUST NOT be displayed!
      if (!isUnlocked || !isL1Done) {
        allowNext = false;
      } else {
        currentTreeNum++;
      }
    }

    this.trees = computedTrees;
    if (this.activeTreeIndex >= this.trees.length) {
      this.activeTreeIndex = Math.max(0, this.trees.length - 1);
    }
  }

  public setUser(user: UserProfile | null, dbUsers?: DbUser[]) {
    this.currentUser = user;
    if (dbUsers) {
      this.dbUsers = dbUsers;
    }
    this.recomputeTrees();
    this.notify();
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
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

  // Check if eligible to start next tree based on Level 1 completion and unlocked rule
  public canStartNewTree(): { allowed: boolean; reason?: string } {
    const lastTree = this.trees[this.trees.length - 1];
    if (!lastTree) return { allowed: true };
    if (!lastTree.isUnlocked) {
      return {
        allowed: false,
        reason: `Tree #${lastTree.treeNumber} is currently locked. Complete its unlock conditions before adding another tree.`,
      };
    }
    const hasLeftDirect = Boolean(lastTree.rootNode.left && !lastTree.rootNode.left.isAvailableSlot);
    const hasRightDirect = Boolean(lastTree.rootNode.right && !lastTree.rootNode.right.isAvailableSlot);
    const lastState = this.treeStates.find((s) => s.treeNumber === lastTree.treeNumber);
    const isL1Done = (hasLeftDirect && hasRightDirect) || Boolean(lastState?.level1Completed);

    if (!isL1Done) {
      return {
        allowed: false,
        reason: `Complete Level 1 (2 Direct Referrals) on Tree #${lastTree.treeNumber} before unlocking Tree #${lastTree.treeNumber + 1}.`,
      };
    }
    return { allowed: true };
  }

  // START AS MANY TREES AS YOU WANT (SEQUENTIALLY UNLOCKED AS LEVEL 1 IS COMPLETED)
  public startNewTree(): UserTreeInstance {
    const check = this.canStartNewTree();
    if (!check.allowed) {
      return this.getActiveTree();
    }
    const nextTreeNum = this.trees.length + 1;
    const newTreeState = this.ensureTreeState(nextTreeNum);
    newTreeState.purchased = true;
    newTreeState.orderAmount = 2000;
    newTreeState.adminApproved = true;
    newTreeState.adminApprovalDate = 'Today · Activated';
    this.recomputeTrees();
    this.activeTreeIndex = this.trees.length - 1;
    this.notify();
    return this.trees[this.activeTreeIndex];
  }

  public approveTreePayment(treeNumber: number) {
    const st = this.ensureTreeState(treeNumber);
    if (st) {
      st.purchased = true;
      st.adminApproved = true;
      st.adminApprovalDate = 'Today · Just now';
      this.recomputeTrees();
      this.notify();
    }
  }

  public toggleTreePurchaseApproval(treeNumber: number) {
    const st = this.ensureTreeState(treeNumber);
    if (st) {
      st.adminApproved = !st.adminApproved;
      if (st.adminApproved) {
        st.purchased = true;
        st.adminApprovalDate = 'Today · Approved';
      }
      this.recomputeTrees();
      this.notify();
    }
  }

  public toggleTreeDirectReferrals(treeNumber: number) {
    const st = this.ensureTreeState(treeNumber);
    if (st) {
      if (st.directReferralsCompleted) {
        st.directReferralsCompleted = false;
        st.directReferralsCount = 1;
        st.level1Completed = false;
        st.level1Rewarded300 = false;
      } else {
        st.directReferralsCompleted = true;
        st.directReferralsCount = 2;
        st.level1Completed = true;
        st.level1Rewarded300 = true;
      }
      this.recomputeTrees();
      this.notify();
    }
  }

  public toggleTreeLevel1Completion(treeNumber: number) {
    const st = this.ensureTreeState(treeNumber);
    if (st) {
      st.level1Completed = !st.level1Completed;
      if (st.level1Completed) {
        st.directReferralsCompleted = true;
        st.directReferralsCount = 2;
        st.level1Rewarded300 = true;
      } else {
        st.directReferralsCompleted = false;
        st.directReferralsCount = 0;
        st.level1Rewarded300 = false;
      }
      this.recomputeTrees();
      this.notify();
    }
  }

  // Compatibility helpers
  public toggleTree1Level1Completion() {
    this.toggleTreeLevel1Completion(1);
  }

  public toggleTree1Rewarded300() {
    const st = this.treeStates.find((s) => s.treeNumber === 1);
    if (st) {
      st.level1Rewarded300 = !st.level1Rewarded300;
      this.recomputeTrees();
      this.notify();
    }
  }

  public toggleTree2AdminApproval() {
    this.toggleTreePurchaseApproval(2);
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

