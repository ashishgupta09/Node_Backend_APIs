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
router.post("/UpdateUser", updateUser);
router.delete("/DeleteUserByUserId", deleteUserByUserId);
router.delete("/DeleteUserByUserId/:id", deleteUserByUserId);

// Vendor Routes
router.post("/CreateVendor", createVendor);
router.get("/GetBusVendors", getBusVendors);
router.get("/GetBusVendorsById", getBusVendorsById);
router.get("/GetBusVendorsById/:id", getBusVendorsById);
router.put("/PutBusVendors", updateVendor);
router.post("/PostBusVendor", createVendor);
router.delete("/DeleteBusVendor", deleteBusVendor);
router.delete("/DeleteBusVendor/:id", deleteBusVendor);

// Location Routes
router.get("/GetBusLocations", getBusLocations);
router.get("/GetBusLocationById", getBusLocationById);
router.get("/GetBusLocationById/:id", getBusLocationById);
router.get("/getAddressByLocationId", getAddressByLocationId);
router.get("/getAddressByLocationId/:id", getAddressByLocationId);
router.post("/PostBusLocationAddress", updateBusLocation);
router.put("/PutBusLocation", updateBusLocation);
router.post("/PostBusLocation", postBusLocation);
router.delete("/DeleteBusLocation", deleteBusLocation);
router.delete("/DeleteBusLocation/:id", deleteBusLocation);

// Schedule Routes
router.get("/GetBusSchedules", getBusSchedules);
router.get("/searchBus", searchBus);
router.get("/getBookedSeats", getBookedSeats);
router.get("/searchBus2", searchBus);
router.get("/GetBusScheduleById", getBusScheduleById);
router.get("/GetBusScheduleById/:id", getBusScheduleById);
router.put("/PutBusSchedule", updateBusSchedule);
router.post("/PostBusSchedule", postBusSchedule);
router.delete("/DeleteBusSchedule", deleteBusSchedule);
router.delete("/DeleteBusSchedule/:id", deleteBusSchedule);

// Booking Routes
router.get("/GetAllBusBookings", getAllBusBookings);
router.get("/GetBusBooking", getBusBooking);
router.get("/GetBusBooking/:id", getBusBooking);
router.post("/PostBusBooking", postBusBooking);
router.delete("/DeleteBusBooking", deleteBusBooking);
router.delete("/DeleteBusBooking/:id", deleteBusBooking);

export default router;
