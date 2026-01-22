import { RegisterDTO } from "src/models/auth.types";
import { User } from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/password";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/token";
import { sendOTPEmail } from "../utils/email";
import { sendSmsOTP } from "../utils/sms";

/**
 * Generate 6-digit OTP
 */
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Register User
 */
export const registerUser = async (data: RegisterDTO) => {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword
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
    const user = await User.findOne({ email });
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

    // ✅ Convert ObjectId → string (CORRECT)
    const userId = user._id.toString();

    const accessToken = generateAccessToken({
        id: userId,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: userId
    });

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: userId,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Send OTP for Email Login
 */
export const sendEmailLoginOTP = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return {
        message: "OTP sent to email successfully",
        email: email
    };
};

/**
 * Send OTP for Phone Login
 */
export const sendPhoneLoginOTP = async (phone: string) => {
    const user = await User.findOne({ phone });
    if (!user) {
        throw new Error("User not found");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.phoneOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via SMS
    await sendSmsOTP(phone, otp);

    return {
        message: "OTP sent to phone successfully",
        phone: phone
    };
};

/**
 * Verify OTP and Login with Email
 */
export const verifyEmailLoginOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.emailOTP || user.emailOTP !== otp) {
        throw new Error("Invalid OTP");
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
        throw new Error("OTP expired");
    }

    const userId = user._id.toString();

    const accessToken = generateAccessToken({
        id: userId,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: userId
    });

    user.refreshToken = refreshToken;
    user.emailOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: userId,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Verify OTP and Login with Phone
 */
export const verifyPhoneLoginOTP = async (phone: string, otp: string) => {
    const user = await User.findOne({ phone });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.phoneOTP || user.phoneOTP !== otp) {
        throw new Error("Invalid OTP");
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
        throw new Error("OTP expired");
    }

    const userId = user._id.toString();

    const accessToken = generateAccessToken({
        id: userId,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: userId
    });

    user.refreshToken = refreshToken;
    user.phoneOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: userId,
            name: user.name,
            phone: user.phone,
            role: user.role
        }
    };
};
