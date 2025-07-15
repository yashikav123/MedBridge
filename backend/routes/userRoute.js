import express from "express";
import { registerUser, loginUser, getProfile, updateProfile,bookAppointment,getMyAppointments } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🟢 Add this route (this might be missing in your code)
router.get("/profile", authUser, getProfile);

// ✅ Profile update
router.post("/update-profile", authUser, upload.single("image"), updateProfile);
router.post("/book-appointment", authUser, bookAppointment);
//router.post("/list-appointment", authUser, listAppointment);
router.get("/my-appointments", authUser, getMyAppointments); 
export default router;
