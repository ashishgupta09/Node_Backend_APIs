
import { Router } from "express";
import { 
    register, 
    login,
    sendEmailOTP,
    sendPhoneOTP,
    verifyEmailLogin,
    verifyPhoneLogin,
    getProfile
} from "./../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// OTP Login with Email
router.post("/login/email/send-otp", sendEmailOTP);
router.post("/login/email/verify-otp", verifyEmailLogin);

// OTP Login with Phone
router.post("/login/phone/send-otp", sendPhoneOTP);
router.post("/login/phone/verify-otp", verifyPhoneLogin);

// Protected Routes (For frontend to verify role)
router.get("/profile", authenticate, getProfile);

export default router;
