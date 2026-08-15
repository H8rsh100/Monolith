import React, { useState } from 'react';
import { ExpeditionHeader } from './components/ExpeditionHeader';
import { UnchartedMapView } from './components/UnchartedMapView';
import { UnchartedRiskMatrixView } from './components/UnchartedRiskMatrixView';
import { UnchartedProgramDetailView } from './components/UnchartedProgramDetailView';
import { UnchartedCodegenView } from './components/UnchartedCodegenView';
import { UnchartedReportModal } from './components/UnchartedReportModal';
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
  const [fogClearedSet, setFogClearedSet] = useState<Set<string>>(new Set(['CUSTMAIN']));

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
      
      // Initially clear fog for the selected program, leaving others fog shrouded
      if (progs.length > 0) {
        const initialSet = new Set<string>([progs[0].programName]);
        setFogClearedSet(initialSet);
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
      
      // Lift fog for this settlement!
      setFogClearedSet((prev) => new Set([...Array.from(prev), selectedProgram]));
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
      
      // Lift fog for ALL settlements in the codebase!
      const allNames = progs.map((p) => p.programName);
      setFogClearedSet(new Set(allNames));
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
    a.download = `monolith_survey_report_${codebaseId}.json`;
    a.click();
  };

  const handleSelectProgram = (pname: string) => {
    setSelectedProgram(pname);
    loadProgramDetail(codebaseId, pname);
    setActiveTab('detail');
  };

  return (
    <div className="h-screen w-screen bg-[#F2EAD8] text-[#233348] flex flex-col overflow-hidden font-sans">
      
      {/* Expedition Header */}
      <ExpeditionHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={handleExportReport}
        onIngest={handleIngest}
        onSummarizeAll={handleSummarizeAll}
        loading={loading}
        selectedProgram={selectedProgram}
        fogClearedCount={fogClearedSet.size}
        totalProgramCount={programs.length}
      />

      {/* Main Viewport Workspace Container with Explicit Height */}
      <main className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden relative">
        {activeTab === 'graph' && (
          <UnchartedMapView
            graphData={graphData}
            onSelectProgram={handleSelectProgram}
            onIngest={handleIngest}
            loading={loading}
            fogClearedSet={fogClearedSet}
          />
        )}

        {activeTab === 'risk' && (
          <UnchartedRiskMatrixView
            programs={programs}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {activeTab === 'detail' && (
          <UnchartedProgramDetailView
            detail={programDetail}
            codegen={codegen}
            onSummarize={handleSummarizeProgram}
            onGenerateCodegen={() => handleGenerateCodegen()}
            loading={loading}
          />
        )}

        {activeTab === 'codegen' && (
          <UnchartedCodegenView
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

      {/* Cartographer Printed Survey Report Modal */}
      {showReportModal && report && (
        <UnchartedReportModal
          report={report}
          codebaseId={codebaseId}
          onClose={() => setShowReportModal(false)}
          onDownload={downloadJsonReport}
          fogClearedCount={fogClearedSet.size}
          totalProgramCount={programs.length}
        />
      )}

    </div>
  );
};
