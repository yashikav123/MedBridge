import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Function to get all doctors
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
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Unauthorized. Token is invalid or expired."
    ) {
      // Token expired - handle it
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("aToken");
      setAToken("");

      // OPTIONAL: Redirect to login
      window.location.href = "/admin-login"; // change based on your route
    } else {
      toast.error(error.message || "Failed to fetch doctors.");
    }
  }
};

const changeAvailability = async (docId) => {
  try {
    const { data } = await axios.post(
      backendUrl+'/api/admin/change-availability',
      { docId },
      { headers: { aToken } }
    );

    if (data.success) {
      toast.success(data.message);
      getAllDoctors();  //it update the state
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message || "Failed to change availability.");
  }
};


  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    backendUrl,
    changeAvailability
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
