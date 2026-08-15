import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown } from 'lucide-react';

interface UnchartedRiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (pname: string) => void;
}

export const UnchartedRiskMatrixView: React.FC<UnchartedRiskMatrixViewProps> = ({
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

  const getTerrainStyle = (score: number) => {
    if (score >= 60) return { bg: 'rgba(139, 46, 46, 0.15)', border: '#8B2E2E', name: 'Danger Marsh', isMarsh: true };
    if (score >= 45) return { bg: 'rgba(181, 98, 58, 0.15)', border: '#B5623A', name: 'Burnt Clay', isMarsh: false };
    if (score >= 25) return { bg: 'rgba(201, 162, 75, 0.15)', border: '#C9A24B', name: 'Sandy Amber', isMarsh: false };
    return { bg: 'rgba(107, 143, 94, 0.15)', border: '#6B8F5E', name: 'Meadow Green', isMarsh: false };
  };

  return (
    <div className="w-full h-full p-6 parchment-bg text-[#233348] font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="map-panel p-5 flex items-center justify-between border-[#233348]">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-[#233348] bg-[#E6DCB8] text-[#233348]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#233348] uppercase tracking-wide">
              RISK TERRAIN LOG // SYSTEM TOPOLOGY ANALYSIS
            </h2>
            <p className="text-xs text-[#233348]/70 font-mono">
              Evaluates McCabe Cyclomatic Complexity, LOC, DB2 SQL statements, and call graph topology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#233348]/70 font-bold uppercase">Mapped Settlements:</span>
          <span className="text-[#233348] font-bold text-sm bg-[#E6DCB8] px-3 py-1 border border-[#233348]">
            [{programs.length} SETTLEMENTS]
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#233348]/30 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#233348]/70 font-bold uppercase">Filter:</span>
          <div className="flex items-center gap-1 bg-[#D9CBAB] p-1 border border-[#233348]">
            {['all', 'low', 'medium', 'high', 'critical'].map((b) => (
              <button
                key={b}
                onClick={() => setFilterBucket(b)}
                className={`px-3 py-1 uppercase font-bold transition-all ${
                  filterBucket === b
                    ? 'bg-[#233348] text-[#F2EAD8]'
                    : 'text-[#233348] hover:bg-[#E6DCB8]'
                }`}
              >
                [{b}]
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-[#233348]" />
          <span className="text-[#233348]/70 font-bold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F2EAD8] border border-[#233348] text-[#233348] px-3 py-1.5 text-xs font-mono focus:outline-none"
          >
            <option value="score">Risk Score (High to Low)</option>
            <option value="loc">Lines of Code (LOC)</option>
            <option value="paragraphs">Paragraph Count</option>
          </select>
        </div>
      </div>

      {/* Cartographer Risk Table */}
      <div className="map-panel overflow-hidden border-[#233348]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#233348] bg-[#E6DCB8] text-[#233348] uppercase tracking-wider text-[11px] font-bold">
              <th className="py-3 px-4">Settlement / Program</th>
              <th className="py-3 px-4">Terrain Swatch</th>
              <th className="py-3 px-4">Risk Index</th>
              <th className="py-3 px-4">LOC</th>
              <th className="py-3 px-4">Paragraphs</th>
              <th className="py-3.5 px-4">DB2 / CICS</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#233348]/20">
            {sorted.map((p) => {
              const terrain = getTerrainStyle(p.riskScore);
              return (
                <tr
                  key={p.programName}
                  className="hover:bg-[#E6DCB8]/50 transition-colors"
                  style={{ backgroundColor: terrain.bg, borderLeft: `6px solid ${terrain.border}` }}
                >
                  <td className="py-3 px-4 font-bold text-[#233348] font-mono">{p.programName}.cbl</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 border border-[#233348] ${terrain.isMarsh ? 'danger-marsh-pattern' : ''}`} style={{ backgroundColor: terrain.border }}></span>
                      <span className="font-sans font-bold text-[11px] uppercase">{terrain.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold font-mono text-[#233348]">{p.riskScore.toFixed(1)} / 100</td>
                  <td className="py-3 px-4 text-[#233348]/80 font-mono">{p.linesOfCode}</td>
                  <td className="py-3 px-4 text-[#233348]/80 font-mono">{p.paragraphCount}</td>
                  <td className="py-3 px-4 font-bold text-[#233348]">
                    {p.hasSqlOrCics ? 'EXEC SQL' : 'NONE'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectProgram(p.programName)}
                      className="px-3.5 py-1 border border-[#233348] bg-[#233348] hover:bg-[#344861] text-[#F2EAD8] font-bold font-mono text-xs uppercase transition-all"
                    >
                      [INSPECT SETTLEMENT]
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
