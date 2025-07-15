import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the Admin context
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData,setDashData] = useState(false);  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Get all doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { aToken } }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleAuthError(error, "Failed to fetch doctors.");
    }
  };

  // Change doctor availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to change availability.");
    }
  };

  // Get all appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments`,
        { headers: { aToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log("✅ Appointments fetched:", data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch appointments.");
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments(); // Refresh after cancel
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to cancel appointment.");
    }
  };

  //getdashboard data
  const getDashData = async () => {
  try {
    const { data } = await axios.get(
      backendUrl + '/api/admin/dashboard',
      {
        headers: { aToken }
      }
    );

    if (data.success) {
      setDashData(data.dashData);
      console.log(data.dashData);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch dashboard data");
  }
};


  // Handle auth errors and session expiry
  const handleAuthError = (error, fallbackMessage) => {
    if (
      error.response &&
      error.response.data?.message === "Unauthorized. Token is invalid or expired."
    ) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("aToken");
      setAToken("");
      window.location.href = "/admin-login";
    } else {
      toast.error(error.message || fallbackMessage);
    }
  };

  // Context value
  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    backendUrl,getDashData,dashData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
