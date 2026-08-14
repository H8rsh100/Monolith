package com.monolith.parser.model;

import java.util.ArrayList;
import java.util.List;

public class JclStep {
    private String stepName;
    private String program;
    private List<DdStatement> ddStatements = new ArrayList<>();

    public JclStep() {}

    public JclStep(String stepName, String program) {
        this.stepName = stepName;
        this.program = program;
    }

    public String getStepName() { return stepName; }
    public void setStepName(String stepName) { this.stepName = stepName; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public List<DdStatement> getDdStatements() { return ddStatements; }
    public void setDdStatements(List<DdStatement> ddStatements) { this.ddStatements = ddStatements; }
}
