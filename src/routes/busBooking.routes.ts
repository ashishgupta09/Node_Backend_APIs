import { Router } from "express";
import {
    getAllUsers,
    addNewUser,
    updateUser,
    deleteUserByUserId,
    createVendor,
    getBusVendors,
    getBusVendorsById,
    updateVendor,
    deleteBusVendor,
    getBusLocations,
    getBusLocationById,
    getAddressByLocationId,
    postBusLocation,
    updateBusLocation,
    deleteBusLocation,
    getBusSchedules,
    getBusScheduleById,
    postBusSchedule,
    updateBusSchedule,
    deleteBusSchedule,
    searchBus,
    getBookedSeats,
    getAllBusBookings,
    getBusBooking,
    postBusBooking,
    deleteBusBooking
} from "../controllers/busBooking.controller";

const router = Router();

// User Routes
router.get("/GetAllUsers", getAllUsers);
router.post("/AddNewUser", addNewUser);
router.put("/UpdateUser", updateUser);
router.delete("/DeleteUserByUserId/:id", deleteUserByUserId);

// Vendor Routes
router.post("/CreateVendor", createVendor);
router.get("/GetBusVendors", getBusVendors);
router.get("/GetBusVendorsById/:id", getBusVendorsById);
router.put("/UpdateBusVendor", updateVendor);
router.delete("/DeleteBusVendor/:id", deleteBusVendor);

// Location Routes
router.get("/GetBusLocations", getBusLocations);
router.get("/GetBusLocationById/:id", getBusLocationById);
router.get("/GetAddressByLocationId/:id", getAddressByLocationId);
router.post("/PostBusLocation", postBusLocation);
router.put("/UpdateBusLocation", updateBusLocation);
router.delete("/DeleteBusLocation/:id", deleteBusLocation);

// Schedule Routes
router.get("/GetBusSchedules", getBusSchedules);
router.get("/GetBusScheduleById/:id", getBusScheduleById);
router.get("/SearchBus", searchBus);
router.get("/GetBookedSeats", getBookedSeats);
router.post("/PostBusSchedule", postBusSchedule);
router.put("/UpdateBusSchedule", updateBusSchedule);
router.delete("/DeleteBusSchedule/:id", deleteBusSchedule);

// Booking Routes
router.get("/GetAllBusBookings", getAllBusBookings);
router.get("/GetBusBooking/:id", getBusBooking);
router.post("/PostBusBooking", postBusBooking);
router.delete("/DeleteBusBooking/:id", deleteBusBooking);

export default router;
