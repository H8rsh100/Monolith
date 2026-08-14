package com.monolith.parser.model;

import java.util.ArrayList;
import java.util.List;

public class JclJob {
    private String jobName;
    private List<JclStep> steps = new ArrayList<>();

    public JclJob() {}

    public JclJob(String jobName) {
        this.jobName = jobName;
    }

    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }

    public List<JclStep> getSteps() { return steps; }
    public void setSteps(List<JclStep> steps) { this.steps = steps; }
}
