import React, { useState } from 'react';
import { ProgramDetail, CodegenResult } from '../api';
import { Sparkles, Code, Copy, Table, Shield, CheckCircle, ArrowRight, AlertTriangle, Terminal } from 'lucide-react';

interface TerminalProgramDetailViewProps {
  detail: ProgramDetail | null;
  codegen: CodegenResult | null;
  onSummarize: () => void;
  onGenerateCodegen: () => void;
  loading: boolean;
}

export const TerminalProgramDetailView: React.FC<TerminalProgramDetailViewProps> = ({
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
      <div className="flex items-center justify-center h-full bg-crtBg text-crtGreen font-mono">
        SELECT A PROGRAM FROM TOPOLOGY OR RISK MATRIX TO INSPECT TERMINAL DATA STREAMS.
      </div>
    );
  }

  const { program, risk, spec } = detail;
  const isHighRisk = risk.score >= 50;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full h-full p-4 bg-crtBg text-crtGreen font-mono overflow-hidden flex flex-col gap-4">
      
      {/* Header Banner */}
      <div className="terminal-box p-3 flex items-center justify-between border-crtGreen">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-crtGreen" />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-glow-green uppercase">{program.programName}.cbl</h2>
              <span className={`px-2 py-0.5 border text-xs font-bold ${
                isHighRisk ? 'border-crtRed text-crtRed bg-crtRed/10' : 'border-crtGreen text-crtGreen bg-crtGreen/10'
              }`}>
                RISK SCORE: {risk.score.toFixed(1)} / 100
              </span>
            </div>
            <p className="text-xs text-crtGreen/70">
              {program.linesOfCode} LOC | {program.paragraphs.length} PARAGRAPHS | {program.calls.length} SUBPROGRAM CALLS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSummarize}
            disabled={loading}
            className="px-3 py-1.5 border border-crtAmber text-crtAmber hover:bg-crtAmber/20 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {spec ? '[RE-EXTRACT SPEC]' : '[EXTRACT SPEC]'}
          </button>

          <button
            onClick={onGenerateCodegen}
            disabled={loading}
            className="px-3 py-1.5 border border-crtCyan text-crtCyan bg-crtCyan/10 hover:bg-crtCyan/30 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Code className="h-3.5 w-3.5" />
            [GENERATE CODE]
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column: COBOL Source Stream */}
        <div className="terminal-box flex flex-col overflow-hidden">
          <div className="p-2 border-b border-crtGreen bg-crtGreen/10 flex items-center justify-between text-xs">
            <span className="font-bold text-glow-green">RAW COBOL SOURCE STREAM [{program.linesOfCode} LOC]</span>
            {program.rawSource && (
              <button onClick={() => handleCopy(program.rawSource || '')} className="text-crtGreen hover:text-white flex items-center gap-1 text-[11px]">
                <Copy className="h-3.5 w-3.5" />
                {copiedCode ? 'COPIED!' : 'COPY'}
              </button>
            )}
          </div>
          
          <div className="p-3 flex-1 overflow-y-auto font-mono text-xs text-crtGreen leading-relaxed bg-black/60">
            {program.rawSource ? (
              <pre className="whitespace-pre-wrap">
                {program.rawSource.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-crtGreen/10 px-1">
                    <span className="w-10 text-crtGreen/40 select-none text-right pr-4">{idx + 1}</span>
                    <span className={line.trim().startsWith('*') ? 'text-crtGreen/60 italic' : line.trim().startsWith('PROCEDURE') ? 'text-crtAmber font-bold' : ''}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            ) : (
              <div className="text-crtGreen/50 italic">Source code stream unavailable.</div>
            )}
          </div>
        </div>

        {/* Right Column: Spec, Schema & Risk Stream */}
        <div className="terminal-box flex flex-col overflow-hidden">
          
          {/* Sub Tab Menu */}
          <div className="flex items-center border-b border-crtGreen/30 bg-crtGreen/5 px-2">
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'spec' ? 'border-crtAmber text-crtAmber text-glow-amber' : 'border-transparent text-crtGreen/70 hover:text-crtGreen'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> SPECIFICATION
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'schema' ? 'border-crtAmber text-crtAmber text-glow-amber' : 'border-transparent text-crtGreen/70 hover:text-crtGreen'
              }`}
            >
              <Table className="h-3.5 w-3.5" /> DATA DIVISION ({program.dataDivision.length})
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'risk' ? 'border-crtAmber text-crtAmber text-glow-amber' : 'border-transparent text-crtGreen/70 hover:text-crtGreen'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> RISK METRICS
            </button>
            <button
              onClick={() => setActiveTab('codegen')}
              className={`px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'codegen' ? 'border-crtAmber text-crtAmber text-glow-amber' : 'border-transparent text-crtGreen/70 hover:text-crtGreen'
              }`}
            >
              <Code className="h-3.5 w-3.5" /> MODERN CODE
            </button>
          </div>

          {/* Panel Content */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
            
            {activeTab === 'spec' && (
              spec ? (
                <div className="space-y-4">
                  <div className="border border-crtAmber/40 p-3 bg-crtAmber/5">
                    <h3 className="text-[11px] font-bold text-crtAmber uppercase mb-1">SYSTEM SUMMARY</h3>
                    <p className="text-crtGreen leading-relaxed">{spec.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-crtGreen uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-crtGreen" /> BUSINESS RULES ({spec.businessRules.length})
                    </h3>
                    <ul className="space-y-1.5">
                      {spec.businessRules.map((rule, idx) => (
                        <li key={idx} className="p-2 border border-crtGreen/30 bg-crtGreen/5 text-crtGreen flex items-start gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-crtGreen shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 border border-crtGreen/30 bg-crtGreen/5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">INPUT PARAMETERS</h4>
                      <ul className="space-y-1 text-crtGreen">
                        {spec.inputs.map((inp, idx) => <li key={idx}>- {inp}</li>)}
                      </ul>
                    </div>
                    <div className="p-2.5 border border-crtGreen/30 bg-crtGreen/5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">OUTPUT STRUCTURES</h4>
                      <ul className="space-y-1 text-crtGreen">
                        {spec.outputs.map((out, idx) => <li key={idx}>- {out}</li>)}
                      </ul>
                    </div>
                  </div>

                  {spec.edgeCases.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-bold text-crtRed uppercase mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> EDGE CASES
                      </h3>
                      <ul className="space-y-1 text-crtRed">
                        {spec.edgeCases.map((edge, idx) => (
                          <li key={idx} className="p-2 border border-crtRed/40 bg-crtRed/10">{edge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-crtGreen font-mono">
                  <p className="mb-3 text-slate-400">NO LLM SPECIFICATION EXTRACTED YET.</p>
                  <button onClick={onSummarize} disabled={loading} className="px-4 py-2 border border-crtAmber text-crtAmber hover:bg-crtAmber/20 font-bold">
                    [EXECUTE LLM EXTRACTION]
                  </button>
                </div>
              )
            )}

            {activeTab === 'schema' && (
              <div className="border border-crtGreen/40 overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-crtGreen/10 text-crtGreen uppercase border-b border-crtGreen/40">
                      <th className="p-2">Level</th>
                      <th className="p-2">Field Name</th>
                      <th className="p-2">PIC Clause</th>
                      <th className="p-2">Redefines Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-crtGreen/20">
                    {program.dataDivision.map((f, idx) => (
                      <tr key={idx} className="hover:bg-crtGreen/5">
                        <td className="p-2 font-bold text-crtAmber">{f.level}</td>
                        <td className="p-2 text-crtGreen">{f.name}</td>
                        <td className="p-2 text-crtCyan">{f.picClause || '-'}</td>
                        <td className="p-2 text-crtRed">{f.redefines || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 border border-crtAmber bg-crtAmber/10 text-crtAmber">
                  <span className="text-[10px] uppercase font-bold">COMPOSITE RISK INDEX</span>
                  <div className="text-xl font-bold mt-1 text-glow-amber">
                    {risk.score.toFixed(1)} / 100.0
                  </div>
                </div>

                <div className="p-3 border border-crtGreen/40 bg-crtGreen/5 space-y-2">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">PARAGRAPH MCCABE COMPLEXITY</span>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {program.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex justify-between p-1.5 border border-crtGreen/30 text-[11px]">
                        <span className="font-bold text-crtGreen">{p.name}</span>
                        <span className="text-crtAmber font-bold">MCCABE: {p.cyclomaticComplexity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'codegen' && (
              codegen ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 border border-crtGreen bg-crtGreen/5">
                    <div className="flex justify-between mb-1">
                      <span className="text-crtGreen font-bold">{codegen.stubFilename}</span>
                      <button onClick={() => handleCopy(codegen.stubCode)} className="text-crtGreen hover:text-white text-[10px]">[COPY]</button>
                    </div>
                    <pre className="p-2 bg-black text-crtGreen text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {codegen.stubCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 font-mono text-xs">
                  <button onClick={onGenerateCodegen} disabled={loading} className="px-4 py-2 border border-crtCyan text-crtCyan bg-crtCyan/10 hover:bg-crtCyan/20 font-bold">
                    [GENERATE TARGET CODE]
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
