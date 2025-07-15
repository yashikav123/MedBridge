import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"; // ✅ Removed require, already imported

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        console.log("Received Body:", req.body);  // ✅ Debugging
        console.log("Received File:", req.file);  // ✅ Debugging

        // Check for missing fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Email already exists. Please use a different email." });
        }

        // Check if image file exists
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is missing" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // Parse address safely
        let parsedAddress = address;
        try {
            if (typeof address === "string") {
                parsedAddress = JSON.parse(address);
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        // Save doctor details
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.status(201).json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            console.log("JWT Secret Key:", process.env.JWT_SECRET); // ✅ Debugging

            const tokenPayload = `${email}:${password}`;

            // ✅ Fixed environment variable name
            const token = jwt.sign({ data: tokenPayload }, process.env.JWT_SECRET, { expiresIn: "1d" });

            res.json({ success: true, message: "Login Successful", token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
//Api to get the all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors }); // ✅ Corrected response
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" }); // ✅ Proper error response
    }
};


export { addDoctor, loginAdmin,allDoctors };
