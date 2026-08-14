      *================================================================*
      * COPYBOOK: CUSTREC.cpy
      * CUSTOMER MASTER RECORD LAYOUT
      *================================================================*
       01  CUSTOMER-RECORD.
           05  CUST-ID               PIC X(10).
           05  CUST-NAME.
               10  FIRST-NAME        PIC X(15).
               10  LAST-NAME         PIC X(20).
           05  CUST-STATUS           PIC X(01).
               88  CUST-ACTIVE       VALUE 'A'.
               88  CUST-SUSPENDED    VALUE 'S'.
               88  CUST-CLOSED       VALUE 'C'.
           05  CUST-CREDIT-SCORE     PIC 9(03).
           05  CUST-DOB              PIC 9(08).
           05  CUST-BALANCE-RAW      PIC X(12).
           05  CUST-BALANCE REDEFINES CUST-BALANCE-RAW PIC 9(10)V99.
           05  FILLER                PIC X(31).
