import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { Code2, Copy, Check, Play } from 'lucide-react';

interface LoomCodegenViewProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string, lang: string) => void;
  loading: boolean;
}

export const LoomCodegenView: React.FC<LoomCodegenViewProps> = ({
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
    <div className="w-full h-full p-6 linen-backing text-slate-100 font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="loom-card p-5 flex items-center justify-between border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-amber-400 gold-glow uppercase tracking-wider">
              TARGET CODEGEN SCAFFOLD // MODERN WEAVE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Translates legacy COBOL business rules into target microservice stubs & pytest / JUnit suites
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-bold uppercase">TARGET PROGRAM:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value, targetLang);
            }}
            className="bg-[#131930] border border-amber-500/40 text-amber-300 rounded-xl px-3.5 py-1.5 font-mono focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore.toFixed(1)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-bold uppercase">TARGET STACK:</span>
          <div className="flex items-center gap-1 bg-[#131930] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleLangSwitch('python')}
              className={`px-3.5 py-1 rounded-lg font-bold transition-all ${
                targetLang === 'python' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              PYTHON 3.12
            </button>
            <button
              onClick={() => handleLangSwitch('java')}
              className={`px-3.5 py-1 rounded-lg font-bold transition-all ${
                targetLang === 'java' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              JAVA SPRING BOOT
            </button>
          </div>
        </div>

        <button
          onClick={() => onGenerateCodegen(selectedProgram, targetLang)}
          disabled={loading}
          className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/25"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          [RE-WEAVE CODE]
        </button>
      </div>

      {/* Code Display Grid */}
      {codegen ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          
          <div className="loom-card flex flex-col overflow-hidden border-amber-500/30 font-mono">
            <div className="p-3 border-b border-white/10 bg-amber-500/10 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">{codegen.stubFilename}</span>
              <button onClick={() => handleCopy(codegen.stubCode, true)} className="text-cyan-300 hover:text-white flex items-center gap-1">
                {copiedStub ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedStub ? 'COPIED!' : '[COPY STUB]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#070912] text-amber-200 text-xs leading-relaxed whitespace-pre-wrap">
              {codegen.stubCode}
            </pre>
          </div>

          <div className="loom-card flex flex-col overflow-hidden border-amber-500/30 font-mono">
            <div className="p-3 border-b border-white/10 bg-cyan-500/10 flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-300">{codegen.testFilename}</span>
              <button onClick={() => handleCopy(codegen.testCode, false)} className="text-cyan-300 hover:text-white flex items-center gap-1">
                {copiedTest ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTest ? 'COPIED!' : '[COPY TESTS]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#070912] text-cyan-200/90 text-xs leading-relaxed whitespace-pre-wrap">
              {codegen.testCode}
            </pre>
          </div>

        </div>
      ) : (
        <div className="loom-card p-12 text-center text-slate-400 font-mono">
          SELECT A PROGRAM AND TARGET STACK TO WEAVE MODERN CODE SCAFFOLDS.
        </div>
      )}

    </div>
  );
};
