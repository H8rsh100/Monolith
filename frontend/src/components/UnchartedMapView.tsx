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
import { MapPin, Compass, Shield, Maximize2, Lock, Unlock, Castle, Route } from 'lucide-react';

interface UnchartedMapViewProps {
  graphData: { nodes: any[]; edges: any[] };
  onSelectProgram: (programName: string) => void;
  onIngest: () => void;
  loading: boolean;
  fogClearedSet: Set<string>;
}

// Settlement / Outpost Map Marker Component
const SettlementMarkerNode: React.FC<NodeProps> = ({ data }) => {
  const nodeType = (data.nodeType as string) || 'program';
  const label = (data.label as string) || (data.name as string) || 'Node';
  const riskScore = typeof data.riskScore === 'number' ? data.riskScore : 0;
  const isFogCleared = Boolean(data.isFogCleared);

  // Environmental Risk Terrain Assignment
  const getTerrainStyle = (score: number) => {
    if (score >= 60) return { bg: '#8B2E2E', name: 'Danger Marsh', text: 'text-white', isMarsh: true }; // Danger Marsh
    if (score >= 45) return { bg: '#B5623A', name: 'Burnt Clay', text: 'text-white', isMarsh: false }; // Burnt Clay
    if (score >= 25) return { bg: '#C9A24B', name: 'Sandy Amber', text: 'text-[#233348]', isMarsh: false }; // Sandy Amber
    return { bg: '#6B8F5E', name: 'Meadow Green', text: 'text-white', isMarsh: false }; // Muted Meadow
  };

  const terrain = getTerrainStyle(riskScore);

  const getMarkerIcon = () => {
    switch (nodeType) {
      case 'copybook': return <Route className="h-3.5 w-3.5 text-[#233348]" />;
      case 'file': return <Shield className="h-3.5 w-3.5 text-[#233348]" />;
      case 'jcl_job': return <Castle className="h-4 w-4 text-[#233348]" />;
      default: return <MapPin className="h-3.5 w-3.5 text-[#233348]" />;
    }
  };

  return (
    <div className="relative group">
      {/* Environmental Risk Terrain Region Under Settlement */}
      <div
        className={`absolute -inset-3 rounded-xl border border-[#233348]/40 transition-all ${
          terrain.isMarsh ? 'danger-marsh-pattern' : ''
        }`}
        style={{
          backgroundColor: isFogCleared ? terrain.bg : 'rgba(140, 150, 165, 0.4)',
          opacity: isFogCleared ? 0.85 : 0.3
        }}
      />

      {/* Main Settlement Pin Card */}
      <div
        className={`relative px-3.5 py-2 bg-[#F2EAD8] text-[#233348] font-mono text-xs border border-[#233348] rounded-[2px] min-w-[195px] shadow-none transition-all ${
          isFogCleared ? 'hover:bg-[#E6DCB8]' : 'opacity-90'
        }`}
      >
        <Handle type="target" position={Position.Top} className="!bg-[#233348] !w-2 !h-2 !border-none" />

        <div className="flex items-center justify-between gap-2 border-b border-[#233348]/30 pb-1 mb-1 font-bold">
          <div className="flex items-center gap-1.5">
            {getMarkerIcon()}
            <span className="font-mono text-xs tracking-tight uppercase">{label}</span>
          </div>
          {isFogCleared ? (
            <Unlock className="h-3 w-3 text-[#6B8F5E]" />
          ) : (
            <Lock className="h-3 w-3 text-[#8B2E2E]" />
          )}
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#233348]/70 font-sans">{nodeType === 'jcl_job' ? 'FORTRESS HUB' : nodeType.toUpperCase()}</span>
          {nodeType === 'program' && (
            <span className={`font-mono font-bold px-1.5 py-0.2 border rounded-[2px] ${terrain.text}`} style={{ backgroundColor: terrain.bg }}>
              {terrain.name.toUpperCase()}
            </span>
          )}
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-[#233348] !w-2 !h-2 !border-none" />
      </div>

      {/* Translucent Fog of War Overlay covering Undocumented Settlements */}
      {!isFogCleared && (
        <div className="absolute -inset-4 fog-overlay rounded-xl flex items-center justify-center pointer-events-none z-10">
          <div className="px-2 py-1 bg-[#233348] text-[#F2EAD8] font-mono text-[10px] font-bold uppercase rounded-[2px] flex items-center gap-1 shadow-md">
            <Lock className="h-2.5 w-2.5" /> FOG SHROUDED
          </div>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  program: SettlementMarkerNode,
  copybook: SettlementMarkerNode,
  file: SettlementMarkerNode,
  jcl_job: SettlementMarkerNode
};

const MapContent: React.FC<UnchartedMapViewProps> = ({ graphData, onSelectProgram, onIngest, loading, fogClearedSet }) => {
  const { fitView } = useReactFlow();

  const nodes: Node[] = (graphData.nodes || []).map((n) => {
    const pname = (n.data?.name || n.id || '').toUpperCase();
    const isCleared = fogClearedSet.has(pname);

    return {
      ...n,
      type: n.type || 'program',
      data: {
        ...n.data,
        isFogCleared: isCleared
      }
    };
  });

  const edges: Edge[] = (graphData.edges || []).map((e) => ({
    ...e,
    style: {
      stroke: '#233348',
      strokeWidth: 2,
      strokeDasharray: '6 4'
    },
    animated: true
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 200);
    return () => clearTimeout(timer);
  }, [fitView, nodes.length]);

  const handleNodeClick = (_: any, node: Node) => {
    if (node.data && node.data.name && (node.type === 'program' || !node.type)) {
      onSelectProgram(node.data.name as string);
    }
  };

  return (
    <div className="w-full h-full min-h-[650px] relative parchment-bg overflow-hidden font-sans select-none">
      
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F2EAD8]/90 z-20 font-sans">
          <div className="p-4 border border-[#233348] bg-[#E6DCB8] mb-4 rounded-[2px]">
            <Compass className="h-10 w-10 text-[#233348] animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#233348] mb-2 uppercase tracking-tight">
            UNCHARTED TERRITORY STANDBY
          </h3>
          <p className="text-xs text-[#233348]/70 max-w-sm text-center mb-6 font-mono">
            CLICK BELOW TO INITIALIZE EXPEDITION & CHART UNKNOWN COBOL SYSTEM.
          </p>
          <button
            onClick={onIngest}
            disabled={loading}
            className="px-6 py-2.5 border border-[#233348] bg-[#233348] text-[#F2EAD8] hover:bg-[#344861] font-mono text-xs font-bold uppercase tracking-wider transition-all"
          >
            {loading ? 'EXPLORING TERRITORY...' : '[START CARTOGRAPHER EXPEDITION]'}
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
          <Controls className="!bg-[#F2EAD8] !border-[#233348] !text-[#233348] !rounded-[2px] !shadow-none !top-6 !right-6 !left-auto !bottom-auto z-20" />
        </ReactFlow>
      )}

      {/* Top Map Controls */}
      {nodes.length > 0 && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fitView({ padding: 0.2, duration: 400 })}
            className="px-3.5 py-2 border border-[#233348] bg-[#F2EAD8] hover:bg-[#E6DCB8] text-[#233348] font-bold uppercase flex items-center gap-2"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            [RECENTER TERRITORY MAP]
          </button>
          <div className="px-3.5 py-2 border border-[#233348] bg-[#E6DCB8] text-[#233348] font-bold">
            Settlements: <span className="text-[#233348] font-bold">{nodes.length}</span> | Cleared: <span className="text-[#6B8F5E] font-bold">{fogClearedSet.size} / {nodes.length}</span>
          </div>
        </div>
      )}

      {/* Fixed Compass Rose Mini-Legend (Bottom Left, Non-Overlapping) */}
      <div className="absolute bottom-6 left-6 z-20 p-4 border border-[#233348] bg-[#F2EAD8] text-xs font-mono flex flex-col gap-2 min-w-[250px]">
        <div className="flex items-center justify-between border-b border-[#233348]/30 pb-2">
          <span className="font-serif font-bold text-[#233348] uppercase tracking-wider text-[11px]">
            Compass Rose & Risk Terrain
          </span>
          <Compass className="h-6 w-6 text-[#233348] hover:rotate-45 transition-transform duration-500 cursor-pointer" />
        </div>
        
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#6B8F5E] border border-[#233348]"></span>
            <span>Meadow Green (Low Risk Ground)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#C9A24B] border border-[#233348]"></span>
            <span>Sandy Amber (Caution Terrain)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#B5623A] border border-[#233348]"></span>
            <span>Burnt Clay (High Hazard Zone)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm danger-marsh-pattern border border-[#233348]"></span>
            <span className="text-[#8B2E2E] font-bold">Danger Marsh (Critical Danger)</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export const UnchartedMapView: React.FC<UnchartedMapViewProps> = (props) => (
  <ReactFlowProvider>
    <MapContent {...props} />
  </ReactFlowProvider>
);
