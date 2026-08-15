import React from 'react';
import { Map, ShieldAlert, Compass, Code2, Play, RefreshCw, FileSpreadsheet, Eye } from 'lucide-react';

interface ExpeditionHeaderProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
  fogClearedCount: number;
  totalProgramCount: number;
}

export const ExpeditionHeader: React.FC<ExpeditionHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram,
  fogClearedCount,
  totalProgramCount
}) => {
  const percentExplored = totalProgramCount > 0 ? Math.round((fogClearedCount / totalProgramCount) * 100) : 0;

  return (
    <header className="border-b border-[#233348]/40 bg-[#F2EAD8] px-6 pt-3 pb-0 flex flex-col gap-2 font-sans relative z-30">
      
      {/* Title & Exploration Progress Meter Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#233348] bg-[#E6DCB8] text-[#233348] rounded-[2px]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#233348] tracking-tight uppercase flex items-center gap-3">
              UNCHARTED TERRITORY <span className="text-[11px] font-mono px-2.5 py-0.5 border border-[#233348] bg-[#C9A24B]/30 text-[#233348] uppercase font-bold">VOL. 1804 // CARTOGRAPHER MAP</span>
            </h1>
          </div>
        </div>

        {/* Exploration Progress Meter & Action Controls */}
        <div className="flex items-center gap-4 font-mono text-xs">
          
          {/* Real-time System Fog Clearance Meter */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-[#233348] bg-[#E6DCB8]">
            <Eye className="h-4 w-4 text-[#233348]" />
            <span className="text-[#233348]/70 uppercase font-bold">Territory Explored:</span>
            <span className="text-[#233348] font-bold">{percentExplored}%</span>
            <div className="w-16 h-2 bg-[#233348]/20 border border-[#233348] overflow-hidden ml-1">
              <div className="h-full bg-[#6B8F5E] transition-all duration-500" style={{ width: `${percentExplored}%` }} />
            </div>
          </div>

          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 border border-[#233348] bg-[#D9CBAB] hover:bg-[#C9A24B]/40 text-[#233348] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            [SURVEY REPORT]
          </button>

          <button
            onClick={onSummarizeAll}
            disabled={loading}
            className="px-3 py-1.5 border border-[#233348] bg-[#6B8F5E]/20 hover:bg-[#6B8F5E]/40 text-[#233348] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            [EXTRACT SPECS & LIFT FOG]
          </button>

          <button
            onClick={onIngest}
            disabled={loading}
            className="px-4 py-1.5 border border-[#233348] bg-[#233348] text-[#F2EAD8] hover:bg-[#344861] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className="h-3 w-3 fill-current" />
            [EXPLORE TERRITORY]
          </button>

        </div>
      </div>

      {/* Expedition Log Folded-Corner Index Tabs Bar */}
      <div className="flex items-end gap-2 border-b border-[#233348] mt-1 pt-1 font-mono text-xs overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 border border-[#233348] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'graph'
              ? 'bg-[#F2EAD8] text-[#233348] border-b-2 border-b-[#F2EAD8] -mb-[1px] font-bold'
              : 'bg-[#D9CBAB] text-[#233348]/70 hover:bg-[#E6DCB8]'
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          TAB I: EXPEDITION MAP
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-2 border border-[#233348] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'risk'
              ? 'bg-[#F2EAD8] text-[#233348] border-b-2 border-b-[#F2EAD8] -mb-[1px] font-bold'
              : 'bg-[#D9CBAB] text-[#233348]/70 hover:bg-[#E6DCB8]'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          TAB II: RISK TERRAIN LOG
        </button>

        <button
          onClick={() => setActiveTab('detail')}
          className={`px-4 py-2 border border-[#233348] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'detail'
              ? 'bg-[#F2EAD8] text-[#233348] border-b-2 border-b-[#F2EAD8] -mb-[1px] font-bold'
              : 'bg-[#D9CBAB] text-[#233348]/70 hover:bg-[#E6DCB8]'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          TAB III: SETTLEMENT INSPECTOR {selectedProgram ? `(${selectedProgram})` : ''}
        </button>

        <button
          onClick={() => setActiveTab('codegen')}
          className={`px-4 py-2 border border-[#233348] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'codegen'
              ? 'bg-[#F2EAD8] text-[#233348] border-b-2 border-b-[#F2EAD8] -mb-[1px] font-bold'
              : 'bg-[#D9CBAB] text-[#233348]/70 hover:bg-[#E6DCB8]'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          TAB IV: CODEGEN SCAFFOLD
        </button>

      </div>

    </header>
  );
};
