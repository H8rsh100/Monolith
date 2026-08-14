import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { Code2, Copy, Check, FileCode, Play, AlertCircle } from 'lucide-react';

interface CodegenViewProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string) => void;
  loading: boolean;
}

export const CodegenView: React.FC<CodegenViewProps> = ({
  programs,
  codegen,
  selectedProgram,
  onSelectProgram,
  onGenerateCodegen,
  loading
}) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 flex items-start gap-3 text-xs text-amber-200/90 font-mono">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 uppercase block mb-0.5">Modernization Scaffold Notice</span>
          Generated code serves as an initial migration scaffold and test harness for human developers to verify legacy logic. It is intentionally designed as a verified starting point for enterprise rewrites.
        </div>
      </div>

      {/* Program Selector Bar */}
      <div className="glass-panel p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCode className="h-5 w-5 text-sky-400" />
          <span className="text-xs font-mono text-slate-300 font-bold uppercase">Target Program:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 text-xs font-mono text-sky-400 font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore}/100)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onGenerateCodegen(selectedProgram)}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Re-Generate Scaffold
        </button>
      </div>

      {/* Codegen Display Split */}
      {codegen ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Python Target Stub */}
          <div className="glass-panel overflow-hidden flex flex-col h-[520px]">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                {codegen.stubFilename}
              </span>
              <button
                onClick={() => handleCopy(codegen.stubCode, true)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedStub ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedStub ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-slate-950 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              {codegen.stubCode}
            </pre>
          </div>

          {/* Pytest Test Skeleton */}
          <div className="glass-panel overflow-hidden flex flex-col h-[520px]">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                {codegen.testFilename}
              </span>
              <button
                onClick={() => handleCopy(codegen.testCode, false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedTest ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTest ? 'Copied!' : 'Copy Tests'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-slate-950 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              {codegen.testCode}
            </pre>
          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 text-center font-mono text-slate-400 text-xs">
          Select a program and click "Re-Generate Scaffold" to view modern Python stubs.
        </div>
      )}

    </div>
  );
};
