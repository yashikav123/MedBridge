import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

const updateProfile = async () => {
  try {
    const updateData = {
      docId: profileData._id, // ✅ MAKE SURE THIS IS PRESENT
      fees: Number(profileData.fees) || 0,
      available: profileData.available,
      address: {
        line1: profileData.address?.line1 || '',
        line2: profileData.address?.line2 || '',
      },
    };

    console.log("Sending updateData:", updateData); // ✅ check in devtools

    const { data } = await axios.post(
      backendUrl + '/api/doctor/update-profile',
      updateData,
      {
        headers: {
          token: dToken,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      setProfileData(data.profileData); // Update with returned profile
      setIsEdit(false);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Update Profile Error:", error.response?.data || error.message);
    toast.error("Something went wrong while updating profile.");
  }
};




  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData && (
    <div>
      <div className="flex flex-col gap-3 m-5">
        {/* Doctor Image */}
        <div>
          <img
            className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
            src={profileData.image}
            alt="Doctor"
          />
        </div>

        {/* Doctor Info Card */}
        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {profileData.name}
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              {profileData.experience} years
            </button>
          </div>

          {/* About Section */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About:</p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {profileData.about}
            </p>
          </div>

          {/* Appointment Fee */}
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:
            <span className="text-gray-800 ml-2">
              {isEdit ? (
                <>
                  ₹
                  <input
                    type="number"
                    value={profileData.fees ?? ''}
                    onChange={(e) =>
                      setProfileData(prev => ({ ...prev, fees: e.target.value }))
                    }
                    className="ml-2 border px-2 py-0.5 rounded"
                  />
                </>
              ) : (
                currency(profileData.fees ?? 0)
              )}
            </span>
          </p>

          {/* Address Section */}
          <div className="flex flex-col py-2">
            <p className="text-sm text-gray-600 font-medium">Address:</p>
            <p className="text-sm text-gray-600">
              {isEdit ? (
                <input
                  type="text"
                  value={profileData.address?.line1 ?? ''}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                  className="border px-2 py-0.5 rounded"
                />
              ) : (
                profileData.address?.line1
              )}
            </p>
            <br />
            <p className="text-sm text-gray-600">
              {isEdit ? (
                <input
                  type="text"
                  value={profileData.address?.line2 ?? ''}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                  className="border px-2 py-0.5 rounded"
                />
              ) : (
                profileData.address?.line2
              )}
            </p>
          </div>

          {/* Availability Checkbox */}
          <div className="flex gap-2 pt-2 items-center">
            <input
              type="checkbox"
              checked={profileData.available || false}
              onChange={() =>
                isEdit &&
                setProfileData(prev => ({
                  ...prev,
                  available: !prev.available
                }))
              }
            />
            <label>Available</label>
          </div>

          {/* Action Button */}
          {isEdit ? (
            <button
              onClick={updateProfile}
              className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-[#5f6ce3] hover:text-white transition-all"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-[#5f6ce3] hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
