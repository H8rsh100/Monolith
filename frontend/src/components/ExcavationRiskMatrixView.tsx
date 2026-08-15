import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown } from 'lucide-react';

interface ExcavationRiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
}

export const ExcavationRiskMatrixView: React.FC<ExcavationRiskMatrixViewProps> = ({
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

  return (
    <div className="w-full h-full p-6 topographic-strata text-slate-100 font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="dig-card p-5 flex items-center justify-between border-sky-500/40">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-sky-400 uppercase tracking-wider">
              SEDIMENT RISK MATRIX // STRATA RISK ANALYSIS
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Evaluates McCabe Cyclomatic Complexity, LOC, DB2 SQL statements, and call graph topology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Excavated Markers:</span>
          <span className="text-sky-400 font-bold text-sm bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/30">
            [{programs.length} PROGRAMS]
          </span>
        </div>
      </div>

      {/* Control Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">Filter:</span>
          <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-xl border border-white/10">
            {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
              <button
                key={b}
                onClick={() => setFilterBucket(b)}
                className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                  filterBucket === b
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-sky-300'
                }`}
              >
                [{b}]
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-sky-400" />
          <span className="text-slate-400 font-bold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1e293b] border border-sky-500/30 text-sky-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="score">Risk Score (High to Low)</option>
            <option value="loc">Lines of Code (LOC)</option>
            <option value="paragraphs">Paragraph Count</option>
          </select>
        </div>
      </div>

      {/* Excavation Table Card */}
      <div className="dig-card overflow-hidden border-sky-500/30">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-sky-500/10 text-sky-300 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-bold">Program Name</th>
              <th className="py-3.5 px-4 font-bold">Strata Risk</th>
              <th className="py-3.5 px-4 font-bold">Score Index</th>
              <th className="py-3.5 px-4 font-bold">LOC</th>
              <th className="py-3.5 px-4 font-bold">Paragraphs</th>
              <th className="py-3.5 px-4 font-bold">DB2 / CICS</th>
              <th className="py-3.5 px-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sorted.map((p) => {
              const isHigh = p.riskScore >= 50;
              return (
                <tr key={p.programName} className="hover:bg-sky-500/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-sky-300 tracking-wider">{p.programName}.cbl</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${
                      isHigh ? 'border-amber-500 text-amber-300 bg-amber-500/10' : 'border-sky-500 text-sky-300 bg-sky-500/10'
                    }`}>
                      {p.riskBucket}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-400">{p.riskScore.toFixed(1)} / 100</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.linesOfCode}</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.paragraphCount}</td>
                  <td className="py-3.5 px-4 font-bold text-purple-400">
                    {p.hasSqlOrCics ? 'EXEC SQL' : 'NONE'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProgram(p.programName)}
                      className="px-3.5 py-1.5 rounded-lg border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500 hover:text-slate-950 text-sky-300 font-bold text-xs transition-all shadow-md"
                    >
                      [INSPECT DIG MARKER]
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
