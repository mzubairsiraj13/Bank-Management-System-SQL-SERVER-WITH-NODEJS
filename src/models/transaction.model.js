const transactionTableDetails = {
    tableName: 'Transactions',
    transactionTableQuery: `CREATE TABLE Transactions (
    transactionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    accountID UNIQUEIDENTIFIER NOT NULL,
    transactionDate DATETIME DEFAULT GETDATE(),
    transactionType VARCHAR(50) NOT NULL CHECK (transactionType IN ('Deposit', 'Withdrawal', 'Recieved','Sent', 'Payment', 'Fee')),
    amount DECIMAL(18, 2) NOT NULL CHECK (amount >= 0),
    description VARCHAR(255),
    balanceAfterTransaction DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_Transaction_Account
        FOREIGN KEY (accountID) REFERENCES Account(accountID)
        ON DELETE CASCADE
);`
}

export default transactionTableDetails;