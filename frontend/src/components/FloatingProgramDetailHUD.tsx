import React, { useState } from 'react';
import { ProgramDetail, CodegenResult } from '../api';
import { getThermalColor } from '../utils/thermalColor';
import { X, Sparkles, Code, Table, Shield, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

interface FloatingProgramDetailHUDProps {
  detail: ProgramDetail | null;
  codegen: CodegenResult | null;
  onSummarize: () => void;
  onGenerateCodegen: () => void;
  onClose: () => void;
  loading: boolean;
}

export const FloatingProgramDetailHUD: React.FC<FloatingProgramDetailHUDProps> = ({
  detail,
  codegen,
  onSummarize,
  onGenerateCodegen,
  onClose,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'spec' | 'schema' | 'risk' | 'codegen'>('spec');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!detail) return null;

  const { program, risk, spec } = detail;
  const thermal = getThermalColor(risk.score);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-void/95 border-l border-cyanAccent/30 font-sans overflow-hidden">
      
      {/* HUD Header Bar */}
      <div className="p-4 border-b border-cyanAccent/20 bg-void/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-mono font-bold text-white tracking-wider uppercase">{program.programName}.cbl</h2>
            <span
              className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border"
              style={{
                backgroundColor: `${thermal.hex}20`,
                color: thermal.hex,
                borderColor: `${thermal.hex}50`
              }}
            >
              {risk.score.toFixed(1)} | {thermal.statusLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            {program.linesOfCode} LOC | {program.paragraphs.length} Paragraphs | {program.calls.length} Subprogram Calls
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-cyanAccent p-1.5 rounded hover:bg-slate-900/60 transition-colors"
          title="Close Inspector Pane"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900/50 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('spec')}
          className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'spec' ? 'border-cyanAccent text-cyanAccent' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" /> Spec
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'schema' ? 'border-cyanAccent text-cyanAccent' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="h-3.5 w-3.5" /> Schema ({program.dataDivision.length})
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'risk' ? 'border-cyanAccent text-cyanAccent' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="h-3.5 w-3.5" /> Risk
        </button>
        <button
          onClick={() => setActiveTab('codegen')}
          className={`px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'codegen' ? 'border-cyanAccent text-cyanAccent' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="h-3.5 w-3.5" /> Codegen
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        
        {/* Spec Tab */}
        {activeTab === 'spec' && (
          spec ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 rounded bg-void/60 border border-slate-800">
                <h3 className="text-[11px] font-bold text-cyanAccent uppercase mb-1">Executive Summary</h3>
                <p className="text-slate-300 leading-relaxed font-sans">{spec.summary}</p>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" /> Business Rules ({spec.businessRules.length})
                </h3>
                <ul className="space-y-1.5">
                  {spec.businessRules.map((rule, idx) => (
                    <li key={idx} className="p-2.5 rounded bg-slate-900/50 border border-slate-800 text-slate-300 flex items-start gap-2 font-sans">
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-void/60 border border-slate-800">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Inputs</h4>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {spec.inputs.map((inp, idx) => <li key={idx}>• {inp}</li>)}
                  </ul>
                </div>
                <div className="p-3 rounded bg-void/60 border border-slate-800">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Outputs</h4>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {spec.outputs.map((out, idx) => <li key={idx}>• {out}</li>)}
                  </ul>
                </div>
              </div>

              {spec.edgeCases.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-bold text-amber-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Edge Cases
                  </h3>
                  <ul className="space-y-1 text-[11px] text-amber-200/90 font-sans">
                    {spec.edgeCases.map((edge, idx) => (
                      <li key={idx} className="p-2 rounded bg-amber-500/10 border border-amber-500/20">{edge}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 font-mono text-xs">
              <p className="text-slate-400 mb-4">No LLM Business Spec Extracted</p>
              <button onClick={onSummarize} disabled={loading} className="px-5 py-2.5 rounded bg-cyanAccent/20 border border-cyanAccent/50 text-cyanAccent font-bold">
                {loading ? 'Extracting Spec...' : 'Generate LLM Spec'}
              </button>
            </div>
          )
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && (
          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-900 text-cyanAccent uppercase text-[10px]">
                  <th className="p-2.5">Level</th>
                  <th className="p-2.5">Field</th>
                  <th className="p-2.5">PIC</th>
                  <th className="p-2.5">Redefines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {program.dataDivision.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-2.5 text-cyanAccent font-bold">{f.level}</td>
                    <td className="p-2.5 text-slate-200">{f.name}</td>
                    <td className="p-2.5 text-emerald-400">{f.picClause || '-'}</td>
                    <td className="p-2.5 text-amber-400">{f.redefines || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Risk Tab */}
        {activeTab === 'risk' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded bg-void/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Composite Thermal Score</span>
              <div className="text-2xl font-bold mt-1" style={{ color: thermal.hex }}>
                {risk.score.toFixed(1)} / 100
              </div>
            </div>

            <div className="p-3.5 rounded bg-void/60 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase">Paragraph Complexity</span>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {program.paragraphs.map((p, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                    <span className="text-slate-200 font-bold">{p.name}</span>
                    <span className="text-cyanAccent">McCabe: {p.cyclomaticComplexity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Codegen Tab */}
        {activeTab === 'codegen' && (
          codegen ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded bg-void/60 border border-slate-800">
                <div className="flex justify-between mb-1.5">
                  <span className="text-emerald-400 font-bold">{codegen.stubFilename}</span>
                  <button onClick={() => handleCopy(codegen.stubCode)} className="text-slate-400 hover:text-white text-[10px]">Copy</button>
                </div>
                <pre className="p-3 rounded bg-slate-950 text-[11px] max-h-60 overflow-y-auto text-slate-300 whitespace-pre-wrap">
                  {codegen.stubCode}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 font-mono text-xs">
              <button onClick={onGenerateCodegen} disabled={loading} className="px-5 py-2.5 rounded bg-cyanAccent/20 border border-cyanAccent/50 text-cyanAccent font-bold">
                Generate Modern Code
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
};
