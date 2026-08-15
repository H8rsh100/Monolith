import React from 'react';
import { Network, ShieldAlert, Cpu, Code2, Play, RefreshCw, FileSpreadsheet, Sparkles } from 'lucide-react';

interface StudioHeaderProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0b101b]/95 backdrop-blur-md px-5 flex items-center justify-between sticky top-0 z-50">
      
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/20">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-sm text-white font-mono tracking-tight">MONOLITH</h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold uppercase">
            STUDIO v1.0
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'graph'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          Topology
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'risk'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Risk Matrix
        </button>

        <button
          onClick={() => setActiveTab('detail')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'detail'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          Inspector {selectedProgram ? `(${selectedProgram})` : ''}
        </button>

        <button
          onClick={() => setActiveTab('codegen')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'codegen'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Codegen Engine
        </button>
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenReport}
          className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-mono font-semibold text-purple-300 transition-all flex items-center gap-1.5"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Report
        </button>

        <button
          onClick={onSummarizeAll}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Specs
        </button>

        <button
          onClick={onIngest}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Play className="h-3 w-3 fill-current" />
          Ingest Scan
        </button>
      </div>

    </header>
  );
};
