import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import cancelIcon from '../../assets/cancel_icon.svg';

const AllAppointment = () => {
  const { aToken, appointments = [], getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No appointments found.</p>
        ) : (
          appointments.map((item, index) => {
            const user = item?.userData;
            const doctor = item?.docData;

            if (!user || !doctor) return null;

            return (
              <div
                key={item._id || index}
                className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              >
                <p className="max-sm:hidden">{index + 1}</p>

                <div className="flex items-center gap-2">
                  <img
                    src={user.image}
                    className="w-8 h-10 rounded-full object-cover"
                    alt="User"
                  />
                  {user.name}
                </div>

                <p className="max-sm:hidden">{calculateAge(user.dob)}</p>

                <p>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                <div className="flex items-center gap-2">
                  <img
                    src={doctor.image}
                    className="w-8 h-10 rounded-full object-cover"
                    alt="Doctor"
                  />
                  {doctor.name}
                </div>

                <p>{currency(doctor.fees)}</p>

                <div className="flex items-center gap-2">
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">Completed</p>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-6 cursor-pointer"
                      src={cancelIcon}
                      alt="Cancel"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
