const registrationQuery = `INSERT INTO ${userTableDetails.tableName}(firstName,lastName,dateOfBirth,cnicNumber,phoneNumber,email,password,userAddress)
    VALUES('${firstName}','${lastName}','${dateOfBirth}','${cnicNumber}','${phoneNumber}','${email}','${password}','${userAddress}');`;


    const getUserDetails = `SELECT * FROM Users WHERE cnicNumber = '${cnicNumber}';`;

   const UserQueries = {
        insertRegistrationData: registrationQuery,
        getUserByCnic: getUserDetails
    }
    module.exports =   UserQueries;