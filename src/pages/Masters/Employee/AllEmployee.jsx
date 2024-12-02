import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiDownload,
  FiUpload,
  FiMoreVertical
} from 'react-icons/fi';

const AllEmployee = () => {
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for demonstration
  const employees = [
    { id: 'EMP001', name: 'John Doe', department: 'IT', designation: 'Senior Developer', location: 'New York', status: 'Active' },
    { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', location: 'London', status: 'Active' },
    { id: 'EMP003', name: 'Mike Johnson', department: 'Finance', designation: 'Accountant', location: 'Singapore', status: 'Inactive' },
    // Add more dummy data as needed
  ];

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-gray-200 shadow-lg';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-gray-900';

  const subTextClass = theme === 'dark'
    ? 'text-purple-300'
    : 'text-gray-600';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-purple-600 hover:bg-purple-700 text-white';

  const secondaryButtonClass = theme === 'dark'
    ? 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-300'
    : 'bg-purple-50 hover:bg-purple-100 text-purple-600';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Employee Management
          </h1>
          <p className={`${subTextClass} mt-1`}>Manage and view all employee records</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/masters/employee/add')}
          className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${buttonClass}`}
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Employee</span>
        </motion.button>
      </div>

      {/* Filters and Search Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border rounded-lg p-4 ${cardClass} space-y-4`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiFilter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiDownload className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${secondaryButtonClass}`}>
              <FiUpload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg ${cardClass} overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200'}`}>
                <th className={`px-6 py-4 text-left ${textClass}`}>Employee ID</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Name</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Department</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Designation</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Location</th>
                <th className={`px-6 py-4 text-left ${textClass}`}>Status</th>
                <th className={`px-6 py-4 text-right ${textClass}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className={`border-b last:border-b-0 hover:${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'} transition-colors ${
                    theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200'
                  }`}
                >
                  <td className={`px-6 py-4 ${textClass}`}>{employee.id}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{employee.name}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{employee.department}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{employee.designation}</td>
                  <td className={`px-6 py-4 ${textClass}`}>{employee.location}</td>
                  <td className={`px-6 py-4`}>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      employee.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AllEmployee; 