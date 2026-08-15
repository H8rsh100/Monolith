import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown, Terminal } from 'lucide-react';

interface TerminalRiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
}

export const TerminalRiskMatrixView: React.FC<TerminalRiskMatrixViewProps> = ({
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
    <div className="w-full h-full p-6 bg-crtBg text-crtGreen font-mono overflow-y-auto flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="terminal-box p-4 flex items-center justify-between border-crtGreen">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-crtAmber" />
          <div>
            <h2 className="text-base font-bold text-glow-amber uppercase tracking-wider">
              MAINFRAME SYSTEM RISK MATRIX // ANALYSIS TABLE
            </h2>
            <p className="text-xs text-crtGreen/70">
              Evaluates McCabe Cyclomatic Complexity, Blast Radius Topology, DB2 SQL, and LOC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">TOTAL ANALYZED:</span>
          <span className="text-crtAmber font-bold text-sm">[{programs.length} PROGRAMS]</span>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-crtGreen/30 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase font-bold">Filter Risk:</span>
          {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
            <button
              key={b}
              onClick={() => setFilterBucket(b)}
              className={`px-3 py-1 border uppercase font-bold transition-all ${
                filterBucket === b
                  ? 'bg-crtGreen text-black border-crtGreen shadow-[0_0_10px_#00FF66]'
                  : 'border-crtGreen/40 text-crtGreen hover:bg-crtGreen/10'
              }`}
            >
              [{b}]
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-crtAmber" />
          <span className="text-slate-400 font-bold uppercase">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-crtBg border border-crtGreen text-crtGreen rounded px-3 py-1 text-xs focus:outline-none"
          >
            <option value="score">Risk Score (High to Low)</option>
            <option value="loc">Lines of Code (LOC)</option>
            <option value="paragraphs">Paragraph Count</option>
          </select>
        </div>
      </div>

      {/* Main ASCII Terminal Table */}
      <div className="terminal-box overflow-hidden">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-crtGreen bg-crtGreen/10 text-crtGreen uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Program Name</th>
              <th className="py-3 px-4">Risk Classification</th>
              <th className="py-3 px-4">Score Index</th>
              <th className="py-3 px-4">LOC</th>
              <th className="py-3 px-4">Paragraphs</th>
              <th className="py-3 px-4">DB2 / CICS</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-crtGreen/20">
            {sorted.map((p) => {
              const isHigh = p.riskScore >= 50;
              return (
                <tr key={p.programName} className="hover:bg-crtGreen/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-crtGreen tracking-wider">{p.programName}.cbl</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 border text-[11px] font-bold uppercase ${
                      isHigh ? 'border-crtRed text-crtRed bg-crtRed/10' : 'border-crtGreen text-crtGreen bg-crtGreen/10'
                    }`}>
                      {p.riskBucket}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-crtAmber">{p.riskScore.toFixed(1)} / 100</td>
                  <td className="py-3 px-4 text-slate-300">{p.linesOfCode}</td>
                  <td className="py-3 px-4 text-slate-300">{p.paragraphCount}</td>
                  <td className="py-3 px-4 font-bold text-crtCyan">{p.hasSqlOrCics ? 'EXEC SQL' : 'NONE'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectProgram(p.programName)}
                      className="px-3 py-1 border border-crtGreen bg-crtGreen/10 hover:bg-crtGreen text-crtGreen hover:text-black font-bold text-xs transition-all shadow-[0_0_8px_rgba(0,255,102,0.3)]"
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
