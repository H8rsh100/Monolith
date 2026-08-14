package com.monolith.parser.model;

import java.util.ArrayList;
import java.util.List;

public class SqlBlockInfo {
    private String type; // SQL or CICS
    private String rawText;
    private List<String> targetTables = new ArrayList<>();

    public SqlBlockInfo() {}

    public SqlBlockInfo(String type, String rawText, List<String> targetTables) {
        this.type = type;
        this.rawText = rawText;
        this.targetTables = targetTables != null ? targetTables : new ArrayList<>();
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }

    public List<String> getTargetTables() { return targetTables; }
    public void setTargetTables(List<String> targetTables) { this.targetTables = targetTables; }
}
