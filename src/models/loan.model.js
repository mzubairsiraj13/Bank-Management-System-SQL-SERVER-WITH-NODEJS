const loanTableDetails = {
    tableName: 'Loan',
    loanTableQuery: `CREATE TABLE Loan (
    loanID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    cnicNumber VARCHAR(14) NOT NULL,
    loanType VARCHAR(50) NOT NULL CHECK (loanType IN ('Home Loan', 'Personal Loan', 'Auto Loan', 'Education Loan', 'Business Loan')),
    loanAmount DECIMAL(18, 2) NOT NULL CHECK (loanAmount > 0),
    interestRate DECIMAL(5, 2) NOT NULL CHECK (interestRate >= 0),
    startDate DATE NOT NULL DEFAULT GETDATE(),
    endDate DATE NOT NULL,
    balance DECIMAL(18, 2) NOT NULL CHECK (Balance >= 0),
    CONSTRAINT FK_Loan_Customer
        FOREIGN KEY (cnicNumber) REFERENCES Users(cnicNumber)
        ON DELETE CASCADE
);`
}

export default loanTableDetails;