
import { Router } from "express";
import { 
    register, 
    login,
    sendEmailOTP,
    sendPhoneOTP,
    verifyEmailLogin,
    verifyPhoneLogin
} from "./../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// OTP Login with Email
router.post("/login/email/send-otp", sendEmailOTP);
router.post("/login/email/verify-otp", verifyEmailLogin);

// OTP Login with Phone
router.post("/login/phone/send-otp", sendPhoneOTP);
router.post("/login/phone/verify-otp", verifyPhoneLogin);

export default router;
