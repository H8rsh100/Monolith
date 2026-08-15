import React from 'react';
import { ExecutiveReport } from '../api';
import { X, Download, ShieldCheck, Clock, FileCode } from 'lucide-react';

interface ExcavationReportModalProps {
  report: ExecutiveReport | null;
  codebaseId: string;
  onClose: () => void;
  onDownload: () => void;
}

export const ExcavationReportModal: React.FC<ExcavationReportModalProps> = ({
  report,
  codebaseId,
  onClose,
  onDownload
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
      <div className="dig-card w-full max-w-3xl overflow-hidden border-sky-500/50 shadow-[0_0_50px_rgba(56,189,248,0.25)]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-sky-500/30 bg-sky-500/10 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-sky-400" />
            <h3 className="font-serif font-bold text-base text-sky-400 uppercase tracking-wider">
              EXCAVATION // EXECUTIVE MIGRATION AUDIT REPORT
            </h3>
          </div>
          <button onClick={onClose} className="text-sky-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs font-mono text-slate-200">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <FileCode className="h-5 w-5 text-sky-400 mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase font-sans">COBOL VOLUME</span>
              <div className="text-xl font-bold text-white mt-1">{report.summary.totalCobolLoc} LOC</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Clock className="h-5 w-5 text-amber-400 mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase font-sans">MIGRATION EFFORT</span>
              <div className="text-xl font-bold text-amber-400 mt-1">{report.summary.estimatedEffortPersonDays} PERSON-DAYS</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <ShieldCheck className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase font-sans">AVERAGE SYSTEM RISK</span>
              <div className="text-xl font-bold text-purple-300 mt-1">{report.summary.averageRiskScore.toFixed(1)} / 100</div>
            </div>
          </div>

          {/* Program Details Table */}
          <div>
            <h4 className="font-bold text-sky-400 uppercase text-xs mb-2">DIG MARKER PORTFOLIO ({report.summary.totalPrograms} PROGRAMS)</h4>
            <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 font-mono text-xs">
              {report.programDetails.map((pd) => (
                <div key={pd.name} className="p-3 flex items-center justify-between bg-white/5 hover:bg-white/10">
                  <span className="font-bold text-sky-400">{pd.name}.cbl</span>
                  <span className="text-slate-400">{pd.loc} LOC</span>
                  <span className="text-slate-400">{pd.paragraphsCount} PARAGRAPHS</span>
                  <span className="text-amber-300 font-bold">RISK: {pd.riskScore.toFixed(1)}</span>
                  <span className="font-bold text-emerald-400">{pd.effortPersonDays} DAYS EFFORT</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">Target Codebase: {codebaseId}</span>
          <button
            onClick={onDownload}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-md shadow-sky-500/25"
          >
            <Download className="h-4 w-4" />
            [EXPORT JSON REPORT]
          </button>
        </div>

      </div>
    </div>
  );
};
