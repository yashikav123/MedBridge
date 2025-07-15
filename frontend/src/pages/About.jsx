import React from 'react';
import { assets } from '../assets/assets';

export const About = () => {
  return (
    <div className="px-4 md:px-10">
      <div className="text-center text-3xl font-semibold text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="About Us" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to <b>MedBridge</b>, your trusted partner in managing your healthcare needs conveniently and efficiently. 
            Our platform connects patients with top doctors across various specialties, ensuring you receive the best medical care 
            from the comfort of your home.
          </p>
          <p>
            We aim to provide quick and easy access to qualified doctors, reduce waiting times at clinics and hospitals, 
            and enhance patient convenience through online consultations and bookings.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            The process is simple—search for doctors by specialty, location, and availability, 
            book a suitable time slot, consult in person or online, and follow up with prescriptions, reports, and medical advice.
          </p>
        </div>
      </div>

      <div className="text-xl my-4 text-center">
        <p>
          WHY <span className="text-[#5f6ce3] font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20 gap-6'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6ce3] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>At MedBridge, we ensure fast doctor searches, easy bookings, and seamless consultations. Get quality healthcare with minimal wait time and maximum convenience! 🚀</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6ce3] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Book appointments online, manage your schedule, and receive personalized care from the comfort of your home. Experience convenience like never before! 🏠</p>
        </div>
      </div>
    </div>
  );
};

export default About;
