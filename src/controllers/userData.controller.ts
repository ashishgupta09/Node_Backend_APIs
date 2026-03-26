import { Request, Response } from "express";
import { prisma } from "../config/db";
import { hashPassword } from "../utils/password";

// Create UserData
export const createUserData = async (req: Request, res: Response) => {
    try {
        const payload = { ...req.body };
        // Handle password if provided
        if (payload.password) {
            payload.password = await hashPassword(payload.password);
        }

        const user = await prisma.userData.create({
            data: payload
        });
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get All UserData
export const getAllUserData = async (req: Request, res: Response) => {
    try {
        const users = await prisma.userData.findMany({
            omit: { password: true }
        });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get UserData by ID
export const getUserDataById = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const user = await prisma.userData.findUnique({
            where: { id },
            omit: { password: true }
        });
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
        const id = String(req.params.id);
        const data = { ...req.body };
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        const user = await prisma.userData.update({
            where: { id },
            data,
            omit: { password: true }
        });
        res.status(200).json(user);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "UserData not found" });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Delete UserData
export const deleteUserData = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await prisma.userData.delete({ where: { id } });
        res.status(200).json({ message: "UserData deleted successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "UserData not found" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
