CREATE DATABASE "Bank";
CREATE DATABASE "BankDemo";

DROP DATABASE Bank;

USE Bank;

USE BankDemo;
SELECT * FROM sys.tables;



CREATE TABLE Users (
    UserID UNIQUEIDENTIFIER PRIMARY KEY  DEFAULT NEWID(),
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    dateOfBirth DATE NOT NULL,
    cnicNumber VARCHAR(14) NOT NULL,
    phoneNumber VARCHAR(20),
    email VARCHAR(100) UNIQUE,
     password VARCHAR(255) NOT NULL,
    isEmailVerified BIT DEFAULT 0,
    accountNumber VARCHAR(16),
    userType VARCHAR(50) CHECK(userType IN ('ADMIN', 'EMPLOYEE', 'N_USER')) DEFAULT 'N_USER',
    userAddress VARCHAR(255),
    dateJoined TIME DEFAULT GETDATE()
);

CREATE TABLE OTP (
    OtpID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    isOtpCodeExpired BIT DEFAULT 0,
    otpGeneratedAt DATETIME DEFAULT GETDATE(),
    otpExpiresAt DATETIME,
    UserID UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Users_OTP
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
);

DROP TABLE "Users";
SELECT * FROM "Users";
DELETE FROM Users WHERE cnicNumber = '12103108359041';
SELECT isEmailVerified FROM Users WHERE cnicNumber = '12103108359041';
UPDATE Users 
SET isEmailVerified = 1
WHERE cnicNumber = '12103108359041';
SELECT * FROM INFORMATION_SCHEMA.TABLES;

SELECT * FROM Users WHERE 'cnicNumber' = '1283' OR 'email' = 'a';
INSERT INTO Users (firstName,lastName,dateOfBirth,cnicNumber)
VALUES('Muhammad Zubair', 'Siraj', '2004-09-09','12456677') ;


CREATE TABLE Branch (
    BranchID INT IDENTITY(1,1) PRIMARY KEY,
    BranchName VARCHAR(100) NOT NULL,
    BranchAddress VARCHAR(255),
    PhoneNumber VARCHAR(20),
    ManagerName VARCHAR(100)
);


CREATE TABLE Employee (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Position VARCHAR(100),
    BranchID INT NOT NULL,
    DateHired DATE DEFAULT GETDATE(),
    Salary DECIMAL(18, 2),
    CONSTRAINT FK_Employee_Branch
        FOREIGN KEY (BranchID) REFERENCES Branch(BranchID)
        ON DELETE CASCADE
);


CREATE TABLE Account (
    AccountID INT IDENTITY(1,1) PRIMARY KEY,
    AccountNumber VARCHAR(20) UNIQUE NOT NULL,
    AccountType VARCHAR(50) NOT NULL CHECK (AccountType IN ('Savings', 'Checking', 'Business')),
    Balance DECIMAL(18, 2) DEFAULT 0.00,
    InterestRate DECIMAL(5, 2) DEFAULT 0.00,
    DateOpened DATE DEFAULT GETDATE(),
    CustomerID INT NOT NULL,
    CONSTRAINT FK_Account_Customer
        FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
        ON DELETE CASCADE
);


CREATE TABLE [Transaction] (
    TransactionID BIGINT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT NOT NULL,
    TransactionDate DATETIME DEFAULT GETDATE(),
    TransactionType VARCHAR(50) NOT NULL CHECK (TransactionType IN ('Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Fee')),
    Amount DECIMAL(18, 2) NOT NULL CHECK (Amount >= 0),
    Description VARCHAR(255),
    BalanceAfterTransaction DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_Transaction_Account
        FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
        ON DELETE CASCADE
);


CREATE TABLE Loan (
    LoanID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    LoanType VARCHAR(50) NOT NULL CHECK (LoanType IN ('Home Loan', 'Personal Loan', 'Auto Loan', 'Education Loan', 'Business Loan')),
    LoanAmount DECIMAL(18, 2) NOT NULL CHECK (LoanAmount > 0),
    InterestRate DECIMAL(5, 2) NOT NULL CHECK (InterestRate >= 0),
    StartDate DATE NOT NULL DEFAULT GETDATE(),
    EndDate DATE NOT NULL,
    Balance DECIMAL(18, 2) NOT NULL CHECK (Balance >= 0),
    CONSTRAINT FK_Loan_Customer
        FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
        ON DELETE CASCADE
);


CREATE TABLE LoanRepayment (
    RepaymentID INT IDENTITY(1,1) PRIMARY KEY,
    LoanID INT NOT NULL,
    PaymentDate DATE NOT NULL DEFAULT GETDATE(),
    AmountPaid DECIMAL(18, 2) NOT NULL CHECK (AmountPaid > 0),
    BalanceAfterRepayment DECIMAL(18, 2) NOT NULL CHECK (BalanceAfterRepayment >= 0),
    CONSTRAINT FK_LoanRepayment_Loan
        FOREIGN KEY (LoanID) REFERENCES Loan(LoanID)
        ON DELETE CASCADE
);


CREATE TABLE AccountBranch (
    AccountBranchID INT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT NOT NULL,
    BranchID INT NOT NULL,
    CONSTRAINT FK_AccountBranch_Account
        FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
        ON DELETE CASCADE,
    CONSTRAINT FK_AccountBranch_Branch
        FOREIGN KEY (BranchID) REFERENCES Branch(BranchID)
        ON DELETE CASCADE,
    UNIQUE (AccountID, BranchID) -- Ensures an account is linked to a branch only once
);


CREATE TABLE CustomerEmployeeInteraction (
    InteractionID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    EmployeeID INT NOT NULL,
    InteractionDate DATETIME DEFAULT GETDATE(),
    InteractionType VARCHAR(100) NOT NULL,
    Notes VARCHAR(MAX),
    CONSTRAINT FK_CustomerEmployeeInteraction_Customer
        FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
        ON DELETE CASCADE,
    CONSTRAINT FK_CustomerEmployeeInteraction_Employee
        FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
        ON DELETE CASCADE
);
