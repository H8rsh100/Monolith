import React, { useState, useEffect } from 'react';
import { SurveyorHeader } from './components/SurveyorHeader';
import { StrataGraphView } from './components/StrataGraphView';
import { StrataRiskMatrixView } from './components/StrataRiskMatrixView';
import { StrataProgramDetailView } from './components/StrataProgramDetailView';
import { StrataCodegenView } from './components/StrataCodegenView';
import { StrataReportModal } from './components/StrataReportModal';
import { api, ProgramSummary, ProgramDetail, CodegenResult, ExecutiveReport } from './api';

const INITIAL_GRAPH = {
  nodes: [
    { id: "jcl_BATJOB01", type: "jcl_job", position: { x: 200, y: 50 }, data: { label: "BATJOB01", name: "BATJOB01", nodeType: "jcl_job", riskScore: 15, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 16 } },
    { id: "jcl_BATJOB02", type: "jcl_job", position: { x: 550, y: 50 }, data: { label: "BATJOB02", name: "BATJOB02", nodeType: "jcl_job", riskScore: 15, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 14 } },
    
    { id: "cpy_CUSTREC", type: "copybook", position: { x: 120, y: 200 }, data: { label: "CUSTREC", name: "CUSTREC", nodeType: "copybook", riskScore: 0, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 0 } },
    { id: "cpy_ACCTREC", type: "copybook", position: { x: 400, y: 200 }, data: { label: "ACCTREC", name: "ACCTREC", nodeType: "copybook", riskScore: 0, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 0 } },
    { id: "cpy_TXNREC", type: "copybook", position: { x: 680, y: 200 }, data: { label: "TXNREC", name: "TXNREC", nodeType: "copybook", riskScore: 0, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 0 } },

    { id: "prog_CUSTMAIN", type: "program", position: { x: 150, y: 370 }, data: { label: "CUSTMAIN", name: "CUSTMAIN", nodeType: "program", riskScore: 39.3, riskBucket: "Medium", riskColor: "#3b82f6", linesOfCode: 110 } },
    { id: "prog_ACCTPROC", type: "program", position: { x: 440, y: 370 }, data: { label: "ACCTPROC", name: "ACCTPROC", nodeType: "program", riskScore: 45.8, riskBucket: "High", riskColor: "#f97316", linesOfCode: 148 } },

    { id: "file_CUST-FILE", type: "file", position: { x: 140, y: 510 }, data: { label: "CUST-FILE", name: "CUST-FILE", nodeType: "file", riskScore: 0, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 0 } },
    { id: "file_ACCT-FILE", type: "file", position: { x: 440, y: 510 }, data: { label: "ACCT-FILE", name: "ACCT-FILE", nodeType: "file", riskScore: 0, riskBucket: "Low", riskColor: "#10b981", linesOfCode: 0 } },

    { id: "prog_INTRCALC", type: "program", position: { x: 220, y: 660 }, data: { label: "INTRCALC", name: "INTRCALC", nodeType: "program", riskScore: 42.1, riskBucket: "Medium", riskColor: "#3b82f6", linesOfCode: 92 } },
    { id: "prog_TXNLOG", type: "program", position: { x: 580, y: 660 }, data: { label: "TXNLOG", name: "TXNLOG", nodeType: "program", riskScore: 34.1, riskBucket: "Medium", riskColor: "#3b82f6", linesOfCode: 78 } }
  ],
  edges: [
    { id: "e_jcl_BATJOB01_prog_CUSTMAIN", source: "jcl_BATJOB01", target: "prog_CUSTMAIN", label: "EXECUTES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_jcl_BATJOB01_prog_TXNLOG", source: "jcl_BATJOB01", target: "prog_TXNLOG", label: "EXECUTES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_jcl_BATJOB02_prog_ACCTPROC", source: "jcl_BATJOB02", target: "prog_ACCTPROC", label: "EXECUTES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_jcl_BATJOB02_prog_INTRCALC", source: "jcl_BATJOB02", target: "prog_INTRCALC", label: "EXECUTES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },

    { id: "e_prog_CUSTMAIN_cpy_CUSTREC", source: "prog_CUSTMAIN", target: "cpy_CUSTREC", label: "COPIES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_prog_CUSTMAIN_file_CUST-FILE", source: "prog_CUSTMAIN", target: "file_CUST-FILE", label: "ACCESSES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_prog_CUSTMAIN_prog_TXNLOG", source: "prog_CUSTMAIN", target: "prog_TXNLOG", label: "CALLS", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },

    { id: "e_prog_ACCTPROC_cpy_ACCTREC", source: "prog_ACCTPROC", target: "cpy_ACCTREC", label: "COPIES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_prog_ACCTPROC_file_ACCT-FILE", source: "prog_ACCTPROC", target: "file_ACCT-FILE", label: "ACCESSES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_prog_ACCTPROC_prog_INTRCALC", source: "prog_ACCTPROC", target: "prog_INTRCALC", label: "CALLS", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },

    { id: "e_prog_INTRCALC_cpy_ACCTREC", source: "prog_INTRCALC", target: "cpy_ACCTREC", label: "COPIES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } },
    { id: "e_prog_TXNLOG_cpy_TXNREC", source: "prog_TXNLOG", target: "cpy_TXNREC", label: "COPIES", animated: true, style: { stroke: "#1B2A3A", strokeWidth: 1.5 } }
  ]
};

const INITIAL_PROGRAMS: ProgramSummary[] = [
  { programName: "ACCTPROC", linesOfCode: 148, riskScore: 45.8, riskBucket: "High", riskColor: "#f97316", paragraphCount: 3, callCount: 1, copybookCount: 1, hasSqlOrCics: true, hasSpec: true },
  { programName: "INTRCALC", linesOfCode: 92, riskScore: 42.1, riskBucket: "High", riskColor: "#f97316", paragraphCount: 2, callCount: 0, copybookCount: 1, hasSqlOrCics: false, hasSpec: true },
  { programName: "CUSTMAIN", linesOfCode: 110, riskScore: 39.3, riskBucket: "Medium", riskColor: "#3b82f6", paragraphCount: 3, callCount: 1, copybookCount: 1, hasSqlOrCics: true, hasSpec: true },
  { programName: "TXNLOG", linesOfCode: 78, riskScore: 34.1, riskBucket: "Medium", riskColor: "#3b82f6", paragraphCount: 2, callCount: 0, copybookCount: 1, hasSqlOrCics: true, hasSpec: true }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'risk' | 'detail' | 'codegen'>('graph');
  const [codebaseId, setCodebaseId] = useState<string>('demo-cobol');
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>(INITIAL_GRAPH);
  const [programs, setPrograms] = useState<ProgramSummary[]>(INITIAL_PROGRAMS);
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
      if (gData && gData.nodes && gData.nodes.length > 0) {
        setGraphData(gData);
      }
      const progs = await api.getPrograms(res.codebaseId);
      if (progs && progs.length > 0) {
        setPrograms(progs);
        setSelectedProgram(progs[0].programName);
        loadProgramDetail(res.codebaseId, progs[0].programName);
      }
    } catch (e) {
      console.error("Ingest failed, retaining initial graph:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramDetail('demo-cobol', 'CUSTMAIN');
    handleIngest();
  }, []);

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
    a.download = `monolith_survey_report_${codebaseId}.json`;
    a.click();
  };

  const handleSelectProgram = (pname: string) => {
    setSelectedProgram(pname);
    loadProgramDetail(codebaseId, pname);
    setActiveTab('detail');
  };

  return (
    <div className="h-screen w-screen bg-[#EDE6D6] text-[#1B2A3A] flex flex-col overflow-hidden font-sans">
      
      {/* Surveyor Field Notebook Header */}
      <SurveyorHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={handleExportReport}
        onIngest={handleIngest}
        onSummarizeAll={handleSummarizeAll}
        loading={loading}
        selectedProgram={selectedProgram}
      />

      {/* Main Viewport Workspace Container */}
      <main className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden relative">
        {activeTab === 'graph' && (
          <StrataGraphView
            graphData={graphData}
            onSelectProgram={handleSelectProgram}
            onIngest={handleIngest}
            loading={loading}
          />
        )}

        {activeTab === 'risk' && (
          <StrataRiskMatrixView
            programs={programs}
            onSelectProgram={handleSelectProgram}
          />
        )}

        {activeTab === 'detail' && (
          <StrataProgramDetailView
            detail={programDetail}
            codegen={codegen}
            onSummarize={handleSummarizeProgram}
            onGenerateCodegen={() => handleGenerateCodegen()}
            loading={loading}
          />
        )}

        {activeTab === 'codegen' && (
          <StrataCodegenView
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

      {/* Printed Survey Report Modal */}
      {showReportModal && report && (
        <StrataReportModal
          report={report}
          codebaseId={codebaseId}
          onClose={() => setShowReportModal(false)}
          onDownload={downloadJsonReport}
        />
      )}

    </div>
  );
};
