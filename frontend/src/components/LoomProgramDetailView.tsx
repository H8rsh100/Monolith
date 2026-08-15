import React, { useState } from 'react';
import { ProgramDetail, CodegenResult } from '../api';
import { Sparkles, Code, Copy, Table, Shield, CheckCircle, ArrowRight, AlertTriangle, Layers } from 'lucide-react';

interface LoomProgramDetailViewProps {
  detail: ProgramDetail | null;
  codegen: CodegenResult | null;
  onSummarize: () => void;
  onGenerateCodegen: () => void;
  loading: boolean;
}

export const LoomProgramDetailView: React.FC<LoomProgramDetailViewProps> = ({
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
      <div className="flex items-center justify-center h-full bg-[#0a0c16] text-amber-400 font-mono">
        SELECT AN INTERSECTION PROGRAM FROM TOPOLOGY OR RISK MATRIX TO INSPECT COBOL THREADS.
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
    <div className="w-full h-full p-4 linen-backing text-slate-100 font-sans overflow-hidden flex flex-col gap-4">
      
      {/* Header Card */}
      <div className="loom-card p-4 flex items-center justify-between border-amber-500/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-3 font-mono">
              <h2 className="text-base font-bold text-amber-400 gold-glow uppercase">{program.programName}.cbl</h2>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Risk Score: {risk.score.toFixed(1)} / 100
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {program.linesOfCode} LOC | {program.paragraphs.length} PARAGRAPHS | {program.calls.length} SUBPROGRAM CALLS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={onSummarize}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {spec ? '[RE-EXTRACT SPEC]' : '[EXTRACT LLM SPEC]'}
          </button>

          <button
            onClick={onGenerateCodegen}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/25"
          >
            <Code className="h-3.5 w-3.5" />
            [WEAVE CODE]
          </button>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column: COBOL Source Stream */}
        <div className="loom-card flex flex-col overflow-hidden border-amber-500/30 font-mono">
          <div className="p-3 border-b border-white/10 bg-amber-500/10 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400">RAW COBOL SOURCE STREAM [{program.linesOfCode} LOC]</span>
            {program.rawSource && (
              <button onClick={() => handleCopy(program.rawSource || '')} className="text-cyan-300 hover:text-white flex items-center gap-1 text-[11px]">
                <Copy className="h-3.5 w-3.5" />
                {copiedCode ? 'COPIED!' : 'COPY'}
              </button>
            )}
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-amber-200/90 leading-relaxed bg-[#070912]">
            {program.rawSource ? (
              <pre className="whitespace-pre-wrap">
                {program.rawSource.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-white/5 px-1">
                    <span className="w-10 text-slate-600 select-none text-right pr-4">{idx + 1}</span>
                    <span className={line.trim().startsWith('*') ? 'text-slate-500 italic' : line.trim().startsWith('PROCEDURE') ? 'text-amber-400 font-bold' : ''}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            ) : (
              <div className="text-slate-500 italic">Source code stream unavailable.</div>
            )}
          </div>
        </div>

        {/* Right Column: Spec, Schema & Risk Stream */}
        <div className="loom-card flex flex-col overflow-hidden border-amber-500/30 font-sans">
          
          {/* Sub Tab Menu */}
          <div className="p-2 border-b border-white/10 bg-white/5 flex items-center gap-1 font-mono">
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'spec' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> SPEC
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'schema' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Table className="h-3.5 w-3.5" /> SCHEMA ({program.dataDivision.length})
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'risk' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> RISK
            </button>
            <button
              onClick={() => setActiveTab('codegen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'codegen' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Code className="h-3.5 w-3.5" /> CODE
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
            
            {activeTab === 'spec' && (
              spec ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h3 className="text-[11px] font-mono font-bold text-amber-400 uppercase mb-1 gold-glow">System Summary</h3>
                    <p className="text-slate-200 leading-relaxed">{spec.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-mono font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Extracted Business Rules ({spec.businessRules.length})
                    </h3>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {spec.businessRules.map((rule, idx) => (
                        <li key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 flex items-start gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Inputs</h4>
                      <ul className="space-y-1 text-slate-300">
                        {spec.inputs.map((inp, idx) => <li key={idx}>• {inp}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Outputs</h4>
                      <ul className="space-y-1 text-slate-300">
                        {spec.outputs.map((out, idx) => <li key={idx}>• {out}</li>)}
                      </ul>
                    </div>
                  </div>

                  {spec.edgeCases.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-mono font-bold text-red-400 uppercase mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Edge Cases & Vulnerabilities
                      </h3>
                      <ul className="space-y-1 font-mono text-[11px]">
                        {spec.edgeCases.map((edge, idx) => (
                          <li key={idx} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">{edge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-amber-400 font-mono">
                  <p className="mb-3 text-slate-400 font-sans">NO LLM SPECIFICATION EXTRACTED YET.</p>
                  <button onClick={onSummarize} disabled={loading} className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
                    [EXECUTE LLM EXTRACTION]
                  </button>
                </div>
              )
            )}

            {activeTab === 'schema' && (
              <div className="border border-white/10 rounded-xl overflow-hidden font-mono">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-amber-500/10 text-amber-300 uppercase border-b border-white/10">
                      <th className="p-2.5">Level</th>
                      <th className="p-2.5">Field Name</th>
                      <th className="p-2.5">PIC Clause</th>
                      <th className="p-2.5">Redefines</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {program.dataDivision.map((f, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="p-2.5 font-bold text-amber-400">{f.level}</td>
                        <td className="p-2.5 text-white">{f.name}</td>
                        <td className="p-2.5 text-cyan-300">{f.picClause || '-'}</td>
                        <td className="p-2.5 text-purple-400">{f.redefines || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Composite Risk Score</span>
                  <div className="text-2xl font-bold mt-1 text-amber-400 gold-glow">
                    {risk.score.toFixed(1)} / 100.0
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">McCabe Cyclomatic Complexity per Paragraph</span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {program.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                        <span className="font-bold text-slate-200">{p.name}</span>
                        <span className="text-amber-400 font-bold">Complexity: {p.cyclomaticComplexity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'codegen' && (
              codegen ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-amber-400 font-bold">{codegen.stubFilename}</span>
                      <button onClick={() => handleCopy(codegen.stubCode)} className="text-amber-400 hover:text-white text-[11px]">Copy</button>
                    </div>
                    <pre className="p-3 rounded-lg bg-black text-amber-200 text-[11px] max-h-56 overflow-y-auto whitespace-pre-wrap">
                      {codegen.stubCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 font-mono text-xs text-amber-400">
                  <button onClick={onGenerateCodegen} disabled={loading} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-md">
                    [WEAVE MODERN CODE]
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
