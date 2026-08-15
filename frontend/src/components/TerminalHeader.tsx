import React from 'react';
import { Terminal, ShieldAlert, Cpu, Code2, FileSpreadsheet, Play, RefreshCw } from 'lucide-react';

interface TerminalHeaderProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="border-b border-crtGreen/40 bg-crtBg/95 backdrop-blur px-4 py-2 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,255,102,0.15)] font-mono">
      
      {/* Top Banner Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 border border-crtGreen bg-crtGreen/10 text-crtGreen text-xs font-bold tracking-widest text-glow-green">
            IBM 3270 CRT
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wider text-glow-green uppercase flex items-center gap-2">
              MONOLITH <span className="text-crtAmber text-glow-amber text-xs">[COBOL/JCL INTELLIGENCE ENGINE]</span>
            </h1>
          </div>
        </div>

        {/* Terminal Quick Status Indicator */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-crtGreen shadow-[0_0_8px_#00FF66] animate-pulse"></span>
            <span className="text-crtGreen font-bold tracking-wider">ONLINE // SYSTEM NORMAL</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-crtAmber">PORT 8001</span>
        </div>
      </div>

      {/* Function Key Menu Bar */}
      <div className="flex items-center justify-between border-t border-crtGreen/20 pt-2 flex-wrap gap-2 text-xs">
        
        {/* Function Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1 border transition-all flex items-center gap-1.5 ${
              activeTab === 'graph'
                ? 'bg-crtGreen text-black font-bold border-crtGreen shadow-[0_0_12px_#00FF66]'
                : 'border-crtGreen/40 text-crtGreen hover:bg-crtGreen/10'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            [F1] TOPOLOGY
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1 border transition-all flex items-center gap-1.5 ${
              activeTab === 'risk'
                ? 'bg-crtGreen text-black font-bold border-crtGreen shadow-[0_0_12px_#00FF66]'
                : 'border-crtGreen/40 text-crtGreen hover:bg-crtGreen/10'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            [F2] RISK MATRIX
          </button>

          <button
            onClick={() => setActiveTab('detail')}
            className={`px-3 py-1 border transition-all flex items-center gap-1.5 ${
              activeTab === 'detail'
                ? 'bg-crtGreen text-black font-bold border-crtGreen shadow-[0_0_12px_#00FF66]'
                : 'border-crtGreen/40 text-crtGreen hover:bg-crtGreen/10'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            [F3] {selectedProgram ? selectedProgram : 'INSPECTOR'}
          </button>

          <button
            onClick={() => setActiveTab('codegen')}
            className={`px-3 py-1 border transition-all flex items-center gap-1.5 ${
              activeTab === 'codegen'
                ? 'bg-crtGreen text-black font-bold border-crtGreen shadow-[0_0_12px_#00FF66]'
                : 'border-crtGreen/40 text-crtGreen hover:bg-crtGreen/10'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            [F4] CODEGEN
          </button>
        </div>

        {/* Function Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReport}
            className="px-2.5 py-1 border border-crtAmber/60 text-crtAmber hover:bg-crtAmber/20 font-bold flex items-center gap-1 transition-all"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            [F5] REPORT
          </button>

          <button
            onClick={onSummarizeAll}
            disabled={loading}
            className="px-2.5 py-1 border border-crtGreen/40 text-crtGreen hover:bg-crtGreen/10 flex items-center gap-1 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            [F6] SPECS
          </button>

          <button
            onClick={onIngest}
            disabled={loading}
            className="px-3 py-1 border border-crtCyan text-crtCyan bg-crtCyan/10 hover:bg-crtCyan/30 font-bold flex items-center gap-1 transition-all disabled:opacity-50 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <Play className="h-3 w-3 fill-current" />
            [F7] INGEST SCAN
          </button>
        </div>

      </div>

    </header>
  );
};
