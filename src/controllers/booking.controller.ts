import { Request, Response } from "express";
import { prisma } from "../config/db";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await prisma.booking.create({
            data: req.body
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: "Create failed", error });
    }
};

export const getBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const booking = await prisma.booking.update({
            where: { id },
            data: req.body
        });

        res.json(booking);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Booking not found" });
        } else {
            res.status(400).json({ message: "Error updating booking", error });
        }
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await prisma.booking.delete({ where: { id } });
        res.json({ message: "Booking deleted successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Booking not found" });
        } else {
            res.status(500).json({ message: "Error deleting booking", error });
        }
    }
};
