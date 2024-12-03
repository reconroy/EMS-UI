import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

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
    // Submit logic will be added here
    console.log('Form submitted:', formData);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/masters/employee/view');
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
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 dark:text-purple-300 hover:text-gray-900 dark:hover:text-purple-100"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </motion.div>

        <div className="flex gap-4">
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handlePrevious}
              className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600"
            >
              Previous
            </motion.button>
          )}
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            className="px-4 py-2 rounded-lg flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {currentStep === 3 ? (
              <>
                <FiSave className="w-5 h-5" />
                <span>Submit</span>
              </>
            ) : (
              <span>Next</span>
            )}
          </motion.button>
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
    </div>
  );
};

export default AddEmployee; 