import React, { useEffect, useState, useRef } from 'react';
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
import { Flag, Compass, Database, FileCode, Layers, Maximize2 } from 'lucide-react';

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
      className={`px-3 py-2 bg-[#EDE6D6] text-[#1B2A3A] font-mono text-xs border border-[#1B2A3A] rounded-[2px] shadow-none min-w-[190px] transition-all hover:bg-[#E4D9BC] cursor-pointer ${
        isCritical ? 'border-l-4 border-l-[#A8462E]' : 'border-l-4 border-l-[#B8862E]'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#1B2A3A] !w-2 !h-2 !border-none" />

      <div className="flex items-center justify-between gap-2 border-b border-[#1B2A3A]/30 pb-1 mb-1">
        <div className="flex items-center gap-1.5 font-bold">
          {getMarkerIcon()}
          <span className="font-mono text-xs tracking-tight uppercase">{label}</span>
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

      <Handle type="source" position={Position.Bottom} className="!bg-[#1B2A3A] !w-2 !h-2 !border-none" />
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
  const [excavationDepth, setExcavationDepth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive Vertical Stratigraphy Layout (Depth-Driven Y-Coordinates)
  const nodes: Node[] = (graphData.nodes || []).map((n, idx) => {
    const nodeType = n.type || n.data?.nodeType || 'program';
    const pname = (n.data?.name || n.id || '').toUpperCase();
    const risk = typeof n.data?.riskScore === 'number' ? n.data.riskScore : 0;

    let depthY = 400; // Default Mid Stratum
    let colX = 100 + (idx % 4) * 260;

    if (nodeType === 'jcl_job') {
      depthY = 60; // Surface Stratum (#E4D9BC)
      colX = 200 + (idx % 2) * 350;
    } else if (nodeType === 'copybook') {
      depthY = 220; // Upper Stratum (#C9B896)
      colX = 120 + (idx % 3) * 280;
    } else if (nodeType === 'file') {
      depthY = 560; // Deep Stratum (#846D49)
      colX = 140 + (idx % 3) * 300;
    } else if (pname.includes('ACCT') || risk >= 45) {
      depthY = 720; // Bedrock Core (#5C4A30) - Oldest 1970s COBOL
      colX = 220 + (idx % 2) * 360;
    } else {
      depthY = 390; // Mid Stratum (#A8926B)
      colX = 150 + (idx % 3) * 290;
    }

    return {
      ...n,
      type: n.type || 'program',
      position: { x: colX, y: depthY }
    };
  });

  const edges: Edge[] = (graphData.edges || []).map((e) => ({
    ...e,
    style: {
      stroke: '#1B2A3A',
      strokeWidth: 1.5,
      strokeDasharray: '4 4'
    },
    animated: false
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 200);
    return () => clearTimeout(timer);
  }, [fitView, nodes.length]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setExcavationDepth((prev) => Math.min(100, prev + 5));
    } else {
      setExcavationDepth((prev) => Math.max(0, prev - 5));
    }
  };

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="w-full h-full min-h-[650px] relative vellum-bg overflow-hidden font-sans select-none"
    >
      
      {/* Stratigraphy Background Layers (Surface to Bedrock) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col font-mono text-[11px] font-bold text-[#1B2A3A]/40 uppercase">
        <div className="h-[180px] bg-[#E4D9BC]/50 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>SURFACE STRATUM // MODERN INTEGRATION & JCL JOBS (Depth: 0m - 150m)</span>
          <span>STRATUM I</span>
        </div>
        <div className="h-[170px] bg-[#C9B896]/40 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>UPPER STRATUM // SHARED COPYBOOK LAYOUTS (Depth: 150m - 320m)</span>
          <span>STRATUM II</span>
        </div>
        <div className="h-[170px] bg-[#A8926B]/30 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
          <span>MID STRATUM // BUSINESS LOGIC & VSAM TARGETS (Depth: 320m - 500m)</span>
          <span>STRATUM III</span>
        </div>
        <div className="h-[170px] bg-[#846D49]/25 border-b border-[#1B2A3A]/20 px-6 py-2 flex justify-between items-start">
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
          <ellipse cx="380" cy="400" rx="280" ry="120" />
          <ellipse cx="980" cy="410" rx="300" ry="130" />
          {/* Bedrock Core Contour Ring */}
          <ellipse cx="550" cy="740" rx="360" ry="100" stroke="#A8462E" strokeWidth="1.5" />
        </g>
      </svg>

      {/* Parallax Excavation Dust Particles */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          opacity: excavationDepth / 100,
          backgroundImage: 'radial-gradient(circle, rgba(132, 109, 73, 0.25) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          transform: `translateY(-${excavationDepth * 2}px)`
        }}
      />

      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EDE6D6]/90 z-20 font-sans">
          <div className="p-4 border border-[#1B2A3A] bg-[#E4D9BC] mb-4 rounded-[2px]">
            <Compass className="h-10 w-10 text-[#1B2A3A]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1B2A3A] mb-2 uppercase tracking-tight">
            CORE SAMPLE DIG SITE STANDBY
          </h3>
          <p className="text-xs text-[#1B2A3A]/70 max-w-sm text-center mb-6 font-mono">
            CLICK BELOW TO EXCAVATE VERTICAL STRATIGRAPHY OF COBOL CORE SAMPLE.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] hover:bg-[#233549] font-mono text-xs font-bold uppercase tracking-wider transition-all"
          >
            {loading ? 'EXCAVATING STRATA...' : '[START VERTICAL EXCAVATION]'}
          </button>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          colorMode="light"
        >
          <Controls className="!bg-[#EDE6D6] !border-[#1B2A3A] !text-[#1B2A3A] !rounded-[2px] !shadow-none !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Top Controls & Depth Counter */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fitView({ padding: 0.2, duration: 400 })}
            className="px-3.5 py-2 border border-[#1B2A3A] bg-[#EDE6D6] hover:bg-[#E4D9BC] text-[#1B2A3A] font-bold uppercase flex items-center gap-2"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            [RECENTER SURVEY MAP]
          </button>
          <div className="px-3.5 py-2 border border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A] font-bold">
            EXCAVATION DEPTH: <span className="text-[#A8462E]">{excavationDepth * 10}m</span> | STRATA: <span className="text-[#1B2A3A]">5 LAYERS</span>
          </div>
        </div>
      )}

      {/* Surveyor Field Legend (Bottom Left, Non-Overlapping) */}
      <div className="absolute bottom-6 left-6 z-20 p-4 border border-[#1B2A3A] bg-[#EDE6D6] text-xs font-mono flex flex-col gap-2 min-w-[240px]">
        <span className="font-serif font-bold text-[#1B2A3A] uppercase tracking-wider text-[11px] border-b border-[#1B2A3A]/40 pb-1">
          Geological Stratigraphy Legend
        </span>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#E4D9BC] border border-[#1B2A3A]"></span>
          <span>Stratum I: Surface JCL Batch Jobs</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#C9B896] border border-[#1B2A3A]"></span>
          <span>Stratum II: Shared Copybooks</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#A8926B] border border-[#1B2A3A]"></span>
          <span>Stratum III: COBOL Business Logic</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#846D49] border border-[#1B2A3A]"></span>
          <span>Stratum IV: Subprograms & VSAM</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 bg-[#5C4A30] border border-[#1B2A3A]"></span>
          <span className="text-[#A8462E] font-bold">Bedrock: 1970s Primitive COBOL</span>
        </div>
      </div>

    </div>
  );
};

export const StrataGraphView: React.FC<StrataGraphViewProps> = (props) => (
  <ReactFlowProvider>
    <StrataContent {...props} />
  </ReactFlowProvider>
);
