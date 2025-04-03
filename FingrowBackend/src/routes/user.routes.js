import { register, login, logout } from '../controllers/login.controller.js';
import { Router } from 'express';
import { verifyjwt } from '../middleware/auth.middleware.js';
import {newKyc} from '../controllers/Kycdata.js'
import {kycstatus} from '../controllers/Kycdata.js'
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyjwt, logout);
router.post('/kyc',newKyc);
router.post('/Kycstatus',kycstatus)

export default router;

// john.doe@example.com