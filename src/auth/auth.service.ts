import { RegisterDTO } from "src/models/auth.types";
import { User } from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/password";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/token";

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
        password: hashedPassword
    });

    return user;
};

/**
 * Login User
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
