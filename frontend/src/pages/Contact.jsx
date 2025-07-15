import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div>
      <div className="text-center text-3xl font-semibold text-gray-500 my-10">
        <p>
          CONTACT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="Contact Us" />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="font-semibold text-lg text-gray-800">Our Office</p>
          <p>186 Thangappa Nagar <br /> Bangalore</p>
          <p>Tel: 123456789 <br /> Email: Medbridge@gmail.com</p>

          <p className="font-semibold text-lg text-gray-800">Careers at MedBridge</p>
          <p>Learn more about our teams</p>

          <button className="border border-blue-200 px-4 py-2 rounded-xl cursor-pointer hover:-translate-y-2 transition-all duration-500 hover:bg-black hover:text-white">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
