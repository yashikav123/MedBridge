import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// ✅ Change Availability
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }
    );

    res.json({ success: true, message: "Availability Updated", updated: updatedDoctor });
  } catch (error) {
    console.error("Error in changeAvailablity:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get All Doctors (Admin Panel)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Login Doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, doctor, token });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Error in loginDoctor:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Appointments for Doctor
const appointmentsDoctor = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    const appointments = await appointmentModel
      .find({ docId: doctorId })
      .populate('userId', 'name image dob');

    const formattedAppointments = appointments.map((appt) => ({
      ...appt._doc,
      userData: appt.userId,
    }));

    res.json({ success: true, appointments: formattedAppointments });
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Mark Appointment Completed
const appointmentComplete = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment marked as completed" });
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to mark this appointment as completed",
      });
    }
  } catch (error) {
    console.error("Error in appointmentComplete:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Cancel Appointment
const appointmentCancel = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.status(403).json({
        success: false,
        message: "Cancellation failed",
      });
    }
  } catch (error) {
    console.error("Error in appointmentCancel:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Dashboard Data
const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    const appointments = await appointmentModel.find({ docId: doctorId });

    let earnings = 0;
    let patients = [];

    appointments.forEach((item) => {
      if (item.isCompleted || item.paymentStatus) {
        earnings += item.amount;
      }

      if (!patients.includes(item.userId.toString())) {
        patients.push(item.userId.toString());
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Error in doctorDashboard:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
//api to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const doctor = await doctorModel.findById(doctorId).select('-password');
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Return only needed fields and ensure defaults
    const profileData = {
      _id: doctor._id,
      name: doctor.name || '',
      image: doctor.image || '',
      degree: doctor.degree || '',
      speciality: doctor.speciality || '',
      experience: doctor.experience || 0,
      about: doctor.about || '',
      fees: doctor.fees ?? 0, // ✅ ensure this is always a number
      available: doctor.available ?? false,
      address: doctor.address || { line1: '', line2: '' }
    };

    res.json({ success: true, profileData });
  } catch (error) {
    console.log("Error in doctorProfile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//api to update doctor profile data from Doctor panel
// api to update doctor profile data from Doctor panel
// ✅ Update Doctor Profile with validation
const updateDoctorProfile = async (req, res) => {
  try {
    console.log("📦 Received update payload:", req.body); // ✅ Log payload

    const { docId, fees, address, available } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    if (fees === undefined || isNaN(Number(fees))) {
      return res.status(400).json({ success: false, message: "Fees must be a valid number" });
    }

    const updatedFields = {
      fees: Number(fees),
      available: Boolean(available),
    };

    if (address?.line1 || address?.line2) {
      updatedFields.address = {
        line1: address.line1 || '',
        line2: address.line2 || '',
      };
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      updatedFields,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      message: "Profile Updated",
      profileData: updatedDoctor,
    });

  } catch (error) {
    console.error("Error in updateDoctorProfile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
};
