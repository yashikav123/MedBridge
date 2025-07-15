import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from "../components/RelatedDoctors";
const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext); // Ensure doctors is always an array
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter,setShowFilter]=useState(false)

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);//verify pannitu it calls the function

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
      <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6ce3] text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>
       Filters
       </button> {/*to make right menu*/}
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex': 'hidden sm:flex'}`}>
          <p onClick={()=> speciality === 'General physician'? navigate(`/doctors`): navigate(`/doctors/General physician`)}  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer hover:text-[#5f6ce3] hover:font-semibold ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}`}>General physician</p>
          <p onClick={()=> speciality === 'Gynecologist'? navigate(`/doctors`): navigate(`/doctors/Gynecologist`)}className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer hover:text-[#5f6ce3] hover:font-semibold ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''}`}>Gynecologist</p>
          <p onClick={()=> speciality === 'Dermatologist'? navigate(`/doctors`): navigate(`/doctors/Dermatologist`)}className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer hover:text-[#5f6ce3] hover:font-semibold ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''}`}>Dermatologist</p>
          <p onClick={()=> speciality === 'Pediatricians'? navigate(`/doctors`): navigate(`/doctors/Pediatricians`)}className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer hover:text-[#5f6ce3] hover:font-semibold ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''}`}>Pediatricians</p>
          <p onClick={()=> speciality === 'Neurologist'? navigate(`/doctors`): navigate(`/doctors/Neurologist`)}className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer hover:text-[#5f6ce3] hover:font-semibold ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''}`}>Neurologist</p>
          <p onClick={()=> speciality === 'Gastroenterologist'? navigate(`/doctors`): navigate(`/doctors/Gastroenterologist`)}className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer hover:text-[#5f6ce3] hover:font-semibold ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ''}`}>Gastroenterologist</p>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0" > {/*to make the doctor card*/}
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                key={index}
              >
                <div className="w-full h-56 bg-[#8d95e3] flex justify-center items-center">
                  <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
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
                  <p className="text-gray-900 text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-600">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No doctors found for this speciality.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
