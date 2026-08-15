import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { Code2, Copy, Check, Play } from 'lucide-react';

interface IOSCodegenViewProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string, lang: string) => void;
  loading: boolean;
}

export const IOSCodegenView: React.FC<IOSCodegenViewProps> = ({
  programs,
  codegen,
  selectedProgram,
  onSelectProgram,
  onGenerateCodegen,
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
    <div className="w-full h-full p-6 bg-black text-slate-100 font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="ios-card p-5 flex items-center justify-between border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#007AFF]">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Modern Target Code Scaffold Generator
            </h2>
            <p className="text-xs text-slate-400">
              Automated translation of reverse-engineered business rules into target microservice stubs & test suites
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4 text-xs font-sans">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-semibold">Target Program:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value, targetLang);
            }}
            className="bg-[#1c1c1e] border border-white/10 text-white rounded-xl px-3.5 py-1.5 font-mono focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore.toFixed(1)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-semibold">Target Stack:</span>
          <div className="flex items-center gap-1 bg-[#2c2c2e] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleLangSwitch('python')}
              className={`px-3.5 py-1 rounded-lg font-semibold transition-all ${
                targetLang === 'python' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Python 3.12
            </button>
            <button
              onClick={() => handleLangSwitch('java')}
              className={`px-3.5 py-1 rounded-lg font-semibold transition-all ${
                targetLang === 'java' ? 'bg-[#007AFF] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Java Spring Boot
            </button>
          </div>
        </div>

        <button
          onClick={() => onGenerateCodegen(selectedProgram, targetLang)}
          disabled={loading}
          className="px-4 py-1.5 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Re-generate
        </button>
      </div>

      {/* Code Display Grid */}
      {codegen ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          
          <div className="ios-card flex flex-col overflow-hidden border-white/10 font-mono">
            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between text-xs">
              <span className="font-bold text-white">{codegen.stubFilename}</span>
              <button onClick={() => handleCopy(codegen.stubCode, true)} className="text-blue-400 hover:text-white flex items-center gap-1">
                {copiedStub ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedStub ? 'Copied!' : 'Copy Stub'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#101012] text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
              {codegen.stubCode}
            </pre>
          </div>

          <div className="ios-card flex flex-col overflow-hidden border-white/10 font-mono">
            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between text-xs">
              <span className="font-bold text-purple-300">{codegen.testFilename}</span>
              <button onClick={() => handleCopy(codegen.testCode, false)} className="text-purple-300 hover:text-white flex items-center gap-1">
                {copiedTest ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTest ? 'Copied!' : 'Copy Tests'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#101012] text-purple-200/90 text-xs leading-relaxed whitespace-pre-wrap">
              {codegen.testCode}
            </pre>
          </div>

        </div>
      ) : (
        <div className="ios-card p-12 text-center text-slate-400 font-sans">
          Select a program and target stack to generate modern code stubs.
        </div>
      )}

    </div>
  );
};
