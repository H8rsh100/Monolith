       IDENTIFICATION DIVISION.
       PROGRAM-ID. INTRCALC.
       AUTHOR. FINANCIAL SYSTEMS GROUP.
      *================================================================*
      * INTEREST CALCULATION ENGINE - HIGH COMPLEXITY MODULE
      *================================================================*
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       COPY ACCTREC.
       01  WS-INTEREST-CALCS.
           05  WS-BASE-RATE          PIC 9(02)V9999 VALUE 03.5000.
           05  WS-BONUS-RATE         PIC 9(02)V9999 VALUE 00.0000.
           05  WS-TOTAL-INTEREST     PIC 9(08)V99 VALUE ZERO.
           05  WS-TIER-INDEX         PIC 9(02) VALUE 1.

       LINKAGE SECTION.
       COPY CUSTREC.
       01  LS-BALANCE-PARAM          PIC 9(08)V99.

       PROCEDURE DIVISION USING CUSTOMER-RECORD LS-BALANCE-PARAM.
       0000-CALCULATE-INTEREST-MAIN.
           DISPLAY "CALCULATING INTEREST FOR CUST: " CUST-ID.
           PERFORM 1000-DETERMINE-TIER-RATES.
           PERFORM 2000-COMPUTE-COMPOUND-INTEREST.
           PERFORM 3000-APPLY-PROMOTIONS.
           DISPLAY "FINAL INTEREST: " WS-TOTAL-INTEREST.
           EXIT PROGRAM.

       1000-DETERMINE-TIER-RATES.
           IF LS-BALANCE-PARAM > 100000.00 THEN
               MOVE 05.2500 TO WS-BASE-RATE
           ELSE
               IF LS-BALANCE-PARAM > 50000.00 THEN
                   MOVE 04.5000 TO WS-BASE-RATE
               ELSE
                   IF LS-BALANCE-PARAM > 10000.00 THEN
                       MOVE 03.7500 TO WS-BASE-RATE
                   ELSE
                       MOVE 02.1000 TO WS-BASE-RATE
                   END-IF
               END-IF
           END-IF.

           EVALUATE CUST-STATUS
               WHEN 'A'
                   IF CUST-CREDIT-SCORE >= 800 THEN
                       ADD 00.7500 TO WS-BONUS-RATE
                   ELSE
                       IF CUST-CREDIT-SCORE >= 700 THEN
                           ADD 00.5000 TO WS-BONUS-RATE
                       END-IF
                   END-IF
               WHEN 'S'
                   MOVE 00.0000 TO WS-BONUS-RATE
               WHEN OTHER
                   MOVE 00.0000 TO WS-BONUS-RATE
           END-EVALUATE.

       2000-COMPUTE-COMPOUND-INTEREST.
           COMPUTE WS-TOTAL-INTEREST ROUNDED = 
               LS-BALANCE-PARAM * ((WS-BASE-RATE + WS-BONUS-RATE) / 100).
           IF WS-TOTAL-INTEREST > 5000.00 THEN
               DISPLAY "LARGE INTEREST CREDIT DETECTED"
           END-IF.

       3000-APPLY-PROMOTIONS.
           EVALUATE TRUE
               WHEN LS-BALANCE-PARAM > 250000.00 AND CUST-CREDIT-SCORE > 750
                   ADD 250.00 TO WS-TOTAL-INTEREST
               WHEN LS-BALANCE-PARAM > 50000.00 AND CUST-CREDIT-SCORE > 700
                   ADD 100.00 TO WS-TOTAL-INTEREST
               WHEN OTHER
                   DISPLAY "NO SPECIAL PROMOTION"
           END-EVALUATE.
