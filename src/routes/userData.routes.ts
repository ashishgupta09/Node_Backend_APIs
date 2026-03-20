import { Router } from "express";
import { createUserData, getAllUserData, getUserDataById, updateUserData, deleteUserData } from "../controllers/userData.controller";

const router = Router();

router.post("/", createUserData);
router.get("/", getAllUserData);
router.get("/:id", getUserDataById);
router.put("/:id", updateUserData);
router.delete("/:id", deleteUserData);

export default router;
