import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Addform = () => {
    const [formData, setFormData] = useState({
  fullName: '',
  gender: 'Male',
  email: 'john@usc.edu', // Assuming this is pre-filled
  mobileNumber: '',
  location: '',
  profileImage: null
});
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 800 * 1024) { // 800KB limit
      alert('File size must be less than 800KB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Only JPG, PNG and GIF files are allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form submitted:', formData);
  // Add your submission logic here
};
return(
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
    {/* Header Section */}
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.history.back()} 
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
        >
          <ArrowBackIcon className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 text-gray-600">
          <h1 className="text-lg font-semibold ">Create Customer</h1>
          <span className="text-gray-400 text-lg font-semibold">›</span>
          <span className="text-lg font-semibold">Add New User</span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Personal Information</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center lg:items-start">
            <input
              type="file"
              id="profile-image"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="profile-image" className="group relative w-32 h-32 rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
                {formData.profileImage ? (
                  <img 
                    src={URL.createObjectURL(formData.profileImage)} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                Choose Photo
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-3 text-center lg:text-left">
              JPG, GIF, or PNG. Max size of 800K
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 p-2.5 hover:border-green-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 p-2.5 hover:border-green-400"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email ID
              </label>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" size="small">
                        <span className="text-xs">verify</span>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <TextField
                fullWidth
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="(000) 000 - 0000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+1</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" size="small">
                        <span className="text-xs">verify</span>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="90001"
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 p-2.5 hover:border-green-400"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Carson City, Los Angeles
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8 gap-4">
          <button 
            type="button"
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save 
          </button>
        </div>
      </form>
    </div>
  </div>
)
}
export default Addform;