import React, { useState } from 'react';
import { ProgramDetail, CodegenResult } from '../api';
import { Sparkles, Code, Copy, Table, Shield, CheckCircle, ArrowRight, AlertTriangle, Compass } from 'lucide-react';

interface UnchartedProgramDetailViewProps {
  detail: ProgramDetail | null;
  codegen: CodegenResult | null;
  onSummarize: () => void;
  onGenerateCodegen: () => void;
  loading: boolean;
}

export const UnchartedProgramDetailView: React.FC<UnchartedProgramDetailViewProps> = ({
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
      <div className="flex items-center justify-center h-full parchment-bg text-[#233348] font-mono">
        SELECT A SETTLEMENT FROM EXPEDITION MAP TO INSPECT FIELD LOG ENTRY.
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
    <div className="w-full h-full p-4 parchment-bg text-[#233348] font-sans overflow-hidden flex flex-col gap-4">
      
      {/* Header Banner */}
      <div className="map-panel p-4 flex items-center justify-between border-[#233348]">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#233348] bg-[#E6DCB8] text-[#233348]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-3 font-mono">
              <h2 className="text-base font-serif font-bold text-[#233348] uppercase">SETTLEMENT: {program.programName}.cbl</h2>
              <span className={`px-2.5 py-0.5 border text-xs font-bold ${
                isCritical ? 'border-[#8B2E2E] text-[#8B2E2E] bg-[#8B2E2E]/10' : 'border-[#C9A24B] text-[#C9A24B] bg-[#C9A24B]/10'
              }`}>
                RISK INDEX: {risk.score.toFixed(1)} / 100
              </span>
            </div>
            <p className="text-xs text-[#233348]/70 font-mono">
              {program.linesOfCode} LOC | {program.paragraphs.length} PARAGRAPHS | {program.calls.length} ROAD CONNECTIONS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={onSummarize}
            disabled={loading}
            className="px-3.5 py-1.5 border border-[#233348] bg-[#D9CBAB] hover:bg-[#C9A24B]/40 text-[#233348] font-bold uppercase transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {spec ? '[RE-EXTRACT NOTES]' : '[EXTRACT EXPEDITION NOTES]'}
          </button>

          <button
            onClick={onGenerateCodegen}
            disabled={loading}
            className="px-3.5 py-1.5 border border-[#233348] bg-[#233348] text-[#F2EAD8] hover:bg-[#344861] font-bold uppercase transition-all"
          >
            <Code className="h-3.5 w-3.5" />
            [WEAVE MODERN CODE]
          </button>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column: COBOL Source Framed Like a Field Log Entry */}
        <div className="map-panel flex flex-col overflow-hidden border-[#233348]">
          <div className="p-3 border-b border-[#233348] bg-[#E6DCB8] flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#233348]">FIELD LOG ENTRY SOURCE STREAM [{program.linesOfCode} LOC]</span>
            {program.rawSource && (
              <button onClick={() => handleCopy(program.rawSource || '')} className="text-[#233348] hover:underline flex items-center gap-1 font-bold">
                <Copy className="h-3.5 w-3.5" />
                {copiedCode ? 'COPIED!' : '[COPY LOG]'}
              </button>
            )}
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-[#233348] leading-relaxed bg-[#F2EAD8]">
            {program.rawSource ? (
              <pre className="whitespace-pre-wrap">
                {program.rawSource.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-[#E6DCB8]/80 px-1 border-b border-[#233348]/10">
                    <span className="w-10 text-[#233348]/50 font-bold select-none text-right pr-3 border-r border-[#233348]/30 mr-3 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className={line.trim().startsWith('*') ? 'text-[#C9A24B] italic font-bold' : line.trim().startsWith('PROCEDURE') ? 'text-[#8B2E2E] font-bold' : ''}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            ) : (
              <div className="text-[#233348]/60 italic">Field log entry unavailable.</div>
            )}
          </div>
        </div>

        {/* Right Column: Expedition Notes & Schema */}
        <div className="map-panel flex flex-col overflow-hidden border-[#233348] font-sans">
          
          {/* Sub Tab Menu */}
          <div className="p-2 border-b border-[#233348] bg-[#D9CBAB] flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#233348] transition-all flex items-center gap-1.5 ${
                activeTab === 'spec' ? 'bg-[#F2EAD8] text-[#233348]' : 'bg-[#E6DCB8] text-[#233348]/70'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> NOTES
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#233348] transition-all flex items-center gap-1.5 ${
                activeTab === 'schema' ? 'bg-[#F2EAD8] text-[#233348]' : 'bg-[#E6DCB8] text-[#233348]/70'
              }`}
            >
              <Table className="h-3.5 w-3.5" /> SCHEMA ({program.dataDivision.length})
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#233348] transition-all flex items-center gap-1.5 ${
                activeTab === 'risk' ? 'bg-[#F2EAD8] text-[#233348]' : 'bg-[#E6DCB8] text-[#233348]/70'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> TERRAIN
            </button>
            <button
              onClick={() => setActiveTab('codegen')}
              className={`px-3 py-1.5 uppercase font-bold border border-[#233348] transition-all flex items-center gap-1.5 ${
                activeTab === 'codegen' ? 'bg-[#F2EAD8] text-[#233348]' : 'bg-[#E6DCB8] text-[#233348]/70'
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
                  <div className="p-3.5 border border-[#233348] bg-[#E6DCB8]">
                    <h3 className="text-[11px] font-mono font-bold text-[#233348] uppercase mb-1">Expedition Field Notes</h3>
                    <p className="text-[#233348] leading-relaxed">{spec.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-mono font-bold text-[#233348] uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-[#6B8F5E]" /> Documented Business Rules ({spec.businessRules.length})
                    </h3>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {spec.businessRules.map((rule, idx) => (
                        <li key={idx} className="p-2.5 border border-[#233348]/40 bg-[#F2EAD8] text-[#233348] flex items-start gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-[#233348] shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-3 border border-[#233348]/40 bg-[#E6DCB8]">
                      <h4 className="text-[10px] font-bold text-[#233348]/70 uppercase mb-1">Input Interfaces</h4>
                      <ul className="space-y-1 text-[#233348]">
                        {spec.inputs.map((inp, idx) => <li key={idx}>• {inp}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 border border-[#233348]/40 bg-[#E6DCB8]">
                      <h4 className="text-[10px] font-bold text-[#233348]/70 uppercase mb-1">Output Records</h4>
                      <ul className="space-y-1 text-[#233348]">
                        {spec.outputs.map((out, idx) => <li key={idx}>• {out}</li>)}
                      </ul>
                    </div>
                  </div>

                  {spec.edgeCases.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-mono font-bold text-[#8B2E2E] uppercase mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#8B2E2E]" /> Danger Hazards & Marsh Hazards
                      </h3>
                      <ul className="space-y-1 font-mono text-[11px]">
                        {spec.edgeCases.map((edge, idx) => (
                          <li key={idx} className="p-2.5 border border-[#8B2E2E] bg-[#8B2E2E]/10 text-[#8B2E2E]">{edge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-[#233348] font-mono">
                  <p className="mb-3 text-[#233348]/70 font-sans">NO EXPEDITION FIELD NOTES EXTRACTED YET.</p>
                  <button onClick={onSummarize} disabled={loading} className="px-4 py-2 border border-[#233348] bg-[#233348] text-[#F2EAD8] font-bold text-xs">
                    [EXTRACT FIELD NOTES & LIFT FOG]
                  </button>
                </div>
              )
            )}

            {activeTab === 'schema' && (
              <div className="border border-[#233348] overflow-hidden font-mono">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#E6DCB8] text-[#233348] uppercase border-b border-[#233348]">
                      <th className="p-2.5">Level</th>
                      <th className="p-2.5">Field Name</th>
                      <th className="p-2.5">PIC Clause</th>
                      <th className="p-2.5">Redefines</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#233348]/20">
                    {program.dataDivision.map((f, idx) => (
                      <tr key={idx} className="hover:bg-[#E6DCB8]/50">
                        <td className="p-2.5 font-bold text-[#233348]">{f.level}</td>
                        <td className="p-2.5 text-[#233348]">{f.name}</td>
                        <td className="p-2.5 text-[#233348]/80">{f.picClause || '-'}</td>
                        <td className="p-2.5 text-[#8B2E2E]">{f.redefines || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 border border-[#233348] bg-[#E6DCB8]">
                  <span className="text-[10px] uppercase font-bold text-[#233348]/70">Risk Index Score</span>
                  <div className="text-2xl font-bold mt-1 text-[#233348]">
                    {risk.score.toFixed(1)} / 100.0
                  </div>
                </div>

                <div className="p-4 border border-[#233348] bg-[#F2EAD8] space-y-2">
                  <span className="text-[10px] uppercase text-[#233348]/70 font-bold">Paragraph McCabe Complexity</span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {program.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex justify-between p-2 border border-[#233348]/30 bg-[#E6DCB8] text-[11px]">
                        <span className="font-bold text-[#233348]">{p.name}</span>
                        <span className="text-[#8B2E2E] font-bold">Complexity: {p.cyclomaticComplexity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'codegen' && (
              codegen ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 border border-[#233348] bg-[#E6DCB8]">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#233348] font-bold">{codegen.stubFilename}</span>
                      <button onClick={() => handleCopy(codegen.stubCode)} className="text-[#233348] hover:underline text-[11px] font-bold">Copy</button>
                    </div>
                    <pre className="p-3 bg-[#F2EAD8] border border-[#233348]/40 text-[#233348] text-[11px] max-h-56 overflow-y-auto whitespace-pre-wrap">
                      {codegen.stubCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 font-mono text-xs text-[#233348]">
                  <button onClick={onGenerateCodegen} disabled={loading} className="px-4 py-2 border border-[#233348] bg-[#233348] text-[#F2EAD8] font-bold">
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
