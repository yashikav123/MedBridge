import express from 'express';
import {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,adminDashboard
} from '../controllers/adminController.js';

import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailablity } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// Route to Add Doctor with Image Upload
adminRouter.post(
  '/add-doctor',
  upload.single('image'),
  (req, res, next) => {
    console.log("File received:", req.file);
    next();
  },
  addDoctor
);

// Admin Login
adminRouter.post('/login', loginAdmin);

// Get all doctors
adminRouter.post('/all-doctors', authAdmin, allDoctors);

// Change doctor availability
adminRouter.post('/change-availability', authAdmin, changeAvailablity);

// Get all appointments
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);

// Cancel appointment ✅ FIXED
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard',authAdmin,adminDashboard)
// Test route
adminRouter.post('/add-doctor/test', (req, res) => {
  res.send('Doctor added successfully!');
});

export default adminRouter;
