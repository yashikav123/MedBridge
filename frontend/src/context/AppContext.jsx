import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create context
export const AppContext = React.createContext();

// ✅ Currency formatting function
const currency = (amount) => `₹${amount}`;

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);

  const currencySymbol = '₹';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch doctor list
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error(error.message);
    }
  };

  // Load logged-in user's profile
  const loadUserProfileData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: {
          token: token, // ✅ Custom token header
        },
      });

      const { data } = response;

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message || 'Failed to load profile.');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error(error.response?.data?.message || 'Internal Server Error');
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    getDoctorsData,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    currency, // ✅ Added to context
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
