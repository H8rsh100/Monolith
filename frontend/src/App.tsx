import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GraphView } from './components/GraphView';
import { RiskMatrixView } from './components/RiskMatrixView';
import { ProgramDetailView } from './components/ProgramDetailView';
import { CodegenView } from './components/CodegenView';
import { api, ProgramSummary, ProgramDetail, CodegenResult } from './api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'risk' | 'detail' | 'codegen'>('graph');
  const [codebaseId, setCodebaseId] = useState<string>('demo-cobol');
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('CUSTMAIN');
  const [programDetail, setProgramDetail] = useState<ProgramDetail | null>(null);
  const [codegen, setCodegen] = useState<CodegenResult | null>(null);
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

  const handleGenerateCodegen = async (pname?: string) => {
    const target = pname || selectedProgram;
    if (!target) return;
    try {
      setLoading(true);
      const res = await api.generateCodegen(codebaseId, target);
      setCodegen(res);
    } catch (e) {
      console.error("Codegen failed:", e);
    } finally {
      setLoading(false);
    }
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
            onGenerateCodegen={handleGenerateCodegen}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};
