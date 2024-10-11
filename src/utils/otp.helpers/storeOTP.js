import dayjs from 'dayjs';
import { generateOTP } from './index.js';
import executeQuery from '../queryExectorFunction.js';

const generateAndStoreOTP = (cnicNumber)=> {
    const optCode = generateOTP();
    const otpGeneratedAt = (dayjs(Date.now())).toISOString();
    const otpExpiresAt = dayjs(Date.now()).add(10,'minutes').toISOString();
    const optQuery = `INSERT INTO OTP(code,otpGeneratedAt,otpExpiresAt,cnicNumber) VALUES ('${optCode}','${otpGeneratedAt}','${otpExpiresAt}','${cnicNumber}');`;
    executeQuery(optQuery);
    return optCode
}

export default generateAndStoreOTP;