package com.monolith.parser.model;

public class DataFieldInfo {
    private String level;
    private String name;
    private String picClause;
    private String redefines;

    public DataFieldInfo() {}

    public DataFieldInfo(String level, String name, String picClause, String redefines) {
        this.level = level;
        this.name = name;
        this.picClause = picClause;
        this.redefines = redefines;
    }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPicClause() { return picClause; }
    public void setPicClause(String picClause) { this.picClause = picClause; }

    public String getRedefines() { return redefines; }
    public void setRedefines(String redefines) { this.redefines = redefines; }
}
