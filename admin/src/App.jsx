import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from 'react-router-dom';

import { AdminContext } from './context/AdminContext';
import Login from './pages/login';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Dashboard from './pages/Admin/Dashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import { DoctorContext } from './context/DoctorContext';
const App = () => {
  const { aToken } = useContext(AdminContext);
   const {dToken}=useContext(DoctorContext);
  return aToken || dToken ? (
    <div className="bg-[#F9F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          {/* Doctor routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointment />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
