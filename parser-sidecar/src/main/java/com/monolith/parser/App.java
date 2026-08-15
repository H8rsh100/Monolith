package com.monolith.parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.monolith.parser.model.*;

import java.io.File;

public class App {

    private static final ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    private static final CobolParserService cobolParser = new CobolParserService();
    private static final JclParserService jclParser = new JclParserService();

    public static void main(String[] args) {
        if (args.length < 2) {
            printUsage();
            System.exit(1);
        }

        String mode = args[0];

        try {
            switch (mode) {
                case "parse":
                    File cobolFile = new File(args[1]);
                    File copybookDir = args.length > 2 ? new File(args[2]) : cobolFile.getParentFile();
                    ProgramAnalysis analysis = cobolParser.parseCobolFile(cobolFile, copybookDir);
                    System.out.println(mapper.writeValueAsString(analysis));
                    break;

                case "parseJcl":
                    File jclFile = new File(args[1]);
                    JclJob job = jclParser.parseJclFile(jclFile);
                    System.out.println(mapper.writeValueAsString(job));
                    break;

                case "parseDirectory":
                    File inputDir = new File(args[1]);
                    File outputDir = new File(args[2]);
                    if (!outputDir.exists()) outputDir.mkdirs();

                    File copyDir = args.length > 3 ? new File(args[3]) : inputDir;

                    File[] files = inputDir.listFiles();
                    if (files != null) {
                        for (File file : files) {
                            String name = file.getName().toLowerCase();
                            if (name.endsWith(".cbl") || name.endsWith(".cob")) {
                                ProgramAnalysis prog = cobolParser.parseCobolFile(file, copyDir);
                                File outFile = new File(outputDir, prog.getProgramName() + ".json");
                                mapper.writeValue(outFile, prog);
                                System.out.println("Parsed COBOL program: " + prog.getProgramName() + " -> " + outFile.getPath());
                            } else if (name.endsWith(".jcl")) {
                                JclJob jcl = jclParser.parseJclFile(file);
                                File outFile = new File(outputDir, jcl.getJobName() + ".jcl.json");
                                mapper.writeValue(outFile, jcl);
                                System.out.println("Parsed JCL job: " + jcl.getJobName() + " -> " + outFile.getPath());
                            }
                        }
                    }
                    System.out.println("Directory batch parsing complete.");
                    break;

                default:
                    System.err.println("Unknown command mode: " + mode);
                    printUsage();
                    System.exit(1);
            }
        } catch (Exception e) {
            System.err.println("Error executing parser mode [" + mode + "]: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void printUsage() {
        System.out.println("Monolith Parser Sidecar CLI");
        System.out.println("Usage:");
        System.out.println("  java -jar parser-sidecar.jar parse <file.cbl> [copybook-dir]");
        System.out.println("  java -jar parser-sidecar.jar parseJcl <file.jcl>");
        System.out.println("  java -jar parser-sidecar.jar parseDirectory <input-dir> <output-dir> [copybook-dir]");
    }
}
