
import { COOKIE_OPTIONS } from '../constants.js';
import {
    generateHashedPassword,
    verifyPassword,
} from '../helperFunction/generateHashPassword.js';
import { generateAccessToken } from '../helperFunction/tokenGenerators.js';
import userTableDetails from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import AsyncHandler from '../utils/AsyncHandler.js';
import sendEmail from '../utils/email.helpers/sendEmail.js';
import {
    deletePreviousOTP,
    generateAndStoreOTP,
    generateOTP,
    verifyOTP,
} from '../utils/otp.helpers/index.js';

import executeQuery from '../utils/queryExectorFunction.js';

import {
    dateOfBirthValidator,
    emailValidator,
    nameValidator,
    passwordValidator,
    validateCnicNumber,
} from '../utils/validators/index.js';


const registerUser = AsyncHandler(async (request, response) => {
    let {
        firstName,
        lastName,
        dateOfBirth,
        cnicNumber,
        phoneNumber,
        email,
        password,
        userAddress,
    } = request.body;
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    if (
        !firstName ||
        !lastName ||
        !dateOfBirth ||
        !cnicNumber ||
        !email ||
        !password
    ) {
        throw new ApiError(404, 'All flieds are mendatory');
    }

    if (nameValidator(firstName) || nameValidator(lastName)) {
        throw new ApiError(400, 'First Name or last name  is  invalid');
    }
    const validAge = dateOfBirthValidator(dateOfBirth);
    if (validAge === 'INVALID-FORMAT') {
        throw new ApiError(
            400,
            `PLease Enter Valid Birth Date Format || Valid Format 'DD-MM-YYYY' : (EXAMPLE : 15/01/2001) `,
        );
    }
    if (validAge === 'INVALID-DATE') {
        throw new ApiError(400, `PLease Enter Valid Birth Date`);
    }

    if (!validAge.isAboutEighteenYears) {
        throw new ApiError(
            403,
            `Your are under Eighteen! Not Allowed to open Bank Account`,
        );
    }

    if (!validateCnicNumber(cnicNumber)) {
        throw new ApiError(
            400,
            `invalid CNIC number: Must be 14 digits and only be containing digits`,
        );
    }
    if (!emailValidator(email)) {
        throw new ApiError(400, `invalid email! Please enter correct email`);
    }

    if (!passwordValidator(password)) {
        throw new ApiError(
            400,
            'Password Must contain alteast 1 Capital letter, Number and a special character',
        );
    }

    const checkExitingUserQuery = `SELECT * FROM ${userTableDetails.tableName} WHERE cnicNumber = '${cnicNumber}' OR email = '${email}';`;

    const existingUser = await executeQuery(checkExitingUserQuery);

    if (existingUser.recordset.length) {
        if (existingUser.recordset[0]?.email === email) {
            throw new ApiError(
                409,
                'Email Already used! choose a different Email Address',
            );
        }
        throw new ApiError(
            409,
            'User Already Exits with the provided Information',
        );
    }

    const hashedPassword = await generateHashedPassword(password);

    const registrationQuery = `INSERT INTO ${userTableDetails.tableName}(firstName,lastName,dateOfBirth,cnicNumber,phoneNumber,email,password,userAddress)
    VALUES('${firstName}','${lastName}','${dateOfBirth}','${cnicNumber}','${phoneNumber}','${email}','${hashedPassword}','${userAddress}');`;
    const getUserDetails = `SELECT * FROM Users WHERE cnicNumber = '${cnicNumber}';`;

    let newUser = await executeQuery(registrationQuery);
    newUser = await executeQuery(getUserDetails);

    delete newUser.recordset[0].password;

    newUser = newUser.recordset[0];

    return response.json(
        new ApiResponse(200, newUser, 'User Account Created successfully'),
    );
});

const loginUser = AsyncHandler(async (request, response) => {
    let { cnicNumber, password } = request.body;
    if (!validateCnicNumber(cnicNumber)) {
        throw new ApiError(
            400,
            `invalid CNIC number: Must be 14 digits and only be containing digits`,
        );
    }
    if (!passwordValidator(password)) {
        throw new ApiError(
            400,
            'Password Must contain alteast 1 Capital letter, Number and a special character',
        );
    }

    const getUserdetails = `SELECT * FROM Users WHERE cnicNumber = '${cnicNumber}';`;
    //const getUserdetails = `SELECT * FROM Users WHERE cnicNumber = '${cnicNumber}' AND password = '${password}';`; //For direct user validation

    let isUserExists = await executeQuery(getUserdetails);

    
    

    if (isUserExists.recordset.length === 0) {
        throw new ApiError(404, 'Please enter correct credentials');
    }
    if (!isUserExists.recordset[0].isEmailVerified) {
        let userName =
            isUserExists.recordset[0].firstName +
            ' ' +
            isUserExists.recordset[0].lastName;
        let otp = generateAndStoreOTP(isUserExists.recordset[0].cnicNumber);

        const verificationToken = generateAccessToken({
            email: isUserExists.recordset[0].email,
        });
        sendEmail(
            isUserExists.recordset[0].email,
            'Email Verification SBL',
            otp,
            userName,
            'verification',
        );
        return response
            .cookie('verificationToken', verificationToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    403,
                    null,
                    'Email not verified! Please verify email.',
                ),
            );
    }

    let existingPassword = isUserExists.recordset[0].password;
    const isPasswordCorrect = await verifyPassword(password, existingPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Please enter correct credentials.');
    }
    let payLoad = isUserExists.recordset[0];
    delete payLoad.password;
    payLoad = payLoad;
    const accessToken = generateAccessToken(payLoad);

    if (accessToken) {
        return response.cookie('accessToken', accessToken, COOKIE_OPTIONS).json(
            new ApiResponse(
                200,
                {
                    user: payLoad,
                    accessToken,
                },
                'user logged in successfully',
            ),
        );
    }
});

const logoutUser = AsyncHandler(async (_, response) => {
   return response
        .clearCookie('accessToken', COOKIE_OPTIONS)
        .json(new ApiResponse(200, null, 'User Logout successfully'));
});

const getUserDetails = AsyncHandler(async (request, response) => {
    const userId = request.body?.UserID;
    const userDetailsQuery = `SELECT UserID,firstName,lastName,dateOfBirth,cnicNumber,phoneNumber,email,isEmailVerified,accountNumber,userType,userAddress,dateJoined FROM Users WHERE UserID = '${userId}';`;
    const userDetails = await executeQuery(userDetailsQuery);
    if (!userDetails.recordset.length) {
        throw new ApiError(404, 'User not exits');
    }

    response.json(
        new ApiResponse(200, { user: userDetails.recordset[0] }, 'success'),
    );
});

const verifyEmail = AsyncHandler(async (request, response) => {
    const { email, emailVerificationOTP } = request.body;

    if (!email) {
        throw new ApiResponse(404, 'Login to your account to verify email');
    }
    const getCnicNumberQuery = `SELECT cnicNumber FROM Users WHERE email = '${email}';`;
    const getCnicNumber = (await executeQuery(getCnicNumberQuery)).recordset[0];

    if (!getCnicNumber.cnicNumber) {
        throw new ApiError(404, "can't get account details!");
    }
    const cnicNumber = getCnicNumber.cnicNumber;
    

    const isOtpCorrect = await verifyOTP(cnicNumber, emailVerificationOTP);
    if (isOtpCorrect === 'EXPIRED_OTP') {
       deletePreviousOTP(cnicNumber)
        throw new ApiError(
            400,
            'OTP has been Expired. Please request new one.',
        );
    }

    if (!isOtpCorrect) {
        throw new ApiError(400, 'Email Verification failed! OTP is invalid.');
    }
    const emailVerifyQuery = `UPDATE Users SET isEmailVerified = ${1} WHERE email = '${email}';`;
    const emailVerificationResult = await executeQuery(emailVerifyQuery);

    if (emailVerificationResult.recordset?.length === 0) {
        throw new ApiError(400, 'Email Verification failed!');
    }

    await executeQuery(OtpRemoveQuery);
    const getUserdetails = `SELECT * FROM Users WHERE email = '${email}';`;
    const userPayload = await executeQuery(getUserdetails);

    if (!userPayload.recordset.length === 0) {
        throw new ApiError(400, 'Email Verification failed!');
    }
    delete userPayload.recordset[0].password;
    const payLoad = userPayload.recordset[0];

    const accessToken = generateAccessToken(payLoad);
    return response
        .cookie('accessToken', accessToken, COOKIE_OPTIONS)
        .clearCookie('verificationToken', COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                {
                    user: payLoad,
                    accessToken,
                },
                'Email Verified successfully!',
            ),
        );
});
const verifyPasswordOtp = AsyncHandler(async (request, response) => {
    const {passwordResetOtp, email} = request.body;
   
  
    const getCnicNumberQuery = `SELECT cnicNumber FROM Users WHERE email = '${email}';`;
    const getCnicNumber = ((await executeQuery(getCnicNumberQuery)).recordset[0]);

 
    

    if (!getCnicNumber.cnicNumber) {
        throw new ApiError(404, "can't get account details!");
    }
    const cnicNumber = getCnicNumber.cnicNumber;
    

    const isOtpCorrect = await verifyOTP(cnicNumber, passwordResetOtp);
    if (isOtpCorrect === 'EXPIRED_OTP') {
        deletePreviousOTP(cnicNumber)
        throw new ApiError(
            400,
            'OTP has been Expired. Please request new one.',
        );
    }

    if (!isOtpCorrect) {
        throw new ApiError(400, 'failed! OTP is invalid.');
    }
    
    return response
        .json(
            new ApiResponse(
                200,
                null,
                'OTP Verified! Enter New Password',
            ),
        );


    


});

const resendOTP = AsyncHandler(async (request, response) => {
    const email = request.body.email || '';

    if (!email) {
        throw new ApiResponse(404, 'Login to your account to verify email');
    }

    const getCnicNumberQuery = `SELECT firstName,lastName,cnicNumber FROM Users WHERE email = '${email}';`;
    const getCnicNumber = (await executeQuery(getCnicNumberQuery)).recordset[0];
    deletePreviousOTP(getCnicNumber.cnicNumber)
    let otp = generateAndStoreOTP(getCnicNumber.cnicNumber);
    const mail = await sendEmail(
        email,
        'Email Verification SBL',
        otp,
        getCnicNumber.firstName + ' ' + getCnicNumber.lastName,
        'verification',
    );

    if (!(mail.accepted[0] === email)) {
        throw new ApiError(502, 'OTP cloud not be sent. Try again later!');
    }

    return response.json(
        new ApiResponse(
            200,
            null,
            'Email with new OTP has been sent to your account.',
        ),
    );
});

const passwordResetOtp = AsyncHandler(async (request, response) => {
    const cnicNumber = request.body.cnicNumber;
    if (!validateCnicNumber(cnicNumber)) {
        throw new ApiError(
            400,
            `invalid CNIC number: Must be 14 digits and only be containing digits`,
        );
    }

    const userQuery = `SELECT firstName,lastName,email FROM Users WHERE cnicNumber = '${cnicNumber}'`;
    const user = (await executeQuery(userQuery)).recordset[0];

    if (!user) {
        throw new ApiError(
            404,
            "User doesn't exists! Try Enter correct credentials.",
        );
    }
    deletePreviousOTP(cnicNumber)
    let otp = generateAndStoreOTP(cnicNumber);

    const passwordResetToken = generateAccessToken({
        email: user.email,
    });
    const mail = await sendEmail(
        user.email,
        'Password Reset SBL',
        otp,
        `${user.firstName} ${user.lastName}`,
        '',
    );


    if (!(mail.accepted[0] === user?.email)) {
        throw new ApiError(502, 'OTP cloud not be sent. Try again later!');
    }
    
    return response.cookie('passwordResetOtp', passwordResetToken, COOKIE_OPTIONS).json(
        new ApiResponse(200, null, 'OTP has been send to your email!'),
    );
});

const changePasswordConfirm = AsyncHandler(async (request, response)=>{
    const {password, email} = request.body;
    const getCnicNumberQuery = `SELECT cnicNumber FROM Users WHERE email = '${email}';`;
    const getCnicNumber = ((await executeQuery(getCnicNumberQuery)).recordset[0]);
   
    

    if (!getCnicNumber.cnicNumber) {
        throw new ApiError(404, "can't get account details!");
    }

    if (!passwordValidator(password)) {
        throw new ApiError(400, "Choose A strong Password! Must contain alteast 1 digist,special and Capital letter.");
    }
    const newHashedPassword = await generateHashedPassword(password);
    console.log(newHashedPassword);
    const updatePasswordQuery = `UPDATE Users SET password = '${newHashedPassword}' WHERE email = '${email}'`;
    const updatedPassword = (((await executeQuery(updatePasswordQuery)).rowsAffected[0]));
    console.log(updatedPassword);
    
    if (!updatedPassword) {
        throw new ApiError(500, "Password Changing Failed!.");
    }

   return response.clearCookie("passwordResetOtp",COOKIE_OPTIONS).json(new ApiResponse(200, null, "Password Changed successfully! Login to your account by entering credentials."));
    
    
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    verifyEmail,
    resendOTP,
    passwordResetOtp,
    verifyPasswordOtp,
    changePasswordConfirm
};
