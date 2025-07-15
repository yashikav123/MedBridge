import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';
// ✅ API for adding a new doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is missing" });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    let parsedAddress = address;
    try {
      if (typeof address === "string") {
        parsedAddress = JSON.parse(address);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

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

    return res
      .status(201)
      .json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const tokenPayload = `${email}:${password}`;
      const token = jwt.sign(
        { data: tokenPayload },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ success: true, message: "Login Successful", token });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to get all doctors (admin panel)
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ API to get all appointments
// adminController.js

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate('userId', 'name image dob')   // from User model
      .populate('docId', 'name image fees');  // from Doctor model

    const formattedAppointments = appointments.map((appt) => ({
      ...appt._doc,
      userData: appt.userId,
      docData: appt.docId,
    }));

    res.json({ success: true, appointments: formattedAppointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};






// ✅ API to cancel an appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      $set: { cancelled: true },
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);

    if (docData) {
      const slots_booked = { ...docData.slots_booked };
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (slot) => slot !== slotTime
        );

        await doctorModel.findByIdAndUpdate(docId, { $set: { slots_booked } });
      }
    }

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



// ✅ Export only working APIs
export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard
};
