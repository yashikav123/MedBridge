import express from 'express';
import { addDoctor,loginAdmin, allDoctors } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailablity } from '../controllers/doctorController.js'; 
const adminRouter = express.Router();

// Route to Add Doctor with Image Upload
adminRouter.post('/add-doctor', upload.single('image'), (req, res, next) => {
    console.log("File received:", req.file); // Debugging file upload
    next();
}, addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors', authAdmin, allDoctors); //authAdmin which is a middleware
adminRouter.post('/change-availability', authAdmin, changeAvailablity);

// Example Route for Testing
adminRouter.post('/add-doctor/test', (req, res) => {
    res.send('Doctor added successfully!');
});

export default adminRouter;
