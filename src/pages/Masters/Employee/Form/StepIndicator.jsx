import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useThemeStore } from '../../../../store/themeStore';

const StepIndicator = ({ currentStep }) => {
  const theme = useThemeStore((state) => state.theme);
  const steps = [
    { number: 1, label: 'Basic Details' },
    { number: 2, label: 'Bank Details' },
    { number: 3, label: 'Documents' },
    { number: 4, label: 'Review' }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: currentStep === step.number ? 1.1 : 1
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                  ${currentStep > step.number
                    ? 'bg-green-500' // Completed step
                    : currentStep === step.number
                      ? theme === 'light' ? 'bg-blue-600' : 'bg-purple-600' // Current step
                      : 'bg-gray-500'   // Upcoming step
                  }`}
              >
                {currentStep > step.number ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{step.number}</span>
                )}
              </motion.div>
              <span className={`mt-2 text-sm ${currentStep === step.number
                  ? theme === 'light' ? 'text-blue-600 font-medium' : 'text-purple-600 font-medium'
                  : currentStep > step.number
                    ? 'text-green-500 font-medium'
                    : 'text-gray-500'
                }`}>
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-0.5 relative">
                <div className="absolute inset-0 bg-gray-300"></div>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{
                    width: currentStep > step.number ? '100%' : '0%'
                  }}
                  className={`absolute inset-0 bg-green-500`}
                ></motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;