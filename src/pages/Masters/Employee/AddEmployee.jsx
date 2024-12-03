import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiArrowRight } from 'react-icons/fi';

import StepIndicator from './Form/StepIndicator';
import BasicDetails from './Form/BasicDetails';
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/masters/employee/view');
  };

  const handleSubmit = () => {
    if (isConfirmed) {
      // Submit logic here
      console.log('Form submitted:', formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetails formData={formData} setFormData={setFormData} />;
      case 2:
        return <DocumentUpload formData={formData} setFormData={setFormData} />;
      case 3:
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
          
          {currentStep < 3 && (
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
      {currentStep === 3 && (
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