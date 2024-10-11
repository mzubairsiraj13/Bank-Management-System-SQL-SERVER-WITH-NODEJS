const laonRepaymentTableDetails = {
    tableName: "LoanRepayment",
    laonPaymentQuery: `CREATE TABLE LoanRepayment (
    repaymentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    loanID UNIQUEIDENTIFIER NOT NULL,
    paymentDate DATE NOT NULL DEFAULT GETDATE(),
    amountPaid DECIMAL(18, 2) NOT NULL CHECK (amountPaid > 0),
    balanceAfterRepayment DECIMAL(18, 2) NOT NULL CHECK (balanceAfterRepayment >= 0),
    CONSTRAINT FK_LoanRepayment_Loan
        FOREIGN KEY (loanID) REFERENCES Loan(loanID)
        ON DELETE CASCADE
);
`
}


export default laonRepaymentTableDetails;