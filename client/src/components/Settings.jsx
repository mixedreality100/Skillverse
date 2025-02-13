import React, { useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Settings = ({ userInfo, updateUserInfo }) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false
  });

  const [localUserInfo, setLocalUserInfo] = useState(userInfo);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const handleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = async (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: false
    }));

    // First update the parent component's state
    updateUserInfo(localUserInfo);

    // Save to localStorage as a temporary solution
    localStorage.setItem('userInfo', JSON.stringify(localUserInfo));

    // If you have an API, you would make the API call here
    try {
      // Example API call (uncomment and modify as needed)
      // await axios.put('/api/user/update', { [field]: localUserInfo[field] });
    } catch (error) {
      console.error('Failed to save changes:', error);
      // Optionally add error handling UI
    }
  };

  const handleChange = (e, field) => {
    setLocalUserInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLocalUserInfo(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
      updateUserInfo({
        ...localUserInfo,
        profilePicture: imageUrl
      });
      
      // Save the updated profile picture to localStorage
      localStorage.setItem('userInfo', JSON.stringify({
        ...localUserInfo,
        profilePicture: imageUrl
      }));
    }
  };

  // Modify the useEffect to ensure it runs only once and properly syncs
  React.useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      const parsedUserInfo = JSON.parse(savedUserInfo);
      setLocalUserInfo(parsedUserInfo);
      // Ensure the parent component gets updated with the stored data
      updateUserInfo(parsedUserInfo);
    } else {
      // If no saved data exists, save the initial userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }, []); // Empty dependency array to run only once

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Account Information</h2>
      
      {/* Profile Picture Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Profile Picture</label>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={localUserInfo.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <button
              onClick={handleProfilePictureClick}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            >
              <FiUpload />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
          <p className="text-sm text-gray-500">Click the upload button to change your profile picture</p>
        </div>
      </div>

      {/* Full Name Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Full Name</label>
          {!isEditing.name ? (
            <button 
              onClick={() => handleEdit('name')}
              className="text-blue-500 text-sm"
            >
              EDIT
            </button>
          ) : (
            <button 
              onClick={() => handleSave('name')}
              className="text-green-500 text-sm"
            >
              SAVE
            </button>
          )}
        </div>
        {isEditing.name ? (
          <input
            type="text"
            value={localUserInfo.name}
            onChange={(e) => handleChange(e, 'name')}
            className="w-full p-2 border rounded text-white bg-gray-700"
          />
        ) : (
          <div>
            <p className="text-lg">{userInfo.name}</p>
            <p className="text-sm text-gray-500">The name that is used for ID verification and that appears on your certificates</p>
          </div>
        )}
      </div>

      {/* Email Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Email address(Sign in)</label>
          {!isEditing.email ? (
            <button 
              onClick={() => handleEdit('email')}
              className="text-blue-500 text-sm"
            >
              EDIT
            </button>
          ) : (
            <button 
              onClick={() => handleSave('email')}
              className="text-green-500 text-sm"
            >
              SAVE
            </button>
          )}
        </div>
        {isEditing.email ? (
          <input
            type="email"
            value={localUserInfo.email}
            onChange={(e) => handleChange(e, 'email')}
            className="w-full p-2 border rounded text-white bg-gray-700"
          />
        ) : (
          <div>
            <p className="text-lg">{userInfo.email}</p>
            <p className="text-sm text-gray-500">Receive messages from us on this email</p>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold">Password</label>
          {!isEditing.password ? (
            <button 
              onClick={() => handleEdit('password')}
              className="text-blue-500 text-sm"
            >
              EDIT
            </button>
          ) : (
            <button 
              onClick={() => handleSave('password')}
              className="text-green-500 text-sm"
            >
              SAVE
            </button>
          )}
        </div>
        {isEditing.password ? (
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={localUserInfo.password}
              onChange={(e) => handleChange(e, 'password')}
              className="w-full p-2 border rounded text-white bg-gray-700"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg">********</p>
            <button className="text-blue-500 text-sm">Reset Password</button>
          </div>
        )}
      </div>

      {/* Account Deletion Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Account Deletion</h2>
        <div className="text-red-500 mb-4">
          <p className='text-red-500'>Warning: Deletion of your account and personal data is permanent and cannot be undone.</p>
          <p className='text-red-500'>We will not be able to recover your account or the data that is deleted.</p>
        </div>
        <button className="text-red-600 border border-red-500 px-4 py-2 rounded hover:bg-red-50">
          Delete my Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
