import mongoose, { Schema, Document } from "mongoose";

export interface IUserData extends Document {
    firstName: string;
    lastName: string;
    maidenName?: string;
    age?: number;
    gender?: string;
    username: string;
    password?: string;
    email: string;
    phone?: string;
    birthDate?: string;
    image?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    eyeColor?: string;
    hair?: { color?: string; type?: string };
    ip?: string;
    address?: {
        address?: string;
        city?: string;
        state?: string;
        stateCode?: string;
        postalCode?: string;
        coordinates?: { lat?: number; lng?: number };
        country?: string;
    };
    macAddress?: string;
    university?: string;
    bank?: {
        cardExpire?: string;
        cardNumber?: string;
        cardType?: string;
        currency?: string;
        iban?: string;
    };
    company?: {
        department?: string;
        name?: string;
        title?: string;
        address?: {
            address?: string;
            city?: string;
            state?: string;
            stateCode?: string;
            postalCode?: string;
            coordinates?: { lat?: number; lng?: number };
            country?: string;
        };
    };
    ein?: string;
    ssn?: string;
    userAgent?: string;
    crypto?: {
        coin?: string;
        wallet?: string;
        network?: string;
    };
    role?: string;
}

const UserDataSchema = new Schema<IUserData>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    maidenName: { type: String },
    age: { type: Number },
    gender: { type: String },
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    birthDate: { type: String },
    image: { type: String },
    bloodGroup: { type: String },
    height: { type: Number },
    weight: { type: Number },
    eyeColor: { type: String },
    hair: {
        color: { type: String },
        type: { type: String }
    },
    ip: { type: String },
    address: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        stateCode: { type: String },
        postalCode: { type: String },
        coordinates: { lat: { type: Number }, lng: { type: Number } },
        country: { type: String }
    },
    macAddress: { type: String },
    university: { type: String },
    bank: {
        cardExpire: { type: String },
        cardNumber: { type: String },
        cardType: { type: String },
        currency: { type: String },
        iban: { type: String }
    },
    company: {
        department: { type: String },
        name: { type: String },
        title: { type: String },
        address: {
            address: { type: String },
            city: { type: String },
            state: { type: String },
            stateCode: { type: String },
            postalCode: { type: String },
            coordinates: { lat: { type: Number }, lng: { type: Number } },
            country: { type: String }
        }
    },
    ein: { type: String },
    ssn: { type: String },
    userAgent: { type: String },
    crypto: {
        coin: { type: String },
        wallet: { type: String },
        network: { type: String }
    },
    role: { type: String, default: "user" }
}, { timestamps: true });

export const UserData = mongoose.model<IUserData>("UserData", UserDataSchema);
