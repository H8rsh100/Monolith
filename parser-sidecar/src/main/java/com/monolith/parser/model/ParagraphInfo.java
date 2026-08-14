package com.monolith.parser.model;

public class ParagraphInfo {
    private String name;
    private int statementCount;
    private int cyclomaticComplexity;

    public ParagraphInfo() {}

    public ParagraphInfo(String name, int statementCount, int cyclomaticComplexity) {
        this.name = name;
        this.statementCount = statementCount;
        this.cyclomaticComplexity = cyclomaticComplexity;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getStatementCount() { return statementCount; }
    public void setStatementCount(int statementCount) { this.statementCount = statementCount; }

    public int getCyclomaticComplexity() { return cyclomaticComplexity; }
    public void setCyclomaticComplexity(int cyclomaticComplexity) { this.cyclomaticComplexity = cyclomaticComplexity; }
}
