import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useEffect } from 'react';


const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate=useNavigate()//once login successfully go to home page
  const [state, setState] = useState('Sign up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign up') {
        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, password }
        );

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Registration successful");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/user/login`,
          { email, password }
        );

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Login successful");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <p className="text-2xl font-semibold text-center mb-2">
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </p>
        <p className="text-center text-gray-600 mb-6">
          Please {state === 'Sign up' ? 'sign up' : 'log in'} to book an appointment.
        </p>

        {state === 'Sign up' && (
          <div className="mb-4">
            <p className="font-medium">Full Name</p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <p className="font-medium">Email</p>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="mb-4">
          <p className="font-medium">Password</p>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#5f6ce3] text-white py-2 rounded-md hover:bg-[#4f5de0] transition duration-300"
        >
          {state === 'Sign up' ? 'Sign Up' : 'Login'}
        </button>

        <p className="text-center text-gray-600 mt-4">
          {state === 'Sign up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="text-[#5f6ce3] cursor-pointer"
            onClick={() => setState(state === 'Sign up' ? 'Login' : 'Sign up')}
          >
            {state === 'Sign up' ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
