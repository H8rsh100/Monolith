import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown } from 'lucide-react';

interface IOSRiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
}

export const IOSRiskMatrixView: React.FC<IOSRiskMatrixViewProps> = ({
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

  const getBadgeStyle = (score: number) => {
    if (score >= 75) return 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30';
    if (score >= 50) return 'bg-[#FF9500]/20 text-[#FF9500] border-[#FF9500]/30';
    if (score >= 25) return 'bg-[#007AFF]/20 text-[#007AFF] border-[#007AFF]/30';
    return 'bg-[#34C759]/20 text-[#34C759] border-[#34C759]/30';
  };

  return (
    <div className="w-full h-full p-6 bg-black text-slate-100 font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="ios-card p-5 flex items-center justify-between border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#FF9500]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              System Risk Matrix Overview
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates McCabe Cyclomatic Complexity, LOC, DB2 SQL statements, and call graph topology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Total Analyzed:</span>
          <span className="text-[#007AFF] font-bold text-sm bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {programs.length} Programs
          </span>
        </div>
      </div>

      {/* Control Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4 text-xs font-sans">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Filter:</span>
          <div className="flex items-center gap-1 bg-[#2c2c2e] p-1 rounded-xl border border-white/10">
            {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
              <button
                key={b}
                onClick={() => setFilterBucket(b)}
                className={`px-3 py-1 rounded-lg capitalize font-semibold transition-all ${
                  filterBucket === b
                    ? 'bg-[#007AFF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <ArrowUpDown className="h-4 w-4 text-[#007AFF]" />
          <span className="text-slate-400 font-semibold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="score">Risk Score (High to Low)</option>
            <option value="loc">Lines of Code (LOC)</option>
            <option value="paragraphs">Paragraph Count</option>
          </select>
        </div>
      </div>

      {/* Apple iOS Table Card */}
      <div className="ios-card overflow-hidden border-white/10">
        <table className="w-full text-left font-sans text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-semibold">Program Name</th>
              <th className="py-3.5 px-4 font-semibold">Classification</th>
              <th className="py-3.5 px-4 font-semibold">Risk Score</th>
              <th className="py-3.5 px-4 font-semibold">LOC</th>
              <th className="py-3.5 px-4 font-semibold">Paragraphs</th>
              <th className="py-3.5 px-4 font-semibold">DB2 / CICS</th>
              <th className="py-3.5 px-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sorted.map((p) => (
              <tr key={p.programName} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-white">{p.programName}.cbl</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(p.riskScore)}`}>
                    {p.riskBucket}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#007AFF]">{p.riskScore.toFixed(1)} / 100</td>
                <td className="py-3.5 px-4 text-slate-300 font-mono">{p.linesOfCode}</td>
                <td className="py-3.5 px-4 text-slate-300 font-mono">{p.paragraphCount}</td>
                <td className="py-3.5 px-4 font-mono">
                  {p.hasSqlOrCics ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-bold">
                      EXEC SQL
                    </span>
                  ) : (
                    <span className="text-slate-500">None</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onSelectProgram(p.programName)}
                    className="px-3.5 py-1.5 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/25"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
