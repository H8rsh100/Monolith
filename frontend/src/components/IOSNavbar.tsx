import React from 'react';
import { Network, ShieldAlert, Cpu, Code2, Play, RefreshCw, FileSpreadsheet, Sparkles } from 'lucide-react';

interface IOSNavbarProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const IOSNavbar: React.FC<IOSNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#1c1c1e]/80 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-50 font-sans">
      
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
            Monolith <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 font-semibold uppercase">iOS Edition</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">COBOL Modernization Intelligence</p>
        </div>
      </div>

      {/* Apple iOS Segmented Control Bar */}
      <nav className="flex items-center gap-1 bg-[#2c2c2e]/90 p-1.5 rounded-2xl border border-white/10 shadow-inner">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'graph'
              ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          Topology
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'risk'
              ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Risk Matrix
        </button>

        <button
          onClick={() => setActiveTab('detail')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'detail'
              ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          Inspector {selectedProgram ? `(${selectedProgram})` : ''}
        </button>

        <button
          onClick={() => setActiveTab('codegen')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'codegen'
              ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Codegen
        </button>
      </nav>

      {/* Apple Action Pill Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenReport}
          className="px-3.5 py-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-semibold text-purple-300 transition-all flex items-center gap-1.5"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Report</span>
        </button>

        <button
          onClick={onSummarizeAll}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-full border border-white/10 bg-[#2c2c2e] hover:bg-white/10 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Extract Specs</span>
        </button>

        <button
          onClick={onIngest}
          disabled={loading}
          className="px-4 py-1.5 rounded-full bg-[#34C759] hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Play className="h-3 w-3 fill-current" />
          Ingest Demo
        </button>
      </div>

    </header>
  );
};
