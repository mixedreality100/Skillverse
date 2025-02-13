import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiEye, FiEyeOff } from "react-icons/fi";

const LearnerSettings = ({ userInfo, updateUserInfo }) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false
  });

  const [localUserInfo, setLocalUserInfo] = useState(userInfo);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Load user data from localStorage if it exists
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (savedName && savedEmail && savedPassword) {
      setLocalUserInfo({
        name: savedName,
        email: savedEmail,
        password: savedPassword,
        profilePicture: userInfo.profilePicture
      });
    }
  }, []);

  const handleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSave = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: false
    }));
    updateUserInfo(localUserInfo);

    // Save user data to localStorage when it's updated
    if (field === 'name') {
      localStorage.setItem('userName', localUserInfo.name);
    }
    if (field === 'email') {
      localStorage.setItem('userEmail', localUserInfo.email);
    }
    if (field === 'password') {
      localStorage.setItem('userPassword', localUserInfo.password);
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
    }
  };

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
            <p className="text-lg">{localUserInfo.name}</p>
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
            <p className="text-lg">{localUserInfo.email}</p>
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
              onClick={() => {
                handleSave('password');
                setPasswordVisible(false); // Reset visibility on save
              }}
              className="text-green-500 text-sm"
            >
              SAVE
            </button>
          )}
        </div>
        {isEditing.password ? (
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              value={localUserInfo.password}
              onChange={(e) => handleChange(e, 'password')}
              className="w-full p-2 border rounded text-white bg-gray-700"
            />
            <button
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-300"
            >
              {passwordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg">{'*'.repeat(localUserInfo.password.length)}</p>
          </div>
        )}
      </div>

      {/* Account Deletion Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Account Deletion</h2>
        <div className="text-red-500 mb-4">
          <p>Warning: Deletion of your account and personal data is permanent and cannot be undone.</p>
          <p>We will not be able to recover your account or the data that is deleted.</p>
        </div>
        <button className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-50">
          Delete my Account
        </button>
      </div>
    </div>
  );
};

export default LearnerSettings;
