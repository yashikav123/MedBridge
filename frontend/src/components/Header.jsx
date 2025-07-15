import React from 'react';
import { assets } from '../assets/assets';
import { motion } from "framer-motion";
const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20" style={{ backgroundColor: '#5f6ce3' }}>
      {/* ---- Left ---- */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-3xl font-semibold leading-tight md:leading-tight lg:leading-tight text-white">
          Your Health, Our Priority. <br /> Book Your Appointment Today.
        </p>
        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
            <img className='w-28'src={assets.group_profiles} alt="" />
            <p>
            Browse trusted doctors, choose your specialist, and <br></br>book your appointment in just a few clicks. <br></br>
            
            </p>
        </div>
        <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#5f6ce3] text-sm m-auto ms:m-0 hover:scale-105 transition-all duration-300 font-semibold'>
            Book appointment <img className='w-3' src={assets.arrow_icon} alt=" "/>
        </a>

      </div>

      {/* ---- Right ---- */}
      <div className="md:w-1/2 relative">
     <motion.img
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="w-full md:absolute bottom-0 h-auto rounded-lg"
    src={assets.header_img}
    alt=""
    />
</div>
    </div>
  );
};

export default Header;
