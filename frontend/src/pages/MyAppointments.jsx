import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    if (!token || !backendUrl) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/my-appointments`, {
        headers: { token }
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || "Failed to load appointments.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData?.();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  const verifyPayment = async (response) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verifyRazorpay`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        },
        {
          headers: { token }
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Payment Verification Error:", error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  const initPay = (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay not loaded.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Payment for Appointment",
      order_id: order.id,
      handler: async (response) => {
        await verifyPayment(response);
      },
      theme: {
        color: "#0F9D58",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/razorpay`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
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
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
            >
              <img
                src={item.docData?.image}
                alt={item.docData?.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900">{item.docData?.name}</p>
                <p className="text-sm text-gray-600">{item.docData?.speciality}</p>
                <p className="text-gray-500 mt-2">
                  <span className="font-medium">Address:</span>{" "}
                  {item.docData?.address?.line1}, {item.docData?.address?.line2}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                {item.isCompleted ? (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                ) : item.cancelled ? (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                ) : item.payment ? (
                  <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                    Payment Completed
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="text-sm sm:min-w-48 py-2 border text-stone-500 hover:bg-[#5f6ce3] hover:text-white rounded-lg"
                    >
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm sm:min-w-48 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
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
