import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';

const Status = ({ theme, formData, handleChange }) => {
  const handleStatusChange = () => {
    handleChange({
      target: {
        name: 'isActive',
        checked: !formData.isActive,
        type: 'checkbox'
      }
    });
  };

  return (
    <div className="space-y-4">
      <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
        Employee Status
      </h4>

      <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h5 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Current Status
            </h5>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                formData.isActive 
                  ? (theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-300')
                  : (theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-300')
              }`}
            >
              {formData.isActive ? (
                <><FiCheck className="w-4 h-4 mr-1" /> Active</>
              ) : (
                <><FiX className="w-4 h-4 mr-1" /> Inactive</>
              )}
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStatusChange}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              formData.isActive 
                ? (theme === 'light' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white')
                : (theme === 'light' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white')
            }`}
          >
            {formData.isActive ? 'Deactivate Employee' : 'Activate Employee'}
          </motion.button>
        </div>

        <div className="mt-4">
          <div className={`h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: formData.isActive ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
              className={`h-full ${
                formData.isActive 
                  ? (theme === 'light' ? 'bg-green-500' : 'bg-green-600')
                  : (theme === 'light' ? 'bg-red-500' : 'bg-red-600')
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;

// import React from 'react';
// import { motion } from 'framer-motion';
// import { FiCheck, FiX } from 'react-icons/fi';

// const Status = ({ theme, formData, handleChange }) => {
//   const handleStatusChange = () => {
//     handleChange({
//       target: {
//         name: 'isActive',
//         checked: !formData.isActive,
//         type: 'checkbox'
//       }
//     });
//   };

//   return (
//     <div className="space-y-4">
//       <h4 className={`text-lg font-medium border-b pb-2 ${theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'}`}>
//         User Status
//       </h4>

//       <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             {formData.isActive ? (
//               <FiCheck className="w-5 h-5 text-green-500" />
//             ) : (
//               <FiX className="w-5 h-5 text-red-500" />
//             )}
//             <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
//               {formData.isActive ? 'Active' : 'Inactive'}
//             </span>
//           </div>

//           <button
//             onClick={handleStatusChange}
//             className={`px-4 py-2 rounded-lg ${
//               formData.isActive 
//                 ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//             }`}
//           >
//             {formData.isActive ? 'Deactivate' : 'Activate'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Status;