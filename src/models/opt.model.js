const OTPTableDetails = 
{
    tableName: "OTP",
    otpTableQuery: `CREATE TABLE OTP (
    OtpID UNIQUEIDENTIFIER DEFAULT NEWID(),
    code VARCHAR(6) NOT NULL,
    
    otpGeneratedAt DATETIME DEFAULT GETDATE(),
    otpExpiresAt DATETIME NOT NULL,
    cnicNumber VARCHAR(14) NOT NULL UNIQUE,
    CONSTRAINT FK_Users_OTP
        FOREIGN KEY (cnicNumber) REFERENCES Users(cnicNumber)
        ON DELETE CASCADE
);`
}

export default OTPTableDetails;