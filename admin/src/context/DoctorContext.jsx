import React, { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState({});

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { token: dToken }
      });

      if (data.success) {
        setAppointments(data.appointments);
        console.log("✅ Appointments fetched:", data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Axios Error in getAppointments:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { token: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message || "Failed to complete appointment.");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { token: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { token: dToken }
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };
const getProfileData = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
      headers: { token: dToken }
    });

    if (data.success) {
      setProfileData({
        ...data.profileData,
        fees: data.profileData.fees ?? 0 // ✅ Set fees default
      });
      console.log("✅ Profile data loaded:", {
        ...data.profileData,
        fees: data.profileData.fees ?? 0
      });
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    toast.error(error?.response?.data?.message || "Something went wrong.");
  }
};


  // ✅ All states and methods passed via context
  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    setAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    setDashData,
    profileData,
    getProfileData,
    setProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
