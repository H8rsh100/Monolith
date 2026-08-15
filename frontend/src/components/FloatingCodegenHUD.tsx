import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { X, Code2, Copy, Check } from 'lucide-react';

interface FloatingCodegenHUDProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string, lang: string) => void;
  onClose: () => void;
  loading: boolean;
}

export const FloatingCodegenHUD: React.FC<FloatingCodegenHUDProps> = ({
  programs,
  codegen,
  selectedProgram,
  onSelectProgram,
  onGenerateCodegen,
  onClose,
  loading
}) => {
  const [targetLang, setTargetLang] = useState<'python' | 'java'>('python');
  const [copiedStub, setCopiedStub] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);

  const handleCopy = (text: string, isStub: boolean) => {
    navigator.clipboard.writeText(text);
    if (isStub) {
      setCopiedStub(true);
      setTimeout(() => setCopiedStub(false), 2000);
    } else {
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2000);
    }
  };

  const handleLangSwitch = (lang: 'python' | 'java') => {
    setTargetLang(lang);
    onGenerateCodegen(selectedProgram, lang);
  };

  return (
    <div className="w-full h-full flex flex-col bg-void/95 border-l border-cyanAccent/30 font-sans overflow-hidden">
      
      {/* HUD Header */}
      <div className="p-4 border-b border-cyanAccent/20 bg-void/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyanAccent" />
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">Target Modernization Codegen Engine</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-400 p-1.5 rounded" title="Close Panel">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Bar Controls */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Target Program:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value, targetLang);
            }}
            className="bg-void border border-slate-800 text-cyanAccent rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore.toFixed(1)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-void p-1 rounded border border-slate-800">
          <button
            onClick={() => handleLangSwitch('python')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
              targetLang === 'python' ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40' : 'text-slate-400'
            }`}
          >
            Python 3.12
          </button>
          <button
            onClick={() => handleLangSwitch('java')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
              targetLang === 'java' ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40' : 'text-slate-400'
            }`}
          >
            Java Spring Boot
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
        {codegen ? (
          <>
            <div className="p-3 rounded bg-void border border-slate-800 flex flex-col">
              <div className="p-2 border-b border-slate-800 bg-slate-950 flex justify-between items-center text-[11px]">
                <span className="text-emerald-400 font-bold">{codegen.stubFilename}</span>
                <button onClick={() => handleCopy(codegen.stubCode, true)} className="text-slate-400 hover:text-white flex items-center gap-1">
                  {copiedStub ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedStub ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-300 text-[11px] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                {codegen.stubCode}
              </pre>
            </div>

            <div className="p-3 rounded bg-void border border-slate-800 flex flex-col">
              <div className="p-2 border-b border-slate-800 bg-slate-950 flex justify-between items-center text-[11px]">
                <span className="text-purple-400 font-bold">{codegen.testFilename}</span>
                <button onClick={() => handleCopy(codegen.testCode, false)} className="text-slate-400 hover:text-white flex items-center gap-1">
                  {copiedTest ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedTest ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-300 text-[11px] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                {codegen.testCode}
              </pre>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-slate-400 font-mono">
            <p className="mb-4">Select a program to preview modern target code stubs.</p>
            <button
              onClick={() => onGenerateCodegen(selectedProgram, targetLang)}
              disabled={loading}
              className="px-5 py-2.5 rounded bg-cyanAccent/20 border border-cyanAccent/50 text-cyanAccent font-bold"
            >
              Generate Target Scaffold
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
