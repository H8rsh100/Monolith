import React from 'react';
import { ExecutiveReport } from '../api';
import { X, Download, ShieldCheck, Clock, FileCode, Compass } from 'lucide-react';

interface StrataReportModalProps {
  report: ExecutiveReport | null;
  codebaseId: string;
  onClose: () => void;
  onDownload: () => void;
}

export const StrataReportModal: React.FC<StrataReportModalProps> = ({
  report,
  codebaseId,
  onClose,
  onDownload
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2A3A]/80 backdrop-blur-sm font-sans">
      <div className="survey-card-solid w-full max-w-3xl overflow-hidden border-[#1B2A3A] shadow-2xl">
        
        {/* Printed Survey Report Header */}
        <div className="px-6 py-4 border-b border-[#1B2A3A] bg-[#EDE6D6] flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-[#1B2A3A]" />
            <h3 className="font-serif font-bold text-base text-[#1B2A3A] uppercase tracking-wider">
              PRINTED GEOLOGICAL SURVEY REPORT // EXECUTIVE DOCKET
            </h3>
          </div>
          <button onClick={onClose} className="text-[#1B2A3A] hover:bg-[#C9B896] p-1 border border-[#1B2A3A]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Site Map Thumbnail at top of Report */}
        <div className="px-6 py-3 border-b border-[#1B2A3A] bg-[#E4D9BC] flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-[#1B2A3A]">SITE MAP THUMBNAIL: SURVEY GRID VOL. 1804</span>
          <span className="text-[#846D49] font-bold">5 STRATA LAYERS // 12 MARKERS</span>
        </div>

        {/* Report Content Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto text-xs font-mono text-[#1B2A3A] bg-[#EDE6D6]">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border border-[#1B2A3A] bg-[#E4D9BC] text-center">
              <FileCode className="h-5 w-5 text-[#1B2A3A] mx-auto mb-1" />
              <span className="text-[#1B2A3A]/70 text-[10px] uppercase font-bold">TOTAL COBOL LOC</span>
              <div className="text-xl font-bold text-[#1B2A3A] mt-1">{report.summary.totalCobolLoc} LOC</div>
            </div>

            <div className="p-4 border border-[#1B2A3A] bg-[#E4D9BC] text-center">
              <Clock className="h-5 w-5 text-[#B8862E] mx-auto mb-1" />
              <span className="text-[#1B2A3A]/70 text-[10px] uppercase font-bold">MIGRATION EFFORT</span>
              <div className="text-xl font-bold text-[#B8862E] mt-1">{report.summary.estimatedEffortPersonDays} PERSON-DAYS</div>
            </div>

            <div className="p-4 border border-[#1B2A3A] bg-[#E4D9BC] text-center">
              <ShieldCheck className="h-5 w-5 text-[#A8462E] mx-auto mb-1" />
              <span className="text-[#1B2A3A]/70 text-[10px] uppercase font-bold">AVERAGE SYSTEM RISK</span>
              <div className="text-xl font-bold text-[#A8462E] mt-1">{report.summary.averageRiskScore.toFixed(1)} / 100</div>
            </div>
          </div>

          {/* Dotted-Leader Table of Site Portfolio */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#1B2A3A] uppercase border-b border-[#1B2A3A] pb-1 mb-3">
              SITE PORTFOLIO STRATIGRAPHY ({report.summary.totalPrograms} PROGRAM MARKERS)
            </h4>
            
            <div className="space-y-2 font-mono text-xs">
              {report.programDetails.map((pd) => (
                <div key={pd.name} className="flex items-center justify-between p-2 border border-[#1B2A3A]/30 bg-[#E4D9BC]/60">
                  <span className="font-bold text-[#1B2A3A] w-32">{pd.name}.cbl</span>
                  <span className="text-[#1B2A3A]/40 flex-1 px-2 overflow-hidden whitespace-nowrap">. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .</span>
                  <span className="text-[#1B2A3A] font-bold w-20 text-right">{pd.loc} LOC</span>
                  <span className="text-[#A8462E] font-bold w-24 text-right">RISK {pd.riskScore.toFixed(1)}</span>
                  <span className="text-[#B8862E] font-bold w-24 text-right">{pd.effortPersonDays} DAYS</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1B2A3A] bg-[#E4D9BC] flex items-center justify-between font-mono text-xs">
          <span className="text-[#1B2A3A]/70">Target Codebase ID: {codebaseId}</span>
          <button
            onClick={onDownload}
            className="px-5 py-2 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] hover:bg-[#233549] font-bold uppercase transition-all"
          >
            <Download className="h-4 w-4 inline mr-2" />
            [EXPORT SURVEY REPORT JSON]
          </button>
        </div>

      </div>
    </div>
  );
};
