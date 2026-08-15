import React, { useState } from 'react';
import { TerminalHeader } from './components/TerminalHeader';
import { TerminalTopologyView } from './components/TerminalTopologyView';
import { TerminalRiskMatrixView } from './components/TerminalRiskMatrixView';
import { TerminalProgramDetailView } from './components/TerminalProgramDetailView';
import { TerminalCodegenView } from './components/TerminalCodegenView';
import { TerminalReportModal } from './components/TerminalReportModal';
import { api, ProgramSummary, ProgramDetail, CodegenResult, ExecutiveReport } from './api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'risk' | 'detail' | 'codegen'>('graph');
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
    a.download = `monolith_mainframe_report_${codebaseId}.json`;
    a.click();
  };

  const handleSelectProgram = (pname: string) => {
    setSelectedProgram(pname);
    loadProgramDetail(codebaseId, pname);
    setActiveTab('detail');
  };

  return (
    <div className="relative w-screen h-screen bg-crtBg text-crtGreen overflow-hidden font-mono selection:bg-crtGreen selection:text-black flex flex-col">
      
      {/* CRT Screen Scanlines & Glass Vignette Overlay */}
      <div className="crt-overlay" />

      {/* IBM 3270 Terminal Header & Function Key Rail */}
      <TerminalHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={handleExportReport}
        onIngest={handleIngest}
        onSummarizeAll={handleSummarizeAll}
        loading={loading}
        selectedProgram={selectedProgram}
      />

      {/* Main Terminal Viewport */}
      <main className="flex-1 overflow-hidden relative z-10">
        {activeTab === 'graph' && (
          <TerminalTopologyView
            graphData={graphData}
            onSelectProgram={handleSelectProgram}
            onIngest={handleIngest}
            loading={loading}
          />
        )}

        {activeTab === 'risk' && (
          <TerminalRiskMatrixView
            programs={programs}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {activeTab === 'detail' && (
          <TerminalProgramDetailView
            detail={programDetail}
            codegen={codegen}
            onSummarize={handleSummarizeProgram}
            onGenerateCodegen={() => handleGenerateCodegen()}
            loading={loading}
          />
        )}

        {activeTab === 'codegen' && (
          <TerminalCodegenView
            programs={programs}
            codegen={codegen}
            selectedProgram={selectedProgram}
            onSelectProgram={(p) => {
              setSelectedProgram(p);
              loadProgramDetail(codebaseId, p);
            }}
            onGenerateCodegen={(p, lang) => handleGenerateCodegen(p, lang)}
            loading={loading}
          />
        )}
      </main>

      {/* Executive Report Terminal Modal */}
      {showReportModal && report && (
        <TerminalReportModal
          report={report}
          codebaseId={codebaseId}
          onClose={() => setShowReportModal(false)}
          onDownload={downloadJsonReport}
        />
      )}

    </div>
  );
};
