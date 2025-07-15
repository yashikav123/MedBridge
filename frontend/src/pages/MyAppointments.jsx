import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/my-appointments', {
        headers: { token: token } // ✅ ensure key and value both exist
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        toast.error(data.message || "Failed to load appointments.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <p className="text-3xl font-semibold text-gray-800 mb-6">My Appointments</p>
      <div className="w-full max-w-3xl space-y-6">
        {appointments?.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Doctor Image */}
              <img
                src={item.docData?.image}
                alt={item.docData?.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />

              {/* Doctor Info */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900">{item.docData?.name}</p>
                <p className="text-sm text-gray-600">{item.docData?.speciality}</p>
                <p className="text-gray-500 mt-2">
                  <span className="font-medium">Address:</span>{" "}
                  {item.docData?.address?.line1}, {item.docData?.address?.line2}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button className="bg-green-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-500 transition">
                  Pay Online
                </button>
                <button className="bg-red-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-500 transition">
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
