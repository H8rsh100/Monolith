import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Flag, Database, FileCode, Layers, Maximize2, RefreshCw } from 'lucide-react';

interface StrataGraphViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Dig Marker Node (Surveyor Pin & Flag Tag)
const DigMarkerNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const isCritical = riskScore >= 50;

  const getMarkerIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-3.5 w-3.5 text-[#1B2A3A]" />;
      case 'file': return <Database className="h-3.5 w-3.5 text-[#1B2A3A]" />;
      case 'jcl_job': return <Layers className="h-3.5 w-3.5 text-[#1B2A3A]" />;
      default: return <Flag className={`h-3.5 w-3.5 ${isCritical ? 'text-[#A8462E]' : 'text-[#1B2A3A]'}`} />;
    }
  };

  return (
    <div
      className={`px-3.5 py-2 bg-[#EDE6D6] text-[#1B2A3A] font-mono text-xs border border-[#1B2A3A] rounded-[2px] shadow-sm min-w-[190px] transition-all hover:scale-105 cursor-pointer group ${
        isCritical ? 'border-l-4 border-l-[#A8462E]' : 'border-l-4 border-l-[#B8862E]'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#1B2A3A] !w-2.5 !h-2.5 !border-none" />

      <div className="flex items-center justify-between gap-2 border-b border-[#1B2A3A]/30 pb-1 mb-1">
        <div className="flex items-center gap-1.5 font-bold">
          {getMarkerIcon()}
          <span className="font-mono text-xs tracking-tight uppercase group-hover:text-[#A8462E] transition-colors">{label}</span>
        </div>
        <span className="text-[10px] text-[#1B2A3A]/70 uppercase font-sans">MARKER</span>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#1B2A3A]/80">{nodeType.toUpperCase()}</span>
        {nodeType === 'program' && (
          <span className={`font-bold font-mono px-1.5 py-0.2 border rounded-[2px] ${
            isCritical ? 'bg-[#A8462E]/15 text-[#A8462E] border-[#A8462E]/40' : 'bg-[#B8862E]/15 text-[#B8862E] border-[#B8862E]/40'
          }`}>
            RISK {riskScore.toFixed(1)}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-[#1B2A3A] !w-2.5 !h-2.5 !border-none" />
    </div>
  );
};

const nodeTypes = {
  program: DigMarkerNode,
  copybook: DigMarkerNode,
  file: DigMarkerNode,
  jcl_job: DigMarkerNode
};

const StrataContent: React.FC<StrataGraphViewProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Derive Vertical Stratigraphy Layout (Depth-Driven Y-Coordinates)
  const nodes: Node[] = (graphData.nodes || []).map((n, idx) => {
    const nodeType = n.type || n.data?.nodeType || 'program';
    const pname = (n.data?.name || n.id || '').toUpperCase();
    const risk = typeof n.data?.riskScore === 'number' ? n.data.riskScore : 0;

    let depthY = 380; // Default Mid Stratum
    let colX = 100 + (idx % 4) * 260;

    if (nodeType === 'jcl_job') {
      depthY = 50; // Surface Stratum (#E4D9BC)
      colX = 200 + (idx % 2) * 350;
    } else if (nodeType === 'copybook') {
      depthY = 200; // Upper Stratum (#C9B896)
      colX = 120 + (idx % 3) * 280;
    } else if (nodeType === 'file') {
      depthY = 510; // Deep Stratum (#846D49)
      colX = 140 + (idx % 3) * 300;
    } else if (pname.includes('ACCT') || risk >= 45) {
      depthY = 660; // Bedrock Core (#5C4A30) - Oldest 1970s COBOL
      colX = 220 + (idx % 2) * 360;
    } else {
      depthY = 370; // Mid Stratum (#A8926B)
      colX = 150 + (idx % 3) * 290;
    }

    return {
      ...n,
      type: n.type || 'program',
      position: { x: colX, y: depthY }
    };
  });

  // Taut Thread Edge Lighting Dynamics & Clean Label Overlap Elimination
  const edges: Edge[] = (graphData.edges || []).map((e) => {
    const rawLabel = e.label || (e.data?.relationship as string) || '';
    const isConnected = hoveredNodeId ? (e.source === hoveredNodeId || e.target === hoveredNodeId) : false;
    const isDimmed = hoveredNodeId ? !isConnected : false;

    return {
      ...e,
      // Show relationship text ONLY when hovered to prevent box clumping/overlaps!
      label: isConnected && rawLabel ? rawLabel.toUpperCase() : undefined,
      labelBgStyle: { fill: '#1B2A3A', rx: 2, ry: 2 },
      labelStyle: { fill: '#EDE6D6', fontWeight: 700, fontSize: 10, fontFamily: 'JetBrains Mono' },
      style: {
        stroke: isConnected ? '#A8462E' : '#1B2A3A',
        strokeWidth: isConnected ? 3.5 : 1.5,
        opacity: isDimmed ? 0.12 : 0.75,
        strokeDasharray: isConnected ? 'none' : '4 4'
      },
      animated: isConnected
    };
  });

  useEffect(() => {
    if (nodes.length === 0 && !loading) {
      onIngest();
    }
  }, [nodes.length, loading, onIngest]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 200);
    return () => clearTimeout(timer);
  }, [fitView, nodes.length]);

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-full min-h-[650px] relative vellum-bg overflow-hidden font-sans select-none">
      
      {/* Stratigraphy Background Layers (Surface to Bedrock) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col font-mono text-[11px] font-bold text-[#1B2A3A]/40 uppercase">
        <div className="h-[170px] bg-[#E4D9BC]/50 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>SURFACE STRATUM // MODERN INTEGRATION & JCL JOBS (Depth: 0m - 150m)</span>
          <span>STRATUM I</span>
        </div>
        <div className="h-[160px] bg-[#C9B896]/40 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>UPPER STRATUM // SHARED COPYBOOK LAYOUTS (Depth: 150m - 320m)</span>
          <span>STRATUM II</span>
        </div>
        <div className="h-[160px] bg-[#A8926B]/30 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>MID STRATUM // BUSINESS LOGIC & VSAM TARGETS (Depth: 320m - 500m)</span>
          <span>STRATUM III</span>
        </div>
        <div className="h-[160px] bg-[#846D49]/25 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>DEEP STRATUM // SUBPROGRAM LOGIC & CALC ENGINES (Depth: 500m - 680m)</span>
          <span>STRATUM IV</span>
        </div>
        <div className="flex-1 bg-[#5C4A30]/20 px-6 py-2 flex justify-between items-start">
          <span>BEDROCK CORE // 1970s PRIMITIVE COBOL (Depth: 680m - 1000m)</span>
          <span className="text-[#A8462E]">BEDROCK</span>
        </div>
      </div>

      {/* SVG Topographic Contour Elevation Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <g stroke="#1B2A3A" strokeWidth="1" fill="none" strokeDasharray="3 3">
          {/* Surface Contour Ring */}
          <path d="M 180 80 Q 400 40 650 90 T 1100 70 T 1400 100" />
          {/* Mid Layer Contour Rings */}
          <ellipse cx="380" cy="380" rx="280" ry="110" />
          <ellipse cx="980" cy="390" rx="300" ry="120" />
          {/* Bedrock Core Contour Ring */}
          <ellipse cx="550" cy="680" rx="360" ry="90" stroke="#A8462E" strokeWidth="1.5" />
        </g>
      </svg>

      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EDE6D6] z-20 font-sans">
          <div className="p-4 border border-[#1B2A3A] bg-[#E4D9BC] mb-4 rounded-[2px]">
            <RefreshCw className="h-10 w-10 text-[#1B2A3A] animate-spin" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1B2A3A] mb-2 uppercase tracking-tight">
            EXCAVATING COBOL CORE SAMPLE...
          </h3>
          <p className="text-xs text-[#1B2A3A]/70 max-w-sm text-center font-mono">
            LOADING VERTICAL STRATIGRAPHY AND TOPOGRAPHIC CONTOURS.
          </p>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
          onNodeMouseLeave={() => setHoveredNodeId(null)}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          colorMode="light"
        >
          <Controls className="!bg-[#EDE6D6] !border-[#1B2A3A] !text-[#1B2A3A] !rounded-[2px] !shadow-none !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Top Controls Bar (Cleaned of Excavation Depth text) */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 400 })}
            className="px-3.5 py-2 border border-[#1B2A3A] bg-[#EDE6D6] hover:bg-[#E4D9BC] text-[#1B2A3A] font-bold uppercase flex items-center gap-2 shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            [RECENTER TOPOLOGY MAP]
          </button>
          <div className="px-3.5 py-2 border border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A] font-bold shadow-sm">
            INTERSECTION NODES: <span className="text-[#A8462E]">{nodes.length}</span> | STRATA: <span className="text-[#1B2A3A]">5 LAYERS</span>
          </div>
        </div>
      )}

      {/* Sleek Horizontal Stratigraphy Legend Bar (Bottom Edge, Zero Overlap) */}
      <div className="absolute bottom-4 left-6 right-6 z-20 px-4 py-2 border border-[#1B2A3A] bg-[#EDE6D6]/95 backdrop-blur-sm text-xs font-mono flex items-center justify-between shadow-md">
        <span className="font-serif font-bold text-[#1B2A3A] uppercase text-[11px] tracking-wider shrink-0 pr-4 border-r border-[#1B2A3A]/30">
          Stratigraphy Legend
        </span>
        
        <div className="flex items-center gap-6 overflow-x-auto text-[11px]">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 bg-[#E4D9BC] border border-[#1B2A3A]"></span>
            <span className="text-[#1B2A3A]">Stratum I: Surface JCL Batch Jobs</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 bg-[#C9B896] border border-[#1B2A3A]"></span>
            <span className="text-[#1B2A3A]">Stratum II: Shared Copybooks</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 bg-[#A8926B] border border-[#1B2A3A]"></span>
            <span className="text-[#1B2A3A]">Stratum III: COBOL Business Logic</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 bg-[#846D49] border border-[#1B2A3A]"></span>
            <span className="text-[#1B2A3A]">Stratum IV: Subprograms & VSAM</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 bg-[#5C4A30] border border-[#1B2A3A]"></span>
            <span className="text-[#A8462E] font-bold">Bedrock: 1970s Primitive COBOL</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export const StrataGraphView: React.FC<StrataGraphViewProps> = (props) => (
  <ReactFlowProvider>
    <TopologyContent {...props} />
  </ReactFlowProvider>
);

const TopologyContent = StrataContent;
