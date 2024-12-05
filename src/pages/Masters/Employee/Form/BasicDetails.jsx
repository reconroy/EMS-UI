import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../../../store/themeStore';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import API from '../../../../services/api';

const BasicDetails = ({ formData, setFormData, onNext }) => {
  const theme = useThemeStore((state) => state.theme);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // State for API data
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          locationsRes,
          departmentsRes,
          designationsRes,
          rolesRes
        ] = await Promise.all([
          API.get('/Locations'),
          API.get('/Departments'),
          API.get('/Designations'),
          API.get('/Roles')
        ]);

        setLocations(locationsRes.data);
        setDepartments(departmentsRes.data);
        setDesignations(designationsRes.data);
        setRoles(rolesRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modified handleChange to handle both IDs and regular values
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === 'date') {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}/${month}/${year}`; // Format to dd/mm/yyyy
      setFormData(prev => ({ ...prev, [name]: formattedDate }));
      return;
    }

    // Handle special cases for dropdowns that need IDs
    switch (name) {
      case 'workingLocation':
        const selectedLocation = locations.find(loc => loc.locationID.toString() === value);
        setFormData(prev => ({
          ...prev,
          locationID: parseInt(value),
          locationName: selectedLocation?.locationName || ''
        }));
        break;

      case 'department':
        const selectedDepartment = departments.find(dept => dept.deptID.toString() === value);
        setFormData(prev => ({
          ...prev,
          departmentID: parseInt(value),
          departmentName: selectedDepartment?.deptName || ''
        }));
        break;

      case 'designation':
        const selectedDesignation = designations.find(desig => desig.designationID.toString() === value);
        setFormData(prev => ({
          ...prev,
          designationID: parseInt(value),
          designationName: selectedDesignation?.designationName || ''
        }));
        break;

      case 'role':
        const selectedRole = roles.find(role => role.roleID.toString() === value);
        setFormData(prev => ({
          ...prev,
          roleID: parseInt(value),
          roleName: selectedRole?.roleName || ''
        }));
        break;

      default:
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isConfirmed) onNext();
  };
  useEffect(() => {
    if (formData.isSameAsPermanent) {
      setFormData((prev) => ({
        ...prev,
        cAddress: prev.pAddress,
        cPinCode: prev.pPinCode,
        cDistrict: prev.pDistrict,
      }));
    }
  }, [formData.pAddress, formData.pPinCode, formData.pDistrict, formData.isSameAsPermanent, setFormData]);

  // Rest of your component remains the same until the Professional Information section
  // In the Professional Information section, update the dropdowns:

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
          Personal Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{ label: 'Full Name', name: 'fullName', required: true },
          { label: 'Nick Name (Alias Name)', name: 'nickName' },
          { label: "Father's Name", name: 'fatherName', required: true },
          { label: "Mother's Name", name: 'motherName', required: true },
          { label: 'Date of Birth', name: 'dob', type: 'date', required: true },
          { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
          { label: 'Marital Status', name: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
          { label: 'Qualification', name: 'qualification', type: 'select', options: ['10th', '12th', 'Graduate', 'Post-Graduate'], required: true }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{ label: 'Email Address', name: 'email', type: 'email', required: true },
          { label: 'Mobile 1', name: 'mobile1', type: 'tel', required: true },
          { label: 'Mobile 2', name: 'mobile2', type: 'tel' }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                required={field.required}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white border-gray-700'}`}>
          Address Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{ label: 'Permanent Address', name: 'pAddress', required: true },
          { label: 'Permanent Pincode', name: 'pPinCode', type: 'number', required: true },
          { label: 'Permanent District', name: 'pDistrict', required: true },
          { label: 'Corresponding Address', name: 'cAddress' },
          { label: 'Corresponding Pincode', name: 'cPinCode', type: 'number' },
          { label: 'Corresponding District', name: 'cDistrict' }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                required={field.required}
              />
            </div>
          ))}
        </div>
        {/* Same As Permanent Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isSameAsPermanent}
            onChange={(e) => {
              const { checked } = e.target;
              setFormData((prev) => {
                const updatedData = { ...prev, isSameAsPermanent: checked };
                if (checked) {
                  updatedData.cAddress = prev.pAddress;
                  updatedData.cPinCode = prev.pPinCode;
                  updatedData.cDistrict = prev.pDistrict;
                } else {
                  updatedData.cAddress = '';
                  updatedData.cPinCode = '';
                  updatedData.cDistrict = '';
                }
                return updatedData;
              });
            }}
            className="h-4 w-4"
          />
          <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
            Same As Permanent
          </span>
        </div>

      </div>

      {/* Professional Information */}
      <div className="space-y-4">
        <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
          Professional Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[{ label: 'Working Location', name: 'workingLocation', required: true },
          { label: 'Department', name: 'department', required: true },
          { label: 'Designation', name: 'designation', required: true },
          { label: 'Date of Joining', name: 'doj', type: 'date', required: true },
          { label: 'Role', name: 'role', type: 'select', options: ['User', 'Employee', 'Admin'], required: true }
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-800 text-white'}`}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={() => setIsConfirmed(!isConfirmed)}
          className="h-4 w-4"
        />
        <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-gray-300'}`}>
          I confirm that the above information is accurate.
        </span>
      </div>

      <motion.button
        type="submit"
        disabled={!isConfirmed}
        className={`mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-md ${!isConfirmed ? 'opacity-50' : 'hover:bg-blue-700'}`}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowRight className="inline-block mr-2" />
        Next
      </motion.button>
    </form>
  );
};

export default BasicDetails;
