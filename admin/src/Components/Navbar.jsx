import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from "../context/DoctorContext.jsx";

const Navbar = () => {
    const { aToken,setAToken } = useContext(AdminContext);
    const navigate=useNavigate();
    const {dToken,setDToken } = useContext(DoctorContext);
    
    const logout=()=>{
        navigate("/");
        aToken && setAToken("");
        aToken && localStorage.removeItem("aToken");
        dToken && setDToken("");
        dToken && localStorage.removeItem("dToken");
        
    }
    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white '>
            <div className='flex items-center gap-2 text-xs'>
                <img className="w-36 sm:w-40 cursor-pointer"src={assets.admin_logo} alt="Admin Logo" />
                <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{aToken ? "Admin" : "Doctor"}</p>
            </div>
            <button onClick={logout} className="bg-[#5F6FFF] text-white tesxtsm px-10 py-2 rounded-full">Logout</button>
        </div>
    );
};

export default Navbar;
