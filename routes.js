import { Router } from 'express';
import { requestOtp, verifyOtp, createPayment } from './controllers.js';

const router = Router();

router.post('/auth/request', requestOtp);
router.post('/auth/verify', verifyOtp);
router.post('/payments/create', createPayment);

export default router;
