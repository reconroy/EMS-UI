import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiArrowRight } from 'react-icons/fi';
import Notification from '../../../components/Notification';
import API from '../../../services/api';

import StepIndicator from './Form/StepIndicator';
import BasicDetails from './Form/BasicDetails';
import BankDetails from './Form/BankDetails';
import DocumentUpload from './Form/DocumentUpload';
import Review from './Form/Review';

const STORAGE_KEY = 'employeeFormData';

const AddEmployee = () => {
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/masters/employee/view');
  };

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const handleSubmit = async () => {
    if (!isConfirmed) {
      showNotification('warning', 'Please confirm the details before submitting');
      return;
    }

    if (currentStep !== 4) {
      showNotification('warning', 'Please complete all steps before submitting');
      return;
    }

    try {
      showNotification('processing', 'Registering employee...');
      
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };

      const employeeData = {
        fullName: formData.fullName || 'string',
        nickName: formData.nickName || 'string',
        fatherName: formData.fatherName || 'string',
        motherName: formData.motherName || 'string',
        maritalStatus: formData.maritalStatus || 'string',
        qualification: formData.qualification || 'string',
        email: formData.email || 'string',
        mobile1: String(formData.mobile1),
        mobile2: String(formData.mobile2) ,
        pAddress: formData.pAddress || 'string',
        pPinCode: formData.pPinCode || 0,
        pDistrict: formData.pDistrict || 'string',
        cAddress: formData.cAddress || 'string',
        cPinCode: formData.cPinCode || 0,
        cDistrict: formData.cDistrict || 'string',
        dob: formatDate(formData.dob) || '2024-12-05',        
        doj: formatDate(formData.doj) || '2024-12-05',
        gender: formData.gender || 'string',
        roleID: formData.roleId || 0,
        aadhaarNumber: formData.aadhaarNumber || 0,
        panNumber: formData.panNumber || 0,
        isActive: formData.isActive === undefined ? true : formData.isActive,
        departmentID: formData.departmentId,
        designation: formData.designation,
        workingLocation: formData.workingLocationId
      };

      console.log('Employee Data:', employeeData);

      const response = await API.post('/Employees', employeeData);
      
      if (response.status === 201 || response.status === 200) {
        showNotification('success', 'Employee registered successfully!');
        
        // Clear all localStorage
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('empIdentityDetails');
        localStorage.removeItem('empBankDetails');
        
        // Navigate to employee list
        navigate('/masters/employee/view');
      }
    } catch (error) {
      console.error('Error registering employee:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        showNotification('error', errorMessages);
      } else {
        showNotification('error', 'Failed to register employee. Please try again.');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails formData={formData} setFormData={setFormData} onNext={handleNext} />;
      case 2:
        return <BankDetails formData={formData} setFormData={setFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <DocumentUpload formData={formData} setFormData={setFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-lg';

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={handleCancel}
            className={`flex items-center gap-2 ${theme === 'dark' ? 'text-purple-600' : 'text-blue-600'}`}
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </motion.div>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handlePrevious}
              className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-purple-600 text-purple-600' : 'border-blue-600 text-blue-600'}`}
            >
              Previous
            </motion.button>
          )}

          {currentStep < 4 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              Next
            </motion.button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        {renderStepContent()}
      </motion.div>

      {/* Confirmation and Submit Section */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
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

          <motion.button
            onClick={handleSubmit}
            disabled={!isConfirmed}
            whileHover={isConfirmed ? { scale: 1.02 } : {}}
            whileTap={isConfirmed ? { scale: 0.98 } : {}}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 
              ${isConfirmed
                ? `${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white cursor-pointer`
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              } transition-colors duration-200`}
          >
            <FiSave className="w-4 h-4" />
            <span>Submit Employee Details</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AddEmployee;