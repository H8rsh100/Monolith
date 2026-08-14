package com.monolith.parser.model;

import java.util.ArrayList;
import java.util.List;

public class ProgramAnalysis {
    private String programName;
    private int linesOfCode;
    private boolean dynamicCalls;
    private List<ParagraphInfo> paragraphs = new ArrayList<>();
    private List<String> calls = new ArrayList<>();
    private List<String> copybooks = new ArrayList<>();
    private List<FileIOInfo> fileIO = new ArrayList<>();
    private List<SqlBlockInfo> sqlBlocks = new ArrayList<>();
    private List<DataFieldInfo> dataDivision = new ArrayList<>();

    public ProgramAnalysis() {}

    public String getProgramName() { return programName; }
    public void setProgramName(String programName) { this.programName = programName; }

    public int getLinesOfCode() { return linesOfCode; }
    public void setLinesOfCode(int linesOfCode) { this.linesOfCode = linesOfCode; }

    public boolean isDynamicCalls() { return dynamicCalls; }
    public void setDynamicCalls(boolean dynamicCalls) { this.dynamicCalls = dynamicCalls; }

    public List<ParagraphInfo> getParagraphs() { return paragraphs; }
    public void setParagraphs(List<ParagraphInfo> paragraphs) { this.paragraphs = paragraphs; }

    public List<String> getCalls() { return calls; }
    public void setCalls(List<String> calls) { this.calls = calls; }

    public List<String> getCopybooks() { return copybooks; }
    public void setCopybooks(List<String> copybooks) { this.copybooks = copybooks; }

    public List<FileIOInfo> getFileIO() { return fileIO; }
    public void setFileIO(List<FileIOInfo> fileIO) { this.fileIO = fileIO; }

    public List<SqlBlockInfo> getSqlBlocks() { return sqlBlocks; }
    public void setSqlBlocks(List<SqlBlockInfo> sqlBlocks) { this.sqlBlocks = sqlBlocks; }

    public List<DataFieldInfo> getDataDivision() { return dataDivision; }
    public void setDataDivision(List<DataFieldInfo> dataDivision) { this.dataDivision = dataDivision; }
}
