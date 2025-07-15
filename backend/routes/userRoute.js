import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,paymentRazorpay,verifyRazorpay
} from "../controllers/userController.js";

import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// ✅ User Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authUser, getProfile);

// ✅ Profile Update
router.post("/update-profile", authUser, upload.single("image"), updateProfile);

// ✅ Appointment Routes
router.post("/book-appointment", authUser, bookAppointment);
router.get("/my-appointments", authUser, getMyAppointments);
router.post("/cancel-appointment", authUser, cancelAppointment);
router.post("/razorpay", authUser, paymentRazorpay);
router.post("/verifyRazorpay", authUser, verifyRazorpay);
// (Optional): If you plan to use this route later, uncomment it
// router.post("/list-appointment", authUser, listAppointment);

export default router;
