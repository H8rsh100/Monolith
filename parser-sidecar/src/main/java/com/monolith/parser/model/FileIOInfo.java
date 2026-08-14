package com.monolith.parser.model;

public class FileIOInfo {
    private String name;
    private String mode;
    private String organization;
    private String assignTo;

    public FileIOInfo() {}

    public FileIOInfo(String name, String mode, String organization, String assignTo) {
        this.name = name;
        this.mode = mode;
        this.organization = organization;
        this.assignTo = assignTo;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getAssignTo() { return assignTo; }
    public void setAssignTo(String assignTo) { this.assignTo = assignTo; }
}
