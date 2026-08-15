import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown } from 'lucide-react';

interface LoomRiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
}

export const LoomRiskMatrixView: React.FC<LoomRiskMatrixViewProps> = ({
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
    <div className="w-full h-full p-6 linen-backing text-slate-100 font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="loom-card p-5 flex items-center justify-between border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-amber-400 gold-glow uppercase tracking-wider">
              THREAD RISK MATRIX // SYSTEM TOPOLOGY BREAKDOWN
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Evaluates McCabe Cyclomatic Complexity, LOC, DB2 SQL statements, and call graph topology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">Analyzed Programs:</span>
          <span className="text-amber-400 font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
            [{programs.length} PROGRAMS]
          </span>
        </div>
      </div>

      {/* Control Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">Filter:</span>
          <div className="flex items-center gap-1 bg-[#131930] p-1 rounded-xl border border-white/10">
            {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
              <button
                key={b}
                onClick={() => setFilterBucket(b)}
                className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                  filterBucket === b
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                [{b}]
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-amber-400" />
          <span className="text-slate-400 font-bold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#131930] border border-amber-500/30 text-amber-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="score">Risk Score (High to Low)</option>
            <option value="loc">Lines of Code (LOC)</option>
            <option value="paragraphs">Paragraph Count</option>
          </select>
        </div>
      </div>

      {/* Loom Table Card */}
      <div className="loom-card overflow-hidden border-amber-500/30">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-amber-500/10 text-amber-300 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-bold">Program Name</th>
              <th className="py-3.5 px-4 font-bold">Risk Classification</th>
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
                <tr key={p.programName} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-300 tracking-wider">{p.programName}.cbl</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border ${
                      isHigh ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
                    }`}>
                      {p.riskBucket}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">{p.riskScore.toFixed(1)} / 100</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.linesOfCode}</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.paragraphCount}</td>
                  <td className="py-3.5 px-4 font-bold text-purple-400">
                    {p.hasSqlOrCics ? 'EXEC SQL' : 'NONE'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProgram(p.programName)}
                      className="px-3.5 py-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs transition-all shadow-md"
                    >
                      [INSPECT PROGRAM]
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
