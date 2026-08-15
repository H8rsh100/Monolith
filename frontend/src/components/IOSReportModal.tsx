import React from 'react';
import { ExecutiveReport } from '../api';
import { X, Download, ShieldCheck, Clock, FileCode } from 'lucide-react';

interface IOSReportModalProps {
  report: ExecutiveReport | null;
  codebaseId: string;
  onClose: () => void;
  onDownload: () => void;
}

export const IOSReportModal: React.FC<IOSReportModalProps> = ({
  report,
  codebaseId,
  onClose,
  onDownload
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="ios-card w-full max-w-3xl overflow-hidden border-white/20 shadow-2xl">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#007AFF]" />
            <h3 className="font-bold text-base text-white tracking-tight">
              Executive Migration Audit Report
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs font-sans text-slate-200">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center font-mono">
              <FileCode className="h-5 w-5 text-[#007AFF] mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase font-sans">COBOL Lines of Code</span>
              <div className="text-xl font-bold text-white mt-1">{report.summary.totalCobolLoc} LOC</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center font-mono">
              <Clock className="h-5 w-5 text-[#34C759] mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase font-sans">Migration Effort</span>
              <div className="text-xl font-bold text-[#34C759] mt-1">{report.summary.estimatedEffortPersonDays} Person-Days</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center font-mono">
              <ShieldCheck className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase font-sans">Average System Risk</span>
              <div className="text-xl font-bold text-purple-300 mt-1">{report.summary.averageRiskScore.toFixed(1)} / 100</div>
            </div>
          </div>

          {/* Program Details Table */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs mb-2">Program Portfolio ({report.summary.totalPrograms} Programs)</h4>
            <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/10 font-mono text-xs">
              {report.programDetails.map((pd) => (
                <div key={pd.name} className="p-3 flex items-center justify-between bg-white/5 hover:bg-white/10">
                  <span className="font-bold text-[#007AFF]">{pd.name}.cbl</span>
                  <span className="text-slate-400">{pd.loc} LOC</span>
                  <span className="text-slate-400">{pd.paragraphsCount} Paragraphs</span>
                  <span className="text-orange-400 font-bold">Risk: {pd.riskScore.toFixed(1)}</span>
                  <span className="font-bold text-[#34C759]">{pd.effortPersonDays} Days Effort</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">Codebase: {codebaseId}</span>
          <button
            onClick={onDownload}
            className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/30"
          >
            <Download className="h-4 w-4" />
            Export Report (JSON)
          </button>
        </div>

      </div>
    </div>
  );
};
