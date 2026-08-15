import React from 'react';
import { Layers, ShieldAlert, Cpu, Code2, Play, RefreshCw, FileSpreadsheet, Sparkles } from 'lucide-react';

interface LoomHeaderProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const LoomHeader: React.FC<LoomHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="h-16 border-b border-loom-gold/30 bg-[#0a0c16]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 font-sans">
      
      {/* Brand & Ancestry Logo */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/30">
          <Sparkles className="h-5 w-5 text-slate-950" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-amber-400 tracking-wider flex items-center gap-2 gold-glow uppercase">
            THE LOOM <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold lowercase">punch-card woven architecture</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Jacquard Thread Topology & Risk Decoder</p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-[#131930] p-1.5 rounded-xl border border-loom-gold/30 shadow-inner">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'graph'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Woven Topology
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'risk'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Risk Matrix
        </button>

        <button
          onClick={() => setActiveTab('detail')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'detail'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          Inspector {selectedProgram ? `(${selectedProgram})` : ''}
        </button>

        <button
          onClick={() => setActiveTab('codegen')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'codegen'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Codegen
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenReport}
          className="px-3.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono font-bold text-amber-300 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Executive Audit</span>
        </button>

        <button
          onClick={onSummarizeAll}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Extract Specs</span>
        </button>

        <button
          onClick={onIngest}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Weave Codebase
        </button>
      </div>

    </header>
  );
};
