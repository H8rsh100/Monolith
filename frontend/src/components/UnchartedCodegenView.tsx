import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { Code2, Copy, Check, Play } from 'lucide-react';

interface UnchartedCodegenViewProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string, lang: string) => void;
  loading: boolean;
}

export const UnchartedCodegenView: React.FC<UnchartedCodegenViewProps> = ({
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
    <div className="w-full h-full p-6 parchment-bg text-[#233348] font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="map-panel p-5 flex items-center justify-between border-[#233348]">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-[#233348] bg-[#E6DCB8] text-[#233348]">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#233348] uppercase tracking-wide">
              TARGET CODEGEN SCAFFOLD // MODERN WEAVE
            </h2>
            <p className="text-xs text-[#233348]/70 font-mono">
              Translates legacy COBOL business rules into target microservice stubs & pytest / JUnit suites
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#233348]/30 pb-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[#233348]/70 font-bold uppercase">TARGET SETTLEMENT:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value, targetLang);
            }}
            className="bg-[#F2EAD8] border border-[#233348] text-[#233348] px-3.5 py-1.5 font-mono focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore.toFixed(1)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#233348]/70 font-bold uppercase">TARGET STACK:</span>
          <div className="flex items-center gap-1 bg-[#D9CBAB] p-1 border border-[#233348]">
            <button
              onClick={() => handleLangSwitch('python')}
              className={`px-3.5 py-1 font-bold transition-all ${
                targetLang === 'python' ? 'bg-[#233348] text-[#F2EAD8]' : 'text-[#233348] hover:bg-[#E6DCB8]'
              }`}
            >
              PYTHON 3.12
            </button>
            <button
              onClick={() => handleLangSwitch('java')}
              className={`px-3.5 py-1 font-bold transition-all ${
                targetLang === 'java' ? 'bg-[#233348] text-[#F2EAD8]' : 'text-[#233348] hover:bg-[#E6DCB8]'
              }`}
            >
              JAVA SPRING BOOT
            </button>
          </div>
        </div>

        <button
          onClick={() => onGenerateCodegen(selectedProgram, targetLang)}
          disabled={loading}
          className="px-4 py-1.5 border border-[#233348] bg-[#233348] text-[#F2EAD8] hover:bg-[#344861] font-bold flex items-center gap-1.5 transition-all"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          [RE-WEAVE CODE]
        </button>
      </div>

      {/* Code Display Grid */}
      {codegen ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 font-mono">
          
          <div className="map-panel flex flex-col overflow-hidden border-[#233348]">
            <div className="p-3 border-b border-[#233348] bg-[#E6DCB8] flex items-center justify-between text-xs font-bold">
              <span className="text-[#233348]">{codegen.stubFilename}</span>
              <button onClick={() => handleCopy(codegen.stubCode, true)} className="text-[#233348] hover:underline flex items-center gap-1">
                {copiedStub ? <Check className="h-3.5 w-3.5 text-[#6B8F5E]" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedStub ? 'COPIED!' : '[COPY STUB]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#F2EAD8] text-[#233348] text-xs leading-relaxed whitespace-pre-wrap border-t border-[#233348]/20">
              {codegen.stubCode}
            </pre>
          </div>

          <div className="map-panel flex flex-col overflow-hidden border-[#233348]">
            <div className="p-3 border-b border-[#233348] bg-[#D9CBAB] flex items-center justify-between text-xs font-bold">
              <span className="text-[#233348]">{codegen.testFilename}</span>
              <button onClick={() => handleCopy(codegen.testCode, false)} className="text-[#233348] hover:underline flex items-center gap-1">
                {copiedTest ? <Check className="h-3.5 w-3.5 text-[#6B8F5E]" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTest ? 'COPIED!' : '[COPY TESTS]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#F2EAD8] text-[#233348] text-xs leading-relaxed whitespace-pre-wrap border-t border-[#233348]/20">
              {codegen.testCode}
            </pre>
          </div>

        </div>
      ) : (
        <div className="map-panel p-12 text-center text-[#233348] font-mono">
          SELECT A SETTLEMENT AND TARGET STACK TO WEAVE MODERN CODE SCAFFOLDS.
        </div>
      )}

    </div>
  );
};
