import React from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FileCode, Database, Cpu, Layers } from 'lucide-react';

interface GraphViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
}

// Custom Node Renderer with Risk Color Accents & Icons
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const riskColor = (data.riskColor as string) || '#10b981';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const riskBucket = (data.riskBucket as string) || 'Low';

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-emerald-400" />;
      case 'file': return <Database className="h-4 w-4 text-cyan-400" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-purple-400" />;
      default: return <Cpu className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <div
      className="px-4 py-3 rounded-xl border bg-slate-900/90 text-white min-w-[170px] shadow-lg transition-all duration-200 hover:scale-105"
      style={{ borderColor: nodeType === 'program' ? riskColor : '#334155' }}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-3 !h-3" />
      
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-mono font-bold text-sm tracking-wide">{label}</span>
        </div>
      </div>

      {nodeType === 'program' && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">Risk Score:</span>
          <span
            className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
            style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
          >
            {riskScore} ({riskBucket})
          </span>
        </div>
      )}

      {nodeType === 'copybook' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1">Copybook Definition</div>
      )}

      {nodeType === 'file' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1">VSAM / Indexed Dataset</div>
      )}

      {nodeType === 'jcl_job' && (
        <div className="text-[11px] text-slate-400 font-mono mt-1">JCL Batch Job</div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = {
  program: CustomNode,
  copybook: CustomNode,
  file: CustomNode,
  jcl_job: CustomNode
};

export const GraphView: React.FC<GraphViewProps> = ({ graphData, onSelectProgram }) => {
  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => ({
    ...e,
    animated: e.animated ?? true
  }));

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        colorMode="dark"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-white" />
        <MiniMap
          nodeColor={(node) => (node.data?.riskColor as string) || '#38bdf8'}
          maskColor="rgba(15, 23, 42, 0.8)"
          className="!bg-slate-900 !border-slate-800"
        />
      </ReactFlow>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 left-6 p-4 glass-panel border border-slate-800 text-xs font-mono flex flex-col gap-2 shadow-2xl">
        <span className="font-bold text-slate-300 uppercase tracking-wider mb-1">Risk Legend</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Low Risk (0 - 25)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-slate-300">Medium Risk (25 - 50)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-slate-300">High Risk (50 - 75)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-slate-300">Critical Risk (75 - 100)</span>
        </div>
      </div>
    </div>
  );
};
