import express from 'express';
const router = express.Router();
import { register, login, verifyOtp} from './../controllers/auth.js'

router
    .post('/register', register)
    .post('/login', login)
    .post('/verify-otp', verifyOtp)

export default router;