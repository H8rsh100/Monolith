import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FileCode, Database, Cpu, Layers, Maximize2, Compass } from 'lucide-react';

interface ExcavationTopologyViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Dig Marker Node Component
const DigMarkerNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const isHighRisk = riskScore >= 50;

  const getStrataBadge = () => {
    switch (nodeType) {
      case 'jcl_job': return <span className="text-purple-300 font-bold">SURFACE JCL STRATUM</span>;
      case 'copybook': return <span className="text-emerald-400 font-bold">SHARED COPYBOOK STRATUM</span>;
      case 'file': return <span className="text-amber-400 font-bold">BEDROCK DATA DATASET</span>;
      default: return <span className={isHighRisk ? 'text-amber-400 font-bold' : 'text-sky-300 font-bold'}>CORE COBOL STRATUM</span>;
    }
  };

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-emerald-400" />;
      case 'file': return <Database className="h-4 w-4 text-amber-400" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-purple-400" />;
      default: return <Cpu className={`h-4 w-4 ${isHighRisk ? 'text-amber-400' : 'text-sky-400'}`} />;
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl dig-card text-white min-w-[210px] font-sans transition-all duration-300 hover:scale-105 group ${
        isHighRisk ? 'border-amber-500 shadow-[0_0_25px_rgba(217,119,6,0.3)]' : 'border-slate-700'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-sky-400 !w-3 !h-3 !border-2 !border-[#0f172a]" />

      <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
            {getIcon()}
          </div>
          <span className="font-mono font-bold text-sm tracking-wide text-slate-100 group-hover:text-sky-300 transition-colors">
            {label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs font-mono">
        <span className="text-[10px] uppercase text-slate-400">{getStrataBadge()}</span>
        {nodeType === 'program' && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
            isHighRisk ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-sky-500/40 bg-sky-500/10 text-sky-300'
          }`}>
            Risk: {riskScore.toFixed(1)}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-sky-400 !w-3 !h-3 !border-2 !border-[#0f172a]" />
    </div>
  );
};

const nodeTypes = {
  program: DigMarkerNode,
  copybook: DigMarkerNode,
  file: DigMarkerNode,
  jcl_job: DigMarkerNode
};

const TopologyContent: React.FC<ExcavationTopologyViewProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => {
    const isConnectedToHovered = hoveredNodeId ? (e.source === hoveredNodeId || e.target === hoveredNodeId) : false;
    const isDimmed = hoveredNodeId ? !isConnectedToHovered : false;

    // Deep architectural ink lines
    const strokeColor = isConnectedToHovered ? '#38bdf8' : '#0284c7';

    return {
      ...e,
      style: {
        stroke: strokeColor,
        strokeWidth: isConnectedToHovered ? 3.5 : 2,
        opacity: isDimmed ? 0.15 : 0.85
      },
      animated: true
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 300 });
    }, 200);
    return () => clearTimeout(timer);
  }, [fitView, nodes.length]);

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] relative topographic-strata overflow-hidden font-sans">
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] z-20 font-sans">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 mb-4 animate-pulse">
            <Compass className="h-10 w-10 text-sky-400" />
          </div>
          <h3 className="text-xl font-serif font-bold text-sky-400 mb-2 uppercase tracking-wider">
            GEOLOGICAL DIG SITE STANDBY
          </h3>
          <p className="text-xs text-slate-400 max-w-sm text-center mb-6 font-mono">
            EXCAVATE DOWN THROUGH STRATA LAYERS TO REACH CORE 1970s COBOL CODEBASE.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
          >
            {loading ? 'EXCAVATING CODEBASE...' : '[START CORE SAMPLE EXCAVATION]'}
          </button>
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
          colorMode="dark"
        >
          <Background color="rgba(56, 189, 248, 0.08)" gap={28} size={1.5} />
          <Controls className="!bg-[#1e293b] !border-sky-500/40 !text-sky-400 !rounded-xl !shadow-2xl !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Top Controls */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 400 })}
            className="px-3.5 py-2 rounded-xl dig-card text-sky-300 font-bold hover:border-sky-400 transition-all flex items-center gap-2 shadow-xl"
          >
            <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
            Recenter Core Sample
          </button>
          <div className="px-3 py-2 rounded-xl dig-card text-slate-300">
            Dig Markers: <span className="text-sky-400 font-bold">{nodes.length}</span> | Contour Lines: <span className="text-amber-400 font-bold">{edges.length}</span>
          </div>
        </div>
      )}

      {/* Geological Strata Legend (Bottom Left, Non-Overlapping) */}
      <div className="absolute bottom-6 left-6 z-10 p-4 dig-card border border-sky-500/40 text-xs font-mono flex flex-col gap-2.5 shadow-2xl min-w-[230px]">
        <span className="font-serif font-bold text-sky-400 uppercase tracking-wider text-[11px] mb-0.5 border-b border-white/10 pb-1">
          Geological Strata Layers
        </span>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#c084fc] shadow-[0_0_8px_#c084fc]"></span>
          <span className="text-slate-200">Layer 1: JCL Batch Surface</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"></span>
          <span className="text-slate-200">Layer 2: COBOL Program Stratum</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#34d399] shadow-[0_0_8px_#34d399]"></span>
          <span className="text-slate-200">Layer 3: Shared Copybook Layout</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]"></span>
          <span className="text-slate-200">Bedrock: Primitive VSAM Data</span>
        </div>
      </div>

    </div>
  );
};

export const ExcavationTopologyView: React.FC<ExcavationTopologyViewProps> = (props) => (
  <ReactFlowProvider>
    <TopologyContent {...props} />
  </ReactFlowProvider>
);
