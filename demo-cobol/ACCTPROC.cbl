       IDENTIFICATION DIVISION.
       PROGRAM-ID. ACCTPROC.
       AUTHOR. MAINFRAME TEAM.
      *================================================================*
      * ACCOUNT TRANSACTION PROCESSING MODULE (WITH DB2 SQL)
      *================================================================*
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       COPY ACCTREC.
       01  WS-SQL-VARS.
           05  WS-BAL                PIC 9(10)V99.
           05  WS-ID                 PIC X(12).
           05  WS-STATUS-CODE        PIC S9(04) COMP.

       LINKAGE SECTION.
       COPY CUSTREC.

       PROCEDURE DIVISION USING CUSTOMER-RECORD.
       0000-PROCESS-ACCOUNT.
           DISPLAY "PROCESSING ACCOUNT FOR CUSTOMER: " CUST-ID.
           MOVE CUST-ID TO WS-ID.
           PERFORM 1000-FETCH-DB2-ACCOUNT.
           IF WS-STATUS-CODE = 0 THEN
               PERFORM 2000-CALCULATE-FEE
               CALL "INTRCALC" USING ACCOUNT-RECORD WS-BAL
               PERFORM 3000-UPDATE-DB2-ACCOUNT
           ELSE
               DISPLAY "ACCOUNT FETCH FAILED FOR CUST: " CUST-ID
           END-IF.
           EXIT PROGRAM.

       1000-FETCH-DB2-ACCOUNT.
           EXEC SQL
               SELECT ACCT_BALANCE, ACCT_NUMBER
               INTO :WS-BAL, :ACCT-NUMBER
               FROM BANK_ACCOUNTS
               WHERE CUST_ID = :WS-ID
           END-EXEC.
           MOVE SQLCODE TO WS-STATUS-CODE.

       2000-CALCULATE-FEE.
           EVALUATE ACCT-TYPE
               WHEN 'CK'
                   IF WS-BAL < 500.00
                       SUBTRACT 12.00 FROM WS-BAL
                   END-IF
               WHEN 'SV'
                   IF WS-BAL < 1000.00
                       SUBTRACT 5.00 FROM WS-BAL
                   END-IF
               WHEN OTHER
                   DISPLAY "STANDARD ACCOUNT TYPE"
           END-EVALUATE.

       3000-UPDATE-DB2-ACCOUNT.
           EXEC SQL
               UPDATE BANK_ACCOUNTS
               SET ACCT_BALANCE = :WS-BAL
               WHERE CUST_ID = :WS-ID
           END-EXEC.
