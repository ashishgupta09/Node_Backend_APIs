import { z } from "zod";

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;
const otpRegex = /^[0-9]{6}$/;

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().refine(
        (val) => emailRegex.test(val),
        { message: "Invalid email address" }
    ),
    phone: z.string().refine(
        (val) => phoneRegex.test(val),
        { message: "Invalid phone number" }
    ).optional(),
    password: z.string().min(8)
});

export const loginSchema = z.object({
    email: z.string().refine(
        (val) => emailRegex.test(val),
        { message: "Invalid email address" }
    ),
    password: z.string()
});

export const loginEmailOTPSchema = z.object({
    email: z.string().refine(
        (val) => emailRegex.test(val),
        { message: "Invalid email address" }
    )
});

export const loginPhoneOTPSchema = z.object({
    phone: z.string().refine(
        (val) => phoneRegex.test(val),
        { message: "Invalid phone number" }
    )
});

export const verifyLoginOTPSchema = z.object({
    email: z.string().refine(
        (val) => emailRegex.test(val),
        { message: "Invalid email address" }
    ).optional(),
    phone: z.string().refine(
        (val) => phoneRegex.test(val),
        { message: "Invalid phone number" }
    ).optional(),
    otp: z.string().refine(
        (val) => otpRegex.test(val),
        { message: "OTP must be 6 digits" }
    )
}).refine(
    (data) => data.email || data.phone,
    { message: "Either email or phone is required" }
);
