import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center my-16 gap-4 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Only showing top 10 doctors */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-full h-56 bg-[#8d95e3] flex justify-center items-center">
              <img
                className="w-full h-full object-cover"
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></span>
                <p
                  className={`${
                    item.available ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {item.available ? 'Available' : 'Not Available'}
                </p>
              </div>
              <p className="text-gray-900 text-lg font-semibold">
                {item.name}
              </p>
              <p className="text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className="bg-[#8d95e3] text-black px-12 py-3 rounded-full mt-10"
      >
        View All
      </button>
    </div>
  );
};

export default TopDoctors;
