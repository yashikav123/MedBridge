import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js'; // ✅ MISSING in your code
import Razorpay from 'razorpay';
// ------------------ REGISTER ------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing details" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Password too short" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already registered" });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new userModel({ name, email, password: hashPassword }).save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ success: true, user, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------ LOGIN ------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, user, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------ GET PROFILE ------------------
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ success: false, message: "User ID required" });

    const user = await userModel.findById(userId).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------ UPDATE PROFILE ------------------
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender)
      return res.status(400).json({ success: false, message: "Missing required profile details" });

    let parsedAddress = {};
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid address format. Should be JSON string.",
        });
      }
    }

    const updateData = { name, phone, dob, gender, address: parsedAddress };

    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = uploadResult.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated successfully." });

  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------ BOOK APPOINTMENT ------------------
const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From middleware
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData || !docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const slots_booked = docData.slots_booked || {};

    // Check if slot is already booked
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }

    // Add slot
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select("-password");

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotDate,
      slotTime,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update doctor's slot booking
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });

  } catch (error) {
    console.error("Error in bookAppointment:", error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------ LIST APPOINTMENTS ------------------
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error in listAppointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};
//api to cancel appointment 
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId; // Correct: Get from middleware
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "You are not authorized to cancel this appointment" });
    }

    // Mark appointment as cancelled instead of deleting
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Free the slot in doctor schedule
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);

    if (docData) {
      let slots_booked = docData.slots_booked || {};
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((slot) => slot !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const razorpayInstance = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});
//api to make payement 
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Validate appointmentId
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    // Find the appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({ success: false, message: "Appointment not found or already cancelled" });
    }

    // Prepare Razorpay order options
    const options = {
      amount: appointmentData.amount * 100, // convert to paise
      currency: process.env.CURRENCY || "INR", // fallback to INR
      receipt: appointmentId.toString(),
    };

    // Create order using Razorpay instance
    const order = await razorpayInstance.orders.create(options);

    // Return response
    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment Razorpay Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// api to verify the pament of razorpay
const crypto = await import('crypto');

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature. Payment verification failed." });
    }

    // Optional: Fetch the appointment from receipt if you stored it
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });

    res.json({ success: true, message: "Payment verified and recorded successfully" });

  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};



export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,getMyAppointments,cancelAppointment,paymentRazorpay,verifyRazorpay};
