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
import { FileCode, Database, Cpu, Layers, Maximize2, Terminal } from 'lucide-react';

interface TerminalTopologyViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
}

// Retro IBM 3270 Terminal Node
const TerminalNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const isHighRisk = riskScore >= 50;

  const getIcon = () => {
    switch (nodeType) {
      case 'copybook': return <FileCode className="h-4 w-4 text-crtGreen" />;
      case 'file': return <Database className="h-4 w-4 text-crtCyan" />;
      case 'jcl_job': return <Layers className="h-4 w-4 text-crtAmber" />;
      default: return <Cpu className={`h-4 w-4 ${isHighRisk ? 'text-crtRed' : 'text-crtGreen'}`} />;
    }
  };

  return (
    <div
      className={`px-4 py-3 bg-crtBg text-crtGreen font-mono min-w-[200px] border transition-all duration-200 ${
        isHighRisk ? 'border-crtRed shadow-[0_0_15px_rgba(255,51,51,0.4)]' : 'border-crtGreen shadow-[0_0_12px_rgba(0,255,102,0.3)]'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-crtGreen !w-2.5 !h-2.5 !border-2 !border-black" />

      <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-crtGreen/30 pb-1">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className={`font-mono font-bold text-xs tracking-wider uppercase ${isHighRisk ? 'text-crtRed text-shadow' : 'text-crtGreen'}`}>
            {label}
          </span>
        </div>
        <span className="text-[10px] text-crtAmber font-bold">[{nodeType.toUpperCase()}]</span>
      </div>

      {nodeType === 'program' && (
        <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
          <span className="text-slate-400">RISK:</span>
          <span className={`font-bold px-1.5 py-0.5 border text-[11px] ${
            isHighRisk ? 'border-crtRed text-crtRed bg-crtRed/10' : 'border-crtGreen text-crtGreen bg-crtGreen/10'
          }`}>
            {riskScore.toFixed(1)} / 100
          </span>
        </div>
      )}

      {nodeType === 'copybook' && (
        <div className="text-[10px] text-crtGreen/80 font-mono mt-1">COPYBOOK LAYOUT DEFINITION</div>
      )}

      {nodeType === 'file' && (
        <div className="text-[10px] text-crtCyan font-mono mt-1">VSAM INDEXED DATASET</div>
      )}

      {nodeType === 'jcl_job' && (
        <div className="text-[10px] text-crtAmber font-mono mt-1">BATCH EXECUTION JOB</div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-crtGreen !w-2.5 !h-2.5 !border-2 !border-black" />
    </div>
  );
};

const nodeTypes = {
  program: TerminalNode,
  copybook: TerminalNode,
  file: TerminalNode,
  jcl_job: TerminalNode
};

const TopologyContent: React.FC<TerminalTopologyViewProps> = ({ graphData, onSelectProgram, onIngest, loading }) => {
  const { fitView } = useReactFlow();

  const nodes: Node[] = (graphData.nodes || []).map((n) => ({
    ...n,
    type: n.type || 'program'
  }));

  const edges: Edge[] = (graphData.edges || []).map((e) => ({
    ...e,
    style: {
      stroke: '#00FF66',
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
    <div className="w-full h-full relative overflow-hidden bg-crtBg font-mono">
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-crtBg z-20 font-mono">
          <div className="p-4 border border-crtGreen bg-crtGreen/10 text-crtGreen mb-4 animate-pulse">
            <Terminal className="h-10 w-10 text-crtGreen" />
          </div>
          <h3 className="text-lg font-bold text-crtGreen uppercase tracking-widest mb-2 text-glow-green">
            [MAINFRAME TOPOLOGY STANDBY]
          </h3>
          <p className="text-xs text-crtGreen/70 max-w-md text-center mb-6 font-mono">
            PRESS [F7] OR CLICK BELOW TO INITIALIZE COBOL & JCL ARCHITECTURE PARSING SCAN.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2 border border-crtGreen bg-crtGreen/20 hover:bg-crtGreen/40 text-crtGreen font-mono text-xs font-bold tracking-wider shadow-[0_0_20px_#00FF66] transition-all"
          >
            {loading ? 'INGESTING SYSTEM...' : '[EXECUTE SCAN]'}
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
          <Background color="rgba(0, 255, 102, 0.15)" gap={32} size={1} />
          <Controls className="!bg-crtBg !border-crtGreen !text-crtGreen !rounded-none !top-4 !right-4 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Terminal Top Control Strip */}
      {nodes.length > 0 && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fitView({ padding: 0.25, duration: 300 })}
            className="px-3 py-1.5 border border-crtGreen bg-crtBg hover:bg-crtGreen/20 text-crtGreen font-bold flex items-center gap-1.5"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            [RECENTER VIEW]
          </button>
          <div className="px-3 py-1.5 border border-crtGreen/50 bg-crtBg text-crtGreen">
            NODES: <span className="text-crtAmber font-bold">{nodes.length}</span> | EDGES: <span className="text-crtAmber font-bold">{edges.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const TerminalTopologyView: React.FC<TerminalTopologyViewProps> = (props) => (
  <ReactFlowProvider>
    <TopologyContent {...props} />
  </ReactFlowProvider>
);
