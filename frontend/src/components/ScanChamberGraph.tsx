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
  Position,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getThermalColor } from '../utils/thermalColor';
import { FileCode, Database, Cpu, Layers, Maximize2, Activity } from 'lucide-react';

interface ScanChamberGraphProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Thermal Diagnostic Node Component
const DiagnosticNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  
  const thermal = getThermalColor(riskScore);

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-emerald-400" />;
      case 'file': return <Database className="h-4 w-4 text-cyanAccent" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-purple-400" />;
      default: return <Cpu className="h-4 w-4" style={{ color: thermal.hex }} />;
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg text-white min-w-[200px] glass-hud glass-hud-hover relative node-ripple-target ${nodeType === 'program' ? thermal.pulseClass : ''}`}
      style={{
        borderColor: nodeType === 'program' ? thermal.hex : 'rgba(45, 226, 230, 0.3)',
        boxShadow: nodeType === 'program' ? `0 0 20px ${thermal.glow}` : '0 0 15px rgba(45,226,230,0.15)',
        '--node-glow-color': thermal.glow
      } as React.CSSProperties}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyanAccent !w-2.5 !h-2.5 !border-2 !border-void" />

      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-void/80 border border-slate-800">
            {getIcon()}
          </div>
          <span className="font-mono font-bold text-xs tracking-wider text-slate-100 uppercase">
            {label}
          </span>
        </div>
      </div>

      {nodeType === 'program' && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
          <span className="text-slate-400 uppercase">Thermal Index:</span>
          <span
            className="font-mono font-bold px-2 py-0.5 rounded text-[11px] border"
            style={{
              backgroundColor: `${thermal.hex}20`,
              color: thermal.hex,
              borderColor: `${thermal.hex}50`
            }}
          >
            {riskScore.toFixed(1)} | {thermal.statusLabel}
          </span>
        </div>
      )}

      {nodeType === 'copybook' && (
        <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>Copybook Definition</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      )}

      {nodeType === 'file' && (
        <div className="text-[10px] text-cyanAccent/80 font-mono mt-1">Indexed VSAM Target</div>
      )}

      {nodeType === 'jcl_job' && (
        <div className="text-[10px] text-purple-400 font-mono mt-1">Batch Execution Job</div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-cyanAccent !w-2.5 !h-2.5 !border-2 !border-void" />
    </div>
  );
};

const nodeTypes = {
  program: DiagnosticNode,
  copybook: DiagnosticNode,
  file: DiagnosticNode,
  jcl_job: DiagnosticNode
};

const ScanChamberContent: React.FC<ScanChamberGraphProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();

  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => {
    const sourceNode = nodes.find(nd => nd.id === e.source);
    const score = sourceNode?.data?.riskScore ? Number(sourceNode.data.riskScore) : 20;
    const thermal = getThermalColor(score);

    return {
      ...e,
      style: {
        stroke: thermal.hex,
        strokeWidth: 2,
        opacity: 0.85
      },
      animated: true
    };
  });

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-void">
      
      {/* Circular Scan Chamber Overlay */}
      <div className="scan-chamber-ring" />
      <div className="absolute inset-0 pointer-events-none border border-cyanAccent/10 rounded-full scale-125" />
      
      {/* Chamber Crosshairs */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-cyanAccent/10 pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyanAccent/10 pointer-events-none" />

      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void/90 z-20">
          <div className="p-4 rounded-full bg-cyanAccent/10 border border-cyanAccent/30 mb-4 animate-pulse">
            <Activity className="h-10 w-10 text-cyanAccent" />
          </div>
          <h3 className="text-lg font-bold font-mono text-cyanAccent uppercase tracking-widest mb-2">Scan Chamber Standby</h3>
          <p className="text-xs text-slate-400 max-w-sm text-center mb-6 font-mono">
            Initialize diagnostic imaging scan on the legacy COBOL & JCL system.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 rounded bg-cyanAccent/20 hover:bg-cyanAccent/30 border border-cyanAccent/60 text-cyanAccent font-mono text-xs font-bold tracking-wider shadow-[0_0_25px_rgba(45,226,230,0.3)] transition-all flex items-center gap-2"
          >
            {loading ? 'Executing Diagnostic Scan...' : 'Start System Autopsy'}
          </button>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          colorMode="dark"
        >
          <Background color="rgba(45, 226, 230, 0.08)" gap={32} size={1} />
          
          <Controls className="!bg-void/90 !border-cyanAccent/30 !text-cyanAccent !rounded-md !shadow-[0_0_20px_rgba(45,226,230,0.2)] !top-6 !right-6 !left-auto !bottom-auto" />
          
          <MiniMap
            nodeColor={(node) => getThermalColor(node.data?.riskScore as number || 0).hex}
            maskColor="rgba(5, 5, 6, 0.9)"
            className="!bg-void/90 !border-cyanAccent/30 !rounded-md !shadow-[0_0_20px_rgba(45,226,230,0.2)] !bottom-6 !right-6"
          />
        </ReactFlow>
      )}

      {/* Chamber Header & Controls */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-20 z-10 flex items-center gap-3">
          <button
            onClick={() => fitView({ padding: 0.3, duration: 400 })}
            className="px-3.5 py-1.5 rounded glass-hud text-xs font-mono font-semibold text-cyanAccent hover:border-cyanAccent/60 transition-all flex items-center gap-2"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Recenter Scan
          </button>
          <div className="px-3.5 py-1.5 rounded glass-hud text-xs font-mono text-slate-300">
            System Nodes: <span className="text-cyanAccent font-bold">{nodes.length}</span> | Dependency Edges: <span className="text-cyanAccent font-bold">{edges.length}</span>
          </div>
        </div>
      )}

      {/* Thermal Gradient Legend HUD Overlay */}
      <div className="absolute bottom-6 left-20 z-10 p-3.5 glass-hud text-xs font-mono flex flex-col gap-2 min-w-[240px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-cyanAccent uppercase text-[10px] tracking-widest">Thermal Spectrum</span>
          <span className="text-[10px] text-slate-400 font-mono">0°C → 100°C</span>
        </div>
        
        {/* Continuous Thermal Bar */}
        <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-[#1E3A8A] via-[#0891B2] via-[#22C55E] via-[#EAB308] via-[#F97316] to-[#EF4444] shadow-inner" />

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>SAFE (0)</span>
          <span>MODERATE (50)</span>
          <span className="text-red-400 font-bold">HOT (100)</span>
        </div>
      </div>

    </div>
  );
};

export const ScanChamberGraph: React.FC<ScanChamberGraphProps> = (props) => (
  <ReactFlowProvider>
    <ScanChamberContent {...props} />
  </ReactFlowProvider>
);
