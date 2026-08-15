import React, { useEffect } from 'react';
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

interface IOSTopologyViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Apple iOS Card Node Component
const IOSNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  
  const getAppleRiskColor = (score: number) => {
    if (score >= 75) return '#FF3B30'; // Apple Red
    if (score >= 50) return '#FF9500'; // Apple Orange
    if (score >= 25) return '#007AFF'; // Apple Blue
    return '#34C759'; // Apple Green
  };

  const riskColor = nodeType === 'program' ? getAppleRiskColor(riskScore) : '#8e8e93';

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-[#34C759]" />;
      case 'file': return <Database className="h-4 w-4 text-[#007AFF]" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-[#AF52DE]" />;
      default: return <Cpu className="h-4 w-4 text-[#007AFF]" />;
    }
  };

  return (
    <div
      className="px-4 py-3 rounded-2xl bg-[#1c1c1e]/90 text-white min-w-[200px] border backdrop-blur-xl transition-all duration-300 hover:scale-105 group font-sans shadow-2xl"
      style={{
        borderColor: nodeType === 'program' ? riskColor : 'rgba(255, 255, 255, 0.15)',
        boxShadow: nodeType === 'program' ? `0 8px 30px ${riskColor}30` : '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-[#1c1c1e]" />

      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/10 border border-white/10">
            {getIcon()}
          </div>
          <span className="font-mono font-bold text-sm tracking-wide text-slate-100 group-hover:text-blue-400 transition-colors">
            {label}
          </span>
        </div>
      </div>

      {nodeType === 'program' && (
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Risk Index:</span>
          <span
            className="font-bold px-2.5 py-0.5 rounded-full text-[11px] border"
            style={{
              backgroundColor: `${riskColor}20`,
              color: riskColor,
              borderColor: `${riskColor}50`
            }}
          >
            {riskScore.toFixed(1)}
          </span>
        </div>
      )}

      {nodeType === 'copybook' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>Copybook Layout</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-ping"></span>
        </div>
      )}

      {nodeType === 'file' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1">VSAM Dataset</div>
      )}

      {nodeType === 'jcl_job' && (
        <div className="text-[11px] text-[#AF52DE] font-mono mt-1">Batch Execution Job</div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-[#1c1c1e]" />
    </div>
  );
};

const nodeTypes = {
  program: IOSNode,
  copybook: IOSNode,
  file: IOSNode,
  jcl_job: IOSNode
};

const TopologyContent: React.FC<IOSTopologyViewProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();

  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => ({
    ...e,
    style: {
      stroke: '#007AFF',
      strokeWidth: 2
    },
    animated: true
  }));

  useEffect(() => {
    fitView({ padding: 0.25, duration: 300 });
  }, [fitView, nodes.length]);

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden font-sans">
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
          <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-4 animate-pulse">
            <Sparkles className="h-10 w-10 text-[#007AFF]" />
          </div>
          <h3 className="text-lg font-bold font-mono text-white mb-2">No System Ingested Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm text-center mb-6 font-mono">
            Tap below to scan and ingest the demo COBOL & JCL banking system.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white font-mono text-xs font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            {loading ? 'Ingesting System...' : 'Ingest Demo System'}
          </button>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          colorMode="dark"
        >
          <Background color="rgba(255, 255, 255, 0.08)" gap={28} size={1.5} />
          <Controls className="!bg-[#1c1c1e]/90 !border-white/10 !text-slate-300 !rounded-2xl !shadow-2xl !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Floating Control Pill */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 400 })}
            className="px-4 py-2 rounded-full ios-glass text-xs font-mono font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2 shadow-xl"
          >
            <Maximize2 className="h-3.5 w-3.5 text-[#007AFF]" />
            Recenter View
          </button>
          <div className="px-4 py-2 rounded-full ios-glass text-xs font-mono text-slate-300">
            Nodes: <span className="text-[#007AFF] font-bold">{nodes.length}</span> | Edges: <span className="text-[#007AFF] font-bold">{edges.length}</span>
          </div>
        </div>
      )}

      {/* Apple Legend Card (Bottom Left, Non-Overlapping) */}
      <div className="absolute bottom-6 left-6 z-10 p-4 ios-glass border border-white/10 text-xs font-mono flex flex-col gap-2.5 shadow-2xl min-w-[200px]">
        <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-0.5 border-b border-white/10 pb-1">
          System Risk Index
        </span>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] shadow-sm"></span>
          <span className="text-slate-300">Low (0 - 25)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF] shadow-sm"></span>
          <span className="text-slate-300">Medium (25 - 50)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF9500] shadow-sm"></span>
          <span className="text-slate-300">High (50 - 75)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-sm"></span>
          <span className="text-slate-300">Critical (75 - 100)</span>
        </div>
      </div>

    </div>
  );
};

export const IOSTopologyView: React.FC<IOSTopologyViewProps> = (props) => (
  <ReactFlowProvider>
    <TopologyContent {...props} />
  </ReactFlowProvider>
);
