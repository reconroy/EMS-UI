import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const AddEmployee = () => {
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-gray-200 shadow-lg';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-gray-900';

  const subTextClass = theme === 'dark'
    ? 'text-purple-300'
    : 'text-gray-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => navigate('/masters/employee/view')}
            className={`flex items-center gap-2 ${subTextClass} hover:${textClass}`}
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Employees</span>
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            theme === 'dark'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <FiSave className="w-5 h-5" />
          <span>Save Employee</span>
        </motion.button>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Add New Employee
        </h1>
        <p className={`${subTextClass} mt-1`}>Enter the details of the new employee</p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-6 ${cardClass}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields will be added here based on requirements */}
          <p className={subTextClass}>Form fields will be added based on requirements...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AddEmployee; 