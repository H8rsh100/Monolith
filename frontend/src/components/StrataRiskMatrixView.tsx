import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown } from 'lucide-react';

interface StrataRiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
}

export const StrataRiskMatrixView: React.FC<StrataRiskMatrixViewProps> = ({
  programs,
  onSelectProgram
}) => {
  const [filterBucket, setFilterBucket] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'loc' | 'paragraphs'>('score');

  const filtered = programs.filter((p) => {
    if (filterBucket === 'all') return true;
    return p.riskBucket.toLowerCase() === filterBucket.toLowerCase();
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'loc') return b.linesOfCode - a.linesOfCode;
    if (sortBy === 'paragraphs') return b.paragraphCount - a.paragraphCount;
    return b.riskScore - a.riskScore;
  });

  const getStrataStripeColor = (score: number) => {
    if (score >= 60) return '#5C4A30'; // Bedrock Core
    if (score >= 45) return '#846D49'; // Deep Stratum
    if (score >= 35) return '#A8926B'; // Mid Stratum
    if (score >= 25) return '#C9B896'; // Upper Stratum
    return '#E4D9BC'; // Surface Stratum
  };

  return (
    <div className="w-full h-full p-6 vellum-bg text-[#1B2A3A] font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="survey-card p-5 flex items-center justify-between border-[#1B2A3A]">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#1B2A3A] uppercase tracking-wide">
              SEDIMENT RISK TABLE // STRATA RISK ANALYSIS
            </h2>
            <p className="text-xs text-[#1B2A3A]/70 font-mono">
              Evaluates McCabe Cyclomatic Complexity, LOC, DB2 SQL statements, and call graph topology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#1B2A3A]/70 font-bold uppercase">Program Count:</span>
          <span className="text-[#1B2A3A] font-bold text-sm bg-[#E4D9BC] px-3 py-1 border border-[#1B2A3A]">
            [{programs.length} PROGRAMS]
          </span>
        </div>
      </div>

      {/* Control Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1B2A3A]/30 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#1B2A3A]/70 font-bold uppercase">Filter:</span>
          <div className="flex items-center gap-1 bg-[#C9B896] p-1 border border-[#1B2A3A]">
            {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
              <button
                key={b}
                onClick={() => setFilterBucket(b)}
                className={`px-3 py-1 uppercase font-bold transition-all ${
                  filterBucket === b
                    ? 'bg-[#1B2A3A] text-[#EDE6D6]'
                    : 'text-[#1B2A3A] hover:bg-[#E4D9BC]'
                }`}
              >
                [{b}]
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-[#1B2A3A]" />
          <span className="text-[#1B2A3A]/70 font-bold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#EDE6D6] border border-[#1B2A3A] text-[#1B2A3A] px-3 py-1.5 text-xs font-mono focus:outline-none"
          >
            <option value="score">Risk Score (High to Low)</option>
            <option value="loc">Lines of Code (LOC)</option>
            <option value="paragraphs">Paragraph Count</option>
          </select>
        </div>
      </div>

      {/* Survey Risk Table */}
      <div className="survey-card overflow-hidden border-[#1B2A3A]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A] uppercase tracking-wider text-[11px] font-bold">
              <th className="py-3 px-4">Program Name</th>
              <th className="py-3 px-4">Strata Classification</th>
              <th className="py-3 px-4">Risk Index</th>
              <th className="py-3 px-4">LOC</th>
              <th className="py-3 px-4">Paragraphs</th>
              <th className="py-3.5 px-4">DB2 / CICS</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B2A3A]/20">
            {sorted.map((p) => {
              const isCritical = p.riskScore >= 50;
              const stripeColor = getStrataStripeColor(p.riskScore);
              return (
                <tr key={p.programName} className="hover:bg-[#E4D9BC]/50 transition-colors" style={{ borderLeft: `6px solid ${stripeColor}` }}>
                  <td className="py-3 px-4 font-bold text-[#1B2A3A] font-mono">{p.programName}.cbl</td>
                  <td className="py-3 px-4 font-sans font-bold">
                    <span className={`px-2 py-0.5 border text-[11px] font-mono uppercase ${
                      isCritical ? 'border-[#A8462E] text-[#A8462E] bg-[#A8462E]/10' : 'border-[#B8862E] text-[#B8862E] bg-[#B8862E]/10'
                    }`}>
                      {p.riskBucket}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold font-mono text-[#1B2A3A]">{p.riskScore.toFixed(1)} / 100</td>
                  <td className="py-3 px-4 text-[#1B2A3A]/80 font-mono">{p.linesOfCode}</td>
                  <td className="py-3 px-4 text-[#1B2A3A]/80 font-mono">{p.paragraphCount}</td>
                  <td className="py-3 px-4 font-bold text-[#1B2A3A]">
                    {p.hasSqlOrCics ? 'EXEC SQL' : 'NONE'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectProgram(p.programName)}
                      className="px-3.5 py-1 border border-[#1B2A3A] bg-[#1B2A3A] hover:bg-[#233549] text-[#EDE6D6] font-bold font-mono text-xs uppercase transition-all"
                    >
                      [INSPECT MARKER]
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
