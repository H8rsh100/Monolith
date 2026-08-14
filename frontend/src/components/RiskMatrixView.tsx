import React, { useState } from 'react';
import { ProgramSummary } from '../api';
import { ShieldAlert, ArrowUpDown, Filter, ChevronRight, CheckCircle2, AlertOctagon } from 'lucide-react';

interface RiskMatrixViewProps {
  programs: ProgramSummary[];
  onSelectProgram: (programName: string) => void;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ programs, onSelectProgram }) => {
  const [filterBucket, setFilterBucket] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'riskScore' | 'linesOfCode' | 'paragraphCount'>('riskScore');

  const filteredPrograms = programs
    .filter((p) => filterBucket === 'all' || p.riskBucket.toLowerCase() === filterBucket.toLowerCase())
    .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Risk Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-4 flex items-center justify-between border-emerald-500/30">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Low Risk</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {programs.filter((p) => p.riskBucket === 'Low').length}
            </div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between border-blue-500/30">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Medium Risk</span>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              {programs.filter((p) => p.riskBucket === 'Medium').length}
            </div>
          </div>
          <ShieldAlert className="h-8 w-8 text-blue-500/40" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between border-amber-500/30">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">High Risk</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {programs.filter((p) => p.riskBucket === 'High').length}
            </div>
          </div>
          <ShieldAlert className="h-8 w-8 text-amber-500/40" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between border-red-500/30">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Critical Risk</span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">
              {programs.filter((p) => p.riskBucket === 'Critical').length}
            </div>
          </div>
          <AlertOctagon className="h-8 w-8 text-red-500/40" />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="glass-panel p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-300 font-bold uppercase">Filter Bucket:</span>
          {['all', 'low', 'medium', 'high', 'critical'].map((bucket) => (
            <button
              key={bucket}
              onClick={() => setFilterBucket(bucket)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                filterBucket === bucket
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {bucket}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-300 font-bold uppercase">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="riskScore">Composite Risk Score</option>
            <option value="linesOfCode">Lines of Code (LOC)</option>
            <option value="paragraphCount">Paragraph Complexity</option>
          </select>
        </div>
      </div>

      {/* Program Risk Matrix Table */}
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 font-mono text-xs text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Program Name</th>
              <th className="py-3.5 px-4">Risk Bucket</th>
              <th className="py-3.5 px-4">Risk Score</th>
              <th className="py-3.5 px-4">LOC</th>
              <th className="py-3.5 px-4">Paragraphs</th>
              <th className="py-3.5 px-4">Subprogram Calls</th>
              <th className="py-3.5 px-4">SQL / CICS</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredPrograms.map((p) => (
              <tr
                key={p.programName}
                onClick={() => onSelectProgram(p.programName)}
                className="hover:bg-slate-900/80 transition-all cursor-pointer group"
              >
                <td className="py-4 px-4 font-bold text-white group-hover:text-sky-400 transition-colors">
                  {p.programName}.cbl
                </td>
                <td className="py-4 px-4">
                  <span
                    className="risk-badge"
                    style={{
                      backgroundColor: `${p.riskColor}20`,
                      color: p.riskColor,
                      borderColor: `${p.riskColor}40`
                    }}
                  >
                    {p.riskBucket}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold" style={{ color: p.riskColor }}>
                  {p.riskScore}/100
                </td>
                <td className="py-4 px-4 text-slate-300">{p.linesOfCode}</td>
                <td className="py-4 px-4 text-slate-300">{p.paragraphCount}</td>
                <td className="py-4 px-4 text-slate-300">{p.callCount}</td>
                <td className="py-4 px-4">
                  {p.hasSqlOrCics ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px]">
                      YES
                    </span>
                  ) : (
                    <span className="text-slate-600">NO</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-sky-400 group-hover:translate-x-1 transition-transform">
                    Inspect <ChevronRight className="h-4 w-4" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
