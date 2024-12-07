import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { FiX } from 'react-icons/fi';
import defaultAvatar from './../../assets/sample-user/sampleUser.jpg';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className={`w-full max-w-4xl mx-auto my-4 rounded-xl ${
            theme === 'dark' 
              ? 'bg-black/90 border border-purple-500/20' 
              : 'bg-white'
          } overflow-hidden shadow-xl relative`}
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
                alt={employee.fullName}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Full Name" value={employee.fullName} />
              <InfoItem label="Nick Name" value={employee.nickName} />
              <InfoItem label="Father's Name" value={employee.fatherName} />
              <InfoItem label="Mother's Name" value={employee.motherName} />
              <InfoItem label="Marital Status" value={employee.maritalStatus} />
              <InfoItem label="Qualification" value={employee.qualification} />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Email" value={employee.email} />
              <InfoItem label="Primary Mobile" value={employee.mobile1} />
              <InfoItem label="Secondary Mobile" value={employee.mobile2} />
            </div>

            {/* Permanent Address */}
            <div className="space-y-2">
              <h3 className={`font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
                Permanent Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Address" value={employee.pAddress} className="col-span-full" />
                <InfoItem label="Pin Code" value={employee.pPinCode} />
                <InfoItem label="District" value={employee.pDistrict} />
              </div>
            </div>

            {/* Current Address */}
            <div className="space-y-2">
              <h3 className={`font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
                Current Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Address" value={employee.cAddress} className="col-span-full" />
                <InfoItem label="Pin Code" value={employee.cPinCode} />
                <InfoItem label="District" value={employee.cDistrict} />
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Department" value={employee.departmentName} />
              <InfoItem label="Role" value={employee.roleName} />
              <InfoItem label="Designation" value={employee.designationName} />
              <InfoItem label="Working Location" value={employee.locationName} />
              <InfoItem 
                label="Date of Birth" 
                value={employee.dob ? new Date(employee.dob).toLocaleDateString() : ''} 
              />
              <InfoItem 
                label="Date of Joining" 
                value={employee.doj ? new Date(employee.doj).toLocaleDateString() : ''} 
              />
            </div>

            {/* Identity Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Aadhaar Number" value={employee.aadhaarNumber} />
              <InfoItem label="PAN Number" value={employee.panNumber} />
              <InfoItem label="Gender" value={employee.gender} />
              <InfoItem label="Status" value={employee.isActive ? 'Active' : 'Inactive'} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
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
        {value || '-'}
      </p>
    </div>
  );
};

export default EmployeeDetailsModal;