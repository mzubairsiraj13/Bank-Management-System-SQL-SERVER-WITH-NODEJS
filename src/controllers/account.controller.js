
import { request, response } from "express";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import sendEmail from "../utils/email.helpers/sendEmail.js";
import accountNumberGenerator from "../utils/generators/accountNumberGenerator.js";
import { deletePreviousOTP, generateAndStoreOTP } from "../utils/otp.helpers/index.js";
import executeQuery from "../utils/queryExectorFunction.js";
import {AccountTypeValidator} from "../utils/validators/index.js";




const createAccount = AsyncHandler(async (request , response) =>{
    let {cnicNumber, accountType} = request.body;

    const userRegistrationValidateQuery = `SELECT UserID FROM Users WHERE cnicNumber = '${cnicNumber}';`
    const isUserExist = (await executeQuery(userRegistrationValidateQuery)).rowsAffected[0];
    if (!isUserExist) {
        throw new ApiError(404, "User not registered with provide CNIC! Please Register Yourself");
    }
    let accountNumber = accountNumberGenerator();
    const uniqueAccountNumberQuery = `SELECT accountNumber FROM Account`;
    const isUniqueAccountNumber = (await executeQuery(uniqueAccountNumberQuery)).recordset;

    if(isUniqueAccountNumber.length > 0) {
        isUniqueAccountNumber.map((account)=> {
            if(account?.accountNumber === accountNumber) 
            {
                accountNumber = accountNumberGenerator();
            }
            
        })
    }
    
    const AccountTypeEnum = {
        CURRENT : 'Current',
        SAVINGS: 'Savings',
        BUSINESS: 'Business',
        FREELANCE: 'Freelance' 
    }
    
   if(Object.keys(AccountTypeEnum).includes(accountType)){
    switch (accountType) {
        case 'CURRENT':
            accountType = AccountTypeEnum.CURRENT
            break;
        case 'SAVINGS':
            accountType = AccountTypeEnum.SAVINGS
            break;
        case 'BUSINESS':
            accountType = AccountTypeEnum.BUSINESS
            break;
        case 'FREELANCE':
            accountType = AccountTypeEnum.FREELANCE
            break;
    }
   }
   else{
    throw new ApiError(404, 'Invalid Account Type');
   }
   
   const existingAccountQuery = `SELECT * FROM Account WHERE cnicNumber = '${cnicNumber}';`
   const existingAccount = (await executeQuery(existingAccountQuery)).recordset[0];
   if(existingAccount) {
    throw new ApiError(400, "A Personal can only have one account at a Time");
   }
   

    const accountDataInsertionQuery = `INSERT INTO Account(accountNumber, accountType, cnicNumber) VAlUES('${accountNumber}','${accountType}','${cnicNumber}');`
    const updateAccountNumberInUserQuery = `UPDATE Users SET accountNumber = '${accountNumber}' WHERE cnicNumber = '${cnicNumber}';`     
    let newAccount = null;
     try {
        newAccount = (await executeQuery(accountDataInsertionQuery)).rowsAffected[0];
        let updatedAccount = (await executeQuery(updateAccountNumberInUserQuery)).rowsAffected[0];
        console.log(newAccount);
        if(!newAccount || !updatedAccount){
        throw new ApiError(400, "Failed to create new account!")

        }
        
     } catch (error) { 
        throw new ApiError(400, "Account creation Failed!" + error)
        
     }
     const getNewAccountDetails = `SELECT * FROM Account WHERE cnicNumber = '${cnicNumber}' AND accountType = '${accountType}';`
const newAccountDetails = (await executeQuery(getNewAccountDetails)).recordset[0]
if (!newAccountDetails) {
    throw new ApiError(500,`Error Fetching Account Details!`);
    
}
     
    return response.json(new ApiResponse(200,newAccountDetails,"account created Succesfuly!"
     ));
});

const initiateAccountVerification = AsyncHandler(async (request, response) => {
    const accountNumber = request.body.accountNumber;

    const getAccountDetailsQuery = `SELECT Users.firstName,Users.lastName,Users.email,Account.accountNumber,Account.accountType,Account.isAccountActive,Account.cnicNumber FROM Users 
    JOIN (SELECT * FROM Account WHERE accountNumber = '${accountNumber}' ) Account 
    ON Users.accountNumber = Account.accountNumber;`
    const isAccountExists = (await executeQuery(getAccountDetailsQuery)).recordset[0];
   
    
    if (!isAccountExists) {
        throw new ApiError(404, "Account Not exists");
    }
    if (isAccountExists?.isAccountActive) {
        throw new ApiError(402, "Account Already Activated!");
    }

    
    await deletePreviousOTP(isAccountExists?.cnicNumber); 
   
    const otpCode = generateAndStoreOTP(isAccountExists?.cnicNumber);
    let userName = isAccountExists.firstName + " " + isAccountExists.lastName;
    let res = await sendEmail(isAccountExists.email,"Account Number Verification",otpCode,userName,'verification')
    console.log(res);
    
    
    return response.json(new ApiResponse(200,null, "OTP Has been sent to email"))

});

const changeAccountType = AsyncHandler(async (request, response)=>{
    let {cnicNumber, oldAccountType, newAccountType} = request.body;
    let accountType = AccountTypeValidator(oldAccountType);
    let accountTypeNew = AccountTypeValidator(newAccountType);
    if (!accountType || !accountTypeNew) {
        throw new ApiError(400, "Invalid Account Types!");  
    }
   const existingAccountTypeQuery = `SELECT accountType FROM Account WHERE cnicNumber = '${cnicNumber}' AND accountType = '${accountType}';`
   const existingAccountType  = (await executeQuery(existingAccountTypeQuery)).recordset[0];
   if(!existingAccountType?.accountType){
    throw new ApiError(404, "Account Does't exist with the provided Type!");
   }
   if (existingAccountType.accountType === accountTypeNew) {
    throw new ApiError(402, "New Account type can't be same as Existing Account Type!");
   }
   const updatedAccountTypeQuery = `UPDATE Account SET accountType = '${accountTypeNew}' WHERE cnicNumber = '${cnicNumber}' AND accountType = '${accountType}' `

   let updatedAccount = null;
   try {
    updatedAccount = (await executeQuery(updatedAccountTypeQuery)).rowsAffected[0];
    
    if (!updatedAccount) {
        throw new ApiError(500,`'Account Type Update Failed!'`);
    }
    
} catch (error) {
    throw new ApiError(500,`'Account Type Update Failed!'`);
    
}
const getUpdateAccountDetails = `SELECT * FROM Account WHERE cnicNumber = '${cnicNumber}' AND accountType = '${accountTypeNew}';`
const newAccountDetails = (await executeQuery(getUpdateAccountDetails)).recordset[0]
if (!newAccountDetails) {
    throw new ApiError(500,`Error Fetching Account Details!`);
    
}
return response.json(new ApiResponse(200, newAccountDetails, "Account Type Change Succesfuly!"));
   


});

const getAccount = AsyncHandler(async (request, response)=>{
    const accountNumber = request.body.accountNumber;


    if (!accountNumber) {
        throw new ApiError(400, "Invalid Account Number");
    }
    const getAccountQuery = `SELECT * FROM Account WHERE accountNumber = '${accountNumber}';`
    let account = (await executeQuery(getAccountQuery)).recordset[0];
    if (!account) {
        throw new ApiError(400, "Account Not found");
    }
    return response.json(new ApiResponse(200, account, "Succesfuly got data"));
})
export {
    createAccount,
    changeAccountType,
    initiateAccountVerification,
    getAccount
}