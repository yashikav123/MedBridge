import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const updateUserProfileData = async () => {
    try{
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('dob',userData.gender);
      image && formData.append('image', image);
      //api call
      const {data}=await axios.post(backendUrl+"/api/user/updateProfile",formData,{headers:{token}});
        if(data.success)
        {
           toast.success(data.message);
           await loadUserProfileData();
           setIsEdit(false);
           setImage(false);
        }
        else{
          toast.error(data.message);
        }

    }catch(error){
      console.log(error)
    }
  }

  if (!userData) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-xl space-y-6">

        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative group w-32 h-32">
            <img
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#5f6ce3] shadow-md group-hover:brightness-75 transition duration-300"
            />

            {isEdit && (
              <>
                <label
                  htmlFor="image"
                  className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer"
                >
                  <img
                    src={assets.upload_icon}
                    alt="Upload"
                    className="w-10 h-10 opacity-80 group-hover:scale-110 transition duration-300"
                  />
                </label>
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </>
            )}
          </div>

          {/* Name */}
          {isEdit ? (
            <input
              type="text"
              className="mt-4 border p-2 rounded w-full text-center font-semibold text-lg"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="mt-4 text-xl font-bold text-gray-700">{userData.name}</p>
          )}
        </div>

        <hr className="border-gray-300" />

        {/* Contact Information */}
        <div className="space-y-4">
          <p className="text-lg font-semibold text-[#5f6ce3]">CONTACT INFORMATION</p>

          <div>
            <p className="text-gray-600 text-sm">Email:</p>
            <p className="text-gray-800">{userData.email}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-800">{userData.phone}</p>
            )}
          </div>

          <div>
            <p className="text-gray-600 text-sm">Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-800">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Basic Information */}
        <div className="space-y-4">
          <p className="text-lg font-semibold text-[#5f6ce3]">BASIC INFORMATION</p>

          <div>
            <p className="text-gray-600 text-sm">Gender:</p>
            {isEdit ? (
              <select
                className="border p-2 rounded w-full"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-800">{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="text-gray-600 text-sm">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-800">{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {isEdit ? (
            <button
              className="bg-[#5f6ce3] text-white px-4 py-2 rounded w-full hover:bg-[#4a57c9] transition font-semibold"
              onClick={(updateUserProfileData) => setIsEdit(false)}
            >
              Save Information
            </button>
          ) : (
            <button
              className="bg-[#5f6ce3] text-white px-4 py-2 rounded w-full hover:bg-[#4a57c9] transition font-semibold"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
