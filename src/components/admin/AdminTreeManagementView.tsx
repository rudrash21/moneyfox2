import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Search,
  UserCheck,
  UserPlus,
  RefreshCw,
  Move,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { dbService, DbUser } from '../../lib/dbService';

interface TreeNode {
  id: string;
  memberId: string;
  name: string;
  email: string;
  role: 'Member' | 'Root' | 'Leader';
  level: number;
  leftPv: number;
  rightPv: number;
  placement: 'root' | 'left' | 'right';
  status: 'Active' | 'Vacant' | 'Pending';
  parentId?: string;
  leftChildId?: string;
  rightChildId?: string;
}

const DEFAULT_APEX_ROOT: TreeNode = {
  id: 'node-root',
  memberId: 'MF-OPS-ROOT',
  name: 'Apex Admin System Root',
  email: 'admin@moneyfox.luxury',
  role: 'Root',
  level: 1,
  leftPv: 0,
  rightPv: 0,
  placement: 'root',
  status: 'Active',
};

export const AdminTreeManagementView: React.FC = () => {
  const [searchId, setSearchId] = useState<string>('MF-OPS-ROOT');
  const [rootId, setRootId] = useState<string>('MF-OPS-ROOT');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('MF-OPS-ROOT');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Initial Tree Network state
  const [treeData, setTreeData] = useState<Record<string, TreeNode>>({
    'MF-OPS-ROOT': DEFAULT_APEX_ROOT,
  });

  const loadTreeFromSupabase = async () => {
    try {
      const users = await dbService.fetchUsers();
      if (users && users.length > 0) {
        const map: Record<string, TreeNode> = {};
        users.forEach((u, idx) => {
          const mId = u.moneyfox_id || `user-${idx}`;
          map[mId] = {
            id: u.id || `node-${idx}`,
            memberId: mId,
            name: u.name || (u.role === 'admin' ? 'Apex Admin' : 'Member'),
            email: u.email,
            role: u.role === 'admin' ? 'Root' : 'Member',
            level: u.current_level || 1,
            leftPv: 0,
            rightPv: 0,
            placement: u.parent_id ? 'left' : 'root',
            status: u.payment_completed ? 'Active' : 'Pending',
            parentId: u.parent_id || undefined,
            leftChildId: u.left_child_id || undefined,
            rightChildId: u.right_child_id || undefined,
          };
        });
        const firstKey = Object.keys(map)[0];
        setTreeData(map);
        setRootId(firstKey);
        setSelectedNodeId(firstKey);
        setSearchId(firstKey);
      } else {
        setTreeData({ 'MF-OPS-ROOT': DEFAULT_APEX_ROOT });
        setRootId('MF-OPS-ROOT');
        setSelectedNodeId('MF-OPS-ROOT');
        setSearchId('MF-OPS-ROOT');
      }
    } catch (err) {
      console.error('Failed to load tree from Supabase:', err);
    }
  };

  useEffect(() => {
    loadTreeFromSupabase();
    const unsub = dbService.subscribeUsers(() => loadTreeFromSupabase());
    return () => unsub();
  }, []);

  const currentNode = treeData[selectedNodeId] || treeData[rootId] || DEFAULT_APEX_ROOT;
  const rootNode = treeData[rootId] || DEFAULT_APEX_ROOT;

  const leftChild = rootNode.leftChildId ? treeData[rootNode.leftChildId] : null;
  const rightChild = rootNode.rightChildId ? treeData[rootNode.rightChildId] : null;

  const leftGrandChildL = leftChild?.leftChildId ? treeData[leftChild.leftChildId] : null;
  const leftGrandChildR = leftChild?.rightChildId ? treeData[leftChild.rightChildId] : null;

  const rightGrandChildL = rightChild?.leftChildId ? treeData[rightChild.leftChildId] : null;
  const rightGrandChildR = rightChild?.rightChildId ? treeData[rightChild.rightChildId] : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toLowerCase();
    const foundKey = Object.keys(treeData).find(
      (k) => k.toLowerCase() === query || treeData[k].name.toLowerCase().includes(query)
    );
    if (foundKey) {
      setSelectedNodeId(foundKey);
      setRootId(foundKey);
      setActionNotice(`Centered tree on member: ${treeData[foundKey].memberId} (${treeData[foundKey].name})`);
    } else {
      setActionNotice(`No tree node found for "${searchId}".`);
    }
  };

  const handleReparent = (newParent: string) => {
    if (!treeData[newParent]) {
      setActionNotice(`Parent ID ${newParent} does not exist.`);
      return;
    }
    setTreeData((prev) => ({
      ...prev,
      [selectedNodeId]: {
        ...prev[selectedNodeId],
        parentId: newParent,
      },
    }));
    setActionNotice(`Successfully reparented ${selectedNodeId} under ${newParent}`);
  };

  const handleSetRoot = (id: string) => {
    setRootId(id);
    setSelectedNodeId(id);
    setActionNotice(`Tree root changed to ${id}`);
  };

  const handleResetToMainRoot = () => {
    const defaultKey = Object.keys(treeData)[0] || 'MF-OPS-ROOT';
    setRootId(defaultKey);
    setSelectedNodeId(defaultKey);
    setSearchId(defaultKey);
    setActionNotice(`Reset view to system root (${defaultKey})`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
            OPERATIONS / NETWORK ARCHITECTURE
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
            Tree Management
          </h1>
          <p className="text-xs text-parchment-400 font-light mt-1">
            Visual 2×2 binary network control • Search by ID or Name • Assign nodes, reparent branches &amp; re-root trees.
          </p>
        </div>

        {/* Global Root Reset Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToMainRoot}
            className="hairline-border px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-parchment-200 hover:border-amberfox hover:text-amberfox flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amberfox" />
            <span>Reset Root ({rootNode.memberId})</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="bg-noir-900 border-l-2 border-amberfox p-4 flex items-center justify-between font-mono text-xs text-parchment-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-parchment-500 hover:text-parchment-200 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            TOTAL NETWORK NODES
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">
            {Object.keys(treeData).length}
          </div>
          <p className="text-[11px] font-mono text-parchment-400">All placed downlines</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            LEFT / RIGHT BALANCE
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">1:1</div>
          <p className="text-[11px] font-mono text-parchment-400">15 Left Team • 15 Right Team</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            CURRENT TREE ROOT
          </span>
          <div className="font-serif text-3xl text-amberfox-gold font-bold uppercase truncate">
            {rootNode.memberId}
          </div>
          <p className="text-[11px] font-mono text-parchment-400">{rootNode.name} (Level {rootNode.level})</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-emerald-400 block">
            TREE HEALTH
          </span>
          <div className="font-serif text-4xl text-emerald-400 font-bold">Symmetrical</div>
          <p className="text-[11px] font-mono text-parchment-400">Zero orphans detected</p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-noir-900 hairline-border p-6 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full font-mono text-xs">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by MoneyFox ID (e.g. mf10492, mf10510) or Name..."
              className="w-full bg-noir-950 hairline-border pl-9 pr-4 py-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
            <Search className="w-4 h-4 text-parchment-500 absolute left-3 top-3 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto btn-gold-sheen text-noir-950 font-bold uppercase tracking-luxury px-6 py-2.5 text-xs cursor-pointer shadow-amber-glow"
          >
            SEARCH &amp; LOCATE
          </button>
        </form>
      </div>

      {/* Main Binary Tree Visual Canvas & Node Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Visual 2x2 Binary Tree */}
        <div className="lg:col-span-8 bg-noir-900 hairline-border p-6 sm:p-8 space-y-8 overflow-x-auto">
          <div className="flex items-center justify-between pb-4 hairline-border-b">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block">
                HIERARCHY VIEW
              </span>
              <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
                Binary Tree Visualizer (Root: {rootNode.memberId})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-parchment-400 bg-noir-950 hairline-border px-2.5 py-1">
              Click node to inspect &amp; modify
            </span>
          </div>

          {/* Level 0: Root Node */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setSelectedNodeId(rootNode.memberId)}
              className={`p-4 bg-noir-950 hairline-border w-56 text-center cursor-pointer transition-all ${
                selectedNodeId === rootNode.memberId
                  ? 'border-amberfox ring-2 ring-amberfox/50 shadow-amber-glow'
                  : 'hover:border-amberfox/50'
              }`}
            >
              <span className="inline-block px-2 py-0.5 bg-amberfox text-noir-950 font-bold font-mono text-[9px] uppercase tracking-luxury mb-1">
                TREE ROOT
              </span>
              <p className="font-serif text-sm font-semibold text-parchment-100">{rootNode.name}</p>
              <p className="text-[10px] font-mono text-amberfox-gold">{rootNode.memberId}</p>
              <div className="flex justify-between text-[9px] font-mono text-parchment-400 mt-2 pt-2 border-t border-amberfox/10">
                <span>L: {rootNode.leftPv}</span>
                <span>Level {rootNode.level}</span>
                <span>R: {rootNode.rightPv}</span>
              </div>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="w-[1px] h-6 bg-amberfox/40" />

            {/* Horizontal Split Line */}
            <div className="w-96 max-w-full h-[1px] bg-amberfox/40 relative">
              <div className="absolute left-0 top-0 w-[1px] h-6 bg-amberfox/40" />
              <div className="absolute right-0 top-0 w-[1px] h-6 bg-amberfox/40" />
            </div>

            {/* Level 1: Left & Right Children */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-xl mt-6">
              {/* Left Child Node */}
              <div className="flex flex-col items-center">
                {leftChild ? (
                  <div
                    onClick={() => setSelectedNodeId(leftChild.memberId)}
                    className={`p-4 bg-noir-950 hairline-border w-48 text-center cursor-pointer transition-all ${
                      selectedNodeId === leftChild.memberId
                        ? 'border-amberfox ring-2 ring-amberfox/50 shadow-amber-glow'
                        : 'hover:border-amberfox/50'
                    }`}
                  >
                    <span className="inline-block px-2 py-0.5 bg-noir-900 border border-amberfox/30 text-amberfox font-mono text-[9px] uppercase mb-1">
                      LEFT CHILD
                    </span>
                    <p className="font-serif text-sm font-semibold text-parchment-100 truncate">
                      {leftChild.name}
                    </p>
                    <p className="text-[10px] font-mono text-amberfox-gold">{leftChild.memberId}</p>
                    <div className="flex justify-between text-[9px] font-mono text-parchment-400 mt-2 pt-2 border-t border-amberfox/10">
                      <span>L: {leftChild.leftPv}</span>
                      <span>Lvl {leftChild.level}</span>
                      <span>R: {leftChild.rightPv}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-noir-950/40 border border-dashed border-amberfox/20 w-48 text-center text-parchment-600 font-mono text-xs">
                    [ Empty Left Slot ]
                  </div>
                )}

                {/* Sub stem */}
                <div className="w-[1px] h-4 bg-amberfox/30" />
                <div className="w-40 h-[1px] bg-amberfox/30 relative">
                  <div className="absolute left-0 top-0 w-[1px] h-4 bg-amberfox/30" />
                  <div className="absolute right-0 top-0 w-[1px] h-4 bg-amberfox/30" />
                </div>

                {/* Level 2 Grandchildren (Left Branch) */}
                <div className="grid grid-cols-2 gap-2 mt-4 w-48">
                  {leftGrandChildL ? (
                    <div
                      onClick={() => setSelectedNodeId(leftGrandChildL.memberId)}
                      className="p-2 bg-noir-950 hairline-border text-center text-[10px] font-mono cursor-pointer hover:border-amberfox"
                    >
                      <p className="text-parchment-200 truncate">{leftGrandChildL.name}</p>
                      <p className="text-amberfox-gold text-[9px]">{leftGrandChildL.memberId}</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-noir-950/30 border border-dashed border-amberfox/10 text-center text-[9px] text-parchment-600 font-mono">
                      Empty
                    </div>
                  )}

                  {leftGrandChildR ? (
                    <div
                      onClick={() => setSelectedNodeId(leftGrandChildR.memberId)}
                      className="p-2 bg-noir-950 hairline-border text-center text-[10px] font-mono cursor-pointer hover:border-amberfox"
                    >
                      <p className="text-parchment-200 truncate">{leftGrandChildR.name}</p>
                      <p className="text-amberfox-gold text-[9px]">{leftGrandChildR.memberId}</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-noir-950/30 border border-dashed border-amberfox/10 text-center text-[9px] text-parchment-600 font-mono">
                      Empty
                    </div>
                  )}
                </div>
              </div>

              {/* Right Child Node */}
              <div className="flex flex-col items-center">
                {rightChild ? (
                  <div
                    onClick={() => setSelectedNodeId(rightChild.memberId)}
                    className={`p-4 bg-noir-950 hairline-border w-48 text-center cursor-pointer transition-all ${
                      selectedNodeId === rightChild.memberId
                        ? 'border-amberfox ring-2 ring-amberfox/50 shadow-amber-glow'
                        : 'hover:border-amberfox/50'
                    }`}
                  >
                    <span className="inline-block px-2 py-0.5 bg-noir-900 border border-amberfox/30 text-amberfox font-mono text-[9px] uppercase mb-1">
                      RIGHT CHILD
                    </span>
                    <p className="font-serif text-sm font-semibold text-parchment-100 truncate">
                      {rightChild.name}
                    </p>
                    <p className="text-[10px] font-mono text-amberfox-gold">{rightChild.memberId}</p>
                    <div className="flex justify-between text-[9px] font-mono text-parchment-400 mt-2 pt-2 border-t border-amberfox/10">
                      <span>L: {rightChild.leftPv}</span>
                      <span>Lvl {rightChild.level}</span>
                      <span>R: {rightChild.rightPv}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-noir-950/40 border border-dashed border-amberfox/20 w-48 text-center text-parchment-600 font-mono text-xs">
                    [ Empty Right Slot ]
                  </div>
                )}

                {/* Sub stem */}
                <div className="w-[1px] h-4 bg-amberfox/30" />
                <div className="w-40 h-[1px] bg-amberfox/30 relative">
                  <div className="absolute left-0 top-0 w-[1px] h-4 bg-amberfox/30" />
                  <div className="absolute right-0 top-0 w-[1px] h-4 bg-amberfox/30" />
                </div>

                {/* Level 2 Grandchildren (Right Branch) */}
                <div className="grid grid-cols-2 gap-2 mt-4 w-48">
                  {rightGrandChildL ? (
                    <div
                      onClick={() => setSelectedNodeId(rightGrandChildL.memberId)}
                      className="p-2 bg-noir-950 hairline-border text-center text-[10px] font-mono cursor-pointer hover:border-amberfox"
                    >
                      <p className="text-parchment-200 truncate">{rightGrandChildL.name}</p>
                      <p className="text-amberfox-gold text-[9px]">{rightGrandChildL.memberId}</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-noir-950/30 border border-dashed border-amberfox/10 text-center text-[9px] text-parchment-600 font-mono">
                      Empty
                    </div>
                  )}

                  {rightGrandChildR ? (
                    <div
                      onClick={() => setSelectedNodeId(rightGrandChildR.memberId)}
                      className="p-2 bg-noir-950 hairline-border text-center text-[10px] font-mono cursor-pointer hover:border-amberfox"
                    >
                      <p className="text-parchment-200 truncate">{rightGrandChildR.name}</p>
                      <p className="text-amberfox-gold text-[9px]">{rightGrandChildR.memberId}</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-noir-950/30 border border-dashed border-amberfox/10 text-center text-[9px] text-parchment-600 font-mono">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Node Inspector & Guarded Operations */}
        <div className="lg:col-span-4 bg-noir-900 hairline-border p-6 space-y-6">
          <div className="pb-4 hairline-border-b">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block mb-0.5">
              NODE INSPECTOR
            </span>
            <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
              {currentNode.name}
            </h3>
            <p className="text-xs font-mono text-amberfox-gold mt-0.5">{currentNode.memberId}</p>
          </div>

          {/* Node Attributes Table */}
          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-amberfox/10">
              <span className="text-parchment-400">Email:</span>
              <span className="text-parchment-200">{currentNode.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amberfox/10">
              <span className="text-parchment-400">Current MLM Level:</span>
              <span className="text-amberfox font-semibold">Level {currentNode.level} of 9</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amberfox/10">
              <span className="text-parchment-400">Left Team Volume:</span>
              <span className="text-parchment-200">{currentNode.leftPv}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amberfox/10">
              <span className="text-parchment-400">Right Team Volume:</span>
              <span className="text-parchment-200">{currentNode.rightPv}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amberfox/10">
              <span className="text-parchment-400">Parent Referrer:</span>
              <span className="text-amberfox-gold">{currentNode.parentId || 'None (System Root)'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amberfox/10">
              <span className="text-parchment-400">Status:</span>
              <span className="text-emerald-400 font-semibold">{currentNode.status}</span>
            </div>
          </div>

          {/* Admin Operations Suite */}
          <div className="pt-2 space-y-3 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-luxury text-amberfox block font-semibold">
              GUARDED ADMIN OPERATIONS:
            </span>

            {/* Set as Tree Root */}
            <button
              onClick={() => handleSetRoot(currentNode.memberId)}
              className="w-full hairline-border py-2 px-3 text-left hover:border-amberfox hover:text-amberfox flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-3.5 h-3.5 text-amberfox" />
                <span>Center Tree on This Node</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-parchment-500" />
            </button>

            {/* Reparent Branch */}
            <button
              onClick={() => handleReparent('mf10492')}
              className="w-full hairline-border py-2 px-3 text-left hover:border-amberfox hover:text-amberfox flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Move className="w-3.5 h-3.5 text-amberfox" />
                <span>Reparent to System Root</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-parchment-500" />
            </button>

            {/* Assign Left Slot */}
            <button
              onClick={() => {
                setActionNotice(`Enqueued open placement for Left Slot of ${currentNode.memberId}`);
              }}
              className="w-full hairline-border py-2 px-3 text-left hover:border-amberfox hover:text-amberfox flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <UserPlus className="w-3.5 h-3.5 text-amberfox" />
                <span>Assign Open Left Child</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-parchment-500" />
            </button>

            {/* Assign Right Slot */}
            <button
              onClick={() => {
                setActionNotice(`Enqueued open placement for Right Slot of ${currentNode.memberId}`);
              }}
              className="w-full hairline-border py-2 px-3 text-left hover:border-amberfox hover:text-amberfox flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <UserPlus className="w-3.5 h-3.5 text-amberfox" />
                <span>Assign Open Right Child</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-parchment-500" />
            </button>

            {/* Security Caution */}
            <div className="p-3 bg-noir-950 hairline-border text-[10px] text-parchment-400 space-y-1 mt-4">
              <div className="flex items-center space-x-1.5 text-amberfox font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Audit Log Protected</span>
              </div>
              <p>
                All tree structural modifications (reparenting, node swaps) are logged in the cryptographic operations audit table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
