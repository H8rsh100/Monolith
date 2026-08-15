import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { Code2, Copy, Check, Play, Terminal } from 'lucide-react';

interface TerminalCodegenViewProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string, lang: string) => void;
  loading: boolean;
}

export const TerminalCodegenView: React.FC<TerminalCodegenViewProps> = ({
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
    <div className="w-full h-full p-6 bg-crtBg text-crtGreen font-mono overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="terminal-box p-4 flex items-center justify-between border-crtGreen">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-crtCyan" />
          <div>
            <h2 className="text-base font-bold text-glow-cyan uppercase tracking-wider">
              TARGET CODEGEN GENERATOR // MODERN STACK SCAFFOLD
            </h2>
            <p className="text-xs text-crtGreen/70">
              Transforms reverse-engineered business rules into target microservice stubs & test skeletons
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-crtGreen/30 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">TARGET PROGRAM:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value, targetLang);
            }}
            className="bg-crtBg border border-crtGreen text-crtGreen rounded px-3 py-1 font-bold focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore.toFixed(1)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">TARGET STACK:</span>
          <button
            onClick={() => handleLangSwitch('python')}
            className={`px-3 py-1 border font-bold transition-all ${
              targetLang === 'python' ? 'bg-crtGreen text-black border-crtGreen shadow-[0_0_10px_#00FF66]' : 'border-crtGreen/40 text-crtGreen'
            }`}
          >
            PYTHON 3.12
          </button>
          <button
            onClick={() => handleLangSwitch('java')}
            className={`px-3 py-1 border font-bold transition-all ${
              targetLang === 'java' ? 'bg-crtGreen text-black border-crtGreen shadow-[0_0_10px_#00FF66]' : 'border-crtGreen/40 text-crtGreen'
            }`}
          >
            JAVA SPRING BOOT
          </button>
        </div>

        <button
          onClick={() => onGenerateCodegen(selectedProgram, targetLang)}
          disabled={loading}
          className="px-4 py-1.5 border border-crtCyan bg-crtCyan/10 hover:bg-crtCyan text-crtCyan hover:text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          [RE-GENERATE SCAFFOLD]
        </button>
      </div>

      {/* Code Display Area */}
      {codegen ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          
          <div className="terminal-box flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-crtGreen bg-crtGreen/10 flex items-center justify-between text-xs">
              <span className="font-bold text-crtGreen">{codegen.stubFilename}</span>
              <button onClick={() => handleCopy(codegen.stubCode, true)} className="text-crtGreen hover:text-white flex items-center gap-1">
                {copiedStub ? <Check className="h-3.5 w-3.5 text-crtGreen" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedStub ? 'COPIED!' : '[COPY STUB]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-black/80 text-crtGreen text-xs leading-relaxed whitespace-pre-wrap">
              {codegen.stubCode}
            </pre>
          </div>

          <div className="terminal-box flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-crtAmber bg-crtAmber/10 flex items-center justify-between text-xs">
              <span className="font-bold text-crtAmber">{codegen.testFilename}</span>
              <button onClick={() => handleCopy(codegen.testCode, false)} className="text-crtAmber hover:text-white flex items-center gap-1">
                {copiedTest ? <Check className="h-3.5 w-3.5 text-crtGreen" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTest ? 'COPIED!' : '[COPY TESTS]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-black/80 text-crtAmber text-xs leading-relaxed whitespace-pre-wrap">
              {codegen.testCode}
            </pre>
          </div>

        </div>
      ) : (
        <div className="terminal-box p-12 text-center text-crtGreen font-mono">
          SELECT A PROGRAM AND TARGET STACK TO GENERATE MODERN CODE SCAFFOLDS.
        </div>
      )}

    </div>
  );
};
