import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { FiX } from 'react-icons/fi';
import defaultAvatar from './../../assets/sample-user/sampleUser.jpg';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className={`w-full max-w-2xl rounded-xl ${
            theme === 'dark' 
              ? 'bg-black/90 border border-purple-500/20' 
              : 'bg-white'
          } overflow-hidden shadow-xl`}
        >
          {/* Header */}
          <div className={`relative p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-purple-100' : 'text-blue-900'
            }`}>
              Employee Details
            </h2>
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 ${
                theme === 'dark' 
                  ? 'text-purple-400 hover:text-purple-300' 
                  : 'text-blue-400 hover:text-blue-500'
              }`}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <img
                src={employee.profilePicture || defaultAvatar}
                alt={`${employee.firstName} ${employee.lastName}`}
                className={`w-32 h-32 rounded-full object-cover border-4 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              />
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="First Name" value={employee.firstName} />
              <InfoItem label="Last Name" value={employee.lastName} />
              <InfoItem label="Email" value={employee.email} />
              <InfoItem label="Phone" value={employee.phone} />
              <InfoItem label="Date of Birth" value={new Date(employee.dob).toLocaleDateString()} />
              <InfoItem label="Date of Joining" value={new Date(employee.doj).toLocaleDateString()} />
              <InfoItem label="Gender" value={employee.gender} />
              <InfoItem label="Department" value={employee.departmentID} />
              <InfoItem label="Role" value={employee.roleID} />
              <InfoItem label="Location" value={employee.workingLocation} />
              <InfoItem label="Status" value={employee.isActive ? 'Active' : 'Inactive'} />
              <InfoItem label="Address" value={employee.address} className="col-span-2" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoItem = ({ label, value, className = '' }) => {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <div className={className}>
      <label className={`text-sm ${
        theme === 'dark' ? 'text-purple-300' : 'text-blue-600'
      }`}>
        {label}
      </label>
      <p className={`mt-1 ${
        theme === 'dark' ? 'text-purple-100' : 'text-blue-900'
      }`}>
        {value}
      </p>
    </div>
  );
};

export default EmployeeDetailsModal;