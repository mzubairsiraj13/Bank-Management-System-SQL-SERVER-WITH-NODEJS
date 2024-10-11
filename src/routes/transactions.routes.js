import { Router } from 'express';
import { changeAccountType, createAccount, getAccount, initiateAccountVerification } from '../controllers/account.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { deposit, sendMoney, Withdrawal } from '../controllers/transactions.controllers.js';




const router = Router();


router.route('/desposit').post(deposit);
router.route('/withdraw').post(Withdrawal);
router.route('/transfer').post(sendMoney);







export default router;