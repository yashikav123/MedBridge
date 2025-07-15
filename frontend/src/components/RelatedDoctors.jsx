import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from "react-router-dom";

const RelatedDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const { docId, speciality } = useParams(); // ✅ Extract both docId & speciality
  const [relDoc, setRelDocs] = useState([]);

  useEffect(() => {
    console.log("Doctors:", doctors);
    console.log("Speciality:", speciality);
    console.log("Doc ID:", docId);

    if (doctors.length > 0 && speciality && docId) {
      const filteredDoctors = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId);
      setRelDocs(filteredDoctors);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className='flex flex-col items-center my-16 gap-4 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors.
      </p>
      
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (  
          <div onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0, 0);}}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500' 
            key={index}
          >  
            <div className='w-full h-56 bg-[#8d95e3] flex justify-center items-center'> 
              <img className='w-full h-full object-cover' src={item.image} alt={item.name} />
            </div>  
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-green-500'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <p>{item.status || "Available"}</p>  
              </div>
              <p className='text-gray-900 text-lg font-semibold'>{item.name}</p>
              <p className='text-gray-600'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} className="bg-[#8d95e3] text-black-600 px-12 py-3 rounded-full mt-10">
        View All
      </button>
    </div>
  );
}

export default RelatedDoctors;
