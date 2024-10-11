import dayjs from 'dayjs';
import executeQuery from '../queryExectorFunction.js';
import ApiError from '../ApiError.js';

const verifyOTP = async (cnicNumberIn, emailVerificationOTP) => {
    const cnicNumber = cnicNumberIn;

    const otpCodeQuery = `SELECT * FROM OTP WHERE cnicNumber = '${cnicNumber}';`;
    const currentOtpDetails = (await executeQuery(otpCodeQuery)).recordset[0];

    const isOtpExpired = dayjs(currentOtpDetails.otpExpiresAt).isBefore(
        dayjs().toDate(),
    );
    const dbOTPCode = currentOtpDetails.code;

    if (isOtpExpired) {
        return "EXPIRED_OTP";
    }
    
    if (dbOTPCode === emailVerificationOTP) {
        console.log(dbOTPCode, emailVerificationOTP, dbOTPCode === emailVerificationOTP);
        return true;
    }
    return false;
};

export default verifyOTP;
