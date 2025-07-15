import React, { useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    cancelAppointment
  } = useContext(DoctorContext);
  
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]); // or use [] if dToken doesn't change dynamically

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        {/* Earnings Card */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all ">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{currency}{dashData.earnings}</p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all ">
          <img className="w-14" src={assets.appointment_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all ">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments?.map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={item.userData.image} alt="Patient" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.userData.name}</p>
                <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className='w-10 cursor-pointer'
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
