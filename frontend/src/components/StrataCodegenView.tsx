import React, { useState } from 'react';
import { CodegenResult, ProgramSummary } from '../api';
import { Code2, Copy, Check, Play } from 'lucide-react';

interface StrataCodegenViewProps {
  programs: ProgramSummary[];
  codegen: CodegenResult | null;
  selectedProgram: string;
  onSelectProgram: (pname: string) => void;
  onGenerateCodegen: (pname: string, lang: string) => void;
  loading: boolean;
}

export const StrataCodegenView: React.FC<StrataCodegenViewProps> = ({
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
    <div className="w-full h-full p-6 vellum-bg text-[#1B2A3A] font-sans overflow-y-auto flex flex-col gap-6">
      
      {/* Top Header Card */}
      <div className="survey-card p-5 flex items-center justify-between border-[#1B2A3A]">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-[#1B2A3A] bg-[#E4D9BC] text-[#1B2A3A]">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#1B2A3A] uppercase tracking-wide">
              TARGET CODEGEN SCAFFOLD // EXCAVATED MODERN CODE
            </h2>
            <p className="text-xs text-[#1B2A3A]/70 font-mono">
              Translates legacy COBOL business rules into target microservice stubs & pytest / JUnit suites
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1B2A3A]/30 pb-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[#1B2A3A]/70 font-bold uppercase">TARGET PROGRAM:</span>
          <select
            value={selectedProgram}
            onChange={(e) => {
              onSelectProgram(e.target.value);
              onGenerateCodegen(e.target.value, targetLang);
            }}
            className="bg-[#EDE6D6] border border-[#1B2A3A] text-[#1B2A3A] px-3.5 py-1.5 font-mono focus:outline-none"
          >
            {programs.map((p) => (
              <option key={p.programName} value={p.programName}>
                {p.programName}.cbl (Risk: {p.riskScore.toFixed(1)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#1B2A3A]/70 font-bold uppercase">TARGET STACK:</span>
          <div className="flex items-center gap-1 bg-[#C9B896] p-1 border border-[#1B2A3A]">
            <button
              onClick={() => handleLangSwitch('python')}
              className={`px-3.5 py-1 font-bold transition-all ${
                targetLang === 'python' ? 'bg-[#1B2A3A] text-[#EDE6D6]' : 'text-[#1B2A3A] hover:bg-[#E4D9BC]'
              }`}
            >
              PYTHON 3.12
            </button>
            <button
              onClick={() => handleLangSwitch('java')}
              className={`px-3.5 py-1 font-bold transition-all ${
                targetLang === 'java' ? 'bg-[#1B2A3A] text-[#EDE6D6]' : 'text-[#1B2A3A] hover:bg-[#E4D9BC]'
              }`}
            >
              JAVA SPRING BOOT
            </button>
          </div>
        </div>

        <button
          onClick={() => onGenerateCodegen(selectedProgram, targetLang)}
          disabled={loading}
          className="px-4 py-1.5 border border-[#1B2A3A] bg-[#1B2A3A] text-[#EDE6D6] hover:bg-[#233549] font-bold flex items-center gap-1.5 transition-all"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          [RE-EXCAVATE CODE]
        </button>
      </div>

      {/* Code Display Grid */}
      {codegen ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 font-mono">
          
          <div className="survey-card flex flex-col overflow-hidden border-[#1B2A3A]">
            <div className="p-3 border-b border-[#1B2A3A] bg-[#E4D9BC] flex items-center justify-between text-xs font-bold">
              <span className="text-[#1B2A3A]">{codegen.stubFilename}</span>
              <button onClick={() => handleCopy(codegen.stubCode, true)} className="text-[#1B2A3A] hover:underline flex items-center gap-1">
                {copiedStub ? <Check className="h-3.5 w-3.5 text-[#5C4A30]" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedStub ? 'COPIED!' : '[COPY STUB]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#EDE6D6] text-[#1B2A3A] text-xs leading-relaxed whitespace-pre-wrap border-t border-[#1B2A3A]/20">
              {codegen.stubCode}
            </pre>
          </div>

          <div className="survey-card flex flex-col overflow-hidden border-[#1B2A3A]">
            <div className="p-3 border-b border-[#1B2A3A] bg-[#C9B896] flex items-center justify-between text-xs font-bold">
              <span className="text-[#1B2A3A]">{codegen.testFilename}</span>
              <button onClick={() => handleCopy(codegen.testCode, false)} className="text-[#1B2A3A] hover:underline flex items-center gap-1">
                {copiedTest ? <Check className="h-3.5 w-3.5 text-[#5C4A30]" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedTest ? 'COPIED!' : '[COPY TESTS]'}
              </button>
            </div>
            <pre className="p-4 flex-1 overflow-y-auto bg-[#EDE6D6] text-[#1B2A3A] text-xs leading-relaxed whitespace-pre-wrap border-t border-[#1B2A3A]/20">
              {codegen.testCode}
            </pre>
          </div>

        </div>
      ) : (
        <div className="survey-card p-12 text-center text-[#1B2A3A] font-mono">
          SELECT A PROGRAM AND TARGET STACK TO EXCAVATE MODERN CODE SCAFFOLDS.
        </div>
      )}

    </div>
  );
};
