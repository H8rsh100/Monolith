import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export interface ProgramSummary {
  programName: string;
  linesOfCode: number;
  riskScore: number;
  riskBucket: string;
  riskColor: string;
  paragraphCount: number;
  callCount: number;
  copybookCount: number;
  hasSqlOrCics: boolean;
  hasSpec: boolean;
}

export interface ProgramDetail {
  program: {
    programName: string;
    linesOfCode: number;
    dynamicCalls: boolean;
    paragraphs: Array<{ name: string; statementCount: number; cyclomaticComplexity: number }>;
    calls: string[];
    copybooks: string[];
    fileIO: Array<{ name: string; mode: string; organization: string; assignTo: string }>;
    sqlBlocks: Array<{ type: string; rawText: string; crudType?: string; targetTables: string[] }>;
    dataDivision: Array<{ level: string; name: string; picClause: string; redefines: string; conditionValues?: string[] }>;
    rawSource?: string;
  };
  risk: {
    score: number;
    bucket: string;
    color: string;
    migrationEffort?: {
      personDays: number;
      targetPythonLoc: number;
      complexityFactor: number;
    };
    breakdown: {
      totalComplexity: number;
      complexityScore: number;
      callersCount: number;
      calleesCount: number;
      blastRadiusScore: number;
      hasSqlOrCics: boolean;
      sqlPenaltyScore: number;
      linesOfCode: number;
      locScore: number;
    };
  };
  spec?: {
    summary: string;
    businessRules: string[];
    inputs: string[];
    outputs: string[];
    edgeCases: string[];
    migrationNotes: string;
  };
}

export interface CodegenResult {
  stubFilename: string;
  stubCode: string;
  testFilename: string;
  testCode: string;
  language?: string;
}

export interface ExecutiveReport {
  codebaseId: string;
  summary: {
    totalPrograms: number;
    totalJclJobs: number;
    totalCobolLoc: number;
    estimatedTargetLoc: number;
    averageRiskScore: number;
    estimatedEffortPersonDays: number;
    riskBucketDistribution: Record<string, number>;
  };
  programDetails: Array<{
    name: string;
    loc: number;
    riskScore: number;
    riskBucket: string;
    effortPersonDays: number;
    paragraphsCount: number;
    sqlCount: number;
  }>;
}

export const api = {
  async ingestCodebase(codebaseDir: string) {
    const res = await axios.post(`${API_BASE}/codebase/ingest`, { codebase_dir: codebaseDir });
    return res.data;
  },

  async listCodebases() {
    const res = await axios.get(`${API_BASE}/codebases`);
    return res.data;
  },

  async getGraph(codebaseId: string) {
    const res = await axios.get(`${API_BASE}/codebase/${codebaseId}/graph`);
    return res.data;
  },

  async getPrograms(codebaseId: string, riskBucket?: string) {
    const res = await axios.get(`${API_BASE}/codebase/${codebaseId}/programs`, {
      params: { risk_bucket: riskBucket }
    });
    return res.data as ProgramSummary[];
  },

  async getProgramDetail(codebaseId: string, programName: string) {
    const res = await axios.get(`${API_BASE}/codebase/${codebaseId}/programs/${programName}`);
    return res.data as ProgramDetail;
  },

  async summarizeProgram(codebaseId: string, programName: string) {
    const res = await axios.post(`${API_BASE}/codebase/${codebaseId}/programs/${programName}/summarize`);
    return res.data;
  },

  async summarizeAll(codebaseId: string) {
    const res = await axios.post(`${API_BASE}/codebase/${codebaseId}/summarize-all`);
    return res.data;
  },

  async generateCodegen(codebaseId: string, programName: string, lang: string = 'python') {
    const res = await axios.post(`${API_BASE}/codebase/${codebaseId}/programs/${programName}/codegen`, null, {
      params: { lang }
    });
    return res.data as CodegenResult;
  },

  async exportReport(codebaseId: string) {
    const res = await axios.get(`${API_BASE}/codebase/${codebaseId}/export/report`);
    return res.data as ExecutiveReport;
  }
};
