import React from 'react';
import { Network, ShieldAlert, Cpu, Code2, Play, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  codebaseId: string;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  codebaseId,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              MONOLITH <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">COBOL AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Legacy Intelligence & Migration Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'graph'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="h-4 w-4" />
            Dependency Graph
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'risk'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Risk Heatmap
          </button>

          {selectedProgram && (
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'detail'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="h-4 w-4" />
              Program: {selectedProgram}
            </button>
          )}

          <button
            onClick={() => setActiveTab('codegen')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'codegen'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="h-4 w-4" />
            Codegen Preview
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSummarizeAll}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Extract Specs
          </button>

          <button
            onClick={onIngest}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Ingest Demo
          </button>
        </div>

      </div>
    </header>
  );
};
