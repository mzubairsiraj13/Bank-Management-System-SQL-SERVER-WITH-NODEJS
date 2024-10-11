import { Router } from 'express';
import {
    changePasswordConfirm,
    getUserDetails,
    loginUser,
    logoutUser,
    passwordResetOtp,
    registerUser,
    resendOTP,
    verifyEmail,
    verifyPasswordOtp,
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

import verificationEmailMiddleware from '../middlewares/verificationMiddleware.js';
import resetEmailMiddlware from '../middlewares/getResetEmailMiddleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(isAuthenticated, logoutUser); 
router.route('/check_auth').get(isAuthenticated, getUserDetails);
router.route('/verify_email').post(verificationEmailMiddleware, verifyEmail);
router.route('/resend_otp').get(verificationEmailMiddleware, resendOTP);
router.route('/password_reset_otp').post(passwordResetOtp);
router.route('/verify_password_reset_otp').post(resetEmailMiddlware,verifyPasswordOtp);
router.route('/change_password').post(resetEmailMiddlware,changePasswordConfirm);

export default router;
