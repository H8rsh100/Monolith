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
import { FileCode, Database, Cpu, Layers, Maximize2, Sparkles } from 'lucide-react';

interface LoomTopologyViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Jacquard Loom Intersection Node
const LoomIntersectionNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const isHighRisk = riskScore >= 50;

  const getThreadBadge = () => {
    switch (nodeType) {
      case 'copybook': return <span className="text-[#00f0ff] font-bold">SHARED THREAD</span>;
      case 'file': return <span className="text-[#10b981] font-bold">DATA WEAVE</span>;
      case 'jcl_job': return <span className="text-[#a855f7] font-bold">BATCH STRAND</span>;
      default: return <span className={isHighRisk ? 'text-amber-400 font-bold' : 'text-slate-300'}>PROGRAM INTERSECTION</span>;
    }
  };

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-[#00f0ff]" />;
      case 'file': return <Database className="h-4 w-4 text-[#10b981]" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-[#a855f7]" />;
      default: return <Cpu className={`h-4 w-4 ${isHighRisk ? 'text-amber-400' : 'text-cyan-400'}`} />;
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl loom-card text-white min-w-[210px] font-sans transition-all duration-300 hover:scale-105 group ${
        isHighRisk ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 'border-slate-700'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-3 !h-3 !border-2 !border-[#0a0c16]" />

      <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
            {getIcon()}
          </div>
          <span className="font-mono font-bold text-sm tracking-wide text-slate-100 group-hover:text-amber-300 transition-colors">
            {label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs font-mono">
        <span className="text-[10px] uppercase text-slate-400">{getThreadBadge()}</span>
        {nodeType === 'program' && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
            isHighRisk ? 'border-amber-400/50 bg-amber-500/10 text-amber-300' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
          }`}>
            Risk: {riskScore.toFixed(1)}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !w-3 !h-3 !border-2 !border-[#0a0c16]" />
    </div>
  );
};

const nodeTypes = {
  program: LoomIntersectionNode,
  copybook: LoomIntersectionNode,
  file: LoomIntersectionNode,
  jcl_job: LoomIntersectionNode
};

const TopologyContent: React.FC<LoomTopologyViewProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => {
    const isConnectedToHovered = hoveredNodeId ? (e.source === hoveredNodeId || e.target === hoveredNodeId) : false;
    const isDimmed = hoveredNodeId ? !isConnectedToHovered : false;

    // Golden thread for critical paths/high risk, Cyan for standard, Emerald for data
    const isCritical = e.source.includes('ACCT') || e.target.includes('ACCT');
    const strokeColor = isConnectedToHovered ? '#f59e0b' : isCritical ? '#f59e0b' : '#00f0ff';

    return {
      ...e,
      style: {
        stroke: strokeColor,
        strokeWidth: isConnectedToHovered ? 4 : isCritical ? 2.5 : 2,
        opacity: isDimmed ? 0.15 : 0.9
      },
      animated: true
    };
  });

  useEffect(() => {
    fitView({ padding: 0.25, duration: 300 });
  }, [fitView, nodes.length]);

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-full relative linen-backing overflow-hidden font-sans">
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c16] z-20 font-sans">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4 animate-pulse">
            <Sparkles className="h-10 w-10 text-amber-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-amber-400 mb-2 gold-glow uppercase">
            THE LOOM WEAVE STANDBY
          </h3>
          <p className="text-xs text-slate-400 max-w-sm text-center mb-6 font-mono">
            WEAVE THE DEPENDENCY THREADS OF THE MAINFRAME COBOL & JCL ARCHITECTURE.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
          >
            {loading ? 'WEAVING CODEBASE...' : '[WEAVE ARCHITECTURE THREADS]'}
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
          <Background color="rgba(245, 158, 11, 0.08)" gap={24} size={1.5} />
          <Controls className="!bg-[#131930] !border-amber-500/40 !text-amber-400 !rounded-xl !shadow-2xl !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Top Controls */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 400 })}
            className="px-3.5 py-2 rounded-xl loom-card text-amber-300 font-bold hover:border-amber-400 transition-all flex items-center gap-2 shadow-xl"
          >
            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
            Recenter Loom
          </button>
          <div className="px-3 py-2 rounded-xl loom-card text-slate-300">
            Intersection Nodes: <span className="text-amber-400 font-bold">{nodes.length}</span> | Woven Strands: <span className="text-cyan-400 font-bold">{edges.length}</span>
          </div>
        </div>
      )}

      {/* Loom Thread Legend (Bottom Left, Non-Overlapping) */}
      <div className="absolute bottom-6 left-6 z-10 p-4 loom-card border border-amber-500/40 text-xs font-mono flex flex-col gap-2.5 shadow-2xl min-w-[220px]">
        <span className="font-display font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-0.5 border-b border-white/10 pb-1 gold-glow">
          Jacquard Thread Palette
        </span>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"></span>
          <span className="text-slate-200">Metallic Gold (Critical Path)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
          <span className="text-slate-200">Electric Cyan (Shared Copybook)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#10b981] shadow-[0_0_8px_#10b981]"></span>
          <span className="text-slate-200">Emerald Weave (Indexed VSAM)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-1 bg-[#a855f7] shadow-[0_0_8px_#a855f7]"></span>
          <span className="text-slate-200">Violet Strand (Batch Execution)</span>
        </div>
      </div>

    </div>
  );
};

export const LoomTopologyView: React.FC<LoomTopologyViewProps> = (props) => (
  <ReactFlowProvider>
    <TopologyContent {...props} />
  </ReactFlowProvider>
);
