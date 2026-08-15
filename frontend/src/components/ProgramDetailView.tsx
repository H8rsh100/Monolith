import React, { useState } from 'react';
import { ProgramDetail, CodegenResult } from '../api';
import { Code, Sparkles, AlertTriangle, CheckCircle, FileText, Copy, Terminal, Shield, ArrowRight, Table } from 'lucide-react';

interface ProgramDetailViewProps {
  detail: ProgramDetail | null;
  codegen: CodegenResult | null;
  onSummarize: () => void;
  onGenerateCodegen: () => void;
  loading: boolean;
}

export const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({
  detail,
  codegen,
  onSummarize,
  onGenerateCodegen,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'spec' | 'schema' | 'risk' | 'codegen'>('spec');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-slate-400 font-mono">
        Select a program node from the Dependency Graph or Risk Heatmap to view analysis.
      </div>
    );
  }

  const { program, risk, spec } = detail;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Header Banner */}
      <div className="glass-panel p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold font-mono text-white">{program.programName}.cbl</h2>
              <span
                className="risk-badge"
                style={{ backgroundColor: `${risk.color}20`, color: risk.color, borderColor: `${risk.color}40` }}
              >
                {risk.bucket} Risk ({risk.score}/100)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {program.linesOfCode} LOC | {program.paragraphs.length} Paragraphs | {program.calls.length} Subprograms Called
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSummarize}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {spec ? 'Regenerate Spec' : 'Generate LLM Spec'}
          </button>
          <button
            onClick={onGenerateCodegen}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            Generate Modern Python Code
          </button>
        </div>
      </div>

      {/* Main Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
        
        {/* Left Column: COBOL Source Code Viewer */}
        <div className="glass-panel flex flex-col h-full overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-400" />
              COBOL Source Code ({program.linesOfCode} lines)
            </span>
            {program.rawSource && (
              <button
                onClick={() => handleCopy(program.rawSource || '')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/80 leading-relaxed">
            {program.rawSource ? (
              <pre className="whitespace-pre-wrap">
                {program.rawSource.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-slate-900/60 px-1 rounded">
                    <span className="w-10 text-slate-600 select-none text-right pr-4">{idx + 1}</span>
                    <span className={line.trim().startsWith('*') ? 'text-emerald-500/80 italic' : line.trim().startsWith('PROCEDURE') ? 'text-sky-400 font-bold' : ''}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            ) : (
              <div className="text-slate-500 italic">Raw COBOL source stream not available.</div>
            )}
          </div>
        </div>

        {/* Right Column: Spec, Data Schema, Risk & Codegen Intelligence Panel */}
        <div className="glass-panel flex flex-col h-full overflow-hidden">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/50 px-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'spec'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Business Spec
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'schema'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="h-4 w-4" />
              Data Division ({program.dataDivision.length})
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'risk'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-4 w-4" />
              Risk Metrics
            </button>
            <button
              onClick={() => setActiveTab('codegen')}
              className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'codegen'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="h-4 w-4" />
              Generated Code
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="p-5 flex-1 overflow-y-auto space-y-6">
            
            {/* 1. LLM Business Spec Tab */}
            {activeTab === 'spec' && (
              spec ? (
                <div className="space-y-5 text-sm">
                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">Executive Summary</h3>
                    <p className="text-slate-300 leading-relaxed text-xs">{spec.summary}</p>
                  </div>

                  {/* Business Rules */}
                  <div>
                    <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Business Rules & Constraints ({spec.businessRules.length})
                    </h3>
                    <ul className="space-y-2">
                      {spec.businessRules.map((rule, idx) => (
                        <li key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inputs & Outputs Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">Inputs</h4>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {spec.inputs.map((inp, idx) => (
                          <li key={idx} className="font-mono text-[11px]">• {inp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">Outputs</h4>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {spec.outputs.map((out, idx) => (
                          <li key={idx} className="font-mono text-[11px]">• {out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Edge Cases */}
                  {spec.edgeCases.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Edge Cases & Error Handling
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {spec.edgeCases.map((edge, idx) => (
                          <li key={idx} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-200/90 text-xs">
                            {edge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Migration Notes */}
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <h3 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider mb-1">Migration Rationale</h3>
                    <p className="text-xs text-indigo-200/90 leading-relaxed">{spec.migrationNotes}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-10 w-10 text-sky-400 mb-3 animate-pulse" />
                  <p className="text-sm text-slate-300 font-semibold mb-1">No Business Spec Extracted Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mb-4">
                    Click below to trigger LLM business logic reverse-engineering for this program.
                  </p>
                  <button
                    onClick={onSummarize}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md"
                  >
                    Extract Business Spec
                  </button>
                </div>
              )
            )}

            {/* 2. Data Division Schema Tab */}
            {activeTab === 'schema' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  Data division memory layouts, PIC clause formats, and REDEFINES memory mappings.
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                        <th className="py-2.5 px-3">Level</th>
                        <th className="py-2.5 px-3">Field Name</th>
                        <th className="py-2.5 px-3">PIC Clause</th>
                        <th className="py-2.5 px-3">Redefines Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {program.dataDivision.map((field, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="py-2.5 px-3 font-bold text-sky-400">{field.level}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-200">{field.name}</td>
                          <td className="py-2.5 px-3 text-emerald-400">{field.picClause || '-'}</td>
                          <td className="py-2.5 px-3 text-amber-400">{field.redefines ? `REDEFINES ${field.redefines}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Risk Metrics Tab */}
            {activeTab === 'risk' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">Score Breakdown (Composite Score: {risk.score}/100)</h3>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Cyclomatic Complexity (35%)</span>
                        <span>{risk.breakdown.complexityScore} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full" style={{ width: `${Math.min(100, (risk.breakdown.complexityScore / 35) * 100)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Blast Radius - Callers/Callees (30%)</span>
                        <span>{risk.breakdown.blastRadiusScore} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, (risk.breakdown.blastRadiusScore / 30) * 100)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Embedded SQL / CICS Penalty (20%)</span>
                        <span>{risk.breakdown.sqlPenaltyScore} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (risk.breakdown.sqlPenaltyScore / 20) * 100)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Lines of Code (15%)</span>
                        <span>{risk.breakdown.locScore} pts</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (risk.breakdown.locScore / 15) * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">Paragraph Complexity Details</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
                    {program.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-300 font-bold">{p.name}</span>
                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          <span>{p.statementCount} stmts</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${p.cyclomaticComplexity > 5 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                            McCabe: {p.cyclomaticComplexity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Generated Codegen Tab */}
            {activeTab === 'codegen' && (
              codegen ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-mono">
                    Scaffold target code generated from legacy business rules.
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{codegen.stubFilename}</span>
                      <button onClick={() => handleCopy(codegen.stubCode)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                        <Copy className="h-3.5 w-3.5" /> Copy Stub
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
                      {codegen.stubCode}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-purple-400">{codegen.testFilename}</span>
                      <button onClick={() => handleCopy(codegen.testCode)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono">
                        <Copy className="h-3.5 w-3.5" /> Copy Tests
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
                      {codegen.testCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Code className="h-10 w-10 text-sky-400 mb-3" />
                  <p className="text-sm text-slate-300 font-semibold mb-1">No Code Generated Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mb-4">
                    Generate modern Python 3.12 or Java Spring Boot function stubs and test skeletons.
                  </p>
                  <button
                    onClick={onGenerateCodegen}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md"
                  >
                    Generate Modern Code Scaffold
                  </button>
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
