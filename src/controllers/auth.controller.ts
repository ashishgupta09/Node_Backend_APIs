import { Request, Response } from "express";
import { 
    registerUser, 
    loginUser,
    sendEmailLoginOTP,
    sendPhoneLoginOTP,
    verifyEmailLoginOTP,
    verifyPhoneLoginOTP
} from "../auth/auth.service";
import { 
    registerSchema, 
    loginSchema,
    loginEmailOTPSchema,
    loginPhoneOTPSchema,
    verifyLoginOTPSchema
} from "../auth/auth.validation";

export const register = async (req: Request, res: Response) => {
    try {
        registerSchema.parse(req.body);

        const user = await registerUser(req.body);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        loginSchema.parse(req.body);

        const result = await loginUser(
            req.body.email,
            req.body.password
        );

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Send OTP for Email Login
 */
export const sendEmailOTP = async (req: Request, res: Response) => {
    try {
        loginEmailOTPSchema.parse(req.body);

        const result = await sendEmailLoginOTP(req.body.email);

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Send OTP for Phone Login
 */
export const sendPhoneOTP = async (req: Request, res: Response) => {
    try {
        loginPhoneOTPSchema.parse(req.body);

        const result = await sendPhoneLoginOTP(req.body.phone);

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Verify OTP and Login with Email
 */
export const verifyEmailLogin = async (req: Request, res: Response) => {
    try {
        console.log("📧 Verify Email Login Request:", req.body);
        
        verifyLoginOTPSchema.parse(req.body);

        if (!req.body.email) {
            throw new Error("Email is required");
        }

        const result = await verifyEmailLoginOTP(
            req.body.email,
            req.body.otp
        );

        console.log("✅ Email verification successful");
        res.json(result);
    } catch (error: any) {
        console.error("❌ Email verification error:", error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Verify OTP and Login with Phone
 */
export const verifyPhoneLogin = async (req: Request, res: Response) => {
    try {
        verifyLoginOTPSchema.parse(req.body);

        if (!req.body.phone) {
            throw new Error("Phone is required");
        }

        const result = await verifyPhoneLoginOTP(
            req.body.phone,
            req.body.otp
        );

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
