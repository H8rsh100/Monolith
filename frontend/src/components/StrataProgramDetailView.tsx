import React, { useState } from 'react';
import { ProgramDetail, CodegenResult } from '../api';
import { Sparkles, Code, Copy, Table, Shield, CheckCircle, ArrowRight, AlertTriangle, Compass } from 'lucide-react';

interface StrataProgramDetailViewProps {
  detail: ProgramDetail | null;
  codegen: CodegenResult | null;
  onSummarize: () => void;
  onGenerateCodegen: () => void;
  loading: boolean;
}

export const StrataProgramDetailView: React.FC<StrataProgramDetailViewProps> = ({
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
      <div className="flex items-center justify-center h-full vellum-bg text-[#1B2A3A] font-mono">
        SELECT A DIG MARKER FROM CORE SAMPLE GRAPH TO INSPECT ANNOTATED CORE-SAMPLE LOG.
      </div>
    );
  }

  const { program, risk, spec } = detail;
  const isCritical = risk.score >= 50;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full h-full p-4 vellum-bg text-[#1B2A3A] font-sans overflow-hidden flex flex-col gap-4">
      
      {/* Header Banner */}
      <div className="survey-card p-4 flex items-center justify-between border-[#1B2A3A]">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-3 font-mono">
              <h2 className="text-base font-serif font-bold text-[#1B2A3A] uppercase">{program.programName}.cbl</h2>
              <span className={`px-2.5 py-0.5 border text-xs font-bold ${
                isCritical ? 'border-[#A8462E] text-[#A8462E] bg-[#A8462E]/10' : 'border-[#B8862E] text-[#B8862E] bg-[#B8862E]/10'
              }`}>
                DEPTH RISK INDEX: {risk.score.toFixed(1)} / 100
              </span>
            </div>
            <p className="text-xs text-[#1B2A3A]/70 font-mono">
              {program.linesOfCode} LOC | {program.paragraphs.length} PARAGRAPHS | {program.calls.length} CALL RELATIONSHIPS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={onSummarize}
            disabled={loading}
            className="px-3.5 py-1.5 border border-[#1B2A3A] bg-[#C9B896] hover:bg-[#A8926B] text-[#1B2A3A] font-bold uppercase transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {spec ? '[RE-EXTRACT SPEC]' : '[EXTRACT LLM SPEC]'}
          </button>

          <button
            onClick={onGenerateCodegen}
            disabled={loading}
            className="px-3.5 py-1.5 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] hover:bg-[#233549] font-bold uppercase transition-all"
          >
            <Code className="h-3.5 w-3.5" />
            [EXCAVATE CODE]
          </button>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column: COBOL Source Stream as Annotated Core-Sample Log with Vertical Depth Ruler */}
        <div className="survey-card flex flex-col overflow-hidden border-[#1B2A3A]">
          <div className="p-3 border-b border-[#1B2A3A] bg-[#E4D9BC] flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#1B2A3A]">ANNOTATED CORE-SAMPLE LOG STREAM [{program.linesOfCode} LOC]</span>
            {program.rawSource && (
              <button onClick={() => handleCopy(program.rawSource || '')} className="text-[#1B2A3A] hover:underline flex items-center gap-1 font-bold">
                <Copy className="h-3.5 w-3.5" />
                {copiedCode ? 'COPIED!' : '[COPY LOG]'}
              </button>
            )}
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-[#1B2A3A] leading-relaxed bg-[#EDE6D6]">
            {program.rawSource ? (
              <pre className="whitespace-pre-wrap">
                {program.rawSource.split('\n').map((line, idx) => {
                  const depthMeters = (idx + 1) * 2;
                  return (
                    <div key={idx} className="flex hover:bg-[#E4D9BC]/80 px-1 border-b border-[#1B2A3A]/10">
                      {/* Vertical Depth Ruler Marker */}
                      <span className="w-16 text-[#846D49] font-bold select-none text-right pr-3 border-r border-[#1B2A3A]/30 mr-3 text-[10px]">
                        {depthMeters}m
                      </span>
                      <span className={line.trim().startsWith('*') ? 'text-[#846D49] italic' : line.trim().startsWith('PROCEDURE') ? 'text-[#A8462E] font-bold' : ''}>
                        {line}
                      </span>
                    </div>
                  );
                })}
              </pre>
            ) : (
              <div className="text-[#846D49] italic">Core sample log stream unavailable.</div>
            )}
          </div>
        </div>

        {/* Right Column: Spec, Schema & Risk Stream */}
        <div className="survey-card flex flex-col overflow-hidden border-[#1B2A3A] font-sans">
          
          {/* Sub Tab Menu */}
          <div className="p-2 border-b border-[#1B2A3A] bg-[#C9B896] flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#1B2A3A] transition-all flex items-center gap-1.5 ${
                activeTab === 'spec' ? 'bg-[#EDE6D6] text-[#1B2A3A]' : 'bg-[#E4D9BC] text-[#1B2A3A]/70'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> SPEC
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#1B2A3A] transition-all flex items-center gap-1.5 ${
                activeTab === 'schema' ? 'bg-[#EDE6D6] text-[#1B2A3A]' : 'bg-[#E4D9BC] text-[#1B2A3A]/70'
              }`}
            >
              <Table className="h-3.5 w-3.5" /> SCHEMA ({program.dataDivision.length})
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#1B2A3A] transition-all flex items-center gap-1.5 ${
                activeTab === 'risk' ? 'bg-[#EDE6D6] text-[#1B2A3A]' : 'bg-[#E4D9BC] text-[#1B2A3A]/70'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> RISK
            </button>
            <button
              onClick={() => setActiveTab('codegen')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#1B2A3A] transition-all flex items-center gap-1.5 ${
                activeTab === 'codegen' ? 'bg-[#EDE6D6] text-[#1B2A3A]' : 'bg-[#E4D9BC] text-[#1B2A3A]/70'
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
                  <div className="p-3.5 border border-[#1B2A3A] bg-[#E4D9BC]">
                    <h3 className="text-[11px] font-mono font-bold text-[#1B2A3A] uppercase mb-1">Field Notebook Summary</h3>
                    <p className="text-[#1B2A3A] leading-relaxed">{spec.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-mono font-bold text-[#1B2A3A] uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-[#5C4A30]" /> Extracted Business Rules ({spec.businessRules.length})
                    </h3>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {spec.businessRules.map((rule, idx) => (
                        <li key={idx} className="p-2.5 border border-[#1B2A3A]/40 bg-[#EDE6D6] text-[#1B2A3A] flex items-start gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-[#1B2A3A] shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-3 border border-[#1B2A3A]/40 bg-[#E4D9BC]">
                      <h4 className="text-[10px] font-bold text-[#1B2A3A]/70 uppercase mb-1">Input Fields</h4>
                      <ul className="space-y-1 text-[#1B2A3A]">
                        {spec.inputs.map((inp, idx) => <li key={idx}>• {inp}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 border border-[#1B2A3A]/40 bg-[#E4D9BC]">
                      <h4 className="text-[10px] font-bold text-[#1B2A3A]/70 uppercase mb-1">Output Structures</h4>
                      <ul className="space-y-1 text-[#1B2A3A]">
                        {spec.outputs.map((out, idx) => <li key={idx}>• {out}</li>)}
                      </ul>
                    </div>
                  </div>

                  {spec.edgeCases.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-mono font-bold text-[#A8462E] uppercase mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#A8462E]" /> Mineral Staining & Vulnerabilities
                      </h3>
                      <ul className="space-y-1 font-mono text-[11px]">
                        {spec.edgeCases.map((edge, idx) => (
                          <li key={idx} className="p-2.5 border border-[#A8462E] bg-[#A8462E]/10 text-[#A8462E]">{edge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-[#1B2A3A] font-mono">
                  <p className="mb-3 text-[#1B2A3A]/70 font-sans">NO FIELD NOTEBOOK SPECIFICATION EXTRACTED YET.</p>
                  <button onClick={onSummarize} disabled={loading} className="px-4 py-2 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] font-bold text-xs">
                    [EXECUTE FIELD SPEC EXTRACTION]
                  </button>
                </div>
              )
            )}

            {activeTab === 'schema' && (
              <div className="border border-[#1B2A3A] overflow-hidden font-mono">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#E4D9BC] text-[#1B2A3A] uppercase border-b border-[#1B2A3A]">
                      <th className="p-2.5">Level</th>
                      <th className="p-2.5">Field Name</th>
                      <th className="p-2.5">PIC Clause</th>
                      <th className="p-2.5">Redefines</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2A3A]/20">
                    {program.dataDivision.map((f, idx) => (
                      <tr key={idx} className="hover:bg-[#E4D9BC]/50">
                        <td className="p-2.5 font-bold text-[#1B2A3A]">{f.level}</td>
                        <td className="p-2.5 text-[#1B2A3A]">{f.name}</td>
                        <td className="p-2.5 text-[#1B2A3A]/80">{f.picClause || '-'}</td>
                        <td className="p-2.5 text-[#A8462E]">{f.redefines || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 border border-[#1B2A3A] bg-[#E4D9BC]">
                  <span className="text-[10px] uppercase font-bold text-[#1B2A3A]/70">Depth Risk Index</span>
                  <div className="text-2xl font-bold mt-1 text-[#1B2A3A]">
                    {risk.score.toFixed(1)} / 100.0
                  </div>
                </div>

                <div className="p-4 border border-[#1B2A3A] bg-[#EDE6D6] space-y-2">
                  <span className="text-[10px] uppercase text-[#1B2A3A]/70 font-bold">McCabe Cyclomatic Complexity per Paragraph</span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {program.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex justify-between p-2 border border-[#1B2A3A]/30 bg-[#E4D9BC] text-[11px]">
                        <span className="font-bold text-[#1B2A3A]">{p.name}</span>
                        <span className="text-[#A8462E] font-bold">Complexity: {p.cyclomaticComplexity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'codegen' && (
              codegen ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 border border-[#1B2A3A] bg-[#E4D9BC]">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#1B2A3A] font-bold">{codegen.stubFilename}</span>
                      <button onClick={() => handleCopy(codegen.stubCode)} className="text-[#1B2A3A] hover:underline text-[11px] font-bold">Copy</button>
                    </div>
                    <pre className="p-3 bg-[#EDE6D6] border border-[#1B2A3A]/40 text-[#1B2A3A] text-[11px] max-h-56 overflow-y-auto whitespace-pre-wrap">
                      {codegen.stubCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 font-mono text-xs text-[#1B2A3A]">
                  <button onClick={onGenerateCodegen} disabled={loading} className="px-4 py-2 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] font-bold">
                    [EXCAVATE MODERN CODE]
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
