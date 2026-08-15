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

interface EnterpriseGraphViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Enterprise Custom Node Component
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const riskColor = (data.riskColor as string) || '#10b981';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const riskBucket = (data.riskBucket as string) || 'Low';

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-emerald-400" />;
      case 'file': return <Database className="h-4 w-4 text-sky-400" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-purple-400" />;
      default: return <Cpu className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <div
      className="px-4 py-3 rounded-xl border bg-slate-900/90 text-white min-w-[200px] shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 group font-sans"
      style={{
        borderColor: nodeType === 'program' ? riskColor : '#334155',
        boxShadow: nodeType === 'program' ? `0 0 20px ${riskColor}25` : '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-3 !h-3 !border-2 !border-slate-900" />
      
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
            {getIcon()}
          </div>
          <span className="font-mono font-bold text-sm tracking-wide text-slate-100 group-hover:text-sky-300 transition-colors">
            {label}
          </span>
        </div>
      </div>

      {nodeType === 'program' && (
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Risk Index:</span>
          <span
            className="font-bold px-2 py-0.5 rounded-md text-[11px] border"
            style={{
              backgroundColor: `${riskColor}15`,
              color: riskColor,
              borderColor: `${riskColor}35`
            }}
          >
            {riskScore.toFixed(1)} ({riskBucket})
          </span>
        </div>
      )}

      {nodeType === 'copybook' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>Copybook Layout</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
      )}

      {nodeType === 'file' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1">Indexed VSAM Dataset</div>
      )}

      {nodeType === 'jcl_job' && (
        <div className="text-[11px] text-purple-300/90 font-mono mt-1">Batch Execution Job</div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-3 !h-3 !border-2 !border-slate-900" />
    </div>
  );
};

const nodeTypes = {
  program: CustomNode,
  copybook: CustomNode,
  file: CustomNode,
  jcl_job: CustomNode
};

const GraphContent: React.FC<EnterpriseGraphViewProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();

  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => ({
    ...e,
    animated: e.animated ?? true
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
    <div className="w-full h-full relative bg-slate-950 overflow-hidden font-sans">
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 mb-4 animate-pulse">
            <Sparkles className="h-10 w-10 text-sky-400" />
          </div>
          <h3 className="text-lg font-bold font-mono text-white mb-2">No Codebase Ingested Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm text-center mb-6 font-mono">
            Ingest the demo COBOL & JCL codebase to construct the interactive system dependency graph.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-mono text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
          >
            {loading ? 'Ingesting Codebase...' : 'Ingest Demo Codebase'}
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
          <Background color="#1e293b" gap={24} size={1.5} />
          <Controls className="!bg-slate-900/90 !border-slate-800 !text-slate-300 !rounded-xl !shadow-2xl !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Floating Top Control Bar */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 400 })}
            className="px-3.5 py-2 rounded-xl glass-panel text-xs font-mono font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 shadow-xl"
          >
            <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
            Recenter Graph
          </button>
          <div className="px-3 py-2 rounded-xl glass-panel text-xs font-mono text-slate-400">
            Nodes: <span className="text-white font-bold">{nodes.length}</span> | Edges: <span className="text-white font-bold">{edges.length}</span>
          </div>
        </div>
      )}

      {/* Risk Legend Overlay (Bottom Left, Non-Overlapping) */}
      <div className="absolute bottom-6 left-6 z-10 p-4 glass-panel border border-slate-800/80 text-xs font-mono flex flex-col gap-2.5 shadow-2xl min-w-[200px]">
        <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-0.5 border-b border-slate-800 pb-1">
          System Risk Index
        </span>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500"></span>
          <span className="text-slate-300">Low Risk (0 - 25)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-500"></span>
          <span className="text-slate-300">Medium Risk (25 - 50)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-500"></span>
          <span className="text-slate-300">High Risk (50 - 75)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm shadow-red-500"></span>
          <span className="text-slate-300">Critical Risk (75 - 100)</span>
        </div>
      </div>
    </div>
  );
};

export const EnterpriseGraphView: React.FC<EnterpriseGraphViewProps> = (props) => (
  <ReactFlowProvider>
    <GraphContent {...props} />
  </ReactFlowProvider>
);
