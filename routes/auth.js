import express from 'express';
const router = express.Router();
import { register, login, verifyOtp, logout} from './../controllers/auth.js'

router
    .post('/register', register)
    .post('/login', login)
    .post('/verify-otp', verifyOtp)
    .post('/logout', logout)

export default router;