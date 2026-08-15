import React from 'react';
import { ExecutiveReport } from '../api';
import { getThermalColor } from '../utils/thermalColor';
import { X, Download, ShieldCheck, Clock, FileCode, Activity } from 'lucide-react';

interface FloatingReportHUDProps {
  report: ExecutiveReport | null;
  codebaseId: string;
  onClose: () => void;
  onDownload: () => void;
}

export const FloatingReportHUD: React.FC<FloatingReportHUDProps> = ({
  report,
  codebaseId,
  onClose,
  onDownload
}) => {
  if (!report) return null;

  const avgThermal = getThermalColor(report.summary.averageRiskScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-hud w-full max-w-3xl overflow-hidden shadow-[0_0_80px_rgba(45,226,230,0.2)] border-cyanAccent/40 font-sans">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-cyanAccent/20 flex items-center justify-between bg-void/90 font-mono">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-cyanAccent animate-pulse" />
            <h3 className="font-bold text-base text-white tracking-widest uppercase">Executive System Autopsy Audit Report</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-cyanAccent p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-mono text-xs text-slate-300">
          
          {/* Top Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded glass-hud border-slate-800 text-center">
              <FileCode className="h-5 w-5 text-cyanAccent mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase">COBOL Codebase Volume</span>
              <div className="text-xl font-bold text-white mt-1">{report.summary.totalCobolLoc} LOC</div>
            </div>

            <div className="p-4 rounded glass-hud border-slate-800 text-center">
              <Clock className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase">Migration Effort</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{report.summary.estimatedEffortPersonDays} Person-Days</div>
            </div>

            <div className="p-4 rounded glass-hud border-slate-800 text-center">
              <ShieldCheck className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <span className="text-slate-400 text-[10px] uppercase">Average System Risk</span>
              <div className="text-xl font-bold mt-1" style={{ color: avgThermal.hex }}>
                {report.summary.averageRiskScore.toFixed(1)} / 100
              </div>
            </div>
          </div>

          {/* Program Breakdown List */}
          <div>
            <h4 className="font-bold text-cyanAccent uppercase mb-2 tracking-wider text-[11px]">System Portfolio ({report.summary.totalPrograms} Programs Analyzed)</h4>
            <div className="border border-slate-800 rounded overflow-hidden divide-y divide-slate-800">
              {report.programDetails.map((pd) => {
                const pdThermal = getThermalColor(pd.riskScore);
                return (
                  <div key={pd.name} className="p-3 flex items-center justify-between bg-void/50 hover:bg-slate-900/40">
                    <span className="font-bold text-slate-200">{pd.name}.cbl</span>
                    <span className="text-slate-400">{pd.loc} LOC</span>
                    <span className="text-slate-400">{pd.paragraphsCount} Paragraphs</span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: `${pdThermal.hex}20`,
                        color: pdThermal.hex,
                        borderColor: `${pdThermal.hex}50`
                      }}
                    >
                      {pd.riskScore.toFixed(1)} | {pdThermal.statusLabel}
                    </span>
                    <span className="font-bold text-emerald-400">{pd.effortPersonDays} Days Effort</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-void/90 flex items-center justify-between font-mono">
          <span className="text-xs text-slate-500">Codebase Target ID: {codebaseId}</span>
          <button
            onClick={onDownload}
            className="px-4 py-2 rounded bg-cyanAccent/20 border border-cyanAccent/60 text-cyanAccent hover:bg-cyanAccent/30 text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(45,226,230,0.3)] transition-all flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Autopsy Report (JSON)
          </button>
        </div>

      </div>
    </div>
  );
};
