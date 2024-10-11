const accountTableDetails = {
    tableName: "Account",
    accountTableQuery: `CREATE TABLE Account (
    accountID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    accountNumber VARCHAR(16) UNIQUE NOT NULL,
    accountType VARCHAR(50) NOT NULL CHECK (AccountType IN ('Savings', 'Current', 'Business', 'Freelance')),
    balance DECIMAL(18, 2) DEFAULT 0.00,
    interestRate DECIMAL(5, 2) DEFAULT 0.00,
    isAccountActive BIT DEFAULT 0,
    dateOpened DATETIME DEFAULT GETDATE(),
    cnicNumber VARCHAR(14) NOT NULL UNIQUE,
    CONSTRAINT FK_Account_Customer
        FOREIGN KEY (cnicNumber) REFERENCES Users(cnicNumber)  
        ON DELETE CASCADE
);`  
} 

export default accountTableDetails;