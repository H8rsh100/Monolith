package com.monolith.parser.model;

public class DdStatement {
    private String ddName;
    private String dsn;

    public DdStatement() {}

    public DdStatement(String ddName, String dsn) {
        this.ddName = ddName;
        this.dsn = dsn;
    }

    public String getDdName() { return ddName; }
    public void setDdName(String ddName) { this.ddName = ddName; }

    public String getDsn() { return dsn; }
    public void setDsn(String dsn) { this.dsn = dsn; }
}
