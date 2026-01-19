import { Request, Response } from "express";
import Booking from "../models/booking";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: "Create failed", error });
    }
};

export const getBookings = async (_req: Request, res: Response) => {
    const bookings = await Booking.find();
    res.json(bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
};

export const updateBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
};
