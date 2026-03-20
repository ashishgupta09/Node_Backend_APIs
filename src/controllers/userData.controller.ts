import { Request, Response } from "express";
import { UserData } from "../models/userData";
import { hashPassword } from "../utils/password";

// Create UserData
export const createUserData = async (req: Request, res: Response) => {
    try {
        const payload = { ...req.body };
        // Handle password if provided
        if (payload.password) {
            payload.password = await hashPassword(payload.password);
        }

        const user = await UserData.create(payload);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get All UserData
export const getAllUserData = async (req: Request, res: Response) => {
    try {
        const users = await UserData.find().select("-password");
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get UserData by ID
export const getUserDataById = async (req: Request, res: Response) => {
    try {
        const user = await UserData.findById(req.params.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "UserData not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update UserData
export const updateUserData = async (req: Request, res: Response) => {
    try {
        if (req.body.password) {
            req.body.password = await hashPassword(req.body.password);
        }
        const user = await UserData.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        if (!user) {
            res.status(404).json({ message: "UserData not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete UserData
export const deleteUserData = async (req: Request, res: Response) => {
    try {
        const user = await UserData.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: "UserData not found" });
            return;
        }
        res.status(200).json({ message: "UserData deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
