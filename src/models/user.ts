import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    password: string
    role: "USER" | "ADMIN";
    refreshToken?: string;
    emailOTP?: string;
    phoneOTP?: string;
    otpExpiry?: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    refreshToken: { type: String },
    emailOTP: { type: String },
    phoneOTP: { type: String },
    otpExpiry: { type: Date }
})

export const User = mongoose.model<IUser>("User", UserSchema);