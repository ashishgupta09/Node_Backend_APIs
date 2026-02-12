import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import BusVendor from "../models/busVendor";
import BusLocation from "../models/busLocation";
import BusSchedule from "../models/busSchedule";
import BusBooking from "../models/busBooking";

// --- User Operations ---

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};



export const addNewUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, phone, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId, ...updates } = req.body; // Assuming userId is passed in body as per request style, or could be params
        if (updates.password) {
             updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error });
    }
};

export const deleteUserByUserId = async (req: Request, res: Response) => {
    try {
        // Try params first, then body/query if not in params, based on loosely defined API
        const userId = req.params.id || req.query.userId || req.body.userId;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};


// --- Vendor Operations ---

export const createVendor = async (req: Request, res: Response) => {
    try {
        const vendor = await BusVendor.create(req.body);
        res.status(201).json(vendor);
    } catch (error) {
        res.status(400).json({ message: "Error creating vendor", error });
    };
};

export const getBusVendors = async (_req: Request, res: Response) => {
    try {
        const vendors = await BusVendor.find();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendors", error });
    }
};

export const getBusVendorsById = async (req: Request, res: Response) => {
    try {
         const id = req.params.id || req.query.id;
        const vendor = await BusVendor.findById(id);
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vendor", error });
    }
};

export const updateVendor = async (req: Request, res: Response) => {
    try {
        const { id, ...updates } = req.body;
        const vendor = await BusVendor.findByIdAndUpdate(id, updates, { new: true });
        res.json(vendor);
    } catch (error) {
        res.status(400).json({ message: "Error updating vendor", error });
    }
};

export const deleteBusVendor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id || req.body.id;
        await BusVendor.findByIdAndDelete(id);
        res.json({ message: "Vendor deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting vendor", error });
    }
};

// --- Location Operations ---

export const getBusLocations = async (_req: Request, res: Response) => {
    try {
        const locations = await BusLocation.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error });
    }
};

export const getBusLocationById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id;
        const location = await BusLocation.findById(id);
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: "Error fetching location", error });
    }
};

export const getAddressByLocationId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id;
        const location = await BusLocation.findById(id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.json({ address: location.address });
    } catch (error) {
        res.status(500).json({ message: "Error fetching address", error });
    }
};

export const postBusLocation = async (req: Request, res: Response) => {
    try {
        const location = await BusLocation.create(req.body);
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ message: "Error creating location", error });
    }
};

export const updateBusLocation = async (req: Request, res: Response) => {
    try {
        const { id, ...updates } = req.body;
        const location = await BusLocation.findByIdAndUpdate(id, updates, { new: true });
        res.json(location);
    } catch (error) {
        res.status(400).json({ message: "Error updating location", error });
    }
};

export const deleteBusLocation = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id || req.body.id;
        await BusLocation.findByIdAndDelete(id);
        res.json({ message: "Location deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting location", error });
    }
};


// --- Schedule Operations ---

export const getBusSchedules = async (_req: Request, res: Response) => {
    try {
        const schedules = await BusSchedule.find()
            .populate("vendorId")
            .populate("sourceLocation")
            .populate("destinationLocation");
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules", error });
    }
};

export const getBusScheduleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id;
        const schedule = await BusSchedule.findById(id)
            .populate("vendorId")
            .populate("sourceLocation")
            .populate("destinationLocation");
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedule", error });
    }
};

export const postBusSchedule = async (req: Request, res: Response) => {
    try {
        const schedule = await BusSchedule.create(req.body);
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: "Error creating schedule", error });
    }
};

export const updateBusSchedule = async (req: Request, res: Response) => {
    try {
        const { id, ...updates } = req.body;
        const schedule = await BusSchedule.findByIdAndUpdate(id, updates, { new: true });
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ message: "Error updating schedule", error });
    }
};

export const deleteBusSchedule = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id || req.body.id;
        await BusSchedule.findByIdAndDelete(id);
        res.json({ message: "Schedule deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting schedule", error });
    }
};

export const searchBus = async (req: Request, res: Response) => {
    try {
        const { sourceId, destinationId, date } = req.query;
        
        const query: any = {};
        if (sourceId) query.sourceLocation = sourceId;
        if (destinationId) query.destinationLocation = destinationId;
        if (date) {
             const startDate = new Date(date as string);
             startDate.setHours(0,0,0,0);
             const endDate = new Date(startDate);
             endDate.setHours(23,59,59,999);
             query.scheduleDate = { $gte: startDate, $lte: endDate };
        }

        const schedules = await BusSchedule.find(query)
            .populate("vendorId")
            .populate("sourceLocation")
            .populate("destinationLocation");
            
        res.json(schedules);
    } catch (error) {
         res.status(500).json({ message: "Error searching buses", error });
    }
};

export const getBookedSeats = async (req: Request, res: Response) => {
    try {
        const { scheduleId } = req.query;
        if (!scheduleId) return res.status(400).json({ message: "scheduleId required" });

        const bookings = await BusBooking.find({ scheduleId, status: "BOOKED" });
        const seats = bookings.flatMap(b => b.seatNumbers);
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booked seats", error });
    }
};

// --- Booking Operations ---

export const getAllBusBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await BusBooking.find()
            .populate("userId", "name email")
            .populate("scheduleId");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

export const getBusBooking = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id;
        const booking = await BusBooking.findById(id)
            .populate("userId", "name email")
            .populate("scheduleId");
        res.json(booking);
    } catch (error) {
         res.status(500).json({ message: "Error fetching booking", error });
    }
};

export const postBusBooking = async (req: Request, res: Response) => {
    try {
        const booking = await BusBooking.create(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: "Error creating booking", error });
    }
};

export const deleteBusBooking = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || req.query.id || req.body.id;
        await BusBooking.findByIdAndDelete(id);
        res.json({ message: "Booking deleted" });
    } catch (error) {
         res.status(500).json({ message: "Error deleting booking", error });
    }
};
