import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const logout = () => {
    setToken('false');
    localStorage.removeItem('token');
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400 px-4">
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-5 font-medium">
        {['Home', 'Find Doctors', 'About', 'Contact'].map((text, index) => (
          <NavLink key={index} to={`/${text.toLowerCase().replace(/\s+/g, '-')}`}>
            {({ isActive }) => (
              <div className="text-center">
                <li className="py-1 list-none">{text}</li>
                <hr
                  className={`border-none outline-none h-0.5 bg-[#5f6ce3] w-3/5 m-auto transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`}
                />
              </div>
            )}
          </NavLink>
        ))}
      </ul>

      {/* Profile / Auth Buttons / Menu Icon */}
      <div className="flex items-center gap-4 relative">
        {token && userData ? (
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={userData.image}
              alt="Profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />

            {showDropdown && (
              <div className="absolute top-12 right-0 text-base font-medium text-gray-600 z-20 bg-stone-100 rounded shadow-lg min-w-48 p-4">
                <p
                  onClick={() => {
                    navigate('/my-profile');
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer hover:text-[#5f6ce3] px-2 py-1"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate('/my-appointments');
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer hover:text-[#5f6ce3] px-2 py-1"
                >
                  Appointments
                </p>
                <p
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer hover:text-[#5f6ce3] px-2 py-1"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#5f6ce3' }}
            className="text-white px-8 py-3 rounded-full font-bold hidden md:block"
          >
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />
      </div>

      {/* Mobile Navigation Menu */}
      {showMenu && (
        <div className="fixed md:hidden right-0 top-0 bottom-0 z-30 bg-white w-64 shadow-lg transition">
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="Logo" />
            <img
              onClick={() => setShowMenu(false)}
              className="cursor-pointer w-6 h-6 z-50"
              src={assets.cross_icon}
              alt="Close"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            {['Home', 'Find Doctors', 'About', 'Contact'].map((text, index) => (
              <NavLink
                key={index}
                to={`/${text.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-700 hover:text-[#5f6ce3] transition duration-300"
                onClick={() => setShowMenu(false)}
              >
                {text}
              </NavLink>
            ))}
            {!token && (
              <button
                onClick={() => {
                  navigate('/login');
                  setShowMenu(false);
                }}
                className="mt-4 bg-[#5f6ce3] text-white px-6 py-2 rounded-full font-semibold"
              >
                Create account
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
