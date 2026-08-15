import React from 'react';
import { ExecutiveReport } from '../api';
import { X, Download, ShieldCheck, Clock, FileCode, Compass, Eye } from 'lucide-react';

interface UnchartedReportModalProps {
  report: ExecutiveReport | null;
  codebaseId: string;
  onClose: () => void;
  onDownload: () => void;
  fogClearedCount: number;
  totalProgramCount: number;
}

export const UnchartedReportModal: React.FC<UnchartedReportModalProps> = ({
  report,
  codebaseId,
  onClose,
  onDownload,
  fogClearedCount,
  totalProgramCount
}) => {
  if (!report) return null;

  const percentExplored = totalProgramCount > 0 ? Math.round((fogClearedCount / totalProgramCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#233348]/80 backdrop-blur-sm font-sans">
      <div className="map-panel-solid w-full max-w-3xl overflow-hidden border-[#233348] shadow-2xl">
        
        {/* Cartographer Survey Document Header */}
        <div className="px-6 py-4 border-b border-[#233348] bg-[#F2EAD8] flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-[#233348]" />
            <h3 className="font-serif font-bold text-base text-[#233348] uppercase tracking-wider">
              CARTOGRAPHER SURVEY REPORT // SYSTEM EXPLORATION DOCKET
            </h3>
          </div>
          <button onClick={onClose} className="text-[#233348] hover:bg-[#D9CBAB] p-1 border border-[#233348]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Map Thumbnail Header with Fog Clearance Ratio */}
        <div className="px-6 py-3 border-b border-[#233348] bg-[#E6DCB8] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 font-bold text-[#233348]">
            <Eye className="h-4 w-4 text-[#6B8F5E]" />
            <span>MAP THUMBNAIL: FOG-CLEARED EXPLORATION SCORE: {percentExplored}%</span>
          </div>
          <span className="text-[#233348] font-bold">CLEARED {fogClearedCount} / {totalProgramCount} SETTLEMENTS</span>
        </div>

        {/* Report Content Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto text-xs font-mono text-[#233348] bg-[#F2EAD8]">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border border-[#233348] bg-[#E6DCB8] text-center">
              <FileCode className="h-5 w-5 text-[#233348] mx-auto mb-1" />
              <span className="text-[#233348]/70 text-[10px] uppercase font-bold">TOTAL COBOL LOC</span>
              <div className="text-xl font-bold text-[#233348] mt-1">{report.summary.totalCobolLoc} LOC</div>
            </div>

            <div className="p-4 border border-[#233348] bg-[#E6DCB8] text-center">
              <Clock className="h-5 w-5 text-[#C9A24B] mx-auto mb-1" />
              <span className="text-[#233348]/70 text-[10px] uppercase font-bold">MIGRATION EFFORT</span>
              <div className="text-xl font-bold text-[#C9A24B] mt-1">{report.summary.estimatedEffortPersonDays} PERSON-DAYS</div>
            </div>

            <div className="p-4 border border-[#233348] bg-[#E6DCB8] text-center">
              <ShieldCheck className="h-5 w-5 text-[#8B2E2E] mx-auto mb-1" />
              <span className="text-[#233348]/70 text-[10px] uppercase font-bold">AVERAGE SYSTEM RISK</span>
              <div className="text-xl font-bold text-[#8B2E2E] mt-1">{report.summary.averageRiskScore.toFixed(1)} / 100</div>
            </div>
          </div>

          {/* Dotted-Leader Portfolio Table */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#233348] uppercase border-b border-[#233348] pb-1 mb-3">
              EXPEDITION SETTLEMENT INVENTORY ({report.summary.totalPrograms} SETTLEMENTS)
            </h4>
            
            <div className="space-y-2 font-mono text-xs">
              {report.programDetails.map((pd) => (
                <div key={pd.name} className="flex items-center justify-between p-2 border border-[#233348]/30 bg-[#E6DCB8]/60">
                  <span className="font-bold text-[#233348] w-32">{pd.name}.cbl</span>
                  <span className="text-[#233348]/40 flex-1 px-2 overflow-hidden whitespace-nowrap">. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .</span>
                  <span className="text-[#233348] font-bold w-20 text-right">{pd.loc} LOC</span>
                  <span className="text-[#8B2E2E] font-bold w-24 text-right">RISK {pd.riskScore.toFixed(1)}</span>
                  <span className="text-[#6B8F5E] font-bold w-24 text-right">{pd.effortPersonDays} DAYS</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#233348] bg-[#E6DCB8] flex items-center justify-between font-mono text-xs">
          <span className="text-[#233348]/70">Target Codebase ID: {codebaseId}</span>
          <button
            onClick={onDownload}
            className="px-5 py-2 border border-[#233348] bg-[#233348] text-[#F2EAD8] hover:bg-[#344861] font-bold uppercase transition-all"
          >
            <Download className="h-4 w-4 inline mr-2" />
            [EXPORT SURVEY REPORT JSON]
          </button>
        </div>

      </div>
    </div>
  );
};
