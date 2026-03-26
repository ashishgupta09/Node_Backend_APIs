import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";

// --- User Operations ---

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            omit: {
                password: true,
                refreshToken: true,
                emailOTP: true,
                phoneOTP: true,
                otpExpiry: true
            } as any // omit might need any if type is strict
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

export const addNewUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, phone, role }
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId, ...updates } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data: updates
        });
        res.json(user);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(400).json({ message: "Error updating user", error });
        }
    }
};

export const deleteUserByUserId = async (req: Request, res: Response) => {
    try {
        const userId = String(req.params.id || req.query.userId || req.body.userId);
        if (!userId || userId === "undefined") {
            return res.status(400).json({ message: "userId is required" });
        }
        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: "User deleted" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Error deleting user", error });
        }
    }
};

// --- Vendor Operations ---

export const createVendor = async (req: Request, res: Response) => {
    try {
        const vendor = await prisma.busVendor.create({
            data: req.body
        });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(400).json({ message: "Error creating vendor", error });
    }
};

export const getBusVendors = async (_req: Request, res: Response) => {
    try {
        const vendors = await prisma.busVendor.findMany();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendors", error });
    }
};

export const getBusVendorsById = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Vendor id is required" });
        }
        const vendor = await prisma.busVendor.findUnique({ where: { id } });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor", error });
    }
};

export const updateVendor = async (req: Request, res: Response) => {
    try {
        const { id, ...updates } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Vendor id is required" });
        }
        const vendor = await prisma.busVendor.update({
            where: { id },
            data: updates
        });
        res.json(vendor);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Vendor not found" });
        } else {
            res.status(400).json({ message: "Error updating vendor", error });
        }
    }
};

export const deleteBusVendor = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id || req.body.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Vendor id is required" });
        }
        await prisma.busVendor.delete({ where: { id } });
        res.json({ message: "Vendor deleted" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Vendor not found" });
        } else {
            res.status(500).json({ message: "Error deleting vendor", error });
        }
    }
};

// --- Location Operations ---

export const getBusLocations = async (_req: Request, res: Response) => {
    try {
        const locations = await prisma.busLocation.findMany();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error });
    }
};

export const getBusLocationById = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Location id is required" });
        }
        const location = await prisma.busLocation.findUnique({ where: { id } });
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: "Error fetching location", error });
    }
};

export const getAddressByLocationId = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Location id is required" });
        }
        const location = await prisma.busLocation.findUnique({ where: { id } });
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.json({ address: location.address });
    } catch (error) {
        res.status(500).json({ message: "Error fetching address", error });
    }
};

export const postBusLocation = async (req: Request, res: Response) => {
    try {
        const { city, state, address, locationId } = req.body;
        if (!city || !state || !address) {
            return res.status(400).json({ message: "city, state, and address are required" });
        }
        const location = await prisma.busLocation.create({
            data: { city, state, address, locationId: Number(locationId) || undefined }
        });
        res.status(201).json(location);
    } catch (error: any) {
        res.status(400).json({ message: "Error creating location", error: error.message || error });
    }
};

export const updateBusLocation = async (req: Request, res: Response) => {
    try {
        const { id, ...updates } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Location id is required" });
        }
        const location = await prisma.busLocation.update({
            where: { id },
            data: updates
        });
        res.json(location);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Location not found" });
        } else {
            res.status(400).json({ message: "Error updating location", error });
        }
    }
};

export const deleteBusLocation = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id || req.body.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Location id is required" });
        }
        await prisma.busLocation.delete({ where: { id } });
        res.json({ message: "Location deleted" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Location not found" });
        } else {
            res.status(500).json({ message: "Error deleting location", error });
        }
    }
};

// --- Schedule Operations ---

export const getBusSchedules = async (_req: Request, res: Response) => {
    try {
        const schedules = await prisma.busSchedule.findMany({
            include: {
                vendor: true,
                source: true,
                destination: true
            }
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules", error });
    }
};

export const getBusScheduleById = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Schedule id is required" });
        }
        const schedule = await prisma.busSchedule.findUnique({
            where: { id },
            include: {
                vendor: true,
                source: true,
                destination: true
            }
        });
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedule", error });
    }
};

export const postBusSchedule = async (req: Request, res: Response) => {
    try {
        const { 
            busName, 
            vendorId, 
            sourceLocationId, 
            destinationLocationId, 
            departureTime, 
            arrivalTime, 
            price, 
            scheduleDate 
        } = req.body;

        // Validation (optional but recommended)
        if (!busName || !vendorId || !sourceLocationId || !destinationLocationId) {
            return res.status(400).json({ message: "Missing required fields for schedule" });
        }

        const schedule = await prisma.busSchedule.create({
            data: {
                busName,
                vendorId,
                sourceLocationId,
                destinationLocationId,
                price: Number(price),
                departureTime: new Date(departureTime),
                arrivalTime: new Date(arrivalTime),
                scheduleDate: new Date(scheduleDate)
            }
        });
        res.status(201).json(schedule);
    } catch (error: any) {
        res.status(400).json({ message: "Error creating schedule", error: error.message || error });
    }
};

export const updateBusSchedule = async (req: Request, res: Response) => {
    try {
        const { id, ...updates } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Schedule id is required" });
        }
        if (updates.departureTime) updates.departureTime = new Date(updates.departureTime);
        if (updates.arrivalTime) updates.arrivalTime = new Date(updates.arrivalTime);
        if (updates.scheduleDate) updates.scheduleDate = new Date(updates.scheduleDate);

        const schedule = await prisma.busSchedule.update({
            where: { id },
            data: updates
        });
        res.json(schedule);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Schedule not found" });
        } else {
            res.status(400).json({ message: "Error updating schedule", error });
        }
    }
};

export const deleteBusSchedule = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id || req.body.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Schedule id is required" });
        }
        await prisma.busSchedule.delete({ where: { id } });
        res.json({ message: "Schedule deleted" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Schedule not found" });
        } else {
            res.status(500).json({ message: "Error deleting schedule", error });
        }
    }
};

export const searchBus = async (req: Request, res: Response) => {
    try {
        const { sourceId, destinationId, date } = req.query;

        const where: any = {};
        if (sourceId) where.sourceLocationId = String(sourceId);
        if (destinationId) where.destinationLocationId = String(destinationId);
        if (date) {
            const startDate = new Date(date as string);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
            where.scheduleDate = { gte: startDate, lte: endDate };
        }

        const schedules = await prisma.busSchedule.findMany({
            where,
            include: {
                vendor: true,
                source: true,
                destination: true
            }
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error searching buses", error });
    }
};

export const getBookedSeats = async (req: Request, res: Response) => {
    try {
        const scheduleId = String(req.query.scheduleId);
        if (!scheduleId || scheduleId === "undefined") return res.status(400).json({ message: "scheduleId is required" });

        const bookings = await prisma.busBooking.findMany({
            where: { scheduleId, status: "BOOKED" }
        });
        const seats = bookings.flatMap(b => b.seatNumbers);
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booked seats", error });
    }
};

// --- Booking Operations ---

export const getAllBusBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await prisma.busBooking.findMany({
            include: {
                user: { select: { name: true, email: true } },
                schedule: true
            }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

export const getBusBooking = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Booking id is required" });
        }
        const booking = await prisma.busBooking.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                schedule: true
            }
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
};

export const postBusBooking = async (req: Request, res: Response) => {
    try {
        const { userId, scheduleId, seatNumbers, totalAmount } = req.body;
        if (!userId || !scheduleId || !seatNumbers || totalAmount === undefined) {
            return res.status(400).json({ message: "Missing required fields for booking" });
        }
        const booking = await prisma.busBooking.create({
            data: {
                userId,
                scheduleId,
                seatNumbers: Array.isArray(seatNumbers) ? seatNumbers.map(Number) : [],
                totalAmount: Number(totalAmount)
            }
        });
        res.status(201).json(booking);
    } catch (error: any) {
        res.status(400).json({ message: "Error creating booking", error: error.message || error });
    }
};

export const deleteBusBooking = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id || req.query.id || req.body.id);
        if (!id || id === "undefined") {
            return res.status(400).json({ message: "Booking id is required" });
        }
        await prisma.busBooking.delete({ where: { id } });
        res.json({ message: "Booking deleted" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: "Booking not found" });
        } else {
            res.status(500).json({ message: "Error deleting booking", error });
        }
    }
};
