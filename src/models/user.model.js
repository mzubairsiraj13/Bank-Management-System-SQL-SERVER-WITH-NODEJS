const userTableDetails = 
{
    tableName: "Users",
    userTableQuery: `CREATE TABLE Users (
    UserID UNIQUEIDENTIFIER DEFAULT NEWID(),
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    dateOfBirth DATE NOT NULL, 
    cnicNumber VARCHAR(14)  PRIMARY KEY,
    phoneNumber VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isEmailVerified BIT DEFAULT 0,
    accountNumber VARCHAR(16),
    userType VARCHAR(50) CHECK(userType IN ('ADMIN', 'EMPLOYEE', 'N_USER')) DEFAULT 'N_USER',
    userAddress VARCHAR(255),
    dateJoined DATETIME DEFAULT GETDATE()
);`
}

export default userTableDetails;