import React from 'react';
import { Network, ShieldAlert, Cpu, Code2, Play, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface ConsoleHeaderProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
              MONOLITH <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">ENTERPRISE COBOL AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Legacy Modernization & Code Migration Suite</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shadow-inner overflow-x-auto">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'graph'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="h-4 w-4" />
            Architecture Graph
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'risk'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Risk Heatmap Matrix
          </button>

          <button
            onClick={() => setActiveTab('detail')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'detail'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="h-4 w-4" />
            Program Inspector {selectedProgram ? `(${selectedProgram})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('codegen')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'codegen'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="h-4 w-4" />
            Target Codegen Engine
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenReport}
            className="px-3.5 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-mono font-semibold text-purple-300 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Executive Report</span>
          </button>

          <button
            onClick={onSummarizeAll}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Extract Specs</span>
          </button>

          <button
            onClick={onIngest}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Ingest Demo
          </button>
        </div>

      </div>
    </header>
  );
};
