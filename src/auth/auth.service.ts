export interface RegisterDTO {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: "USER" | "ADMIN" | "MANAGER";
}
import { prisma } from "../config/db";
import { hashPassword, comparePassword } from "../utils/password";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/token";
import { sendOTPEmail } from "../utils/email";
import { sendSmsOTP } from "../utils/sms";
import { User } from "@prisma/client";

/**
 * Generate 6-digit OTP
 */
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Shared helper: generate tokens + return auth response
 */
const generateAuthResponse = async (user: User) => {
    const userId = user.id;

    const accessToken = generateAccessToken({
        id: userId,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: userId
    });

    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });

    return {
        accessToken,
        token: accessToken, // Alias for backward compatibility/frontend expectation
        refreshToken,
        user: {
            id: userId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};

/**
 * Register User
 */
export const registerUser = async (data: RegisterDTO) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: data.role || "USER"
        }
    });

    return user;
};

/**
 * Login User (Old password-based)
 */
export const loginUser = async (
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    return generateAuthResponse(user);
};

/**
 * Send OTP for Email Login
 */
export const sendEmailLoginOTP = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailOTP: otp,
            otpExpiry: otpExpiry
        }
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return {
        message: "OTP sent to email successfully",
        email: email
    };
};

/**
 * Send OTP for Phone Login (Twilio)
 */
export const sendPhoneLoginOTP = async (phone: string) => {
    // ✅ Ensure E.164 format
    if (!phone.startsWith("+")) {
        throw new Error(
            "Phone number must include country code (e.g. +919876543210)"
        );
    }

    // Prisma findFirst since phone might not be unique (though it usually is)
    // Actually, in the Prisma schema I defined for User, phone is not unique but optional.
    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
        throw new Error("User not found");
    }

    const otp = generateOTP();

    await prisma.user.update({
        where: { id: user.id },
        data: {
            phoneOTP: otp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
        }
    });

    // ✅ Twilio requires +<countrycode><number>
    await sendSmsOTP(phone, otp);

    return {
        message: "OTP sent to phone successfully",
        phone
    };
};

/**
 * Verify OTP and Login with Email
 */
export const verifyEmailLoginOTP = async (email: string, otp: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.emailOTP || user.emailOTP !== otp) {
        throw new Error("Invalid OTP");
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
        throw new Error("OTP expired");
    }

    // Clear OTP fields before generating tokens
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            emailOTP: null,
            otpExpiry: null
        }
    });

    return generateAuthResponse(updatedUser);
};

/**
 * Verify OTP and Login with Phone
 */
export const verifyPhoneLoginOTP = async (phone: string, otp: string) => {
    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.phoneOTP || user.phoneOTP !== otp) {
        throw new Error("Invalid OTP");
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
        throw new Error("OTP expired");
    }

    // Clear OTP fields before generating tokens
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            phoneOTP: null,
            otpExpiry: null
        }
    });

    return generateAuthResponse(updatedUser);
};
