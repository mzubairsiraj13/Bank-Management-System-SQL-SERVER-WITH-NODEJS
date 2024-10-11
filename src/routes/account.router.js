import { Router } from 'express';
import { changeAccountType, createAccount, getAccount, initiateAccountVerification } from '../controllers/account.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';




const router = Router();


router.route('/create').post(createAccount);
router.route('/changetype').put(changeAccountType);
router.route('/init_account_verification').get(initiateAccountVerification);
router.route('/').get(getAccount);






export default router;