      *================================================================*
      * COPYBOOK: ACCTREC.cpy
      * BANK ACCOUNT RECORD LAYOUT
      *================================================================*
       01  ACCOUNT-RECORD.
           05  ACCT-NUMBER           PIC X(12).
           05  ACCT-CUST-ID          PIC X(10).
           05  ACCT-TYPE             PIC X(02).
               88  ACCT-CHECKING     VALUE 'CK'.
               88  ACCT-SAVINGS      VALUE 'SV'.
               88  ACCT-MONEY-MKT    VALUE 'MM'.
           05  ACCT-BALANCE          PIC 9(10)V99.
           05  ACCT-INTEREST-RATE    PIC 9(02)V9999.
           05  ACCT-LAST-ACTIVITY    PIC 9(08).
           05  FILLER                PIC X(44).
