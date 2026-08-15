import React from 'react';
import { Network, ShieldAlert, Cpu, Code2, Play, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface NavbarProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  codebaseId: string;
  onIngest: () => void;
  onSummarizeAll: () => void;
  onExportReport: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  codebaseId,
  onIngest,
  onSummarizeAll,
  onExportReport,
  loading,
  selectedProgram
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2 font-mono">
              MONOLITH <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">COBOL AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Legacy Intelligence Engine</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 shadow-inner overflow-x-auto">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'graph'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Dependency Graph
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'risk'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Risk Heatmap
          </button>

          {selectedProgram && (
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'detail'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              Program: {selectedProgram}
            </button>
          )}

          <button
            onClick={() => setActiveTab('codegen')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'codegen'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Codegen Preview
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExportReport}
            className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-[11px] font-mono font-semibold text-purple-300 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Executive Report</span>
          </button>

          <button
            onClick={onSummarizeAll}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-medium text-slate-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Extract Specs</span>
          </button>

          <button
            onClick={onIngest}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className="h-3 w-3 fill-current" />
            Ingest Demo
          </button>
        </div>

      </div>
    </header>
  );
};
