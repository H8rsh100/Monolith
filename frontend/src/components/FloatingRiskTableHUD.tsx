import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { getThermalColor } from '../utils/thermalColor';
import { X, ShieldAlert, ArrowUpDown } from 'lucide-react';

interface FloatingRiskTableHUDProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
  onClose: () => void;
}

export const FloatingRiskTableHUD: React.FC<FloatingRiskTableHUDProps> = ({
  programs,
  onSelectProgram,
  onClose
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
    <div className="w-full h-full flex flex-col bg-void/95 border-l border-cyanAccent/30 font-sans overflow-hidden">
      
      {/* HUD Header */}
      <div className="p-4 border-b border-cyanAccent/20 bg-void/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-cyanAccent" />
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">Thermal System Risk Matrix</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-400 p-1.5 rounded" title="Close Panel">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1">
          {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
            <button
              key={b}
              onClick={() => setFilterBucket(b)}
              className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                filterBucket === b
                  ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ArrowUpDown className="h-3.5 w-3.5 text-cyanAccent" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-void border border-slate-800 text-cyanAccent rounded px-2 py-1 focus:outline-none"
          >
            <option value="score">Sort by Risk</option>
            <option value="loc">Sort by LOC</option>
            <option value="paragraphs">Sort by Paragraphs</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="py-2.5 px-2">Program</th>
              <th className="py-2.5 px-2">Thermal Score</th>
              <th className="py-2.5 px-2">LOC</th>
              <th className="py-2.5 px-2">SQL/CICS</th>
              <th className="py-2.5 px-2 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sorted.map((p) => {
              const thermal = getThermalColor(p.riskScore);
              return (
                <tr key={p.programName} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-2.5 px-2 font-bold text-slate-200">{p.programName}.cbl</td>
                  <td className="py-2.5 px-2">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold border"
                      style={{
                        backgroundColor: `${thermal.hex}20`,
                        color: thermal.hex,
                        borderColor: `${thermal.hex}50`
                      }}
                    >
                      {p.riskScore.toFixed(1)} | {thermal.statusLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-slate-300">{p.linesOfCode}</td>
                  <td className="py-2.5 px-2 text-cyanAccent font-bold">{p.hasSqlOrCics ? 'YES' : 'NO'}</td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      onClick={() => onSelectProgram(p.programName)}
                      className="px-2.5 py-1 rounded bg-cyanAccent/15 border border-cyanAccent/40 text-cyanAccent hover:bg-cyanAccent/30 text-[10px] font-bold"
                    >
                      Inspect
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
