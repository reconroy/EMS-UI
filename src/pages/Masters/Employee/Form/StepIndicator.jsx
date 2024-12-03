import React from 'react';
import { motion } from 'framer-motion';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Basic Details' },
    { number: 2, label: 'Documents' },
    { number: 3, label: 'Review' }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: currentStep === step.number ? 1.1 : 1,
                  backgroundColor: currentStep >= step.number ? 'rgb(147, 51, 234)' : 'rgb(107, 114, 128)'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${currentStep >= step.number ? 'bg-purple-600' : 'bg-gray-500'}`}
              >
                <span className="text-white font-medium">{step.number}</span>
              </motion.div>
              <span className={`mt-2 text-sm ${
                currentStep === step.number ? 'text-purple-600 font-medium' : 'text-gray-500'
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
                  className="absolute inset-0 bg-purple-600"
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