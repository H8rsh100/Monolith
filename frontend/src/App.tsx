import React, { useState } from 'react';
import { VerticalNav } from './components/VerticalNav';
import { ScanChamberGraph } from './components/ScanChamberGraph';
import { FloatingProgramDetailHUD } from './components/FloatingProgramDetailHUD';
import { FloatingRiskTableHUD } from './components/FloatingRiskTableHUD';
import { FloatingCodegenHUD } from './components/FloatingCodegenHUD';
import { FloatingReportHUD } from './components/FloatingReportHUD';
import { api, ProgramSummary, ProgramDetail, CodegenResult, ExecutiveReport } from './api';

export const App: React.FC = () => {
  const [activeHud, setActiveHud] = useState<'graph' | 'risk' | 'detail' | 'codegen'>('graph');
  const [codebaseId, setCodebaseId] = useState<string>('demo-cobol');
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('CUSTMAIN');
  const [programDetail, setProgramDetail] = useState<ProgramDetail | null>(null);
  const [codegen, setCodegen] = useState<CodegenResult | null>(null);
  const [report, setReport] = useState<ExecutiveReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProgramDetail = async (cid: string, pname: string) => {
    try {
      const detail = await api.getProgramDetail(cid, pname);
      setProgramDetail(detail);
    } catch (e) {
      console.error("Failed to load program detail:", e);
    }
  };

  const handleIngest = async () => {
    try {
      setLoading(true);
      const res = await api.ingestCodebase("demo-cobol");
      setCodebaseId(res.codebaseId);
      const gData = await api.getGraph(res.codebaseId);
      setGraphData(gData);
      const progs = await api.getPrograms(res.codebaseId);
      setPrograms(progs);
      if (progs.length > 0) {
        setSelectedProgram(progs[0].programName);
        loadProgramDetail(res.codebaseId, progs[0].programName);
      }
    } catch (e) {
      console.error("Ingest failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeProgram = async () => {
    if (!selectedProgram) return;
    try {
      setLoading(true);
      await api.summarizeProgram(codebaseId, selectedProgram);
      await loadProgramDetail(codebaseId, selectedProgram);
    } catch (e) {
      console.error("Summarize failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeAll = async () => {
    try {
      setLoading(true);
      await api.summarizeAll(codebaseId);
      const progs = await api.getPrograms(codebaseId);
      setPrograms(progs);
      if (selectedProgram) {
        await loadProgramDetail(codebaseId, selectedProgram);
      }
    } catch (e) {
      console.error("Summarize all failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCodegen = async (pname?: string, lang: string = 'python') => {
    const target = pname || selectedProgram;
    if (!target) return;
    try {
      setLoading(true);
      const res = await api.generateCodegen(codebaseId, target, lang);
      setCodegen(res);
    } catch (e) {
      console.error("Codegen failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setLoading(true);
      const rep = await api.exportReport(codebaseId);
      setReport(rep);
      setShowReportModal(true);
    } catch (e) {
      console.error("Failed to export report:", e);
    } finally {
      setLoading(false);
    }
  };

  const downloadJsonReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monolith_autopsy_report_${codebaseId}.json`;
    a.click();
  };

  const handleSelectProgram = (pname: string) => {
    setSelectedProgram(pname);
    loadProgramDetail(codebaseId, pname);
    setActiveHud('detail');
  };

  const isPaneOpen = activeHud !== 'graph';

  return (
    <div className="relative w-screen h-screen bg-void text-slate-100 overflow-hidden font-sans selection:bg-cyanAccent/30 selection:text-cyanAccent flex">
      
      {/* Continuous Diagnostic Viewport Scanline Loop */}
      <div className="scanline-overlay" />

      {/* Left Vertical Spine Navigation Rail */}
      <VerticalNav
        activeHud={activeHud}
        setActiveHud={setActiveHud}
        onOpenReport={handleExportReport}
        onIngest={handleIngest}
        onSummarizeAll={handleSummarizeAll}
        loading={loading}
        selectedProgram={selectedProgram}
      />

      {/* Main Dual-Pane Viewport Container */}
      <main className="flex-1 ml-16 h-full flex overflow-hidden">
        
        {/* Left Pane: Permanent Scan Chamber Graph Canvas */}
        <div className="flex-1 h-full relative transition-all duration-300">
          <ScanChamberGraph
            graphData={graphData}
            onSelectProgram={handleSelectProgram}
            onIngest={handleIngest}
            loading={loading}
            activeHud={activeHud}
          />
        </div>

        {/* Right Pane: In-Flow Side Inspector Panel (Zero Overlap) */}
        {isPaneOpen && (
          <div className="w-[520px] lg:w-[600px] h-full transition-all duration-300 z-30 shrink-0">
            {activeHud === 'detail' && (
              <FloatingProgramDetailHUD
                detail={programDetail}
                codegen={codegen}
                onSummarize={handleSummarizeProgram}
                onGenerateCodegen={() => handleGenerateCodegen()}
                onClose={() => setActiveHud('graph')}
                loading={loading}
              />
            )}

            {activeHud === 'risk' && (
              <FloatingRiskTableHUD
                programs={programs}
                onSelectProgram={handleSelectProgram}
                onClose={() => setActiveHud('graph')}
              />
            )}

            {activeHud === 'codegen' && (
              <FloatingCodegenHUD
                programs={programs}
                codegen={codegen}
                selectedProgram={selectedProgram}
                onSelectProgram={(p) => {
                  setSelectedProgram(p);
                  loadProgramDetail(codebaseId, p);
                }}
                onGenerateCodegen={(p, lang) => handleGenerateCodegen(p, lang)}
                onClose={() => setActiveHud('graph')}
                loading={loading}
              />
            )}
          </div>
        )}

      </main>

      {/* Executive Report Modal HUD */}
      {showReportModal && report && (
        <FloatingReportHUD
          report={report}
          codebaseId={codebaseId}
          onClose={() => setShowReportModal(false)}
          onDownload={downloadJsonReport}
        />
      )}

    </div>
  );
};
