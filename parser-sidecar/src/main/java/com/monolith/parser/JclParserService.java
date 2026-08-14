package com.monolith.parser;

import com.monolith.parser.model.DdStatement;
import com.monolith.parser.model.JclJob;
import com.monolith.parser.model.JclStep;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JclParserService {

    private static final Pattern JOB_PATTERN = Pattern.compile("(?i)^//([A-Z0-9_-]+)\\s+JOB");
    private static final Pattern STEP_PATTERN = Pattern.compile("(?i)^//([A-Z0-9_-]+)\\s+EXEC\\s+PGM=([A-Z0-9_-]+)");
    private static final Pattern DD_PATTERN = Pattern.compile("(?i)^//([A-Z0-9_-]+)\\s+DD\\s+DSN=([A-Z0-9_\\-\\.\\(\\)]+)");

    public JclJob parseJclFile(File jclFile) throws IOException {
        String content = FileUtils.readFileToString(jclFile, StandardCharsets.UTF_8);
        String[] lines = content.split("\\r?\\n");

        JclJob job = new JclJob();
        String baseName = jclFile.getName();
        int dotIdx = baseName.lastIndexOf('.');
        job.setJobName(dotIdx > 0 ? baseName.substring(0, dotIdx) : baseName);

        JclStep currentStep = null;

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("//*") || !trimmed.startsWith("//")) continue;

            Matcher jobMatcher = JOB_PATTERN.matcher(trimmed);
            if (jobMatcher.find()) {
                job.setJobName(jobMatcher.group(1));
                continue;
            }

            Matcher stepMatcher = STEP_PATTERN.matcher(trimmed);
            if (stepMatcher.find()) {
                currentStep = new JclStep(stepMatcher.group(1), stepMatcher.group(2));
                job.getSteps().add(currentStep);
                continue;
            }

            Matcher ddMatcher = DD_PATTERN.matcher(trimmed);
            if (ddMatcher.find() && currentStep != null) {
                currentStep.getDdStatements().add(new DdStatement(ddMatcher.group(1), ddMatcher.group(2)));
            }
        }

        return job;
    }
}
