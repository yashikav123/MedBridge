import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, []);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No appointments found.</p>
        ) : (
          appointments.reverse().map((item, index) => {
            const user = item.userData;
            if (!user) return null;

            return (
              <div
                key={item._id || index}
                className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100"
              >
                <p className="max-sm:hidden">{index + 1}</p>

                <div className="flex items-center gap-2">
                  <img className="w-8 h-10 rounded-full object-cover" src={user.image} alt="Patient" />
                  <p>{user.name}</p>
                </div>

                <div>
                  <p className="text-xs inline border border-green-500 px-2 py-0.5 rounded-full">
                    {item.payment ? 'Online' : 'Cash'}
                  </p>
                </div>

                <p className="max-sm:hidden">{calculateAge(user.dob)}</p>

                <p>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                <p>{currency(item.amount)}</p>

                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-400 text-xs font-medium">Completed</p>
                ) : (
                  <div className="flex gap-2">
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-6 cursor-pointer"
                      src={assets.tick_icon}
                      alt="Complete"
                    />
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-6 cursor-pointer"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
