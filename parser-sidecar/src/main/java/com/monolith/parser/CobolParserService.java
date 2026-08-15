package com.monolith.parser;

import com.monolith.parser.model.*;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CobolParserService {

    private static final Pattern PROGRAM_ID_PATTERN = Pattern.compile("(?i)PROGRAM-ID\\.\\s*([A-Z0-9_-]+)");
    private static final Pattern COPY_PATTERN = Pattern.compile("(?i)\\bCOPY\\s+([A-Z0-9_-]+)");
    private static final Pattern CALL_STATIC_PATTERN = Pattern.compile("(?i)\\bCALL\\s+\"([^\"]+)\"");
    private static final Pattern CALL_DYNAMIC_PATTERN = Pattern.compile("(?i)\\bCALL\\s+([A-Z0-9_-]+)");
    private static final Pattern SELECT_PATTERN = Pattern.compile("(?i)\\bSELECT\\s+([A-Z0-9_-]+)\\s+ASSIGN\\s+TO\\s+[\"']?([^\"'\\s\\.]+)", Pattern.MULTILINE);
    private static final Pattern ORG_PATTERN = Pattern.compile("(?i)\\bORGANIZATION\\s+IS\\s+([A-Z0-9_-]+)");
    private static final Pattern EXEC_SQL_PATTERN = Pattern.compile("(?i)EXEC\\s+SQL\\s+(.*?)\\s+END-EXEC", Pattern.DOTALL);
    private static final Pattern EXEC_CICS_PATTERN = Pattern.compile("(?i)EXEC\\s+CICS\\s+(.*?)\\s+END-EXEC", Pattern.DOTALL);
    private static final Pattern SQL_TABLE_PATTERN = Pattern.compile("(?i)\\b(?:FROM|INTO|UPDATE|JOIN)\\s+([A-Z0-9_]+)");
    private static final Pattern DATA_ALL_PATTERN = Pattern.compile("(?i)^\\s*(01|05|77|88)\\s+([A-Z0-9_-]+)(?:\\s+REDEFINES\\s+([A-Z0-9_-]+))?(?:\\s+PIC\\s+([A-Z0-9\\(\\)\\.V]+))?(?:\\s+VALUE\\s+[\"']?([^\"'\\s\\.]+))?", Pattern.MULTILINE);
    private static final Pattern PARAGRAPH_HEADER_PATTERN = Pattern.compile("(?i)^\\s*([A-Z0-9_-]+)\\.\\s*$", Pattern.MULTILINE);

    public ProgramAnalysis parseCobolFile(File cobolFile, File copybookDir) throws IOException {
        String content = FileUtils.readFileToString(cobolFile, StandardCharsets.UTF_8);
        ProgramAnalysis analysis = new ProgramAnalysis();

        // Count lines of code excluding comments
        String[] lines = content.split("\\r?\\n");
        int loc = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && !trimmed.startsWith("*") && !trimmed.startsWith("/")) {
                loc++;
            }
        }
        analysis.setLinesOfCode(loc);

        // Program Name
        Matcher pIdMatcher = PROGRAM_ID_PATTERN.matcher(content);
        if (pIdMatcher.find()) {
            analysis.setProgramName(pIdMatcher.group(1).trim());
        } else {
            String baseName = cobolFile.getName();
            int dotIdx = baseName.lastIndexOf('.');
            analysis.setProgramName(dotIdx > 0 ? baseName.substring(0, dotIdx) : baseName);
        }

        // COPY Statements
        Set<String> copybooks = new LinkedHashSet<>();
        Matcher copyMatcher = COPY_PATTERN.matcher(content);
        while (copyMatcher.find()) {
            copybooks.add(copyMatcher.group(1).trim());
        }
        analysis.setCopybooks(new ArrayList<>(copybooks));

        // CALL Statements
        Set<String> calls = new LinkedHashSet<>();
        boolean hasDynamic = false;
        Matcher callStaticMatcher = CALL_STATIC_PATTERN.matcher(content);
        while (callStaticMatcher.find()) {
            calls.add(callStaticMatcher.group(1).trim());
        }

        // Check for dynamic calls
        Matcher callDynMatcher = CALL_DYNAMIC_PATTERN.matcher(content);
        while (callDynMatcher.find()) {
            String target = callDynMatcher.group(1).trim();
            if (!target.equalsIgnoreCase("USING") && !target.startsWith("\"") && !calls.contains(target)) {
                hasDynamic = true;
            }
        }
        analysis.setCalls(new ArrayList<>(calls));
        analysis.setDynamicCalls(hasDynamic);

        // File I/O
        List<FileIOInfo> fileIOList = new ArrayList<>();
        Matcher selectMatcher = SELECT_PATTERN.matcher(content);
        while (selectMatcher.find()) {
            String fileName = selectMatcher.group(1);
            String assignTo = selectMatcher.group(2);
            String org = "SEQUENTIAL";
            Matcher orgMatcher = ORG_PATTERN.matcher(content);
            if (orgMatcher.find()) {
                org = orgMatcher.group(1);
            }
            fileIOList.add(new FileIOInfo(fileName, "INPUT-OUTPUT", org, assignTo));
        }
        analysis.setFileIO(fileIOList);

        // EXEC SQL Blocks
        List<SqlBlockInfo> sqlBlocks = new ArrayList<>();
        Matcher sqlMatcher = EXEC_SQL_PATTERN.matcher(content);
        while (sqlMatcher.find()) {
            String rawSql = sqlMatcher.group(1).trim();
            List<String> tables = new ArrayList<>();
            Matcher tableMatcher = SQL_TABLE_PATTERN.matcher(rawSql);
            while (tableMatcher.find()) {
                tables.add(tableMatcher.group(1));
            }
            sqlBlocks.add(new SqlBlockInfo("SQL", rawSql, tables));
        }

        // EXEC CICS Blocks
        Matcher cicsMatcher = EXEC_CICS_PATTERN.matcher(content);
        while (cicsMatcher.find()) {
            String rawCics = cicsMatcher.group(1).trim();
            sqlBlocks.add(new SqlBlockInfo("CICS", rawCics, Collections.emptyList()));
        }
        analysis.setSqlBlocks(sqlBlocks);

        // Data Division Layouts (01, 05, 77, 88 levels)
        List<DataFieldInfo> dataFields = new ArrayList<>();
        Matcher dataMatcher = DATA_ALL_PATTERN.matcher(content);
        while (dataMatcher.find()) {
            String lvl = dataMatcher.group(1);
            String fName = dataMatcher.group(2);
            String redefines = dataMatcher.group(3);
            String pic = dataMatcher.group(4);
            String val = dataMatcher.group(5);
            DataFieldInfo field = new DataFieldInfo(lvl, fName, pic != null ? pic : "", redefines != null ? redefines : "");
            if (val != null && !val.isEmpty()) {
                field.getConditionValues().add(val);
            }
            dataFields.add(field);
        }
        analysis.setDataDivision(dataFields);

        // Procedure Division Paragraphs & Cyclomatic Complexity
        analysis.setParagraphs(extractParagraphs(content));

        return analysis;
    }

    private List<ParagraphInfo> extractParagraphs(String content) {
        List<ParagraphInfo> paragraphs = new ArrayList<>();
        int procIdx = content.toUpperCase().indexOf("PROCEDURE DIVISION");
        if (procIdx < 0) {
            return paragraphs;
        }

        String procBody = content.substring(procIdx);
        String[] lines = procBody.split("\\r?\\n");
        
        String currentPara = "MAIN-PROCEDURE";
        int stmtCount = 0;
        int complexity = 1;

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("*") || trimmed.startsWith("/")) continue;

            Matcher headerMatcher = PARAGRAPH_HEADER_PATTERN.matcher(trimmed);
            if (headerMatcher.matches()) {
                String candidate = headerMatcher.group(1).toUpperCase();
                if (!candidate.startsWith("PROCEDURE") && !candidate.startsWith("DECLARATIVES")) {
                    if (stmtCount > 0 || !currentPara.equals("MAIN-PROCEDURE")) {
                        paragraphs.add(new ParagraphInfo(currentPara, stmtCount, complexity));
                    }
                    currentPara = candidate;
                    stmtCount = 0;
                    complexity = 1;
                    continue;
                }
            }

            if (trimmed.endsWith(".")) {
                stmtCount++;
            }

            String upper = trimmed.toUpperCase();
            if (upper.contains(" IF ") || upper.startsWith("IF ")) complexity++;
            if (upper.contains(" EVALUATE ") || upper.startsWith("EVALUATE ")) complexity++;
            if (upper.contains(" WHEN ") || upper.startsWith("WHEN ")) complexity++;
            if (upper.contains(" UNTIL ") || upper.contains(" VARYING ")) complexity++;
            if (upper.contains(" ON SIZE ERROR ")) complexity++;
            if (upper.contains(" AT END ")) complexity++;
        }

        paragraphs.add(new ParagraphInfo(currentPara, Math.max(1, stmtCount), complexity));
        return paragraphs;
    }
}
