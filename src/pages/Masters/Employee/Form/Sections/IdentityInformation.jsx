import React, { useEffect } from 'react';
import { useThemeStore } from '../../../../../store/themeStore';

const IdentityInformation = ({ formData, setFormData }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Load saved identity details from localStorage
    const savedIdentityDetails = localStorage.getItem('empIdentityDetails');
    if (savedIdentityDetails) {
      const parsedDetails = JSON.parse(savedIdentityDetails);
      setFormData(prev => ({
        ...prev,
        ...parsedDetails
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    
    // Save to localStorage
    localStorage.setItem('empIdentityDetails', JSON.stringify({
      aadhaarNumber: updatedFormData.aadhaarNumber || '',
      panNumber: updatedFormData.panNumber || ''
    }));
  };

  return (
    <div className="space-y-8">
      <h4 className={`text-lg font-medium border-b pb-2 ${
        theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'
      }`}>
        Identity Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label 
            htmlFor="aadhaarNumber" 
            className={`block text-sm font-medium ${
              theme === 'light' ? 'text-gray-900' : 'text-gray-300'
            }`}
          >
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="aadhaarNumber"
            name="aadhaarNumber"
            value={formData.aadhaarNumber || ''}
            onChange={handleChange}
            required
            maxLength={12}
            className={`w-full rounded-md border px-3 py-2 ${
              theme === 'light' 
                ? 'border-gray-300 bg-white text-gray-900' 
                : 'border-gray-600 bg-gray-800 text-white'
            }`}
          />
        </div>

        <div className="space-y-1">
          <label 
            htmlFor="panNumber" 
            className={`block text-sm font-medium ${
              theme === 'light' ? 'text-gray-900' : 'text-gray-300'
            }`}
          >
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="panNumber"
            name="panNumber"
            value={formData.panNumber || ''}
            onChange={handleChange}
            required
            maxLength={10}
            className={`w-full rounded-md border px-3 py-2 ${
              theme === 'light' 
                ? 'border-gray-300 bg-white text-gray-900' 
                : 'border-gray-600 bg-gray-800 text-white'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default IdentityInformation;
