import React from 'react';
import { Compass, ShieldAlert, Cpu, Code2, Play, RefreshCw, FileText } from 'lucide-react';

interface SurveyorHeaderProps {
  activeTab: 'graph' | 'risk' | 'detail' | 'codegen';
  setActiveTab: (tab: 'graph' | 'risk' | 'detail' | 'codegen') => void;
  onOpenReport: () => void;
  onIngest: () => void;
  onSummarizeAll: () => void;
  loading: boolean;
  selectedProgram?: string;
}

export const SurveyorHeader: React.FC<SurveyorHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onIngest,
  onSummarizeAll,
  loading,
  selectedProgram
}) => {
  return (
    <header className="border-b border-[#1B2A3A]/40 bg-[#EDE6D6] px-6 pt-3 pb-0 flex flex-col gap-2 font-sans relative z-30">
      
      {/* Title & Metadata Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A] rounded-[2px]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#1B2A3A] tracking-tight uppercase flex items-center gap-3">
              MONOLITH <span className="text-[11px] font-mono px-2 py-0.5 border border-[#1B2A3A] bg-[#C9B896] text-[#1B2A3A] uppercase font-bold">COBOL MAINFRAME MODERNIZATION ENGINE</span>
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 border border-[#1B2A3A] bg-[#C9B896] hover:bg-[#A8926B] text-[#1B2A3A] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            [EXECUTIVE REPORT]
          </button>

          <button
            onClick={onSummarizeAll}
            disabled={loading}
            className="px-3 py-1.5 border border-[#1B2A3A] bg-[#E4D9BC] hover:bg-[#C9B896] text-[#1B2A3A] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            [EXTRACT SPECS]
          </button>

          <button
            onClick={onIngest}
            disabled={loading}
            className="px-4 py-1.5 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] hover:bg-[#233549] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            <Play className="h-3 w-3 fill-current" />
            [WEAVE CODEBASE]
          </button>
        </div>
      </div>

      {/* Field Notebook Index Tabs Bar */}
      <div className="flex items-end gap-2 border-b border-[#1B2A3A] mt-1 pt-1 font-mono text-xs overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 border border-[#1B2A3A] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'graph'
              ? 'bg-[#EDE6D6] text-[#1B2A3A] border-b-2 border-b-[#EDE6D6] -mb-[1px] font-bold'
              : 'bg-[#C9B896] text-[#1B2A3A]/70 hover:bg-[#E4D9BC]'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          TAB I: TOPOLOGY MAP
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-2 border border-[#1B2A3A] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'risk'
              ? 'bg-[#EDE6D6] text-[#1B2A3A] border-b-2 border-b-[#EDE6D6] -mb-[1px] font-bold'
              : 'bg-[#C9B896] text-[#1B2A3A]/70 hover:bg-[#E4D9BC]'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          TAB II: RISK MATRIX
        </button>

        <button
          onClick={() => setActiveTab('detail')}
          className={`px-4 py-2 border border-[#1B2A3A] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'detail'
              ? 'bg-[#EDE6D6] text-[#1B2A3A] border-b-2 border-b-[#EDE6D6] -mb-[1px] font-bold'
              : 'bg-[#C9B896] text-[#1B2A3A]/70 hover:bg-[#E4D9BC]'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          TAB III: INSPECTOR {selectedProgram ? `(${selectedProgram})` : ''}
        </button>

        <button
          onClick={() => setActiveTab('codegen')}
          className={`px-4 py-2 border border-[#1B2A3A] border-b-0 rounded-t-[3px] font-bold uppercase transition-all flex items-center gap-2 ${
            activeTab === 'codegen'
              ? 'bg-[#EDE6D6] text-[#1B2A3A] border-b-2 border-b-[#EDE6D6] -mb-[1px] font-bold'
              : 'bg-[#C9B896] text-[#1B2A3A]/70 hover:bg-[#E4D9BC]'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          TAB IV: CODEGEN SCAFFOLD
        </button>

      </div>

    </header>
  );
};
