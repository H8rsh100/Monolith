      *================================================================*
      * COPYBOOK: TXNREC.cpy
      * TRANSACTION AUDIT RECORD LAYOUT
      *================================================================*
       01  TRANSACTION-RECORD.
           05  TXN-ID                PIC X(16).
           05  TXN-ACCT-NUMBER       PIC X(12).
           05  TXN-TYPE              PIC X(03).
               88  TXN-DEPOSIT       VALUE 'DEP'.
               88  TXN-WITHDRAWAL    VALUE 'WTH'.
               88  TXN-TRANSFER      VALUE 'TRF'.
               88  TXN-INTEREST      VALUE 'INT'.
           05  TXN-AMOUNT            PIC 9(08)V99.
           05  TXN-TIMESTAMP         PIC X(20).
           05  TXN-STATUS            PIC X(02).
               88  TXN-SUCCESS       VALUE 'OK'.
               88  TXN-FAILED        VALUE 'ER'.
           05  FILLER                PIC X(25).
