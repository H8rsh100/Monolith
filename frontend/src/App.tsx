import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GraphView } from './components/GraphView';
import { RiskMatrixView } from './components/RiskMatrixView';
import { ProgramDetailView } from './components/ProgramDetailView';
import { CodegenView } from './components/CodegenView';
import { api, ProgramSummary, ProgramDetail, CodegenResult, ExecutiveReport } from './api';
import { X, Download, ShieldCheck, Clock, FileCode } from 'lucide-react';

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

  const loadData = async (cid: string) => {
    try {
      setLoading(true);
      const gData = await api.getGraph(cid);
      setGraphData(gData);

      const progs = await api.getPrograms(cid);
      setPrograms(progs);

      if (progs.length > 0) {
        const defaultProg = progs[0].programName;
        setSelectedProgram(defaultProg);
        loadProgramDetail(cid, defaultProg);
      }
    } catch (e) {
      console.warn("Auto-ingesting demo codebase...");
      await handleIngest();
    } finally {
      setLoading(false);
    }
  };

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
    } flexively: {
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
    a.download = `monolith_migration_report_${codebaseId}.json`;
    a.click();
  };

  const handleSelectProgram = (pname: string) => {
    setSelectedProgram(pname);
    loadProgramDetail(codebaseId, pname);
    setActiveTab('detail');
  };

  useEffect(() => {
    loadData(codebaseId);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        codebaseId={codebaseId}
        onIngest={handleIngest}
        onSummarizeAll={handleSummarizeAll}
        onExportReport={handleExportReport}
        loading={loading}
        selectedProgram={selectedProgram}
      />

      <main className="flex-1 overflow-hidden">
        {activeTab === 'graph' && (
          <GraphView graphData={graphData} onSelectProgram={handleSelectProgram} />
        )}

        {activeTab === 'risk' && (
          <RiskMatrixView programs={programs} onSelectProgram={handleSelectProgram} />
        )}

        {activeTab === 'detail' && (
          <ProgramDetailView
            detail={programDetail}
            codegen={codegen}
            onSummarize={handleSummarizeProgram}
            onGenerateCodegen={() => handleGenerateCodegen()}
            loading={loading}
          />
        )}

        {activeTab === 'codegen' && (
          <CodegenView
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

      {/* Executive Report Modal */}
      {showReportModal && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl overflow-hidden shadow-2xl border-slate-700">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-purple-400" />
                <h3 className="font-bold font-mono text-lg text-white">Executive Migration Audit Report</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-mono text-xs text-slate-300">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <FileCode className="h-5 w-5 text-sky-400 mx-auto mb-1" />
                  <span className="text-slate-400 text-[11px] uppercase">COBOL Codebase</span>
                  <div className="text-xl font-bold text-white mt-1">{report.summary.totalCobolLoc} LOC</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <Clock className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-slate-400 text-[11px] uppercase">Estimated Effort</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{report.summary.estimatedEffortPersonDays} Days</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <ShieldCheck className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                  <span className="text-slate-400 text-[11px] uppercase">Average System Risk</span>
                  <div className="text-xl font-bold text-purple-300 mt-1">{report.summary.averageRiskScore}/100</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 uppercase mb-2">System Program Portfolio ({report.summary.totalPrograms} Programs)</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                  {report.programDetails.map((pd) => (
                    <div key={pd.name} className="p-3 flex items-center justify-between bg-slate-900/40 hover:bg-slate-900">
                      <span className="font-bold text-sky-400">{pd.name}.cbl</span>
                      <span className="text-slate-400">{pd.loc} LOC</span>
                      <span className="text-slate-400">{pd.paragraphsCount} Paragraphs</span>
                      <span className="font-bold text-emerald-400">{pd.effortPersonDays} Days Effort</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Codebase ID: {codebaseId}</span>
              <button
                onClick={downloadJsonReport}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold shadow-md flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Audit Report (JSON)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
