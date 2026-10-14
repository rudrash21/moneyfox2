import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GitBranch, RotateCcw, ZoomIn, ZoomOut, X, Eye, Crosshair, ChevronRight, Maximize2 } from 'lucide-react';
import { NINE_LEVEL_SCHEDULE } from '../../data/mockData';

export interface BinaryNodeData {
  id: string;
  name: string;
  code: string;
  tag: string;
  depth: number;
  leftPV: number;
  rightPV: number;
  levelTier: number;
  parentCode?: string;
  parentName?: string;
  branchSide?: 'left' | 'right';
  left?: BinaryNodeData;
  right?: BinaryNodeData;
}

// Deterministically generate complete 9-level binary tree hierarchy (all 1,023 nodes)
const buildFullNineLevelTree = (): BinaryNodeData => {
  const firstNames = [
    'Vikramaditya', 'Priya', 'Amit', 'Karan', 'Sneha', 'Rohit', 'Ananya',
    'Arjun', 'Meera', 'Dev', 'Riya', 'Kabir', 'Tanvi', 'Aditya', 'Pooja',
    'Sanjay', 'Neha', 'Rohan', 'Divya', 'Varun', 'Kavita', 'Naveen', 'Simran',
    'Kiran', 'Deepak', 'Alok', 'Ishaan', 'Tara', 'Manoj', 'Zoya', 'Nikhil', 'Shreya'
  ];
  const lastInitials = ['S.', 'V.', 'K.', 'M.', 'R.', 'P.', 'D.', 'T.', 'B.', 'G.', 'N.', 'J.', 'A.', 'C.', 'W.', 'H.'];

  let codeCounter = 10492;

  const createNode = (
    depth: number,
    tag: string,
    isLeft: boolean,
    parentCode?: string,
    parentName?: string,
    branchSide: 'left' | 'right' = 'left'
  ): BinaryNodeData => {
    const fnIndex = (codeCounter + depth) % firstNames.length;
    const lnIndex = (codeCounter * 3 + depth) % lastInitials.length;
    const name = `${firstNames[fnIndex]} ${lastInitials[lnIndex]}`;
    const code = `mf${codeCounter++}`;
    const basePV = Math.max(25, Math.round(1500 / Math.pow(1.8, depth)));

    const node: BinaryNodeData = {
      id: code,
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
        depth === 0 ? 'LEFT CHILD' : `L${depth + 1}L`,
        true,
        code,
        name,
        depth === 0 ? 'left' : branchSide
      );
      node.right = createNode(
        depth + 1,
        depth === 0 ? 'RIGHT CHILD' : `L${depth + 1}R`,
        false,
        code,
        name,
        depth === 0 ? 'right' : branchSide
      );
    }

    return node;
  };

  const root = createNode(0, 'TREE ROOT', true);
  root.name = 'VIKRAMADITYA S.';
  root.code = 'mf10492';
  root.leftPV = 1500;
  root.rightPV = 1500;

  if (root.left) {
    root.left.name = 'PRIYA V.';
    root.left.code = 'mf10510';
    root.left.tag = 'LEFT CHILD';
    root.left.leftPV = 700;
    root.left.rightPV = 800;

    if (root.left.left) {
      root.left.left.name = 'KARAN M.';
      root.left.left.code = 'mf10520';
      root.left.left.tag = 'L2 LEFT';
      root.left.left.leftPV = 350;
      root.left.left.rightPV = 350;
    }
    if (root.left.right) {
      root.left.right.name = 'SNEHA R.';
      root.left.right.code = 'mf10521';
      root.left.right.tag = 'L2 RIGHT';
      root.left.right.leftPV = 350;
      root.left.right.rightPV = 350;
    }
  }

  if (root.right) {
    root.right.name = 'AMIT K.';
    root.right.code = 'mf10511';
    root.right.tag = 'RIGHT CHILD';
    root.right.leftPV = 800;
    root.right.rightPV = 700;

    if (root.right.left) {
      root.right.left.name = 'ROHIT P.';
      root.right.left.code = 'mf10522';
      root.right.left.tag = 'L2 LEFT';
      root.right.left.leftPV = 400;
      root.right.left.rightPV = 400;
    }
    if (root.right.right) {
      root.right.right.name = 'ANANYA D.';
      root.right.right.code = 'mf10523';
      root.right.right.tag = 'L2 RIGHT';
      root.right.right.leftPV = 400;
      root.right.right.rightPV = 400;
    }
  }

  return root;
};

const FULL_NINE_LEVEL_TREE = buildFullNineLevelTree();

// Helper to extract all nodes at a given depth
const getNodesAtDepth = (node: BinaryNodeData, targetDepth: number): BinaryNodeData[] => {
  if (node.depth === targetDepth) return [node];
  const list: BinaryNodeData[] = [];
  if (node.left) list.push(...getNodesAtDepth(node.left, targetDepth));
  if (node.right) list.push(...getNodesAtDepth(node.right, targetDepth));
  return list;
};

// Recommended default zoom for each level to fit cleanly and cover viewport width
const DEFAULT_ZOOM_PER_LEVEL: Record<number, number> = {
  1: 1.0,
  2: 1.0,
  3: 1.0,
  4: 0.85,
  5: 0.65,
  6: 0.45,
  7: 0.28,
  8: 0.16,
  9: 0.10,
};

// Memoized Recursive Tree Node Renderer for buttery 60+ FPS zoom and drag performance
const TreeNodeRecursiveItem: React.FC<{
  node: BinaryNodeData;
  depth: number;
  maxDepth: number;
  activeLevel: number;
  onNodeClick: (node: BinaryNodeData) => void;
}> = React.memo(({ node, depth, maxDepth, activeLevel, onNodeClick }) => {
  const hasChildren = depth < maxDepth && !!node.left && !!node.right;

  // Render node card styled according to depth with guaranteed min-width and no shrinking
  const renderCard = () => {
    if (depth === 0) {
      return (
        <div
          onClick={() => onNodeClick(node)}
          className="rounded-full bg-gradient-to-b from-noir-900 to-noir-950 border-2 border-amberfox p-3 text-center shadow-[0_0_20px_rgba(217,119,6,0.35)] w-40 h-40 min-w-[160px] min-h-[160px] shrink-0 transition-transform duration-150 hover:scale-105 hover:border-amber-300 cursor-pointer group flex flex-col items-center justify-center relative z-10 select-none"
        >
          <span className="border border-amberfox/80 bg-amberfox/20 text-amberfox font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 font-bold rounded-full mb-1">
            {node.tag || 'TREE ROOT'}
          </span>
          <h4 className="font-serif text-xs font-bold text-parchment-100 uppercase tracking-wider group-hover:text-amberfox transition-colors truncate max-w-[125px]">
            {node.name}
          </h4>
          <p className="font-mono text-[9px] text-amberfox-gold font-semibold mt-0.5">
            {node.code}
          </p>
        </div>
      );
    }

    if (depth === 1) {
      return (
        <div
          onClick={() => onNodeClick(node)}
          className="rounded-full bg-gradient-to-b from-noir-900 to-noir-950 border-2 border-amberfox/80 hover:border-amber-300 p-2.5 text-center w-34 h-34 min-w-[136px] min-h-[136px] shrink-0 transition-transform duration-150 hover:scale-105 cursor-pointer group shadow-[0_0_14px_rgba(217,119,6,0.25)] flex flex-col items-center justify-center relative z-10 select-none"
        >
          <span className="border border-amberfox/60 bg-amberfox/15 text-amberfox font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 font-bold rounded-full mb-0.5">
            {node.tag}
          </span>
          <h5 className="font-serif text-[11px] font-bold text-parchment-100 uppercase tracking-wide group-hover:text-amberfox transition-colors truncate max-w-[105px]">
            {node.name}
          </h5>
          <p className="font-mono text-[8px] text-amberfox-gold font-semibold mt-0.5">
            {node.code}
          </p>
        </div>
      );
    }

    if (depth === 2) {
      return (
        <div
          onClick={() => onNodeClick(node)}
          className="rounded-full bg-gradient-to-b from-noir-900 to-noir-950 border-2 border-amberfox/60 hover:border-amber-300 p-2 text-center w-28 h-28 min-w-[112px] min-h-[112px] shrink-0 transition-transform duration-150 hover:scale-105 cursor-pointer group shadow-[0_0_10px_rgba(217,119,6,0.2)] flex flex-col items-center justify-center relative z-10 select-none"
        >
          <span className="text-[7px] font-mono text-amberfox font-semibold uppercase tracking-wider">
            {node.tag}
          </span>
          <div className="font-serif text-[10px] font-bold text-parchment-100 uppercase tracking-wide group-hover:text-amberfox transition-colors truncate max-w-[85px] mt-0.5">
            {node.name}
          </div>
          <p className="font-mono text-[8px] text-amberfox-gold font-semibold mt-0.5">
            {node.code}
          </p>
        </div>
      );
    }

    if (depth >= 3 && depth <= 8) {
      return (
        <div
          onClick={() => onNodeClick(node)}
          className="rounded-full bg-gradient-to-b from-noir-900 to-noir-950 border border-amberfox/45 hover:border-amber-300 p-1.5 text-center w-24 h-24 min-w-[96px] min-h-[96px] shrink-0 transition-transform duration-150 hover:scale-105 cursor-pointer group shadow-[0_0_8px_rgba(245,138,46,0.15)] flex flex-col items-center justify-center relative z-10 select-none"
          title={`${node.name} (${node.code}) - Level ${depth}`}
        >
          <span className="text-[7px] font-mono text-amber-500 font-bold">L{depth}</span>
          <div className="font-serif text-[9px] font-bold text-parchment-100 uppercase truncate max-w-[75px] mt-0.5 group-hover:text-amberfox">
            {node.name}
          </div>
          <p className="font-mono text-[7px] text-amberfox-gold font-medium mt-0.5">{node.code}</p>
        </div>
      );
    }

    // Depth === 9 (Pinnacle Tier Node - The Last Nodes)
    return (
      <div
        onClick={() => onNodeClick(node)}
        className="rounded-full bg-gradient-to-b from-noir-900 to-noir-950 border border-amber-500/80 hover:border-amber-300 p-1.5 text-center w-24 h-24 min-w-[96px] min-h-[96px] shrink-0 transition-transform duration-150 hover:scale-105 cursor-pointer group shadow-[0_0_10px_rgba(245,138,46,0.25)] flex flex-col items-center justify-center relative z-10 select-none"
        title={`Level 9 Node: ${node.name} (${node.code}) - Milestone: ₹76,800`}
      >
        <span className="text-[7px] font-mono text-amber-400 font-bold">L9 • ₹76.8K</span>
        <div className="font-serif text-[9px] font-bold text-parchment-100 uppercase truncate max-w-[75px] mt-0.5 group-hover:text-amberfox transition-colors">
          {node.name}
        </div>
        <p className="font-mono text-[7px] text-amberfox-gold font-semibold mt-0.5">{node.code}</p>
      </div>
    );
  };

  // Node dimensions and vertical spacing by depth to form an exact ScholarHat-style triangular binary tree
  const getNodeDimensions = (d: number) => {
    if (d === 0) return { size: 160, gap: 110 };
    if (d === 1) return { size: 136, gap: 85 };
    if (d === 2) return { size: 112, gap: 65 };
    return { size: 96, gap: 48 };
  };

  const parentGeo = getNodeDimensions(depth);
  const childGeo = getNodeDimensions(depth + 1);

  const parentCenterY = parentGeo.size / 2;
  const gap = parentGeo.gap;
  const childCenterY = parentGeo.size + gap + childGeo.size / 2;
  const totalSvgHeight = childCenterY;

  return (
    <div className="relative flex flex-col items-center shrink-0 min-w-max">
      {/* Exact straight center-to-center diagonal vector lines */}
      {hasChildren && (
        <svg
          className="absolute top-0 left-0 w-full pointer-events-none z-0 overflow-visible opacity-90"
          style={{ height: totalSvgHeight }}
        >
          {/* Left Branch Vector Line */}
          <line
            x1="50%"
            y1={parentCenterY}
            x2="25%"
            y2={childCenterY}
            stroke="#f59e0b"
            strokeWidth={depth === 0 ? 3 : depth === 1 ? 2.5 : 2}
            strokeLinecap="round"
          />
          {/* Right Branch Vector Line */}
          <line
            x1="50%"
            y1={parentCenterY}
            x2="75%"
            y2={childCenterY}
            stroke="#f59e0b"
            strokeWidth={depth === 0 ? 3 : depth === 1 ? 2.5 : 2}
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Node Card (z-10 ensures card sits seamlessly above vector lines) */}
      {renderCard()}

      {/* Children branches with vertical spacing spacer */}
      {hasChildren && (
        <div className="flex flex-col items-center w-full shrink-0 min-w-max">
          {/* Spacing gap ensuring triangular symmetry between parent and children */}
          <div style={{ height: gap }} className="w-full shrink-0" />

          {/* Children container */}
          <div className="relative flex justify-center shrink-0 min-w-max w-full">
            {/* Left Child branch with clean guaranteed spacing */}
            <div className="flex-1 min-w-max flex flex-col items-center px-2 shrink-0">
              <TreeNodeRecursiveItem
                node={node.left!}
                depth={depth + 1}
                maxDepth={maxDepth}
                activeLevel={activeLevel}
                onNodeClick={onNodeClick}
              />
            </div>

            {/* Right Child branch with clean guaranteed spacing */}
            <div className="flex-1 min-w-max flex flex-col items-center px-2 shrink-0">
              <TreeNodeRecursiveItem
                node={node.right!}
                depth={depth + 1}
                maxDepth={maxDepth}
                activeLevel={activeLevel}
                onNodeClick={onNodeClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const NineLevelBinaryTree: React.FC = () => {
  const [selectedDepth, setSelectedDepth] = useState<number>(9);
  const [focusedNodePath, setFocusedNodePath] = useState<BinaryNodeData[]>([FULL_NINE_LEVEL_TREE]);
  const [zoomScale, setZoomScale] = useState<number>(DEFAULT_ZOOM_PER_LEVEL[9] || 0.1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 40 });
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);
  const [selectedNodeModal, setSelectedNodeModal] = useState<BinaryNodeData | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragOriginRef = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    moved: false,
  });

  // Compute active subtree root based on breadcrumbs
  const activeRoot = useMemo(() => {
    return focusedNodePath[focusedNodePath.length - 1];
  }, [focusedNodePath]);

  // Center tree horizontally in the viewport
  const centerTree = useCallback((targetZoom?: number) => {
    if (!viewportRef.current || !contentRef.current) return;
    const viewW = viewportRef.current.clientWidth;
    const contentW = contentRef.current.offsetWidth || contentRef.current.scrollWidth;
    const scale = targetZoom ?? zoomScale;
    const newPanX = Math.round(viewW / 2 - (contentW / 2) * scale);
    const newPanY = viewportRef.current.clientWidth < 640 ? 20 : 30;
    setPan({ x: newPanX, y: newPanY });
  }, [zoomScale]);

  // Fit tree perfectly to current viewport width & height (works on mobile, tablet, and desktop)
  const handleFitPage = useCallback(() => {
    if (!viewportRef.current || !contentRef.current) return;
    const isMobile = viewportRef.current.clientWidth < 640;
    const viewW = viewportRef.current.clientWidth - (isMobile ? 24 : 48);
    const viewH = viewportRef.current.clientHeight - (isMobile ? 50 : 80);
    const contentW = contentRef.current.offsetWidth || contentRef.current.scrollWidth;
    const contentH = contentRef.current.offsetHeight || contentRef.current.scrollHeight;

    if (contentW > 0 && contentH > 0) {
      const scaleX = viewW / contentW;
      const scaleY = viewH / contentH;
      const fitZoom = Math.min(1.0, Math.max(0.008, Number(Math.min(scaleX, scaleY).toFixed(3))));
      setZoomScale(fitZoom);
      const newPanX = Math.round(viewportRef.current.clientWidth / 2 - (contentW / 2) * fitZoom);
      const newPanY = isMobile ? 20 : 30;
      setPan({ x: newPanX, y: newPanY });
    }
  }, []);

  // Auto-fit whenever activeRoot or selectedDepth changes, or upon initial mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      handleFitPage();
    }, 60);
    const timer2 = setTimeout(() => {
      handleFitPage();
    }, 250);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeRoot, selectedDepth, handleFitPage]);

  // Auto-fit on window resize (e.g. mobile rotation or viewport change)
  useEffect(() => {
    const handleResize = () => {
      handleFitPage();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleFitPage]);

  // Handle smooth mouse wheel & pinch gestures directly without main-thread scroll blocking
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Pinch zoom or Ctrl + Wheel zoom focused into cursor
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomDelta = e.deltaY < 0 ? 1.12 : 0.88;
        setZoomScale((prevZoom) => {
          const nextZoom = Math.min(2.0, Math.max(0.008, Number((prevZoom * zoomDelta).toFixed(3))));
          setPan((prevPan) => ({
            x: Math.round(mouseX - (mouseX - prevPan.x) * (nextZoom / prevZoom)),
            y: Math.round(mouseY - (mouseY - prevPan.y) * (nextZoom / prevZoom)),
          }));
          return nextZoom;
        });
      } else {
        // Natural trackpad / wheel pan in X & Y
        setPan((prev) => ({
          x: Math.round(prev.x - e.deltaX),
          y: Math.round(prev.y - e.deltaY),
        }));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleSelectDepth = (depth: number) => {
    setSelectedDepth(depth);
    setTimeout(() => {
      handleFitPage();
    }, 40);
  };

  const handleZoomIn = () => {
    if (!viewportRef.current) return;
    const viewW = viewportRef.current.clientWidth;
    const viewH = viewportRef.current.clientHeight;
    const centerX = viewW / 2;
    const centerY = viewH / 2;
    const nextZoom = Math.min(2.0, Number((zoomScale + 0.1).toFixed(2)));
    setPan((prev) => ({
      x: Math.round(centerX - (centerX - prev.x) * (nextZoom / zoomScale)),
      y: Math.round(centerY - (centerY - prev.y) * (nextZoom / zoomScale)),
    }));
    setZoomScale(nextZoom);
  };

  const handleZoomOut = () => {
    if (!viewportRef.current) return;
    const viewW = viewportRef.current.clientWidth;
    const viewH = viewportRef.current.clientHeight;
    const centerX = viewW / 2;
    const centerY = viewH / 2;
    const nextZoom = Math.max(0.008, Number((zoomScale - 0.05).toFixed(2)));
    setPan((prev) => ({
      x: Math.round(centerX - (centerX - prev.x) * (nextZoom / zoomScale)),
      y: Math.round(centerY - (centerY - prev.y) * (nextZoom / zoomScale)),
    }));
    setZoomScale(nextZoom);
  };

  const handleSetZoomPreset = (targetScale: number) => {
    if (!viewportRef.current) return;
    const viewW = viewportRef.current.clientWidth;
    const viewH = viewportRef.current.clientHeight;
    const centerX = viewW / 2;
    const centerY = viewH / 2;
    setPan((prev) => ({
      x: Math.round(centerX - (centerX - prev.x) * (targetScale / zoomScale)),
      y: Math.round(centerY - (centerY - prev.y) * (targetScale / zoomScale)),
    }));
    setZoomScale(targetScale);
  };

  const handleResetRoot = () => {
    setFocusedNodePath([FULL_NINE_LEVEL_TREE]);
    setSelectedNodeModal(null);
    setTimeout(() => handleFitPage(), 50);
  };

  const handleDrillDown = (node: BinaryNodeData) => {
    if (focusedNodePath.some((n) => n.id === node.id)) return;
    setFocusedNodePath((prev) => [...prev, node]);
    setSelectedNodeModal(null);
    setTimeout(() => handleFitPage(), 50);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    setFocusedNodePath((prev) => prev.slice(0, index + 1));
    setSelectedNodeModal(null);
    setTimeout(() => handleFitPage(), 50);
  };

  // 1:1 Instant Pointer Drag-to-pan with hardware pointer capture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    isDraggingRef.current = true;
    setIsDraggingState(true);
    dragOriginRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragOriginRef.current.startX;
    const dy = e.clientY - dragOriginRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragOriginRef.current.moved = true;
    }
    setPan({
      x: dragOriginRef.current.panX + dx,
      y: dragOriginRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleNodeClick = useCallback((node: BinaryNodeData) => {
    // If the user was dragging the tree, do not open the modal
    if (dragOriginRef.current.moved) return;
    setSelectedNodeModal(node);
  }, []);

  const currentLevelInfo = NINE_LEVEL_SCHEDULE[selectedDepth - 1];

  return (
    <div className="bg-noir-900/95 border border-amberfox/30 rounded-2xl p-4 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title & Concept Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-amberfox font-mono text-xs uppercase tracking-luxury">
          <GitBranch className="w-4 h-4 text-amberfox" />
          <span>DUAL-BRANCH ARCHITECTURAL TOPOLOGY</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100 uppercase tracking-wider">
          How the Binary Tree Works
        </h3>
        <p className="text-xs sm:text-sm text-parchment-400 max-w-2xl mx-auto font-light leading-relaxed">
          Complete 9-level binary network topology. Click any tier from <strong>L1 to L9</strong> below to inspect that level&apos;s complete tree structure with precision orthogonal connectors.
        </p>
      </div>

      {/* Main Control Console matching user reference image */}
      <div className="bg-noir-950 p-4 sm:p-5 border border-amberfox/25 rounded-xl space-y-4">
        {/* Top Status Bar: TREE DEPTH VIEW + Zoom Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500 font-mono font-bold tracking-wider uppercase">TREE DEPTH VIEW:</span>
            <span className="text-parchment-200">
              Displaying <strong className="text-amber-500 font-bold">Level {selectedDepth}</strong> ({currentLevelInfo.nodes} Nodes)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleFitPage}
              className="px-2.5 py-1 bg-noir-900 border border-amberfox/30 text-parchment-300 hover:text-amberfox hover:border-amberfox text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Fit Tree to Screen Width"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fit Screen</span>
            </button>
            <button
              onClick={() => handleSetZoomPreset(0.25)}
              className={`px-2 py-1 bg-noir-900 border text-xs font-mono cursor-pointer transition-colors ${
                zoomScale === 0.25 ? 'border-amberfox text-amberfox font-bold' : 'border-amberfox/30 text-parchment-400 hover:text-parchment-200'
              }`}
            >
              25%
            </button>
            <button
              onClick={() => handleSetZoomPreset(0.5)}
              className={`px-2 py-1 bg-noir-900 border text-xs font-mono cursor-pointer transition-colors ${
                zoomScale === 0.5 ? 'border-amberfox text-amberfox font-bold' : 'border-amberfox/30 text-parchment-400 hover:text-parchment-200'
              }`}
            >
              50%
            </button>
            <button
              onClick={() => handleSetZoomPreset(1.0)}
              className={`px-2 py-1 bg-noir-900 border text-xs font-mono cursor-pointer transition-colors ${
                zoomScale === 1.0 ? 'border-amberfox text-amberfox font-bold' : 'border-amberfox/30 text-amber-400 hover:text-amber-300'
              }`}
              title="View at 100% full card size"
            >
              100% Detail
            </button>
            <button
              onClick={() => centerTree()}
              className="px-2.5 py-1 bg-noir-900 border border-amberfox/30 text-parchment-300 hover:text-amberfox hover:border-amberfox text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Center View"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 bg-noir-900 border border-amberfox/30 text-parchment-300 hover:text-amberfox hover:border-amberfox text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-parchment-200 font-mono text-xs min-w-[38px] text-center font-bold">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 bg-noir-900 border border-amberfox/30 text-parchment-300 hover:text-amberfox hover:border-amberfox text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 9-Level Selector Buttons (Exact match with user image) */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 sm:gap-2">
          {NINE_LEVEL_SCHEDULE.map((lvl) => {
            const isSelected = selectedDepth === lvl.level;
            return (
              <button
                key={lvl.level}
                onClick={() => handleSelectDepth(lvl.level)}
                className={`py-2 px-1 text-center font-mono transition-all cursor-pointer rounded-none border ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500 text-noir-950 font-bold shadow-[0_0_12px_rgba(245,138,46,0.6)]'
                    : 'bg-noir-900 border-amberfox/20 text-parchment-300 hover:border-amberfox/60 hover:text-amberfox'
                }`}
              >
                <div className="text-xs uppercase font-bold">L{lvl.level}</div>
                <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-noir-950 font-semibold' : 'text-amberfox-gold'}`}>
                  ₹{lvl.levelReward >= 1000 ? `${lvl.levelReward / 1000}k` : lvl.levelReward}
                </div>
              </button>
            );
          })}
        </div>

        {/* Breadcrumb Path when drilling down */}
        {focusedNodePath.length > 1 && (
          <div className="flex items-center space-x-2 pt-3 border-t border-amberfox/15 text-xs font-mono overflow-x-auto whitespace-nowrap">
            <span className="text-parchment-400">Branch Drilldown:</span>
            {focusedNodePath.map((node, idx) => (
              <React.Fragment key={node.id}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-amberfox/60" />}
                <button
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  className={`hover:text-amberfox transition-colors cursor-pointer ${
                    idx === focusedNodePath.length - 1 ? 'text-amberfox font-bold underline' : 'text-parchment-300'
                  }`}
                >
                  {node.name} ({node.code})
                </button>
              </React.Fragment>
            ))}
            <button
              onClick={handleResetRoot}
              className="ml-auto text-[11px] text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Full Tree
            </button>
          </div>
        )}
      </div>

      {/* VISUAL BINARY TREE CANVAS - Smooth Pan & Zoom Canvas */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full overflow-hidden select-none min-h-[460px] sm:min-h-[580px] h-[520px] sm:h-[640px] border border-amberfox/20 rounded-xl bg-noir-950/60 relative touch-none ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          ref={contentRef}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
          className="absolute top-0 left-0 w-max min-w-full flex flex-col items-center px-8 pb-32"
        >
          {/* Orthogonal Recursive Tree Renderer */}
          <TreeNodeRecursiveItem
            node={activeRoot}
            depth={0}
            maxDepth={selectedDepth}
            activeLevel={selectedDepth}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Sticky Bottom Status Banner */}
        <div className="absolute bottom-0 left-0 right-0 py-2.5 px-4 bg-noir-950/95 backdrop-blur-md border-t border-amberfox/30 flex flex-wrap items-center justify-between text-xs font-mono text-parchment-200 z-10 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="text-amber-500 font-bold uppercase tracking-wider">Level {selectedDepth} Pinnacle:</span>
            <span className="font-semibold">{currentLevelInfo.nodes} Total Nodes</span>
            <span className="text-amberfox font-bold">• Milestone Reward: ₹{currentLevelInfo.levelReward.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-parchment-400">
            Click &amp; drag anywhere to move tree • Scroll or pinch to zoom • Click node to inspect
          </div>
        </div>
      </div>



      {/* Interactive Node Detail Inspector Modal */}
      {selectedNodeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedNodeModal(null)}
        >
          <div
            className="bg-noir-950 border border-amberfox/60 rounded-xl p-6 max-w-md w-full relative shadow-[0_0_30px_rgba(217,119,6,0.25)] text-left font-mono space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNodeModal(null)}
              className="absolute top-4 right-4 text-parchment-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="border border-amberfox/80 bg-amberfox/15 text-amberfox text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-widest">
                {selectedNodeModal.tag || `LEVEL ${selectedNodeModal.depth} NODE`}
              </span>
              <span className="text-parchment-400 text-xs">Depth Tier {selectedNodeModal.depth}</span>
            </div>

            <div>
              <h4 className="font-serif text-xl font-bold text-parchment-100 uppercase tracking-wider">
                {selectedNodeModal.name}
              </h4>
              <p className="text-amberfox-gold text-xs font-semibold mt-0.5">
                Member ID: {selectedNodeModal.code}
              </p>
            </div>

            <div className="bg-noir-900 border border-amberfox/20 p-3.5 rounded-lg space-y-2 text-xs">
              {selectedNodeModal.parentName && (
                <div className="flex justify-between text-parchment-300">
                  <span>Direct Sponsor:</span>
                  <span className="text-parchment-100 font-medium">
                    {selectedNodeModal.parentName} ({selectedNodeModal.parentCode})
                  </span>
                </div>
              )}
              <div className="flex justify-between text-parchment-300">
                <span>Downline Status:</span>
                <span className="text-parchment-100 font-bold">
                  {selectedNodeModal.left && selectedNodeModal.right ? '2 / 2 Filled' : 'Open Spillover Slots'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleDrillDown(selectedNodeModal)}
                className="flex-1 btn-gold-sheen text-noir-950 text-xs uppercase font-bold py-2.5 flex items-center justify-center cursor-pointer shadow-amber-glow"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                <span>Focus Sub-Branch</span>
              </button>
              <button
                onClick={() => setSelectedNodeModal(null)}
                className="px-4 py-2.5 border border-amberfox/30 text-parchment-300 hover:text-white text-xs uppercase font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
