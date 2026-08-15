import os
import json
import re
import subprocess
from typing import List, Optional
from pydantic import BaseModel, Field
from app.config import settings

class ParagraphInfo(BaseModel):
    name: str
    statementCount: int = 0
    cyclomaticComplexity: int = 1

class FileIOInfo(BaseModel):
    name: str
    mode: str = "INPUT-OUTPUT"
    organization: str = "SEQUENTIAL"
    assignTo: str = ""

class SqlBlockInfo(BaseModel):
    type: str = "SQL"
    rawText: str
    crudType: str = "READ"
    targetTables: List[str] = Field(default_factory=list)

class DataFieldInfo(BaseModel):
    level: str = "01"
    name: str
    picClause: str = ""
    redefines: str = ""
    conditionValues: List[str] = Field(default_factory=list)

class ProgramAnalysis(BaseModel):
    programName: str
    linesOfCode: int = 0
    dynamicCalls: bool = False
    paragraphs: List[ParagraphInfo] = Field(default_factory=list)
    calls: List[str] = Field(default_factory=list)
    copybooks: List[str] = Field(default_factory=list)
    fileIO: List[FileIOInfo] = Field(default_factory=list)
    sqlBlocks: List[SqlBlockInfo] = Field(default_factory=list)
    dataDivision: List[DataFieldInfo] = Field(default_factory=list)
    rawSource: Optional[str] = None

class DdStatement(BaseModel):
    ddName: str
    dsn: str

class JclStep(BaseModel):
    stepName: str
    program: str
    ddStatements: List[DdStatement] = Field(default_factory=list)

class JclJob(BaseModel):
    jobName: str
    steps: List[JclStep] = Field(default_factory=list)


def classify_crud(sql_text: str) -> str:
    upper = sql_text.upper()
    if "INSERT" in upper or "WRITE" in upper:
        return "WRITE"
    elif "UPDATE" in upper or "SET" in upper:
        return "UPDATE"
    elif "DELETE" in upper or "DROP" in upper:
        return "DELETE"
    return "READ"


class ParserClient:
    def __init__(self, jar_path: str = settings.PARSER_JAR_PATH):
        self.jar_path = jar_path

    def parse_codebase(self, codebase_dir: str) -> tuple[List[ProgramAnalysis], List[JclJob]]:
        programs: List[ProgramAnalysis] = []
        jcl_jobs: List[JclJob] = []

        output_dir = os.path.join(codebase_dir, ".parsed_json")
        os.makedirs(output_dir, exist_ok=True)

        env = os.environ.copy()
        env["JAVA_HOME"] = settings.JAVA_HOME

        if os.path.exists(self.jar_path):
            try:
                cmd = [
                    "java", "-jar", self.jar_path,
                    "parseDirectory", codebase_dir, output_dir, codebase_dir
                ]
                subprocess.run(cmd, check=True, capture_output=True, text=True, env=env)

                for fname in os.listdir(output_dir):
                    fpath = os.path.join(output_dir, fname)
                    if fname.endswith(".jcl.json"):
                        with open(fpath, "r", encoding="utf-8") as f:
                            jcl_jobs.append(JclJob(**json.load(f)))
                    elif fname.endswith(".json"):
                        with open(fpath, "r", encoding="utf-8") as f:
                            data = json.load(f)
                            prog = ProgramAnalysis(**data)
                            for sb in prog.sqlBlocks:
                                sb.crudType = classify_crud(sb.rawText)
                            cbl_path = os.path.join(codebase_dir, f"{prog.programName}.cbl")
                            if os.path.exists(cbl_path):
                                with open(cbl_path, "r", encoding="utf-8", errors="ignore") as cbl_file:
                                    prog.rawSource = cbl_file.read()
                            programs.append(prog)

                if programs or jcl_jobs:
                    return programs, jcl_jobs
            except Exception as e:
                print(f"[ParserClient] Sidecar JAR execution notice, falling back to native parser: {e}")

        # Native Python fallback parser
        return self._native_parse_codebase(codebase_dir)

    def _native_parse_codebase(self, codebase_dir: str) -> tuple[List[ProgramAnalysis], List[JclJob]]:
        programs: List[ProgramAnalysis] = []
        jcl_jobs: List[JclJob] = []

        for root, _, files in os.walk(codebase_dir):
            for file in files:
                fpath = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                if ext in [".cbl", ".cob"]:
                    prog = self._parse_single_cobol(fpath)
                    programs.append(prog)
                elif ext == ".jcl":
                    jcl = self._parse_single_jcl(fpath)
                    jcl_jobs.append(jcl)

        return programs, jcl_jobs

    def _parse_single_cobol(self, filepath: str) -> ProgramAnalysis:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        basename = os.path.splitext(os.path.basename(filepath))[0]
        pid_match = re.search(r"(?i)PROGRAM-ID\.\s*([A-Z0-9_-]+)", content)
        pname = pid_match.group(1) if pid_match else basename

        lines = [line for line in content.splitlines() if line.strip() and not line.strip().startswith(("*", "/"))]
        loc = len(lines)

        copybooks = list(set(re.findall(r"(?i)\bCOPY\s+([A-Z0-9_-]+)", content)))
        static_calls = list(set(re.findall(r'(?i)\bCALL\s+"([^"]+)"', content)))

        dynamic_calls = False
        all_calls = re.findall(r"(?i)\bCALL\s+([A-Z0-9_-]+)", content)
        for c in all_calls:
            if c.upper() != "USING" and not c.startswith('"') and c not in static_calls:
                dynamic_calls = True

        file_io = []
        selects = re.finditer(r"(?i)\bSELECT\s+([A-Z0-9_-]+)\s+ASSIGN\s+TO\s+[\"']?([^\"'\s\.]+)", content)
        for s in selects:
            file_io.append(FileIOInfo(name=s.group(1), assignTo=s.group(2)))

        sql_blocks = []
        for sql in re.finditer(r"(?i)EXEC\s+SQL\s+(.*?)\s+END-EXEC", content, re.DOTALL):
            raw = sql.group(1).strip()
            tables = re.findall(r"(?i)\b(?:FROM|INTO|UPDATE|JOIN)\s+([A-Z0-9_]+)", raw)
            crud = classify_crud(raw)
            sql_blocks.append(SqlBlockInfo(type="SQL", rawText=raw, crudType=crud, targetTables=list(set(tables))))

        for cics in re.finditer(r"(?i)EXEC\s+CICS\s+(.*?)\s+END-EXEC", content, re.DOTALL):
            raw_cics = cics.group(1).strip()
            crud = classify_crud(raw_cics)
            sql_blocks.append(SqlBlockInfo(type="CICS", rawText=raw_cics, crudType=crud, targetTables=[]))

        data_fields = []
        for df in re.finditer(r"(?i)^\s*(01|05|77|88)\s+([A-Z0-9_-]+)(?:\s+REDEFINES\s+([A-Z0-9_-]+))?(?:\s+PIC\s+([A-Z0-9\(\)\.V]+))?(?:\s+VALUE\s+[\"']?([^\"'\s\.]+))?", content, re.MULTILINE):
            val = df.group(5)
            c_vals = [val] if val else []
            data_fields.append(DataFieldInfo(level=df.group(1), name=df.group(2), picClause=df.group(4) or "", redefines=df.group(3) or "", conditionValues=c_vals))

        paragraphs = []
        proc_match = re.search(r"(?i)PROCEDURE DIVISION", content)
        if proc_match:
            proc_body = content[proc_match.end():]
            current_para = "MAIN-PROCEDURE"
            stmt_cnt = 0
            complexity = 1
            for line in proc_body.splitlines():
                t = line.strip()
                if t.startswith(("*", "/")): continue
                header = re.match(r"(?i)^\s*([A-Z0-9_-]+)\.\s*$", t)
                if header and not header.group(1).upper().startswith(("PROCEDURE", "DECLARATIVES")):
                    paragraphs.append(ParagraphInfo(name=current_para, statementCount=stmt_cnt, cyclomaticComplexity=complexity))
                    current_para = header.group(1).upper()
                    stmt_cnt = 0
                    complexity = 1
                    continue
                if t.endswith("."): stmt_cnt += 1
                u = t.upper()
                if " IF " in u or u.startswith("IF "): complexity += 1
                if " EVALUATE " in u or u.startswith("EVALUATE "): complexity += 1
                if " WHEN " in u or u.startswith("WHEN "): complexity += 1
                if " UNTIL " in u: complexity += 1

            paragraphs.append(ParagraphInfo(name=current_para, statementCount=max(1, stmt_cnt), cyclomaticComplexity=complexity))

        return ProgramAnalysis(
            programName=pname,
            linesOfCode=loc,
            dynamicCalls=dynamic_calls,
            paragraphs=paragraphs,
            calls=static_calls,
            copybooks=copybooks,
            fileIO=file_io,
            sqlBlocks=sql_blocks,
            dataDivision=data_fields,
            rawSource=content
        )

    def _parse_single_jcl(self, filepath: str) -> JclJob:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        basename = os.path.splitext(os.path.basename(filepath))[0]
        job = JclJob(jobName=basename)
        current_step = None

        for line in content.splitlines():
            t = line.strip()
            if t.startswith("//*") or not t.startswith("//"): continue
            jm = re.search(r"(?i)^//([A-Z0-9_-]+)\s+JOB", t)
            if jm:
                job.jobName = jm.group(1)
                continue
            sm = re.search(r"(?i)^//([A-Z0-9_-]+)\s+EXEC\s+PGM=([A-Z0-9_-]+)", t)
            if sm:
                current_step = JclStep(stepName=sm.group(1), program=sm.group(2))
                job.steps.append(current_step)
                continue
            ddm = re.search(r"(?i)^//([A-Z0-9_-]+)\s+DD\s+DSN=([A-Z0-9_\-\.\(\)]+)", t)
            if ddm and current_step:
                current_step.ddStatements.append(DdStatement(ddName=ddm.group(1), dsn=ddm.group(2)))

        return job
