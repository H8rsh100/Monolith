import React from 'react';
import { ExecutiveReport } from '../api';
import { X, Download, ShieldCheck, Clock, FileCode, Terminal } from 'lucide-react';

interface TerminalReportModalProps {
  report: ExecutiveReport | null;
  codebaseId: string;
  onClose: () => void;
  onDownload: () => void;
}

export const TerminalReportModal: React.FC<TerminalReportModalProps> = ({
  report,
  codebaseId,
  onClose,
  onDownload
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div className="terminal-box w-full max-w-3xl overflow-hidden border-crtAmber shadow-[0_0_50px_rgba(255,176,0,0.3)]">
        
        {/* Header Bar */}
        <div className="px-6 py-3 border-b border-crtAmber bg-crtAmber/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-crtAmber" />
            <h3 className="font-bold text-sm text-crtAmber tracking-widest uppercase">
              IBM 3270 SYSTEM AUTOPSY AUDIT REPORT // EXECUTIVE SUMMARY
            </h3>
          </div>
          <button onClick={onClose} className="text-crtAmber hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-crtGreen">
          
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 border border-crtGreen bg-crtGreen/5 text-center">
              <FileCode className="h-5 w-5 text-crtGreen mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase">COBOL VOLUME</span>
              <div className="text-lg font-bold text-crtGreen mt-1">{report.summary.totalCobolLoc} LOC</div>
            </div>

            <div className="p-3 border border-crtAmber bg-crtAmber/5 text-center">
              <Clock className="h-5 w-5 text-crtAmber mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase">MIGRATION EFFORT</span>
              <div className="text-lg font-bold text-crtAmber mt-1">{report.summary.estimatedEffortPersonDays} PERSON-DAYS</div>
            </div>

            <div className="p-3 border border-crtCyan bg-crtCyan/5 text-center">
              <ShieldCheck className="h-5 w-5 text-crtCyan mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase">AVERAGE SYSTEM RISK</span>
              <div className="text-lg font-bold text-crtCyan mt-1">{report.summary.averageRiskScore.toFixed(1)} / 100</div>
            </div>
          </div>

          {/* Program Details Table */}
          <div>
            <h4 className="font-bold text-crtAmber uppercase mb-2">PROGRAM PORTFOLIO DETAILS ({report.summary.totalPrograms} PROGRAMS)</h4>
            <div className="border border-crtGreen/40 overflow-hidden divide-y divide-crtGreen/20">
              {report.programDetails.map((pd) => (
                <div key={pd.name} className="p-2.5 flex items-center justify-between bg-crtGreen/5 hover:bg-crtGreen/10">
                  <span className="font-bold text-crtGreen">{pd.name}.cbl</span>
                  <span className="text-slate-300">{pd.loc} LOC</span>
                  <span className="text-slate-300">{pd.paragraphsCount} PARAGRAPHS</span>
                  <span className="text-crtAmber font-bold">RISK: {pd.riskScore.toFixed(1)}</span>
                  <span className="font-bold text-crtCyan">{pd.effortPersonDays} DAYS EFFORT</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-crtAmber/40 bg-black flex items-center justify-between text-xs">
          <span className="text-slate-500">TARGET CODEBASE: {codebaseId}</span>
          <button
            onClick={onDownload}
            className="px-4 py-1.5 border border-crtAmber bg-crtAmber/20 hover:bg-crtAmber text-crtAmber hover:text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(255,176,0,0.3)]"
          >
            <Download className="h-4 w-4" />
            [EXPORT JSON REPORT]
          </button>
        </div>

      </div>
    </div>
  );
};
