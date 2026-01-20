import { z } from "zod";

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().refine(
        (val) => emailRegex.test(val),
        { message: "Invalid email address" }
    ),
    password: z.string().min(8)
});

export const loginSchema = z.object({
    email: z.string().refine(
        (val) => emailRegex.test(val),
        { message: "Invalid email address" }
    ),
    password: z.string()
});
