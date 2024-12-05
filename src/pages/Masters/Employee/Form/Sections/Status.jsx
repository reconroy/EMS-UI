import React from 'react';
import { motion } from 'framer-motion';

const Status = ({ theme, formData, handleChange }) => {
  const handleStatusChange = () => {
    handleChange({ target: { name: 'isActive', checked: !formData.isActive } });
  };

  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Employee Status
      </h4>
      
      <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <div 
          onClick={handleStatusChange}
          className={`relative cursor-pointer rounded-xl p-4 transition-all duration-300 
            ${theme === 'light' 
              ? 'hover:bg-gray-50' 
              : 'hover:bg-gray-700'}`}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={false}
              animate={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: formData.isActive ? 1 : 0.95,
                  opacity: formData.isActive ? 1 : 0.7
                }}
                className={`h-12 w-12 rounded-lg flex items-center justify-center
                  ${formData.isActive 
                    ? (theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-purple-900 text-purple-300')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-gray-700 text-gray-400')
                  }`}
              >
                <span className="text-xl font-semibold">
                  {formData.isActive ? 'A' : 'I'}
                </span>
              </motion.div>

              <div className="space-y-1">
                <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {formData.isActive ? 'Active Status' : 'Inactive Status'}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formData.isActive 
                    ? 'Employee has access to all assigned systems' 
                    : 'Employee access is currently restricted'}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={false}
              animate={{
                rotate: formData.isActive ? 0 : 180,
              }}
              className={`h-8 w-8 rounded-full flex items-center justify-center
                ${formData.isActive 
                  ? (theme === 'light' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white')
                  : (theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-400')
                }`}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 15l7-7 7 7" 
                />
              </svg>
            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={{
              backgroundColor: formData.isActive 
                ? (theme === 'light' ? '#3B82F6' : '#8B5CF6') 
                : (theme === 'light' ? '#E5E7EB' : '#374151'),
              width: formData.isActive ? '100%' : '0%'
            }}
            className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Status;