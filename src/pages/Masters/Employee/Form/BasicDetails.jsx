import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../../../store/themeStore';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import PersonalInformation from './Sections/PersonalInformation';
import ContactInformation from './Sections/ContactInformation';
import AddressInformation from './Sections/AddressInformation';
import ProfessionalInformation from './Sections/ProfessionalInformation';
import Status from './Sections/Status';
import API from '../../../../services/api';
import IdentityInformation from './Sections/IdentityInformation';

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

        console.log('Roles response:', rolesRes.data);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'select-one') {
      const field = ['workingLocation', 'department', 'designation', 'role'].includes(name);
      if (field) {
        const select = e.target;
        const selectedOption = select.options[select.selectedIndex];
        const data = JSON.parse(selectedOption.dataset.data || '{}');
        console.log(selectedOption)
        if (name === 'role') {
          setFormData(prev => ({
            ...prev,
            roleId: data.id,
            roleName: data.name
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [`${name}Id`]: data.id,
            [`${name}Name`]: data.name,
            [name]: value
          }));
        }
        return;
      }
    }
  
    if (type === 'date' && (name === 'dob' || name === 'doj')) {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      setFormData(prev => ({
        ...prev,
        [name]: formattedDate
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PersonalInformation theme={theme} formData={formData} handleChange={handleChange} />
      <ContactInformation theme={theme} formData={formData} handleChange={handleChange} />
      <AddressInformation theme={theme} formData={formData} handleChange={handleChange} />
      <IdentityInformation formData={formData} setFormData={setFormData} />
      <ProfessionalInformation
        theme={theme}
        formData={formData}
        handleChange={handleChange}
        locations={locations}
        departments={departments}
        designations={designations}
        roles={roles}
      />
      <Status theme={theme} formData={formData} handleChange={handleChange} />

      {/* Confirmation Checkbox */}
      <div className="flex items-center space-x-2 mt-6">
        <input
          type="checkbox"
          id="confirmDetails"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-600' : 'text-blue-600'} border-gray-300 rounded focus:ring-purple-500`}
        />
        <label
          htmlFor="confirmDetails"
          className="text-sm text-gray-900 dark:text-gray-300"
        >
          I confirm that all the details provided are correct and accurate.
        </label>
      </div>

      {/* Proceed Button */}
      <motion.button
        type="submit"
        disabled={!isConfirmed}
        whileHover={isConfirmed ? { scale: 1.02 } : {}}
        whileTap={isConfirmed ? { scale: 0.98 } : {}}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 
          ${isConfirmed
            ? `${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white cursor-pointer`
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
      >
        <span>Proceed to Document Upload</span>
        <FiArrowRight className="w-4 h-4" />
      </motion.button>
    </form>
  );
};

export default BasicDetails; 