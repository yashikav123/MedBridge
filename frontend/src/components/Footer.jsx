import React from 'react';
import { assets } from '../assets/assets'; 

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="MedBridge Logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis dolorem obcaecati error dicta, ducimus maiores quibusdam accusamus voluptatem molestiae, iste modi minima ad molestias dolore perspiciatis non possimus animi est!
          </p>
        </div>
        
    
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>    
        </div>

    
        <div>
          <p className="text-xl font-medium mb-5">Get in touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-555-5555</li>
            <li>Medbridge@gmail.com</li>
          </ul>
        </div>
      </div>

      
      <div className="text-center text-gray-800 mt-5">
  <hr />
  <p className="text-sm font-semibold py-4">Copyright 2025@ MedBridge - All Rights Reserved</p>
</div>
</div>
  );
};

export default Footer;
